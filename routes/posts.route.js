const {Router} = require("express")
const controllers = require("../controllers/posts.controllers")
const router = Router()

router.post("/post", controllers.createPost)

router.get("/:userId", controllers.getPosts)

router.delete("/delete/:id", controllers.deletePosts)

router.put("/important/:id", controllers.updateImportant)
router.put("/text/:id", controllers.updateText)

module.exports = router