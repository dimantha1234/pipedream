<img height="40" src="https://github.com/psavkar/pipedream/raw/readme-test/images/twitter/TwitterLogo.png" align=left>    
<h1 align="left"><strong>Twitter: Search Mentions</strong></h1>

Emit new Tweets when a new tweet matches your search.

```javascript
const twitter = require('https://github.com/PipedreamHQ/pipedream/components/twitter/twitter.app.js')
const moment = require('moment')
 
module.exports = {
  name: "Search Mentions",
  description: "Emit new Tweets that matches your search criteria", 
  version: "0.0.1",
  props: {
    db: "$.service.db",
    twitter,
    q: { propDefinition: [twitter, "q"] },
    result_type: { propDefinition: [twitter, "result_type"] },
    includeRetweets: { propDefinition: [twitter, "includeRetweets"] },
    includeReplies: { propDefinition: [twitter, "includeReplies"] },
    lang: { propDefinition: [twitter, "lang"] },
    locale: { propDefinition: [twitter, "locale"] },
    geocode: { propDefinition: [twitter, "geocode"] },
    enrichTweets: { propDefinition: [twitter, "enrichTweets"] },
    count: { propDefinition: [twitter, "count"] },
    maxRequests: { propDefinition: [twitter, "maxRequests"] },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    }, 
  }, 
  async run(event) {
    const since_id = this.db.get("since_id")
    const { lang, locale, geocode, result_type, enrichTweets, includeReplies, includeRetweets, maxRequests, count } = this
    let q = this.q, max_id, limitFirstPage

    if (!since_id) {
      limitFirstPage = true
    } else {
      limitFirstPage = false
    }
 
    // run paginated search
    const tweets = await this.twitter.paginatedSearch({ 
      q, 
      since_id, 
      lang, 
      locale, 
      geocode, 
      result_type, 
      enrichTweets, 
      includeReplies, 
      includeRetweets, 
      maxRequests,
      count,
      limitFirstPage,
    })

    // emit array of tweet objects
    if(tweets.length > 0) {
      tweets.sort(function(a, b){return a.id - b.id})

      tweets.forEach(tweet => {
        this.$emit(tweet, {
          ts: moment(tweet.created_at, 'ddd MMM DD HH:mm:ss Z YYYY').valueOf(),
          summary: tweet.full_text || tweet.text,
          id: tweet.id_str,
        })

        if (tweet.id_str > max_id || !max_id) {
          max_id = tweet.id_str
        }
      })
    }
    if (max_id) {
      this.db.set("since_id", max_id)
    }
  },
}
```
<a href="http://pipedream.com"><img src="https://img.shields.io/static/v1?label=&message=Run%20on%20Pipedream&color=brightgreen&style=for-the-badge"></a>

**Or deploy via CLI:**

```bash
pd deploy https://github.com/psavkar/pipedream/blob/readme-test/components/twitter/sources/search-twitter/search-twitter.js
```



## Sample Event

Following is a sample event emitted by this source:

```javascript
{
  "created_at": "Thu Aug 13 00:32:45 +0000 2020",
  "id": 1293707024086302700,
  "id_str": "1293707024086302733",
  "full_text": "Usefull! The fastest way to integrate APIs and run code | Pipedream https://t.co/S7trbAShpS",
  "truncated": false,
  "display_text_range": [
    0,
    91
  ],
  "entities": {
    "hashtags": [],
    "symbols": [],
    "user_mentions": [],
    "urls": [
      {
        "url": "https://t.co/S7trbAShpS",
        "expanded_url": "http://pipedream.com/",
        "display_url": "pipedream.com",
        "indices": [
          68,
          91
        ]
      }
    ]
  },
  "metadata": {
    "iso_language_code": "en",
    "result_type": "recent"
  },
  "source": "<a href=\"http://twitter.com/#!/download/ipad\" rel=\"nofollow\">Twitter for iPad</a>",
  "in_reply_to_status_id": null,
  "in_reply_to_status_id_str": null,
  "in_reply_to_user_id": null,
  "in_reply_to_user_id_str": null,
  "in_reply_to_screen_name": null,
  "user": {
    "id": 48042909,
    "id_str": "48042909",
    "name": "Savi Vila",
    "screen_name": "savivila",
    "location": "NY",
    "description": "Ph.D. in Physics. Visual Designer. Science Consultant, having fun discovering tiny things in a complex world",
    "url": null,
    "entities": {
      "description": {
        "urls": []
      }
    },
    "protected": false,
    "followers_count": 113,
    "friends_count": 357,
    "listed_count": 1,
    "created_at": "Wed Jun 17 17:39:01 +0000 2009",
    "favourites_count": 1884,
    "utc_offset": null,
    "time_zone": null,
    "geo_enabled": false,
    "verified": false,
    "statuses_count": 7291,
    "lang": null,
    "contributors_enabled": false,
    "is_translator": false,
    "is_translation_enabled": false,
    "profile_background_color": "C0DEED",
    "profile_background_image_url": "http://abs.twimg.com/images/themes/theme1/bg.png",
    "profile_background_image_url_https": "https://abs.twimg.com/images/themes/theme1/bg.png",
    "profile_background_tile": false,
    "profile_image_url": "http://pbs.twimg.com/profile_images/1280540544842809344/dyx0dvcZ_normal.jpg",
    "profile_image_url_https": "https://pbs.twimg.com/profile_images/1280540544842809344/dyx0dvcZ_normal.jpg",
    "profile_banner_url": "https://pbs.twimg.com/profile_banners/48042909/1584209351",
    "profile_link_color": "1DA1F2",
    "profile_sidebar_border_color": "C0DEED",
    "profile_sidebar_fill_color": "DDEEF6",
    "profile_text_color": "333333",
    "profile_use_background_image": true,
    "has_extended_profile": false,
    "default_profile": true,
    "default_profile_image": false,
    "following": false,
    "follow_request_sent": false,
    "notifications": false,
    "translator_type": "none"
  },
  "geo": null,
  "coordinates": null,
  "place": null,
  "contributors": null,
  "is_quote_status": false,
  "retweet_count": 0,
  "favorite_count": 0,
  "favorited": false,
  "retweeted": false,
  "possibly_sensitive": false,
  "lang": "en",
  "created_at_timestamp": 1597278765000,
  "created_at_iso8601": "2020-08-13T00:32:45.000Z"
}
```



## Popular Integrations

Actions are reusable components that implement popular operations. You can execute actions on demand or trigger and orchestrate their execution in workflows.

| Source                                            | Description                                                  | Popularity |
| ------------------------------------------------- | ------------------------------------------------------------ | ---------- |
| [Search Mentions](./sources/search-mentions)      | Emit new Tweets when a new tweet matches your search.        | 9.9        |
| [New Tweets by User](./sources/search-mentions)   | Emit new Tweets when when there is a new Tweet from a specific user. | 9.8        |
| [New Followers](./sources/search-mentions)        | Emit new Tweets when when you get a new follower.            | 7.2        |
| [My Liked Tweets](./sources/search-mentions)      | Emit new Tweets when when you get a new follower.            | 6.3        |
| [New Follower of User](./sources/search-mentions) | Emit new Tweets when when you get a new follower.            | 5.5        |

**[View All Actions (15)](./sources/search-mentions)**



## Commonly Paired Actions

Actions are reusable components that implement popular operations. You can execute actions on demand or trigger and orchestrate their execution in workflows.

| Source                                            | Description                                                  | Popularity |
| ------------------------------------------------- | ------------------------------------------------------------ | ---------- |
| [Search Mentions](./sources/search-mentions)      | Emit new Tweets when a new tweet matches your search.        | 9.9        |
| [New Tweets by User](./sources/search-mentions)   | Emit new Tweets when when there is a new Tweet from a specific user. | 9.8        |
| [New Followers](./sources/search-mentions)        | Emit new Tweets when when you get a new follower.            | 7.2        |
| [My Liked Tweets](./sources/search-mentions)      | Emit new Tweets when when you get a new follower.            | 6.3        |
| [New Follower of User](./sources/search-mentions) | Emit new Tweets when when you get a new follower.            | 5.5        |

**[View All Actions (15)](./sources/search-mentions)**



## Commonly Paired Apps

Click to connect your Twitter account and use tokens in code. Pipedream manages the OAuth authentication and refresh process.

| Source                                      | Description                                                  | Popularity |
| ------------------------------------------- | ------------------------------------------------------------ | ---------- |
| [Slack](./srources/search-mentions)         | From breaking news and entertainment to sports and politics, from big events to everyday interests. If it's happening anywhere, it's happening on Twitter. | 9.9        |
| [Google Sheets](./srources/search-mentions) | From breaking news and entertainment to sports and politics, from big events to everyday interests. If it's happening anywhere, it's happening on Twitter. | 9.9        |
| [Discord](./srources/search-mentions)       | From breaking news and entertainment to sports and politics, from big events to everyday interests. If it's happening anywhere, it's happening on Twitter. | 9.9        |



## Commonly Used ` npm` Packages

| Source                              | Description                                                  | Popularity |
| ----------------------------------- | ------------------------------------------------------------ | ---------- |
| [moment](./sources/search-mentions) | A lightweight JavaScript date library for parsing, validating, manipulating, and formatting dates. | 9.8        |
| [querystring]()                     | Parse and stringify URL query strings                        | 8.7        |
