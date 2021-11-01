const jwt = require('jsonwebtoken')
const APIException = require('../helpers/api.exception')

const authorization = (req, res, next) => {
  try {
    const accessToken = req.headers.authorization.split(" ")[ 1 ]

    const payload = jwt.verify(accessToken, process.env.ACCESS_SECRET)
    if (!payload) return next(APIException.Request("Пользователь не авторизован!"))

    req.user = payload
    next()
  } catch (err) { return next(APIException.Request("Пользователь не авторизован!")) }
}

module.exports = authorization