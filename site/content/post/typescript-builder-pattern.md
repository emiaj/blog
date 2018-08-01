---
title: "Implementing the builder pattern in Typescript"
date: 2018-08-01T19:00:00+10:00
draft: false
tags: [typescript]
---

## Introduction

The [Builder Pattern](https://en.wikipedia.org/wiki/Builder_pattern) is a design pattern used to construct objects by relying on method chaining.

Once the required properties have been set, calling `Build` in the builder instance gives you in exchange a fully populated object.

This pattern works well when you want to implement a DSL that provides a self-documented API to object construction.

I have been looking at Typescript type system lately, trying to find clever ways to use its power and flexibility.

In this article we will see how Typescript type system can help us implement a generic `Builder` class.

## The domain

Let's define a simple interface that we will use in our solutions below.

```typescript
interface RequestSettings {
  protocol: 'http' | 'https';
  host: string;
  path: string;
  query?: string;
  headers: { key: string, value: string }[]
}
```

## Solution #0

This one is for the naysayers, we could ignore the whole point of the article and simply say that the `Builder` pattern is useless and that one could simply do:

```typescript
const settings0: RequestSettings = {
  protocol: 'http',
  host: 'test.com',
  path: '/foo/bar',
  headers: []
}
```
Basically manually construction of the `settings` object but where's the fun in that, right?

## Solution #1

Here we create a `Builder` class where you pass property names and values that construct on each call the object that we want to get.

```typescript
class SimpleBuilder {
  constructor(private current = {}) {

  }

  prop(key: string, value: any) {
    return new SimpleBuilder({ ...this.current, ...{ [key]: value } });
  }

  build<R>() {
    return <R>this.current;
  }
}

// Usage

const settings1 = new SimpleBuilder()
  .prop('protocol', 'http')
  .prop('host', 'test.com')
  .prop('path', '/foo/bar')
  .prop('headers', [])
  .build<RequestSettings>();

```

However, this solution is a bit brittle.

On each call to `prop` we need to pass a `string` matching the property of the object we want to build and this isn't checked by the compiler.

The `value` argument of the `prop` function is of type `any` and that means that we could potentially set an invalid value to one of those properties.

We are definitely not taking advantage of Typescript type system here.


## Solution #2

This time we want to avoid all the problems from `Solution #1`.

How would that look like? Here is how:

```typescript
class TypedBuilder<T> {
  constructor(private current = {}) {
  }
  prop<P extends keyof T, V extends T[P]>(key: P, value: V) {
    return new TypedBuilder<T>({ ...this.current, ...{ [key]: value } });
  }
  build() {
    return <T>this.current;
  }
}

// Usage

const settings2 = new TypedBuilder<RequestSettings>()
  .prop('protocol', 'http')
  .prop('host', 'test.com')
  .prop('path', '/foo/bar')
  .prop('headers', [])
  .build();
```

Now that's much better!!

Let's review our `prop` function now.

Our `key` argument ensures that the value we pass to it matches one of the properties of the type we want to construct thanks to the `keyof` keyword:

- `P extends keyof T`
- `key: P`

Our `value` argument is no longer of type `any` but instead it matches the declared type of the property we want to set:

- `V extends T[P]`
- `value: V`

Let's see this in action:

<img title="TypedBuilder demo" src="/images/typescript-builder-pattern/builder-02.gif" style="width:30vw;">

This solution, however, has a few problems:

- Nothing stops you from calling `prop` several times and map over a single property which could lead to unintended bugs.
- The `build` function doesn't care if the object has been properly set.
- We would like the `build` function to return an object representing the current state of the key/value pairs defined on each call to `prop`.


## Solution #3

Time to address the issues from the previous attempt.

We are going to use `Intersection Types` and the `Exclude` and `Pick` interfaces to accomplish what we want to achieve here.

- `Intersection Types` - Combines multiple types into one (e.g. `T` & `U`).
- `Exclude<T, U>` - Exclude from `T` those types that are assignable to `U`.
- `Pick<T,K>` - Select (or `pick`, duh!) a property `K` from a type `T`.

You can read more about them in the [Advanced Types](https://www.typescriptlang.org/docs/handbook/advanced-types.html) page of the Typescript handbook.


The actual implementation would be:


```typescript
class AdvanceBuilder<T, R extends {} = {}> {

  constructor(private current: R = null) {
  }

  // P: Only those properties from T that do not exist in R
  prop<P extends Exclude<keyof T, keyof R>, V extends T[P]>(key: P, value: V) {

    // Specifying the type of `extra` here for clarity but it's not required
    let extra: Pick<T, P> = { [key]: value };

    // `instance` is an intersection between our accumulator type (R) and
    // the `extra` object created above 
    let instance = {
      ...(this.current as object),
      ...extra
    } as R & Pick<T, P>;

    return new AdvanceBuilder<T, R & Pick<T, P>>(instance);
  }

  build(): R {
    return this.current;
  }
}
```

The usage of identical to `TypedBuilder`, the only difference is that the return type changes as we call the `prop` function:

```typescript
const settings3: RequestSettings = new AdvanceBuilder<RequestSettings>()
  // AdvanceBuilder<RequestSettings, Pick<RequestSettings, "protocol">>
  .prop('protocol', 'http')
  // AdvanceBuilder<RequestSettings, Pick<RequestSettings, "protocol"> & 
  // Pick<RequestSettings, "host">>
  .prop('host', 'test.com')
  // AdvanceBuilder<RequestSettings, Pick<RequestSettings, "protocol"> & 
  // Pick<RequestSettings, "host"> & 
  // Pick<RequestSettings, "path">>
  .prop('path', '/foo/bar')
  // AdvanceBuilder<RequestSettings, Pick<RequestSettings, "protocol"> & 
  // Pick<RequestSettings, "host"> & 
  // Pick<RequestSettings, "path"> & 
  // Pick<RequestSettings, "headers">>
  .prop('headers', [])
  // Pick<RequestSettings, "protocol"> & Pick<RequestSettings, "host"> & 
  // Pick<RequestSettings, "path"> & 
  // Pick<RequestSettings, "headers">
  .build();
```

As I said before, each call to `prop` enhances the `AdvanceBuild` type and specialises it more and more.

On the final call to `build` we get the following type:

```
Pick<RequestSettings, "protocol"> & 
Pick<RequestSettings, "host"> & 
Pick<RequestSettings, "path"> & 
Pick<RequestSettings, "headers">
```

And thanks to Typescript structural equality, that object can be set to a `RequestSettings` type.

Additionally, below I showcase how it's not possible to set a single property more than once:

<img title="TypedBuilder demo" src="/images/typescript-builder-pattern/builder-03.gif" style="width:30vw;">


## Conclusion

As you can see here, Typescript type system can be quite helpful when we need to define very specific constraints and behaviours in our applications and libraries.  
Probably our third solution is overkill since the second option is most likely good enough in most cases.  

Crazy stuffs? Probably.  
Would you ever need it? Maybe not.  
Did I have fun doing it? Absolutely. 

Finally, you can get the code used in this article from [this gist](https://gist.github.com/emiaj/b7fc92d6fa586935b6f8d62a5299b1e6).  
Until next time.

