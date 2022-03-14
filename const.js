const headers = {
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
  'Content-Type': 'application/json'
}
const handler = {
  error(res) {
    res.writeHead(400, headers)
    res.write(JSON.stringify({
      status: 'false',
      message: '欄位錯誤啦'
    }))
    res.end()
  },
  success(res, data) {
    res.writeHead(200, headers)
    res.write(JSON.stringify({
      status: 'success',
      data: data
    }))
    res.end()
  }
}

module.exports = handler