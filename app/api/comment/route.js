import Comment from "@models/comment"
import Post from "@models/post"
import { connectToDB } from "@utils/database"

export const POST = async(req, res) => {
    const {userId, postId, text} = await req.json()
    try {
        await connectToDB()

        const targetPost = await Post.findById(postId)
        const newComment = new Comment({
            creator: userId,
            text
        })

        const savedComment = await newComment.save()
        targetPost.comments.push(savedComment._id) //attatch post reference to comment list
        await targetPost.save()

        return new Response(JSON.stringify(newComment), {status: 201})
    } catch (error) {
        console.log(error)
        return new Response("Failed to create a new new comment", {status: 500})
    }

}

