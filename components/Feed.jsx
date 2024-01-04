'use client'

import { useEffect, useState } from "react"
import PostCard from "./PostCard"
import { useRouter } from "next/navigation"

const PostCardList = ({data, handleTagClick}) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map(post => 
        <PostCard
          key = {post._id}
          post = {post}
          handleTagClick = {handleTagClick}
        />
      )}
    </div>
  )
}

const Feed = () => {
  const [searchText, setSearchText] = useState("")
  const [posts, setPosts] = useState([])
  const router = useRouter()
  
  useEffect(()=>{
    const fetchPosts = async() => {
      const response = await fetch("/api/post", { cache: 'no-store' });
      const data = await response.json()
      setPosts(data)
    }

    fetchPosts()
  }, [router.asPath])
  
  const handleSearchChange = (e) => {
    setSearchText(e.target.value)
  }
  
  return ( 
    <section className="feed">
      <form className="relative w-full flex-center">
        <input 
          type="text" 
          placeholder="Search for a tag or username" 
          value = {searchText} 
          onChange = {handleSearchChange} 
          required 
          className="search_input peer"/>
      </form>
      <PostCardList
        data = {posts}
        handleTagClick = {()=>{}}
      />
    </section>
  )
}

export default Feed