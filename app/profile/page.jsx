'use client'
import Profile from "@components/Profile"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import useSessionValidation from "@utils/useSessionValidation"

const MyProfile = () => {
  const router = useRouter()
  const {session, sessionStatus} = useSessionValidation()
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/users/${session.user.id}/posts`)
        const data = await response.json()
        setPosts(data)
      } catch (error) {
        console.error('Error fetching posts:', error)
      }
    }

    if (session && session.user && session.user.id) {
      fetchPosts()
    }
  }, [sessionStatus])

  const handleEdit = async (post) => {
    console.log("navigating to edit post")
    router.push(`update-post?id=${post._id}`)
  }

  const handleDelete = async(post) => {
    const hasConfirmed = confirm("Are you sure you want to delete?")
    if(hasConfirmed){
      try {
        await fetch(`/api/post/${post._id}`, {method: "DELETE"})

        const filteredPosts = posts.filter(p => p._id !== post._id)
        console.log(filteredPosts)
        setPosts(filteredPosts)

      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <Profile
    name = "My"
    desc = "Welcome to your personalized profile page"
    data = {posts}
    handleEdit = {handleEdit}
    handleDelete = {handleDelete}
    />  
  )
}

export default MyProfile