const { Schema, model, Types } = require("mongoose")

const schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  completed: { type: Boolean, default: false },
  activation: { type: String, default: null },
  posts: [ { type: Types.ObjectId, ref: "Posts" } ]
});

module.exports = model("Users", schema)