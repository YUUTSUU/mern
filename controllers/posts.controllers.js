const Posts = require("../models/posts.model")

const controllers = {
  async createPost(req, res, next) {
    try {
      const {text, userId} = req.body

      const posts = await Posts.create({owner: userId, text, important: false, edit: false})
      res.status(200).json(posts)
    } catch (err) {return next(err)}
  },
  async getPosts(req, res, next) {
    try {
      const {userId} = req.params

      const posts = await Posts.find({owner: userId})
      res.status(200).json(posts)
    } catch (err) {return next(err)}
  },
  async deletePosts(req, res, next) {
    try {
      const {id} = req.params

      const posts = await Posts.findOneAndDelete({_id: id})
      res.status(200).json(posts)
    } catch (err) {return next(err)}
  },
  async updateImportant(req, res, next) {
    try {
      const {id} = req.params

      const posts = await Posts.findOne({_id: id})
      posts.important = !posts.important
      await posts.save()

      res.status(200).json(posts)
    } catch (err) {return next(err)}
  },
  async updateText(req, res, next) {
    try {
      const {id} = req.params
      const {updateText} = req.body

      const posts = await Posts.findOneAndUpdate({_id: id}, {text: updateText})
      res.status(200).json(posts)
    } catch (err) {
      return next(err)
    }
  }
}

module.exports = controllers