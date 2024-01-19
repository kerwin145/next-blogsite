import {Schema, model, models} from 'mongoose'

const commentSchema = new Schema({
    creator: {type: Schema.Types.ObjectId, ref: "User", required: true},
    text: {type: String, required: true},
    likes: {type: Number, default: 0},
    dislikes: {type: Number, default: 0},
})

const Comment = models.Comment || model('Comment', commentSchema);

export default Comment