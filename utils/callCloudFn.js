const getAccessToken = require('./getAccessToken.js')
const ax = require('axios').default

const callCloudFn = async (ctx, fnName, params) => {
  const ACCESS_TOKEN = await getAccessToken()

  const URL = `https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=${ACCESS_TOKEN}&env=${ctx.state.env}&name=${fnName}`

  return await ax.post(URL, { ...params })
}

module.exports = callCloudFn
