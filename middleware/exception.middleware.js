const APIException = require("../helpers/api.exception")

function exception(err, req, res, next) {
  if (err instanceof APIException) return res.status(err.status).json({ message: err.message  })
  return res.status(500).json({ message: "Непредвиденная ошибка!" })
}

module.exports = exception