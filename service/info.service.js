function infoService(req) {
  const userAgent = req.headers['user-agent']
  const timeStamp = `${ new Date().toLocaleDateString() } ${ new Date().toLocaleTimeString() } GMT`
  const ipAddress = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress

  return {timeStamp, ipAddress, userAgent}
}

module.exports = infoService