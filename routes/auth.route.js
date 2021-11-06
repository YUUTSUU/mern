const {Router} = require("express")
const validate = require("../helpers/auth.validate")
const controllers = require("../controllers/auth.controllers")
const authorization = require("../middleware/auth.middleware")
const router = Router()

router.post("/register", validate.register, controllers.register)
router.post("/login", validate.login, controllers.login)
router.post("/google", controllers.google)
router.post("/logout", controllers.logout)

router.put("/forgot", controllers.forgot)
router.put("/reset", validate.reset, controllers.reset)

router.get("/activation/:id", controllers.activation)
router.get("/refresh", controllers.refresh)
router.get("/user", authorization, controllers.user)

module.exports = router