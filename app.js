const { v4: uuidv4 } = require('uuid')
const errorHandle = require('./errorHandle')
const http = require('http')
// http.createServer((request, response) => {
//   console.log('request:', request);
//   response.writeHead(200, { "Content-Type": 'text/plain' });
//   response.write('Hello~!')
//   response.end()
// }).listen(8080)


const todos = [
  {
    title: '測試',
    id: uuidv4()
  }
]

const requsetListener = (req, res) => {

  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json'
  }

  let data = ''

  req.on('data', chunk => {
    data += chunk
  })

  if (req.url == '/todos' && req.method == 'GET') {
    // todos - GET
    res.writeHead(200, headers)
    res.write(JSON.stringify({
      status: 'success',
      data: todos
    }))
    res.end()
  } else if (req.url == '/todos' && req.method == 'POST') {// todos - POST

    req.on('end', () => {
      try {
        const title = JSON.parse(data).title
        if (title !== undefined) {
          const obj = {
            title: title,
            id: uuidv4()
          }
          todos.push(obj)
          res.writeHead(200, headers)
          res.write(JSON.stringify({
            status: 'success',
            data: todos
          }))
          res.end()
        } else {
          errorHandle(res)
        }
      } catch (error) {
        errorHandle(res)
      }

    })
  } else if (req.url == '/todos' && req.method == 'DELETE') { // todos - DELETE ALL
    todos.length = 0
    res.writeHead(200, headers)
    res.write(JSON.stringify({
      status: 'success',
      data: todos,
    }))
    res.end()
  } else if (req.url.startsWith('/todos/') && req.method == 'DELETE') { // todos - DELETE
    const id = req.url.split('/').pop()
    let index = todos.findIndex(el => el.id == id)
    res.writeHead(200, headers)
    if (index !== -1) {
      todos.splice(index, 1)
      res.write(JSON.stringify({
        status: 'success',
        data: todos,
      }))
      res.end()
    } else {
      errorHandle(res)
    }

  } else if (req.url.startsWith('/todos/') && req.method == 'PATCH') {

    req.on('end', () => {
      try {
        const todo = JSON.parse(data).title
        const id = req.url.split('/').pop()
        const index = todos.findIndex(el => el.id == id)

        if (todo !== undefined && index !== -1) {
          todos[index].title = todo
          res.writeHead(200, headers)
          res.write(JSON.stringify({
            status: 'success',
            data: todos,
          }))
        } else {
          errorHandle(res)
        }
        res.end()
      } catch {
        errorHandle(res)
      }
    })

  }
  else {
    res.writeHead(404, headers)
    res.write('Not found!')
    res.end()
  }


}
const server = http.createServer(requsetListener)
server.listen(process.env.PORT || 8080)

