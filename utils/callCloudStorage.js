const getAccessToken = require('./getAccessToken.js')
const ax = require('axios').default

const cloudStorage = {
  /**
   * 获取下载链接（https）
   * @param {Object} ctx 上下文
   * @param {Array} fileList 传入的参数对象数组
   */
  async download(ctx, fileList) {
    const ACCESS_TOKEN = await getAccessToken()
    const options = {
      method: 'POST',
      url: `https://api.weixin.qq.com/tcb/batchdownloadfile?access_token=${ACCESS_TOKEN}`,
      data: {
        env: ctx.state.env,
        file_list: fileList
      }
    }

    return await ax(options)
      .then(res => {
        return res
      })
      .catch(function (err) {
        console.log(err)
      })
  },
  /**
   * 上传文件
   * @param {Object} ctx 上下文
   */
  async upload(ctx) {
    // 1、请求地址
    const ACCESS_TOKEN = await getAccessToken()
    const file = ctx.request.files.file
    const path = `swiper/${Date.now()}-${Math.random()}-${file.name}`
    const options = {
      method: 'POST',
      url: `https://api.weixin.qq.com/tcb/uploadfile?access_token=${ACCESS_TOKEN}`,
      data: {
        path,
        env: ctx.state.env
      }
    }
    //  请求参数的
    const info = await ax(options)
      .then(function (res) {
        return res
      })
      .catch(function (err) {})
    console.log(info)
    // 2、上传图片
    const params = {
      method: 'POST',
      headers: {
        'content-type': 'multipart/form-data'
      },
      url: info.url,
      formData: {
        key: path,
        Signature: info.authorization,
        'x-cos-security-token': info.token,
        'x-cos-meta-fileid': info.cos_file_id,
        file: fs.createReadStream(file.path)
      }
    }
    await ax({})
    return info.file_id
  },

  async delete(ctx, fileid_list) {
    const ACCESS_TOKEN = await getAccessToken()
    const options = {
      method: 'POST',
      url: `https://api.weixin.qq.com/tcb/batchdeletefile?access_token=${ACCESS_TOKEN}`,
      data: {
        env: ctx.state.env,
        fileid_list: fileid_list
      }
    }

    return await ax(options)
      .then(res => {
        return res
      })
      .catch(function (err) {
        console.log(err)
      })
  }
}

module.exports = cloudStorage
