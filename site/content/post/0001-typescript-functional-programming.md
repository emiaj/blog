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

> https://en.wikibooks.org/wiki/Haskell/Understanding_monads/Maybe
>
> The Maybe monad represents computations which might "go wrong" by not returning a value.


<iframe style="border: 1px solid #999;width: 100%; height: 580px"
        src="https://embed.plnkr.co/Gi1A7855iDvlwjbhGa6q/?show=src/main.ts,preview" frameborder="0"
        allowfullscreen="allowfullscreen">
  Loading plunk...
</iframe>