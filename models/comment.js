const { Schema, model, models } = require("mongoose");

const commentSchema = new mongoose.Schema({
    creator: {type: Schema.Types.ObjectId, ref: "User"},
    text: {type: String, required: true},
    likes: {type: Number, default: 0},
    dislikes: {type: Number, default: 0},
})

const Comment = models.Comment || model('Comment', commentSchema)

export default Comment