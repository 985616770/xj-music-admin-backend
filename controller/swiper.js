const Router = require('koa-router')
const callCloudDB = require('../utils/callCloudDB')
const cloudStorage = require('../utils/callCloudStorage')
const router = new Router()

router.get('/list', async (ctx, next) => {
  // 默认十条
  const query = `db.collection('swiper').get()`
  const res = (await callCloudDB(ctx, 'databasequery', query)).data
  // 文件下载链接
  let fileList = []
  const { data } = res

  for (let i = 0, len = data.length; i < len; i++) {
    fileList.push({
      fileid: JSON.parse(data[i]).fileid,
      max_age: 7200
    })
  }

  const { file_list } = (await cloudStorage.download(ctx, fileList)).data

  let returnData = []

  for (let i = 0, len = file_list.length; i < len; i++) {
    returnData.push({
      download_url: file_list[i].download_url,
      fileid: file_list[i].fileid,
      _id: JSON.parse(data[i])._id
    })
  }

  ctx.body = { data: returnData, code: 20000 }
})

router.post('/upload', async (ctx, next) => {
  
})
module.exports = router
