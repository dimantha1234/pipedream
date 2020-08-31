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
    twitter = {
      app: "twitter",
      type: "app"
    },
  }, 
  async run(event) {
    this.twitter._makeRequest({
      url: `https://api.twitter.com/1.1/account/verify_credentials.json`,
    })
  }
}

```
<a href="http://tod.ly/3fMdryW"><img src="https://i.ibb.co/m0bBsSL/deploy-clean.png" height="35"></a>


## Event Sources

Event run on Pipedream's infrastructure and turn any API into an event stream. You can trigger Pipedream workflows, or which you can consume using Pipedream's REST API or a private, real-time SSE stream.

- **[Search Mentions:](./sources/search-mentions)** Emit new Tweets when a new tweet matches your search.
- **[New Tweets by User:](./sources/search-mentions)** Emit new Tweets when when there is a new Tweet from a specific user.
- **[New Followers:](./sources/search-mentions)** Emit new Tweets when when you get a new follower.

**[View All Sources (8)](./sources/search-mentions)**


## Actions

Event run on Pipedream's infrastructure and turn any API into an event stream. You can trigger Pipedream workflows, or which you can consume using Pipedream's REST API or a private, real-time SSE stream.

- **[Search Mentions:](./sources/search-mentions)** Emit new Tweets when a new tweet matches your search.
- **[New Tweets by User:](./sources/search-mentions)** Emit new Tweets when when there is a new Tweet from a specific user.
- **[New Followers:](./sources/search-mentions)** Emit new Tweets when when you get a new follower.

**[View All Actions (15)](./sources/search-mentions)**

## `npm` Packages Used with Twitter

- `moment`
- `querystring`

## Connecting Your Twitter Account

Connect your Twitter account with a click using Pipedream's browser-based OAuth flow. You can initiate auth at https://pipedream.com/apps or via the CLI.

### Scopes

Pipedream requests the following scopes when you connect your account. [Contact us](https://pipedream.com) to request additional scopes.

| Scope     | Description           |
| ------- | --------------- |
| `Read and Write` | This permission level permits read and write access to Twitter resources, including the ability to read a user’s Tweets, home timeline, and profile information; and to post Tweets, follow users, or update elements of a user’s profile information. It also allows write access to send Direct Messages on behalf of a user (POST direct_messages/events/new) but does not provide the ability to read or delete Direct Messages. |

### OAuth Configuration

Twitter’s API relies on the `OAuth 1.0a` protocol. At a very simplified level, Twitter’s implementation requires that requests needing `authorization` contain an additional HTTP Authorization header.

Pipedream integrates with the following endpoints using the configuration below when you connect your account.

#### Request Token

##### Endpoint

```
https://api.twitter.com/oauth/request_token
```

##### Configuration

###### URL Params

None

###### Header Params (1)

| Key     | Value           |
| ------- | --------------- |
| `OAuth` | `authorization` |

###### Body Params

None

#### Authorization Request

##### Endpoint

```
https://api.twitter.com/oauth/authenticate
```

##### Configuration

###### URL Params (7)

| Key             | Value                              |
| --------------- | ---------------------------------- |
| `client_id`     | `{{oauth.client_id}}`              |
| `state`         | `{{oauth.state}}`                  |
| `redirect_uri`  | `{{oauth.redirect_url}}`           |
| `response_type` | `code`                             |
| `scope`         | `{{oauth.space_separated_scopes}}` |
| `oauth_token`   | `{{oauth.token}}`                  |
| `force_login`   | `true`                             |

###### Header Params

None

###### Body Params

None

#### Access Token Request

##### Endpoint

```
https://api.twitter.com/oauth/access_token
```

##### Configuration

###### URL Params 

None

###### Header Params (2)

| Key            | Value                               |
| -------------- | ----------------------------------- |
| `OAuth`        | `authorization`                     |
| `content-type` | `application/x-www-form-urlencoded` |

###### Body Params

None

#### Refresh Token Request

Not required

