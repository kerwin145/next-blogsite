import Post from "@models/post"
import User from "@models/user"
import { connectToDB } from "@utils/database"

export const POST = async(req, {params}, res) => {
    try{
        await connectToDB()

        const {userId} = await req.json()
        const postId = params.id 

        const user = await User.findById(userId)
        const post = await Post.findById(postId)

        console.log(userId)
        console.log(postId)
        
        if(user.likedPosts.includes(postId)){
            post.likes--
            user.likedPosts = user.likedPosts.filter(p => p != postId) //remove from user's liked

            await post.save()
            await user.save()

            return new Response("Post successfully unliked", {status: 200})
        }
        
        if(user.dislikedPosts.includes(postId)){
            post.dislikes--
            post.likes++
            user.likedPosts.push(postId)
            user.dislikedPosts = user.dislikedPosts.filter(p => p != postId) //remove from user's liked

            await post.save()
            await user.save()

            return new Response("Post successfully reliked", {status: 200})
        }

        post.likes++
        user.likedPosts.push(postId)
        await user.save()
        await post.save()
        return new Response("Post successfully liked", {status: 200})

    } catch (error) {
        return new Response("Failed to like post", {status: 500})        

    }
}