const { Schema, model, Types } = require("mongoose")

const schema = new Schema({
  owner: { type: Types.ObjectId, ref: "Users" },
  text: { type: "String" },
  important: false,
  edit: false
});

module.exports = model("Posts", schema)