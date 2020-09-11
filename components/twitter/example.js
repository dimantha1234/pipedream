const twitter = require('https://github.com/PipedreamHQ/pipedream/components/twitter/twitter.app.js')
const axios = require('axios')
 
module.exports = {
  name: "Twitter Code Sample",
  description: "Code sample demonstrating how to connect to the Twitter API using Pipedream managed auth.", 
  version: "0.0.1",
  props: {
    twitter,
  }, 
  async run(event) {
    const response = await axios(this, {
      url: `https://api.twitter.com/1.1/account/verify_credentials.json`,
    }, {
      token: {
        key: this.twitter.$auth.oauth_access_token,
        secret: this.twitter.$auth.oauth_refresh_token,
      },
      oauthSignerUri: this.twitter.$auth.oauth_signer_uri,
    })
    this.$emit(response.data)
  }
}
