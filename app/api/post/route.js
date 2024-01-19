import Post from "@models/post"
import { connectToDB } from "@utils/database"

export const GET = async (req, res) => {
    try {
        await connectToDB();
        const posts = await Post.find().populate('creator');
        console.log("Retrieved all posts");

        return new Response(JSON.stringify(posts), { status: 200 });
    } catch (error) {
        return new Reszponse("Failed to fetch posts", { status: 500});
    }
};
