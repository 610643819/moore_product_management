// 创建服务器
const http = require('http')

const serverHandler = require('../app')

const POST = 3000

const serve = http.createServer(serverHandler)

serve.listen(POST, () => {
    console.log(`Listening on http://localhost/:${POST}`)
})
