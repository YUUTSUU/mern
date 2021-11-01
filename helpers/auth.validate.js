const { check } = require("express-validator")

const validate = {
  register: [
    check("name", "Некорректное имя пользователя!").exists(),
    check("email", "Некорректный Email!").toLowerCase().isEmail(),
    check("password", "Пароль не может быть меньше 6 символов!").isLength({ min: 6 })
  ],
  login: [
    check("email", "Некорректный Email!").toLowerCase().isEmail(),
    check("password", "Некорректный пароль!").exists()
  ],
  reset: [
    check("password", "Пароль не может быть меньше 6 символов!").isLength({ min: 6 })
  ]
}

module.exports = validate