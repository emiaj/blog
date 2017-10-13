---
title: "Functional programming with Typescript"
date: 2017-10-12T17:02:01+10:00
draft: false
---

## Introduction

I have been working with Typescript for a few months already.
I have also used it for real in one of my engagements at Readify and also to develop some personal projects.
All in all I think it's a great language and very pleasant to work with.

After a little while I started to push the limits of its type system and wanted to know if it was possible to 
leverage functional programming patterns with it.
Turned out to not be an easy task, I kept stumbling into my limited knowledge of the language and
the fact that I don't have a full grasp of functional programming (the theoric/foundational part) that
could allow me to build a whole library from the ground up.

I was about to call it a defeat but then I found [fp-ts](https://github.com/gcanti/fp-ts), a functional
library for Typescript.

I started to play with it for a few days, read the code and I came to the conclusion that is really amazing.
It's inspired by other equally awesome libraries (like [fantasy-land](https://github.com/fantasyland/fantasy-land)) and it certainly has changed my mind towards
getting functional programming constructs into Typescript.

Ok, enough with words, let's see some of the things you could do with it...

## Show me the code!!

I love [plnkr](http://plnkr.co/) and that's what I'm going to use to show you the code.


### Option

Let's begin with an easy one, the `Option` monad. 
`Option` is also known as `Maybe`. 
This monad encodes an unsucessful computation by not returning
a value.
A successful computation is encoded in the `Some` datastructure and
an erroneous one in the `None` datastructure.

Great, let's then create a quick demo for this. A `divide` function
is defined below where you either get a result
for a valid pair of arguments (that's, the denominator is not `0`) or
otherwise you get none.

<iframe style="border: 1px solid #999;width: 100%; height: 580px"
        src="https://embed.plnkr.co/Gi1A7855iDvlwjbhGa6q/?show=src/main.ts,preview" frameborder="0"
        allowfullscreen="allowfullscreen">
  Loading plunk...
</iframe>


### Either

`Either` is like `Option` but in this case, you can encode
the reason for a failure giving a chance to the consumer
of your method to know
why an operation failed to complete successfully.

You encode the valid result of an operation in the `Right` side of
the datastructure and the invalid result of an operation (normally an string
but you can put anything you want) in the `Left` side of it.

Let's port our previous example to `Either`...

<iframe style="border: 1px solid #999;width: 100%; height: 580px"
        src="https://embed.plnkr.co/1UZDEnWu9kB5anBWCApv/?show=src/main.ts,preview" frameborder="0"
        allowfullscreen="allowfullscreen">
  Loading plunk...
</iframe>

I think the code now reveals in a better way the outcome of the computation.


## Conclusion

We looked today at how to use functional programming to model your programs
using sound abstractions, `Option` and `Either` in this case.

There is so much more to it, I plan to create a few more articles
about this very soon (I have one in the backburner about `Free` and another about `Validation`), but this should suffice for the time being.

Until next time.

