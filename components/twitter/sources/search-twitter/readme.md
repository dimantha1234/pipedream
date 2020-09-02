<img height="40" src="https://github.com/psavkar/pipedream/raw/readme-test/images/twitter/TwitterLogo.png">    

<h1 align="left"><strong>Twitter: Search Mentions</strong></h1>

Emit new Tweets that match your search criteria. 

Deploy and run this source on Pipedream for free to inspect emitted events, trigger Pipedream workflows, or consume events in your own app using APIs.

*Deploy using Pipdream UI*

<a href="http://pipedream.com"><img src="https://img.shields.io/static/v1?label=&message=Run%20on%20Pipedream&color=brightgreen&style=for-the-badge"></a>

*Deploy using Pipdream CLI*

```bash
pd deploy https://github.com/psavkar/pipedream/blob/readme-test/components/twitter/sources/search-twitter/search-twitter.js
```

*Deploy using Pipdream API*

```bash
curl -d '{"component_url":"https://github.com/PipedreamHQ/pipedream/blob/master/components/http/http.js"}' \
  -H "Authorization: Bearer <API-KEY>" \
  -H "Content-Type: application/json" \
  "https://api.pipedream.com/v1/sources"
```

## Code

Following is the open source code for this source component. Deploy and run it for free, submit a PR to contribute, or use it as a template to author and deploy your own custom component.

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

## Configure

Pipedream will walk you through configuring this source when you activate via the UI or CLI. You may also update any of these settings after deploying.

### Authentication

Connect your accounts on Pipedream for the following apps.

| Source                               | Description                                                  | Authentication Strategy | Popularity |
| ------------------------------------ | ------------------------------------------------------------ | ----------------------- | ---------- |
| [Twitter](./sources/search-mentions) | From breaking news and entertainment to sports and politics, from big events to everyday interests. If it's happening anywhere, it's happening on Twitter. | OAuth 1.0A              | 9.8        |

### Props

You may customize the following settings when instantiating this source. 

| Label                                     | Type                | Optional | Options                | Default            | Description                                                  |
| ----------------------------------------- | ------------------- | -------- | ---------------------- | ------------------ | ------------------------------------------------------------ |
| Search Term                               | `string`            | `false`  |                        |                    | Search for keywords `star wars`, screen names `@starwars`, or hashtags `#starwars`. You can also use Twitter's [standard search operators](https://developer.twitter.com/en/docs/tweets/rules-and-filtering/overview/standard-operators). |
| Result Type                               | `string`            | `true`   | Recent, Popular, Mixed | `recent`           | Specifies the type of results you want to retrieve.          |
| Retweets                                  | `string`            | `true`   |                        | `incude`           | Select whether to `include`, `exclude` or `only` include retweets in emitted events. |
| Replies                                   | `string`            | `true`   |                        | `include`          | Select whether to `include`, `exclude` or `only` include replies in emitted events. |
| Language                                  | `string`            | `true`   | `async()`              |                    | Restricts tweets to the given language. Language detection is best-effort. |
| Locale                                    | `string`            | `true`   |                        |                    | Specify the language of the query you are sending (only `ja` is currently effective). This is intended for language-specific consumers and the default should work in the majority of cases. |
| Geocode                                   | `string`            | `true`   |                        |                    | Returns tweets by users located within a given radius of the given latitude/longitude. The location is preferentially taking from the Geotagging API, but will fall back to their Twitter profile. The parameter value is specified by `latitude,longitude,radius`, where radius units must be specified as either `mi` (miles) or `km` (kilometers). Note that you cannot use the near operator via the API to geocode arbitrary locations; however you can use this geocode parameter to search near geocodes directly. |
| Enrich Tweets                             | `boolean`           | `true`   |                        |                    | Enrich each tweet with epoch (milliseconds) and ISO8601 conversions of Twitter's `created_at` timestamp. |
| Count (advanced)                          | `integer`           | `true`   |                        |                    | The maximum number of tweets to return per API request (up to `100`) |
| Max API Requests per Execution (advanced) | `integer`           | `true`   | `1 - 180`              | `1`                | The maximum number of API requests to make per execution (e.g., multiple requests are required to retrieve paginated results). **Note:** Twitter [rate limits API requests](https://developer.twitter.com/en/docs/basics/rate-limiting) per 15 minute interval. |
| Timer                                     | `$.interface.timer` | `false`  | `15+ seconds`          | `Every 15 minutes` | Configure the schedule to trigger the component. You may configure an interval (minimum interval of 15 seconds) or a cron expression. |

## Consume Events

Trigger Pipedream workflows, or consume events in your own app using APIs.

**Get Recent Events**

```bash
curl -H "Authorization: Bearer <API-KEY>" \
  "https://api.pipedream.com/v1/sources/<SOURCE-ID>/event_summaries?expand=event"
```

**Stream Events in Real-Time**

```bash
curl -H "Authorization: Bearer <API-KEY>" \
  "https://api.pipedream.com/sources/<SOURCE-ID>/sse"
```

## Sample Emits

Following are a sample events emitted by this source.

### Original Tweet

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



### Original Tweet with Media

```javascript
{
  "created_at": "Wed Aug 26 23:46:17 +0000 2020",
  "id": 1298768760409473000,
  "id_str": "1298768760409473025",
  "full_text": ".@YouTube as an event source is live! \n🔥 Trigger on new videos, matching keywords, etc.\n✨ Open-source, available on GitHub\n❤️ Developed by a user, see Docs &amp; Quickstart\n😍 Build your own today!\n\nhttps://t.co/uJcO4ZnNht\nhttps://t.co/8yOKWOpzKp https://t.co/uBHKnrVyqQ",
  "truncated": false,
  "display_text_range": [
    0,
    245
  ],
  "entities": {
    "hashtags": [],
    "symbols": [],
    "user_mentions": [
      {
        "screen_name": "YouTube",
        "name": "YouTube",
        "id": 10228272,
        "id_str": "10228272",
        "indices": [
          1,
          9
        ]
      }
    ],
    "urls": [
      {
        "url": "https://t.co/uJcO4ZnNht",
        "expanded_url": "https://pipedream.com/sources/new?app=youtube",
        "display_url": "pipedream.com/sources/new?ap…",
        "indices": [
          198,
          221
        ]
      },
      {
        "url": "https://t.co/8yOKWOpzKp",
        "expanded_url": "https://github.com/PipedreamHQ/pipedream",
        "display_url": "github.com/PipedreamHQ/pi…",
        "indices": [
          222,
          245
        ]
      }
    ],
    "media": [
      {
        "id": 1298768746505310200,
        "id_str": "1298768746505310208",
        "indices": [
          246,
          269
        ],
        "media_url": "http://pbs.twimg.com/media/EgYnSzTUEAA_hYh.jpg",
        "media_url_https": "https://pbs.twimg.com/media/EgYnSzTUEAA_hYh.jpg",
        "url": "https://t.co/uBHKnrVyqQ",
        "display_url": "pic.twitter.com/uBHKnrVyqQ",
        "expanded_url": "https://twitter.com/pipedream/status/1298768760409473025/photo/1",
        "type": "photo",
        "sizes": {
          "thumb": {
            "w": 150,
            "h": 150,
            "resize": "crop"
          },
          "small": {
            "w": 680,
            "h": 376,
            "resize": "fit"
          },
          "medium": {
            "w": 1200,
            "h": 664,
            "resize": "fit"
          },
          "large": {
            "w": 1472,
            "h": 814,
            "resize": "fit"
          }
        }
      }
    ]
  },
  "extended_entities": {
    "media": [
      {
        "id": 1298768746505310200,
        "id_str": "1298768746505310208",
        "indices": [
          246,
          269
        ],
        "media_url": "http://pbs.twimg.com/media/EgYnSzTUEAA_hYh.jpg",
        "media_url_https": "https://pbs.twimg.com/media/EgYnSzTUEAA_hYh.jpg",
        "url": "https://t.co/uBHKnrVyqQ",
        "display_url": "pic.twitter.com/uBHKnrVyqQ",
        "expanded_url": "https://twitter.com/pipedream/status/1298768760409473025/photo/1",
        "type": "photo",
        "sizes": {
          "thumb": {
            "w": 150,
            "h": 150,
            "resize": "crop"
          },
          "small": {
            "w": 680,
            "h": 376,
            "resize": "fit"
          },
          "medium": {
            "w": 1200,
            "h": 664,
            "resize": "fit"
          },
          "large": {
            "w": 1472,
            "h": 814,
            "resize": "fit"
          }
        }
      }
    ]
  },
  "metadata": {
    "iso_language_code": "en",
    "result_type": "recent"
  },
  "source": "<a href=\"https://mobile.twitter.com\" rel=\"nofollow\">Twitter Web App</a>",
  "in_reply_to_status_id": null,
  "in_reply_to_status_id_str": null,
  "in_reply_to_user_id": null,
  "in_reply_to_user_id_str": null,
  "in_reply_to_screen_name": null,
  "user": {
    "id": 1067926271856767000,
    "id_str": "1067926271856766976",
    "name": "Pipedream",
    "screen_name": "pipedream",
    "location": "San Francisco, CA",
    "description": "Serverless integration and compute platform. Free for developers. 👩‍💻☁️🔗💥🚀",
    "url": "https://t.co/uH4CagGdm7",
    "entities": {
      "url": {
        "urls": [
          {
            "url": "https://t.co/uH4CagGdm7",
            "expanded_url": "https://pipedream.com",
            "display_url": "pipedream.com",
            "indices": [
              0,
              23
            ]
          }
        ]
      },
      "description": {
        "urls": []
      }
    },
    "protected": false,
    "followers_count": 5162,
    "friends_count": 4055,
    "listed_count": 57,
    "created_at": "Wed Nov 28 23:40:39 +0000 2018",
    "favourites_count": 1029,
    "utc_offset": null,
    "time_zone": null,
    "geo_enabled": false,
    "verified": false,
    "statuses_count": 234,
    "lang": null,
    "contributors_enabled": false,
    "is_translator": false,
    "is_translation_enabled": false,
    "profile_background_color": "F5F8FA",
    "profile_background_image_url": null,
    "profile_background_image_url_https": null,
    "profile_background_tile": false,
    "profile_image_url": "http://pbs.twimg.com/profile_images/1207431957765705728/HzP2Yhq8_normal.jpg",
    "profile_image_url_https": "https://pbs.twimg.com/profile_images/1207431957765705728/HzP2Yhq8_normal.jpg",
    "profile_banner_url": "https://pbs.twimg.com/profile_banners/1067926271856766976/1571334539",
    "profile_link_color": "1DA1F2",
    "profile_sidebar_border_color": "C0DEED",
    "profile_sidebar_fill_color": "DDEEF6",
    "profile_text_color": "333333",
    "profile_use_background_image": true,
    "has_extended_profile": false,
    "default_profile": true,
    "default_profile_image": false,
    "following": true,
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
  "created_at_timestamp": 1598485577000,
  "created_at_iso8601": "2020-08-26T23:46:17.000Z"
}
```



### Retweet

```javascript
{
  "created_at": "Fri Aug 07 21:29:56 +0000 2020",
  "id": 1291849079845089300,
  "id_str": "1291849079845089280",
  "full_text": "RT @mjclemente84: I'll be finishing up this week, like last, by exploring @pipedream during a live coding session.\n\nHoping to take data fro…",
  "truncated": false,
  "display_text_range": [
    0,
    140
  ],
  "entities": {
    "hashtags": [],
    "symbols": [],
    "user_mentions": [
      {
        "screen_name": "mjclemente84",
        "name": "Matthew Clemente",
        "id": 257038630,
        "id_str": "257038630",
        "indices": [
          3,
          16
        ]
      },
      {
        "screen_name": "pipedream",
        "name": "Pipedream",
        "id": 1067926271856767000,
        "id_str": "1067926271856766976",
        "indices": [
          74,
          84
        ]
      }
    ],
    "urls": []
  },
  "metadata": {
    "iso_language_code": "en",
    "result_type": "recent"
  },
  "source": "<a href=\"https://mobile.twitter.com\" rel=\"nofollow\">Twitter Web App</a>",
  "in_reply_to_status_id": null,
  "in_reply_to_status_id_str": null,
  "in_reply_to_user_id": null,
  "in_reply_to_user_id_str": null,
  "in_reply_to_screen_name": null,
  "user": {
    "id": 1067926271856767000,
    "id_str": "1067926271856766976",
    "name": "Pipedream",
    "screen_name": "pipedream",
    "location": "San Francisco, CA",
    "description": "Serverless integration and compute platform. Free for developers. 👩‍💻☁️🔗💥🚀",
    "url": "https://t.co/uH4CagGdm7",
    "entities": {
      "url": {
        "urls": [
          {
            "url": "https://t.co/uH4CagGdm7",
            "expanded_url": "https://pipedream.com",
            "display_url": "pipedream.com",
            "indices": [
              0,
              23
            ]
          }
        ]
      },
      "description": {
        "urls": []
      }
    },
    "protected": false,
    "followers_count": 4785,
    "friends_count": 3815,
    "listed_count": 55,
    "created_at": "Wed Nov 28 23:40:39 +0000 2018",
    "favourites_count": 1023,
    "utc_offset": null,
    "time_zone": null,
    "geo_enabled": false,
    "verified": false,
    "statuses_count": 225,
    "lang": null,
    "contributors_enabled": false,
    "is_translator": false,
    "is_translation_enabled": false,
    "profile_background_color": "F5F8FA",
    "profile_background_image_url": null,
    "profile_background_image_url_https": null,
    "profile_background_tile": false,
    "profile_image_url": "http://pbs.twimg.com/profile_images/1207431957765705728/HzP2Yhq8_normal.jpg",
    "profile_image_url_https": "https://pbs.twimg.com/profile_images/1207431957765705728/HzP2Yhq8_normal.jpg",
    "profile_banner_url": "https://pbs.twimg.com/profile_banners/1067926271856766976/1571334539",
    "profile_link_color": "1DA1F2",
    "profile_sidebar_border_color": "C0DEED",
    "profile_sidebar_fill_color": "DDEEF6",
    "profile_text_color": "333333",
    "profile_use_background_image": true,
    "has_extended_profile": false,
    "default_profile": true,
    "default_profile_image": false,
    "following": true,
    "follow_request_sent": false,
    "notifications": false,
    "translator_type": "none"
  },
  "geo": null,
  "coordinates": null,
  "place": null,
  "contributors": null,
  "retweeted_status": {
    "created_at": "Fri Aug 07 21:04:13 +0000 2020",
    "id": 1291842606293569500,
    "id_str": "1291842606293569537",
    "full_text": "I'll be finishing up this week, like last, by exploring @pipedream during a live coding session.\n\nHoping to take data from @JotForm, manipulate it, and pipe it to @googlesheets 🤞\n\nGoing live in 5: https://t.co/1qqhYQn1tk",
    "truncated": false,
    "display_text_range": [
      0,
      220
    ],
    "entities": {
      "hashtags": [],
      "symbols": [],
      "user_mentions": [
        {
          "screen_name": "pipedream",
          "name": "Pipedream",
          "id": 1067926271856767000,
          "id_str": "1067926271856766976",
          "indices": [
            56,
            66
          ]
        },
        {
          "screen_name": "JotForm",
          "name": "JotForm",
          "id": 34689599,
          "id_str": "34689599",
          "indices": [
            123,
            131
          ]
        },
        {
          "screen_name": "googlesheets",
          "name": "Google Sheets",
          "id": 1150081370187845600,
          "id_str": "1150081370187845632",
          "indices": [
            163,
            176
          ]
        }
      ],
      "urls": [
        {
          "url": "https://t.co/1qqhYQn1tk",
          "expanded_url": "https://youtu.be/sndBPkhttgA",
          "display_url": "youtu.be/sndBPkhttgA",
          "indices": [
            197,
            220
          ]
        }
      ]
    },
    "metadata": {
      "iso_language_code": "en",
      "result_type": "recent"
    },
    "source": "<a href=\"https://about.twitter.com/products/tweetdeck\" rel=\"nofollow\">TweetDeck</a>",
    "in_reply_to_status_id": null,
    "in_reply_to_status_id_str": null,
    "in_reply_to_user_id": null,
    "in_reply_to_user_id_str": null,
    "in_reply_to_screen_name": null,
    "user": {
      "id": 257038630,
      "id_str": "257038630",
      "name": "Matthew Clemente",
      "screen_name": "mjclemente84",
      "location": "New Jersey",
      "description": "Husband. Father. Developer. Always trying to be better.",
      "url": "https://t.co/CUv7faAamH",
      "entities": {
        "url": {
          "urls": [
            {
              "url": "https://t.co/CUv7faAamH",
              "expanded_url": "http://blog.mattclemente.com",
              "display_url": "blog.mattclemente.com",
              "indices": [
                0,
                23
              ]
            }
          ]
        },
        "description": {
          "urls": []
        }
      },
      "protected": false,
      "followers_count": 282,
      "friends_count": 235,
      "listed_count": 11,
      "created_at": "Thu Feb 24 16:00:42 +0000 2011",
      "favourites_count": 321,
      "utc_offset": null,
      "time_zone": null,
      "geo_enabled": false,
      "verified": false,
      "statuses_count": 797,
      "lang": null,
      "contributors_enabled": false,
      "is_translator": false,
      "is_translation_enabled": false,
      "profile_background_color": "C0DEED",
      "profile_background_image_url": "http://abs.twimg.com/images/themes/theme1/bg.png",
      "profile_background_image_url_https": "https://abs.twimg.com/images/themes/theme1/bg.png",
      "profile_background_tile": false,
      "profile_image_url": "http://pbs.twimg.com/profile_images/439040536649793538/cBmreTa0_normal.jpeg",
      "profile_image_url_https": "https://pbs.twimg.com/profile_images/439040536649793538/cBmreTa0_normal.jpeg",
      "profile_banner_url": "https://pbs.twimg.com/profile_banners/257038630/1538426586",
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
    "retweet_count": 1,
    "favorite_count": 1,
    "favorited": false,
    "retweeted": false,
    "possibly_sensitive": false,
    "lang": "en"
  },
  "is_quote_status": false,
  "retweet_count": 1,
  "favorite_count": 0,
  "favorited": false,
  "retweeted": false,
  "possibly_sensitive": false,
  "lang": "en",
  "created_at_timestamp": 1596835796000,
  "created_at_iso8601": "2020-08-07T21:29:56.000Z"
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



## Commonly Paired ` npm` Packages

| Source                              | Description                                                  | Popularity |
| ----------------------------------- | ------------------------------------------------------------ | ---------- |
| [moment](./sources/search-mentions) | A lightweight JavaScript date library for parsing, validating, manipulating, and formatting dates. | 9.8        |
| [querystring]()                     | Parse and stringify URL query strings                        | 8.7        |
