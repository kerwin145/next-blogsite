import Post from "@models/post"
import { connectToDB } from "@utils/database"

export const GET = async (req, {params}, res) => {
    try {
        await connectToDB()
        const userPosts = await Post.find({creator: params.id}).populate('creator')
        return new Response(JSON.stringify(userPosts), {status: 200})
    
    } catch (error) {
        return new Response("Failed to fetch posts", {status: 500})
    }
    
}