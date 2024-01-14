import {Schema, model, models} from 'mongoose'

const UserSchema = new Schema({
    email: {type: String, unique: [true, "email already exists"], required: [true, "email is required"]},
    username: {type: String, 
        unique: [true, "email already exists"], 
        required: [true, "email is required"],
    },
    image: {type: String},
    likedPosts: {type: [Schema.Types.ObjectId], ref: "Post"},
    dislikedPosts: {type: [Schema.Types.ObjectId], ref: "Post"},
})

const User = models.User || model("User", UserSchema)

export default User