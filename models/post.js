const { Schema, model, models } = require("mongoose");

const postSchema = new Schema({
    creator: {type: Schema.Types.ObjectId, ref: 'User'},
    text: {type: String, required: [true, 'Prompt is required']},
    tag: {type: String, required: [true, "tag is required"]}
})

const Post = models.Post || model('Post', postSchema)

export default Post