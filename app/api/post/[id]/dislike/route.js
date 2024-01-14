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

        if(user.dislikedPosts.includes(postId)){

            post.dislikes--
            user.dislikedPosts = user.dislikedPosts.filter(p => p != postId) //remove from user's liked

            await post.save()
            await user.save()

            return new Response("Post successfully un-disliked", {status: 200})
        }
        
        if(user.likedPosts.includes(postId)){
            post.likes--
            post.dislikes++
            user.dislikedPosts.push(postId)
            user.likedPosts = user.likedPosts.filter(p => p != postId) //remove from user's liked

            await post.save()
            await user.save()

            return new Response("Post successfully re-disliked", {status: 200})
        }

        post.dislikes++
        user.dislikedPosts.push(postId)
        await user.save()
        await post.save()
        return new Response("Post successfully disliked", {status: 200})

    } catch (error) {
        return new Response("Failed to like dislike", {status: 500})        

    }
}