const Koa = require('koa')
const Router = require('koa-router')
const cors = require('koa2-cors')
const koaBody = require('koa-body')

const app = new Koa()
const router = new Router()

const ENV = 'test-d8akm'

// 跨域
app.use(
  cors({
    origin: ['http://localhost:9528'],
    credentials: true
  })
)

// 接受post参数解析
app.use(
  koaBody({
    multipart: true
  })
)
// 全局中间件
app.use(async (ctx, next) => {
  ctx.state.env = ENV
  await next()
})

const playlist = require('./controller/playlist.js')
const swiper = require('./controller/swiper.js')

router.use('/playlist', playlist.routes())
router.use('/swiper', swiper.routes())

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000, () => {
  console.log('service is running at 3000')
})
