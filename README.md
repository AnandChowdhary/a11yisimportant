# 🐦 @a11yisimportant

[![Travis CI](https://img.shields.io/travis/AnandChowdhary/a11yisimportant.svg)](https://travis-ci.org/AnandChowdhary/a11yisimportant)
[![Coverage Status](https://coveralls.io/repos/github/AnandChowdhary/a11yisimportant/badge.svg?branch=master)](https://coveralls.io/github/AnandChowdhary/a11yisimportant?branch=master)
[![GitHub](https://img.shields.io/github/license/anandchowdhary/a11yisimportant.svg)](https://github.com/AnandChowdhary/a11yisimportant/blob/master/LICENSE)
![Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/github/AnandChowdhary/a11yisimportant.svg)
[![Twitter Follow](https://img.shields.io/twitter/follow/a11yisimportant.svg?label=%40a11yisimportant)](https://twitter.com/a11yisimportant)

[@a11yisimportant](https://twitter.com/a11yisimportant) is a Twitter bot which follows smart people tweeting about #a11y and retweets mentions. Written in Typescript and hosted on [Oswald Labs Platform](https://oswaldlabs.com/platform/).

## ⭐ How it works

#### `/follow`

The follow endpoint follows users tweeting with the hashtag #a11y. It runs every hour, powered by [IFTTT](https://ifttt.com) and a webhook:

1. Find (mixed) tweets with hashtag #a11y
1. Like all those tweets
1. Make a list of users (unique)
1. Remove any users @a11yisimportant already follows
1. Follow everyone from this list

#### `/retweet`

The retweet endpoint retweets tweets that @a11yisimportant is tagged in. It runs every hour, powered by [IFTTT](https://ifttt.com) and a webhook:

1. Find (recent) tweets with mention @a11yisimportant
1. Remove any tweets written by self
1. Remove any tweets which are already retweeted
1. Like every tweet in this list
1. If this tweet is a reply, get the original tweet instead
1. Remove any duplicates (unique array)
1. Remove any "Thanks for the follow!" tweets
1. Retweet every tweet in this list

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
  id_str: "1106516296085188609",
  text: "Accessibility is important",
  user: {
    id_str: "1106514269758214144",
    screen_name: "a11yisimportant"
  }
  // . . .
};
```

In each interface, longint strings are preferred since JavaScript natively doesn't support such large integers (e.g., `id_str` instead of `id`).

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

## ✅ Todo

- [x] Auto follow
- [x] Auto retweet
- [x] Retweet CC original tweets
- [x] Like all mentions
- [x] Like all #a11y tweets

## 📝 License

MIT
