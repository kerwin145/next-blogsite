import Comment from "@models/comment"
import Post from "@models/post"
import { connectToDB } from "@utils/database"

export const POST = async (req, {params}, res) => {
    const {postId} = await req.json()

    try{
        await connectToDB()

        const targetPost = await Post.findById(postId)
        targetPost.comments = targetPost.comments.filter(c => c._id != params.id)
        await targetPost.save()

        await Comment.findByIdAndDelete(params.id)

        return new Response("Deleted succesfully", {status: 200})
    } catch (error) {
        console.log(error)

        return new Response("Server error", {status: 500})
    }

}