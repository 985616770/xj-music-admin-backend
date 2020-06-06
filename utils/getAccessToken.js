const rp = require('axios').default
const fs = require('fs')
const path = require('path')

const APPID = 'wx242adee6cd49ab7a'
const APPSECRET = '742860ca477601cb9fb26386622da62d'
const URL = ` https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`
const fileName = path.resolve(__dirname, './access_token.json')

const updateAccessToken = async () => {
  const res = (await rp(URL)).data
  // 写入文件
  if (res.access_token) {
    fs.writeFileSync(
      fileName,
      JSON.stringify({
        access_token: res.access_token,
        createTime: new Date()
      })
    )
  } else {
    await updateAccessToken()
  }
}

const getAccessToken = async () => {
  try {
    // 读取token
    const readRes = fs.readFileSync(fileName, 'utf-8')
    const readObj = JSON.parse(readRes)

    // 服务器宕机，异常处理
    const createTime = new Date(readObj.createTime).getTime()
    const nowTime = new Date().getTime()
    if ((nowTime - createTime) / 1000 / 60 / 60 >= 2) {
      await updateAccessToken()
      await getAccessToken()
    }
    // 返回token
    // console.log(readObj.access_token)

    return readObj.access_token
  } catch (error) {
    await updateAccessToken()
    await getAccessToken()
  }
}

/**
 * 定时调取api，更新token
 * @time 一小时五十五分钟
 */
setInterval(async () => {
  await updateAccessToken()
}, (7200 - 300) * 1000)

module.exports = getAccessToken
