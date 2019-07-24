---
title: "React useEffect and fetch API"
date: 2019-07-23T17:11:23+10:00
draft: false
tags: [react, fetch, typescript, AbortController]
---

Howdy!!!  

React (16.8?) introduced hooks not long ago and I have been using them more and more to
create functional components where state and effects are easily identifiable and maintenance-friendly.  


I have found the React docs quite good at explaining what they are and how you are supposed to use them.  
You can read more about them here: https://reactjs.org/docs/hooks-intro.html  



## useEffect


The `useEffect` hook let's you perform _side effects_ in function components, those side effects could be:

- Persisting state to `localStorage`.
- Using `timeout` to run a background task.
- Subscribe/unsubscribe to events.
- Retrieving data from an external source.

## The problem

You can rely on `useEffect` hook to fetch data from an external source, but you need to keep in mind that HTTP requests could still be ongoing long after your component has been updated/unmounted, thus, you need to handle this in an appropriated way.  

This problem can go unnoticed during development time, specially when the external resources that your app is accessing are located in your own machine where latency is minimal.  

## Demo application

Let's create a little app that let's you:  

- View a list of your favourite JS frameworks.  
- When clicking in one of them, the app will retrieve information about them (their description) from an external endpoint.  

Something like this:  

<div class="image fit">
    <img title="Demo application" src="/images/react-use-effect-and-fetch/react-fav-framework-demo-01.gif" >
</div>


Not the fanciest app in the world that's for sure :D  
I have used `create-react-app` to create it and also passed the `--typescript` flag  - I love types :)  


To emulate a backend API I have used [Mocky](https://www.mocky.io).   

## Code

The code for this little app can be found here: https://gist.github.com/emiaj/c824158b34d51341246b129d31c0fed7  

We are going to focus on the data fetching part this time, I think the code is self-explanatory but feel free to drop a comment below if you have any questions.  

The list of frameworks is statically populated in the `PopularFrameworks` component, each item has a `name` and a `details` property.  
The `details` property represents the url from where to fetch the additional information about the selected framework.  

Here's an excerpt from the `PopularFrameworks` component:

{{< highlight jsx "hl_lines=5-9 29" >}}

export const PopularFrameworks: React.FC = () => {

    const [state, update] = React.useState<FrameworkSummary | null>(null);

    const frameworks: FrameworkSummary[] = [
        { "name": "React", details: "http://www.mocky.io/v2/5d36894a56000067003a5323" },
        { "name": "Angular", details: "http://www.mocky.io/v2/5d368a3256000054003a5327" },
        { "name": "Vue", details: "http://www.mocky.io/v2/5d36899b5600007d5d3a5324" }
    ];

    return <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, display: 'flex' }}>
            <ul style={{ listStyle: 'none', flex: 1 }}>
                {
                    frameworks.map(framework => {
                        return <li key={framework.name}
                            style={state && state.name === framework.name ? 
                                                            selectedFrameworkStyle : 
                                                            frameworkStyle}
                            onClick={() => update(framework)}>
                            {framework.name}
                        </li>
                    })
                }
            </ul>
        </div>
        <div style={{ flex: 1, display: 'flex' }}>
            {
                state && <FrameworkDetails {...state} />
            }
        </div>
    </div>;
}
{{< /highlight >}}


When a framework gets selected, we then pass that info down to a `FrameworkDetails` component, where the framework information data is ultimately retrieved using the `fetch` API.   

{{< highlight jsx "hl_lines=14-16 18" >}}
export const FrameworkDetails: React.FC<FrameworkDetailsProps> = 
    props: FrameworkDetailsProps) => {

    const [state, update] = React.useState<FrameworkDetailsState>({ loaded: false });

    /*
      Retrieve JS Framework information using `fetch`.
      We pass [prop.details] as a dependency of this hook so that we don't 
      fetch data unnecessarily.
    */
    React.useEffect(() => {
        update({ loaded: false, description: null });

        fetch(props.details)
            .then(response => response.json())
            .then(json => update({ loaded: true, ...json }));

    }, [props.details]);

    return <div style={{ padding: '1rem', margin: '1rem', flex: 1 }}>

        {state.loaded ? <p>
            {state.description}
        </p> : <p>
                Loading information...
            </p>
        }

    </div>;
}
{{< /highlight >}}

As you can see from the animated gif above, the framework data is retrieved and rendered correctly on the page and everything works just fine.   


Or maybe not...

## Race conditions

Let's add a delay query-string parameter to our Mocky endpoints to simulate network latency, that would reveal a hidden problem in our current implementation:  
{{< highlight tsx >}}
    const frameworks: FrameworkSummary[] = [
        { 
            "name": "React", 
             // respond after 3 seconds
             "details": "http://www.mocky.io/v2/5d36894a56000067003a5323?mocky-delay=3s"
        }, 
        { 
            "name": "Angular", 
             // respond after 2 seconds
            "details": "http://www.mocky.io/v2/5d368a3256000054003a5327?mocky-delay=2s"
        },
        { 
            "name": "Vue", 
             // respond after 1 seconds
            "details": "http://www.mocky.io/v2/5d36899b5600007d5d3a5324?mocky-delay=1s"
        } 
    ];
{{< /highlight >}}
Let's see what happens with our app under these conditions...  

<div class="image fit">
  <img title="Race conditions" src="/images/react-use-effect-and-fetch/react-fav-framework-demo-02.gif" >
</div>


Oh that's no good, because there's a delay in the requests now the responses of those requests overlap each other which then causes to display incorrect information on screen.  


## Enter AbortController

What we need is a way to tell the hook that we want to cancel any ongoing request when `FrameworkDetails` gets updated.  
Thankfully, the `fetch` API offers a way to cancel ongoing requests using a `signal` from an `AbortController` instance.  

Lets adjust our effect in `FrameworkDetails` accordingly to graceful cancel ongoing requests:  


{{< highlight tsx "hl_lines=3 8 11-18 22-25" >}}

    React.useEffect(() => {
        // AbortController instance
        const controller = new AbortController();
        
        update({ loaded: false, description: null });
        
        // we pass in a `signal` to `fetch` so that we can cancel the requests
        fetch(props.details, { signal: controller.signal }) 
            .then(response => response.json())
            .then(json => update({ loaded: true, ...json }))
            .catch(e => {
                if (controller.signal.aborted) {
                    console.log('Request has been gracefully cancelled');
                }
                else {
                    throw e;
                }
            });
        
        // Our effect must return an "unsubscribe" function, 
        // a callback function that is invoked every time the component is rendered
        return function cancel() {
            // self explanatory
            controller.abort();
        };
    }, [props.details]);
{{< /highlight >}}


With that in place, let's see how our app behaves now:   

<div class="image fit">
  <img title="AbortController" src="/images/react-use-effect-and-fetch/react-fav-framework-demo-03.gif" >
</div>


Yay, now our app is displaying the right information at all times!!!  


## Conclusion

React hooks are quite powerful but we need to be aware of these subtle issues and act accordingly.  

Using `AbortController` with `fetch` will keep us in a safe space by following the simple pattern I showed in this article.  

## Additional resources

- React Hooks - https://reactjs.org/docs/hooks-intro.html  
- Fetch API - https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API  
- AbortController - https://developer.mozilla.org/en-US/docs/Web/API/AbortController  
- How to clean up subscriptions in react components using AbortController ? by @seganesa https://link.medium.com/OLvfQmReyY  
- react-hooks-fetch - https://github.com/dai-shi/react-hooks-fetch  
- useEffect memory leak when setting state in fetch promise #15006 - https://github.com/facebook/react/issues/15006