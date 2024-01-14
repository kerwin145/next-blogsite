import Post from "@models/post"
import User from "@models/user"
import { connectToDB } from "@utils/database"

export const GET = async (req, {params}, res) => {
    try {
        await connectToDB()

        const userId = params.id
        const postId = params.postId

        const user = await User.findById(userId)
        if (!user) {
            return new Response("User not found", { status: 404 });
        }


        if(user.likedPosts.includes(postId))
            return new Response("LIKED", {status: 200})

        if(user.dislikedPosts.includes(postId))
            return new Response("DISLIKED", {status: 200})

        return new Response("NONE", {status: 200})
        
    } catch (error) {
        return new Response("Failed to fetch post", {status: 500})        
    }
}