import Comment from "@models/comment"
import Post from "@models/post"
import { connectToDB } from "@utils/database"

export const GET = async (req, {params}, res) => {
    try {
        await connectToDB()
        const post = await Post.findById(params.id)
        if(!post){
            return new Response("Post not found", {status: 404})
        }

        await post.populate('creator')
        await post.populate({
            path : 'comments',
            populate: {
                path: 'creator'
            }
        })

        return new Response(JSON.stringify(post, {status:200}))

    } catch (error) {
        return new Response("Failed to fetch post", {status: 500})        
    }
}

export const PATCH = async (req, {params}, res) => { 
    const {text, tag} = await req.json()   
    try {
        await connectToDB()

        const target = await Post.findById(params.id)
        if(!target){
            return new Response("Update: post not found", {status: 404})
        }

        target.text = text
        target.tag = tag

        await target.save()

        return new Response(JSON.stringify(target), {status: 200})

    } catch (error) {
        return new Response("Failed to update post", {status: 500})        
    }
}

export const DELETE = async (req, {params},  res) => {
    try {
        await connectToDB()

        const post = await Post.findById(params.id)

        //delete comments associated with the post
        const comments = post.comments
        for(const c of comments){
            await Comment.findByIdAndDelete(c)
        }

        await Post.findByIdAndDelete(post)
        return new Response("Post successfully deleted", {status: 200})
    } catch (error) {
        return new Response("Failed to delete post", {status: 500})        
    }
}