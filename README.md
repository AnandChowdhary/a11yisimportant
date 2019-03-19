# 🐦 @a11yisimportant

[![Travis CI](https://img.shields.io/travis/AnandChowdhary/a11yisimportant.svg)](https://travis-ci.org/AnandChowdhary/a11yisimportant)
[![Coverage Status](https://coveralls.io/repos/github/AnandChowdhary/a11yisimportant/badge.svg?branch=master)](https://coveralls.io/github/AnandChowdhary/a11yisimportant?branch=master)
[![GitHub](https://img.shields.io/github/license/anandchowdhary/a11yisimportant.svg)](https://github.com/AnandChowdhary/a11yisimportant/blob/master/LICENSE)
![Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/github/AnandChowdhary/a11yisimportant.svg)
[![Twitter Follow](https://img.shields.io/twitter/follow/a11yisimportant.svg?label=%40a11yisimportant)](https://twitter.com/a11yisimportant)

[@a11yisimportant](https://twitter.com/a11yisimportant) is a Twitter bot which follows smart people tweeting about #a11y and retweets mentions. Written in Typescript and hosted on [Oswald Labs Platform](https://oswaldlabs.com/platform/).

## ⭐ How it works

#### `/follow`

The follow endpoint follows users tweeting with the hashtag #a11y. It runs every hour, powered by [IFTTT](https://ifttt.com) and a webhook.

#### `/retweet`

The retweet endpoint retweets tweets that @a11yisimportant is tagged in. It runs every hour, powered by [IFTTT](https://ifttt.com) and a webhook.

#### Interfaces

This package also exposes the following Typescript interfaces:

- `SearchResult` for the result from a standard search using the Twitter API
- `SearchMeta` for the metadata in a search result
- `User` for a user's profile
- `Tweet` for a tweet object

You can use them like this:

```js
import { Tweet } from "a11yisimportant/interfaces" 
const tweet: Tweet = {
  id: 123,
  text: "This is a tweet",
  user: {
    id: 456,
    screen_name: "a11yisimportant"
  }
  // . . .
};
```

## 🛠️ Development

Install dependencies:

```bash
yarn
```

Compile Typescript to CommonJS before running the server:

```bash
yarn build
```

Run local server:

```bash
yarn start
```

##  Todo

- [x] Auto follow
- [x] Auto retweet
- [x] Retweet CC original tweets
- [x] Like all mentions
- [x] Like all #a11y tweets

## 📝 License

MIT
