const Router = require('koa-router')
const callCloudFn = require('../utils/callCloudFn')
const callCloudDB = require('../utils/callCloudDB')

const router = new Router()

router.get('/list', async (ctx, next) => {
  const {
    query: { count, start }
  } = ctx.request

  const {
    data: { resp_data }
  } = await callCloudFn(ctx, 'music', {
    $url: 'playlist',
    count: parseInt(count),
    start: parseInt(start)
  })

  // 查询歌单列表
  ctx.body = { resp_data, code: 20000 }
})

router.get('/getById', async (ctx, next) => {
  const query = `db.collection('playlist').doc('${ctx.request.query.id}').get()`
  const res = (await callCloudDB(ctx, 'databasequery', query)).data
  // console.log(res)

  ctx.body = {
    code: 20000,
    res
  }
})

router.post('/updatePlaylist', async (ctx, next) => {
  const params = ctx.request.body
  const query = `db.collection('playlist').doc('${params._id}').update({
    data:{
      name:'${params.name}',
      copywriter:'${params.copywriter}'
    }
  })`
  const res = (await callCloudDB(ctx, 'databaseupdate', query)).data
  ctx.body = {
    code: 20000,
    res
  }
})

router.get('/del', async (ctx, next) => {
  console.log(ctx.request.query)

  const query = `db.collection('playlist').doc('${ctx.request.query.id}').remove()`
  const res = (await callCloudDB(ctx, 'databasedelete', query)).data
  ctx.body = {
    code: 20000,
    res
  }
})
module.exports = router
