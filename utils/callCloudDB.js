const getAccessToken = require('./getAccessToken')
const ax = require('axios').default

const callCloudDB = async (ctx, fnName, query = {}) => {
  const ACCESS_TOKEN = await getAccessToken()
  const URL = `https://api.weixin.qq.com/tcb/${fnName}?access_token=${ACCESS_TOKEN}`

  return ax.post(URL, { query, env: ctx.state.env })
}

module.exports = callCloudDB
