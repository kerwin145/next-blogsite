import Post from "@models/post"
import User from "@models/user"
const { connectToDB } = require("@utils/database")

export const POST = async(req, {params}, res) => {
    try {
        await connectToDB()
        
        const userId = params.id
        const user = await User.findById(userId)

        const filteredLikedPosts = await Promise.all(
            user.likedPosts.map(async (postId) => {
              const postExists = await Post.findById(postId)
              return postExists ? postId : null
            })
          );

        user.likedPosts = filteredLikedPosts.filter((postId) => postId !== null)

        const filteredisLikedPosts = await Promise.all(
            user.dislikedPosts.map(async (postId) => {
              const postExists = await Post.findById(postId)
              return postExists ? postId : null
            })
          );
        user.dislikedPosts = filteredisLikedPosts.filter((postId) => postId !== null)
        console.log(user.likedPosts)

        await user.save()
        return new Response("successfully cleaned liked and disliked posts.", {status: 200})
    } catch (error) {
        return new Response("Server error", {status: 500})
    }
}