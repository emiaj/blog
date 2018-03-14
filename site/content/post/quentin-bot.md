---
title: "Quentin - Your movie knowledge bot"
date: 2018-03-13T16:59:53+10:00
draft: false
tags: [cognitive-services, luis, bot, microsoft-bot-framework]
---

## Introduction

Thanks to the professional development (PD) program provided by the company that I work for, 
[Readify](http://www.readify.net), I got some time to invest into researching a variety of technologies from Microsoft in the AI realm, particularly:

- [Microsoft Cognitive Services](https://azure.microsoft.com/en-us/services/cognitive-services/)
- [LUIS: Language Understanding Intelligent Service](https://luis.ai/)
- [Microsoft Bot Framework](https://dev.botframework.com/)

Furthermore, to make things interesting and because I like to learn by experimentation,
I set the goal to create a simple bot that gives you plot information about a movie.

## Creating the bot

My plan to create this bot was:

- In LUIS, define the intents (search movie and get movie info) in LUIS
- In LUIS, create utterances and link them to their corresponding intent (e.g. `what's the plot of the movie "Jackie Brown"?`)
- In LUIS, define entities that will hold the relevant tokens of an utterance (e.g. `Title` would be the entity matching `Jackie Brown` in the utterance above)
- Create a chat bot to let users ask for the plot of any movie
- Use LUIS to parse the messages and find what was the user intent (the action they wanted to invoke)
- Search movies (using [OMDB Api](omdbapi.com)) according to the query introduced and display the results

You can find more about intents, utterances and entities by reading LUIS official docs [here](https://docs.microsoft.com/en-us/azure/cognitive-services/luis/home).

## Quentin Demo

I named this bot **Quentin**, inspired by the famous director Quentin Tarantino.
You can try Quentin right here in this post using the widget below.
If you want the fullscreen experience, you can go [here](/quentin-bot).

<iframe src="/quentin-bot" style="min-width:400px;min-height:480px;" width="100%" height="100%" />