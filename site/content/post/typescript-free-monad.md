---
title: "Typescript and the Free Monad"
date: 2017-10-12T17:02:55+10:00
draft: true
tags: [typescript, fp-ts]
---

## Introduction

There has been for a long time one Monad that always fascinated me for
its proposal, that was the `Free` monad.

With `Free` you can _define_ an extensible DSL that encodes the different
steps that a program will execute, and later define an _interpreter_
that performs the actual calculations and/or side effects.

Well, that was my lame explanation of it...

There are many articles and papers that explain the `Free` monad in depth
but I always found Kelly Robinson's article to be quite complete and yet
easy to follow (plus, it outlines some of its caveats).
It's super good and you can read it [here](http://blog.krobinson.me/posts/monads-part-2-the-free-monad)