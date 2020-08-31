<img height="40" src="https://github.com/psavkar/pipedream/raw/readme-test/images/twitter/TwitterLogo.png" align=left>    
<h1 align="left"><strong>Twitter</strong></h1>

From breaking news and entertainment to sports and politics, from big events to everyday interests. If it's happening anywhere, it's happening on Twitter.

Use Pipedrem to get events on new Tweets, followers, likes, search mentions and more.

## Run Node.js with Twitter auth — try it now

Click to connect your Twitter account and use tokens in code. Pipedream manages the OAuth authentication and refresh process.

```javascript
const twitter = require('https://github.com/PipedreamHQ/pipedream/components/twitter/twitter.app.js')
 
module.exports = {
  name: "Twitter Example",
  description: "Return your Twitter account details on each invocation", 
  version: "0.0.1",
  props: {
    twitter,
  }, 
  async run(event) {
    this.twitter._makeRequest({
      url: `https://api.twitter.com/1.1/account/verify_credentials.json`,
    })
  }
}

```

## Event Sources

Event run on Pipedream's infrastructure and turn any API into an event stream. You can trigger Pipedream workflows, or which you can consume using Pipedream's REST API or a private, real-time SSE stream.

- **Search Mentions:** Emit new Tweets when a new tweet matches your search [view code](./sources/search-mentions) | [deploy](./sources/search-mentions)
- **New Tweets by User:** Emit new Tweets when when there is a new Tweet from a specific user [view code](./sources/search-mentions) | [deploy](./sources/search-mentions)
- **New Followers:** Emit new Tweets when when you get a new follower. [view code](./sources/search-mentions) | [deploy](./sources/search-mentions)



**[View All Sources](./sources/search-mentions)**


## Actions

Event run on Pipedream's infrastructure and turn any API into an event stream. You can trigger Pipedream workflows, or which you can consume using Pipedream's REST API or a private, real-time SSE stream.

- **Search Mentions:** Emit new Tweets when a new tweet matches your search [view code](./sources/search-mentions) | [deploy](./sources/search-mentions)
- **New Tweets by User:** Emit new Tweets when when there is a new Tweet from a specific user [view code](./sources/search-mentions) | [deploy](./sources/search-mentions)
- **New Followers:** Emit new Tweets when when you get a new follower. [view code](./sources/search-mentions) | [deploy](./sources/search-mentions)



**[View All Actions](./sources/search-mentions)**