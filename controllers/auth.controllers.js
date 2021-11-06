const User = require("../models/users.model")
const {validationResult} = require("express-validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const uuid = require("uuid")
const mailService = require("../service/mail.service")
const infoService = require("../service/info.service")
const {OAuth2Client} = require('google-auth-library')
const userDTO = require("../helpers/user.dto")
const APIException = require("../helpers/api.exception")

const controllers = {
  register: async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) return next(APIException.Validate(errors.array()))

      const {name, email, password} = req.body

      const isEmail = await User.findOne({email})
      if (isEmail) return next(APIException.Request("Адресс уже занят, попробуйте другой!"))

      const hashedPassword = await bcrypt.hash(password, 12)
      const code = uuid.v4()
      const user = await User.create({name, email, password: hashedPassword, activation: code})

      const accessToken = jwt.sign({name: user.name, userId: user._id, }, process.env.ACCESS_SECRET, {expiresIn: "1h"})
      const refreshToken = jwt.sign({userId: user._id}, process.env.REFRESH_SECRET, {expiresIn: "7d"})

      const id = jwt.sign({code}, process.env.ACTIVATION_SECRET)
      const url = `${ process.env.API_CLIENT }/api/auth/activation/${ id }`
      const info = infoService(req)
      await mailService.register(email, url, info, name)

      res.cookie("refresh_token", refreshToken, {httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000})
      res.status(200).json({message: "Подтвердите электронный адрес!", accessToken, refreshToken, info, url})
    } catch (err) {return next(err)}
  },
  activation: async (req, res, next) => {
    try {
      const {id} = req.params;

      const {code} = jwt.verify(id, process.env.ACTIVATION_SECRET)
      if (!code) return next(APIException.Request("Некорректный код активации!"))

      const user = await User.findOne({activation: code})
      if (!user) return next(APIException.Request("Код активации не найден!"))

      user.completed = true
      await user.save()

      res.redirect(`${ process.env.API_CLIENT }/login`)
    } catch (err) {return next(err)}
  },
  login: async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) return next(APIException.Validate(errors.array()))

      const {email, password} = req.body
      const user = await User.findOne({email})
      if (!user) return next(APIException.Request("Пользователь не найден!"))

      const isPassword = await bcrypt.compare(password, user.password)
      if (!isPassword) return next(APIException.Request("Неверный пароль!"))

      const accessToken = jwt.sign({name: user.name, userId: user._id}, process.env.ACCESS_SECRET, {expiresIn: "1h"})
      const refreshToken = jwt.sign({userId: user.id}, process.env.REFRESH_SECRET, {expiresIn: "7d"})

      const info = infoService(req)
      const url = `${ process.env.API_CLIENT }/api/auth/reset`
      await mailService.login(email, url, info)

      res.cookie("refresh_token", refreshToken, {httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000})
      res.status(200).json({message: "Вход успешно выполнен!", accessToken, refreshToken, info})
    } catch (err) {return next(err)}
  },
  google: async (req, res, next) => {
    try {
      const {credential} = req.body

      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
      const ticket = await client.verifyIdToken({idToken: credential, audience: process.env.GOOGLE_CLIENT_ID})
      if (!ticket) return next(APIException.Request("Не удалось проверить token!"))

      const {email_verified, email, given_name, sub} = ticket.payload
      if (!email_verified) return next(APIException.Request("Не удалось проверить email!"))

      const password = email + process.env.GOOGLE_CLIENT_SECRET
      const hashedPassword = await bcrypt.hash(password, 12)

      const info = infoService(req)
      const user = await User.findOne({email})

      if (user) {
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return next(APIException.Request("Пароль не совпадает!"))

        const accessToken = jwt.sign({name: user.name, userId: user._id}, process.env.ACCESS_SECRET, {expiresIn: "1h"})
        const refreshToken = jwt.sign({userId: user.id}, process.env.REFRESH_SECRET, {expiresIn: "7d"})

        await mailService.google(email, info)

        res.cookie("refresh_token", refreshToken, {httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000})
        res.status(200).json({message: "Вход успешно выполнен!", accessToken, refreshToken, info})
      } else {
        const newUser = await User.create({name: given_name, email, password: hashedPassword, completed: true, activation: sub})

        const accessToken = jwt.sign({name: newUser.name, userId: newUser._id, }, process.env.ACCESS_SECRET, {expiresIn: "1h"})
        const refreshToken = jwt.sign({userId: newUser._id}, process.env.REFRESH_SECRET, {expiresIn: "7d"})

        await mailService.google(email, info)

        res.cookie("refresh_token", refreshToken, {httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000})
        res.status(200).json({message: "Пользователь создан!", accessToken, refreshToken, info})
      }
    } catch (err) {return next(err)}
  },
  logout: async (req, res, next) => {
    try {
      const {refresh_token} = req.cookies
      if (!refresh_token) return next(APIException.Request("Токен не найдет!"))

      res.clearCookie("refresh_token")
      res.status(200).json({message: "Токен удален!", refreshToken: refresh_token})
    } catch (err) {return next(err)}
  },
  forgot: async (req, res, next) => {
    try {
      const {email} = req.body

      const user = await User.findOne({email})
      if (!user) return next(APIException.Request("Пользователь не найден!"))

      const token = jwt.sign({userId: user._id}, process.env.ACCESS_SECRET, {expiresIn: "1h"})
      const url = `${ process.env.API_SERVER }/api/auth/reset/${ token }`
      await mailService(email, url)

      res.status(200).json({message: "Письмо для востановления пароля отправлено на почту!"})
    } catch (err) {return next(err)}
  },
  reset: async (req, res, next) => {
    try {
      const {password} = req.body
      const {id} = req.user

      const hashedPassword = await bcrypt.hash(password, 12)
      await User.findOneAndUpdate({_id: id}, {password: hashedPassword})

      res.status(200).json({message: "Пароль успешно изменен!"})
    } catch (err) {return next(err)}
  },
  refresh: async (req, res, next) => {
    try {
      const {refresh_token} = req.cookies

      const {userId} = jwt.verify(refresh_token, process.env.REFRESH_SECRET)
      if (!userId) return next(APIException.Request("Пожалуйста авторизуйтесь!"))

      const user = await User.findOne({_id: userId})

      const accessToken = jwt.sign({name: user.name, userId: user._id}, process.env.ACCESS_SECRET, {expiresIn: "1h"})
      const refreshToken = jwt.sign({userId: user.id}, process.env.REFRESH_SECRET, {expiresIn: "7d"})

      res.cookie("refresh_token", refreshToken, {httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000})
      res.status(200).json({message: "Токен обновлен", accessToken, refreshToken})
    } catch (err) {return next(err)}
  },
  user: async (req, res, next) => {
    try {
      const {userId} = req.user

      const user = await User.findOne({_id: userId})
      if (!user) return next(APIException.Request("Пользователь не найден!"))

      const data = new userDTO(user)
      res.status(200).json({...data})
    } catch (err) {return next(err)}
  }
}

module.exports = controllers