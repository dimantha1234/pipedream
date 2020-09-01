<img height="40" src="https://github.com/psavkar/pipedream/raw/readme-test/images/twitter/TwitterLogo.png" align=left>    
<h1 align="left"><strong>Twitter</strong></h1>

From breaking news and entertainment to sports and politics, from big events to everyday interests. If it's happening anywhere, it's happening on Twitter.



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
    return this.twitter._makeRequest({
      url: `https://api.twitter.com/1.1/account/verify_credentials.json`,
    })
  }
}

```
<a href="http://tod.ly/3fMdryW"><img src="https://i.ibb.co/m0bBsSL/deploy-clean.png" height="35"></a>



## Event Sources

Event sources run on Pipedream's infrastructure and turn any API into an event stream. You can trigger Pipedream workflows, or which you can consume using Pipedream's REST API or a private, real-time SSE stream.

| Source                                                | Description                                                  |                                                              |
| ----------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **[Search Mentions](./sources/search-mentions)**      | Emit new Tweets when a new tweet matches your search.        | [code](https://pipedream.com) \| [deploy](https://pipedream.com) |
| **[New Tweets by User](./sources/search-mentions)**   | Emit new Tweets when when there is a new Tweet from a specific user. | [code](https://pipedream.com) \| [deploy](https://pipedream.com) |
| **[New Followers](./sources/search-mentions)**        | Emit new Tweets when when you get a new follower.            | [code](https://pipedream.com) \| [deploy](https://pipedream.com) |
| **[My Liked Tweets](./sources/search-mentions)**      | Emit new Tweets when when you get a new follower.            | [code](https://pipedream.com) \| [deploy](https://pipedream.com) |
| **[New Follower of User](./sources/search-mentions)** | Emit new Tweets when when you get a new follower.            | [code](https://pipedream.com) \| [deploy](https://pipedream.com) |

**[View All Sources (8)](./sources/search-mentions)**




## Actions

Actions are reusable components that implement popular operations. You can execute actions on demand or trigger and orchestrate their execution in workflows.

| Source                                                | Description                                                  |                                                              |
| ----------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **[Search Mentions](./sources/search-mentions)**      | Emit new Tweets when a new tweet matches your search.        | [code](https://pipedream.com) \| [deploy](https://pipedream.com) |
| **[New Tweets by User](./sources/search-mentions)**   | Emit new Tweets when when there is a new Tweet from a specific user. | [code](https://pipedream.com) \| [deploy](https://pipedream.com) |
| **[New Followers](./sources/search-mentions)**        | Emit new Tweets when when you get a new follower.            | [code](https://pipedream.com) \| [deploy](https://pipedream.com) |
| **[My Liked Tweets](./sources/search-mentions)**      | Emit new Tweets when when you get a new follower.            | [code](https://pipedream.com) \| [deploy](https://pipedream.com) |
| **[New Follower of User](./sources/search-mentions)** | Emit new Tweets when when you get a new follower.            | [code](https://pipedream.com) \| [deploy](https://pipedream.com) |

**[View All Actions (15)](./sources/search-mentions)**



## ` npm` Packages Used with Twitter

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



## Using Twitter in Components



### Prop Definitions

Add common Twitter props to your components with pre-defined labels, descriptions, default values, validation logic and more. You can over-ride any values when you include them in your own component.

 **Want to contribute a new or Twitter prop definition or suggest an edit to an existing one?** [Create a PR](https://pipedream.com) in this repo.

| Name             | Type      | Label            | Optional | Options                | Default  | Description                                                  |
| ---------------- | --------- | ---------------- | -------- | ---------------------- | -------- | ------------------------------------------------------------ |
| `q`              | `string`  | Search Term      | `false`  |                        |          | Search for keywords `star wars`, screen names `@starwars`, or hashtags `#starwars`. You can also use Twitter's [standard search operators](https://developer.twitter.com/en/docs/tweets/rules-and-filtering/overview/standard-operators). |
| `keyword_filter` | `string`  | Keywords         | `true`   |                        |          | Filter tweets based on keywords `star wars`, user mentions `@starwars`, or hashtags `#starwars`. You can also use Twitter's [standard search operators](https://developer.twitter.com/en/docs/tweets/rules-and-filtering/overview/standard-operators). |
| `result_type`    | `string`  | Result Type      | `true`   | Recent, Popular, Mixed | `recent` | Specifies the type of results you want to retrieve.          |
| `count`          | `integer` | Count (advanced) | `true`   |                        |          | The maximum number of tweets to return per API request (up to `100`) |
| `from`           | `string`  | From             | `false`  |                        |          | The screen name of the user (e.g., `pipedream`)              |
| `geocode`        | `string`  | Geocode          | `true`   |                        |          | Returns tweets by users located within a given radius of the given latitude/longitude. The location is preferentially taking from the Geotagging API, but will fall back to their Twitter profile. The parameter value is specified by `latitude,longitude,radius`, where radius units must be specified as either `mi` (miles) or `km` (kilometers). Note that you cannot use the near operator via the API to geocode arbitrary locations; however you can use this geocode parameter to search near geocodes directly. |
| `screen_name`    | `string`  | Screen Name      | `false`  |                        |          | The screen name of the user (e.g., `pipedream`)              |
| `trendLocation`  | `string`  | Location         | `false`  | async options          |          |                                                              |



### Methods

Use common Twitter methods in your components. Want to contribute a new or Twitter method or suggest an edit to an existing one? [Create a PR](https://pipedream.com) in this repo.

#### `async` _getAuthorizationHeader

Generate an authorization header to sign the request. The data, method and URL passed into this function must exactly match the values submitted in the API request to Twitter. This method is typically called from `_makeRequest()`.

##### Inputs

| Field    | Type     | Description                                                  |
| -------- | -------- | ------------------------------------------------------------ |
| `data`   | `object` | The data to post to Twitter.                                 |
| `method` | `string` | The method of the HTTP request to sign (e.g., `get`, `post`) |
| `url`    | `string` | The URL for the request.                                     |

##### Return Value

| Type     | Description                                                |
| -------- | ---------------------------------------------------------- |
| `string` | Authorization header to pass in an API request to Twitter. |

##### Code

```javascript
async _getAuthorizationHeader({ data, method, url }) {
  const requestData = {
    data,
    method,
    url,
  }
  const token = {
    key: this.$auth.oauth_access_token,
    secret: this.$auth.oauth_refresh_token,
  }
  return (await axios({
    method: 'POST',
    url: this.$auth.oauth_signer_uri,
    data: {
      requestData,
      token,
    }
  })).data
}
```

#### `async` _makeRequest

Helper function to make requests to Twitter's API. Accepts an axios configuration, generates an OAuth 1.0A signature, and returns the response from Twitter's API.

##### Inputs

| Field     | Type      | Description                                                  |
| --------- | --------- | ------------------------------------------------------------ |
| `config`  | `object`  | An object with the configuration for the axios request       |
| `attempt` | `integer` | The attempt number. Used to support retries when generating the authorization header. |

##### Return Value

| Type  | Description                          |
| ----- | ------------------------------------ |
| `any` | Returns the data from Twitter's API. |

##### Code

```javascript
async _makeRequest(config, attempt = 0) {
  if (!config.headers) config.headers = {}
  if (config.params) {
    const query = querystring.stringify(config.params)
    delete config.params
    const sep = config.url.indexOf('?') === -1 ? '?' : '&'
    config.url += `${sep}${query}`
    config.url = config.url.replace('?&','?')
  }
  let authorization, count = 0
  const maxTries = 3
  while(true) {
    try {
      authorization = await this._getAuthorizationHeader(config)
      break
    } catch (err) {
      // handle exception
      if (++count == maxTries) {
        throw err
      } 
      const milliseconds = 1000 * count
      await new Promise(resolve => setTimeout(resolve, milliseconds)) 
    }
  }
  config.headers.authorization = authorization
  return await axios(config)
},
```

