const http = require('http')
const { v4: uuidv4 } = require('uuid')
const handler = require('./const')
const dayjs = require('dayjs')

const todos = [
  {
    title: '預設的資料',
    createTime: dayjs().format('YYYY/MM/DD HH:mm:ss'), //  第三方外掛測試
    lastUpdateTime: '',
    id: uuidv4()
  }
]

const requsetListener = (req, res) => {
  const time = dayjs().format('YYYY/MM/DD HH:mm:ss') // 要放在 requsetListener 內
  let data = ''
  req.on('data', chunk => {// POST & PATCH 取得封包
    data += chunk
  })

  if (req.url == '/todos' && req.method == 'GET') {// GET
    handler.success(res, todos)
  } else if (req.url == '/todos' && req.method == 'POST') {// POST
    req.on('end', () => {
      try {
        const title = JSON.parse(data).title // 前端只須給 title
        if (title !== undefined) {
          const obj = {
            id: uuidv4(),
            title: title,
            createTime: time, // 後端紀錄時間
            lastUpdateTime: '',
            isDone: false
          }
          todos.push(obj)
          handler.success(res, todos)
        } else {
          handler.error(res)
        }
      } catch (error) {
        handler.error(res)
      }
    })
  } else if (req.url == '/todos' && req.method == 'DELETE') { // DELETE ALL
    todos.length = 0
    handler.success(res, todos)
  } else if (req.url.startsWith('/todos/') && req.method == 'DELETE') { // DELETE
    const id = req.url.split('/').pop()
    let index = todos.findIndex(el => el.id == id)

    if (index !== -1) {
      todos.splice(index, 1)
      handler.success(res, todos)
    } else {
      handler.error(res)
    }

  } else if (req.url.startsWith('/todos/') && req.method == 'PATCH') { // PATCH
    req.on('end', () => {
      try {
        const { title } = JSON.parse(data)
        const id = req.url.split('/').pop()
        const index = todos.findIndex(el => el.id == id)
        if (title !== undefined && index !== -1) {
          todos[index].title = title
          todos[index].lastUpdateTime = time
          handler.success(res, todos)
        } else {
          handler.error(res)
        }
      } catch {
        handler.error(res)
      }
    })
  } else {
    res.writeHead(404, headers)
    res.write('404 Not found!')
    res.end()
  }
}
const server = http.createServer(requsetListener)
server.listen(process.env.PORT || 8080)

