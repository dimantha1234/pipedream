<img height="40" src="https://github.com/psavkar/pipedream/raw/readme-test/images/twitter/TwitterLogo.png" align=left>    
<h1 align="left"><strong>Twitter</strong></h1>

From breaking news and entertainment to sports and politics, from big events to everyday interests. If it's happening anywhere, it's happening on Twitter.

Use Pipedrem to get events on new Tweets, followers, likes, search mentions and more.

## Run Node.js with Twitter auth — try it now

Click to connect your Twitter account and use tokens in code. Pipedream manages the OAuth authentication and refresh process.

```javascript
return await require("@pipedreamhq/platform").axios(this, {
  url: `https://api.twitter.com/1.1/account/verify_credentials.json`,
}, {
  token: {
    key: auths.twitter.oauth_access_token,
    secret: auths.twitter.oauth_refresh_token,
  },
  oauthSignerUri: auths.twitter.oauth_signer_uri,
})
```