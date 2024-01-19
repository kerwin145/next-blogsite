'use client'

import { useEffect, useState } from "react"
import TagList from "./TagList"
import { PostCardList } from "./PostCardList"
import { useSession } from "next-auth/react"

const Feed = () => {
  const [posts, setPosts] = useState(null)
  const [searchText, setSearchText] = useState("")
  const [tagFilters, setTagFilters] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const {data: session} = useSession()

  const[isStrictTagFilter, setStrictTagFilter] = useState(false)
  
  useEffect(()=>{
    const fetchPosts = async() => {
      setSearchText("")
      setTagFilters([])
      const response = await fetch("/api/post", { cache: 'no-store' });
      const data = await response.json()
      if(session?.user.id){
        await fetch(`api/users/${session?.user.id}/cleanVotes`, {method: "POST"})
      }
      setPosts(data)
      setFilteredPosts(data)
      console.log("acquired data")
      console.log(data)
    }

    fetchPosts()
  }, [session?.user.id])

  useEffect(()=>{
    if(searchText === "" && tagFilters.length === 0){
      setFilteredPosts(posts)
      return
    }

    const tokenSet = new Set(searchText.split(" ").filter(t => t.length > 0).map(t => t.toLowerCase()));
    const tokens = [...tokenSet];

    let scoredPosts = posts

    if(searchText !== ""){
      //rank by longest consecutive matching tokens
      //to make it better, I could score based off how far apart search tokens are where the sequence is contained in the text
      // for example: if search str is a b c, and text1 is a x b y c, text2 is a b c x y , text2 is better as subsequence a b c has 0 separation in text2 but total of 1 separation in text1
      scoredPosts = posts.map(post => {
        let score = 0
        let cnt = 0
        const text = post.text.toLowerCase()
        for(const token of tokens){
          if(text.includes(token))
            score = Math.max(score, ++cnt)
          else 
            cnt = 0
        }

        return {post, score}
      })

      scoredPosts = scoredPosts.filter(p => p.score > 0).sort((a, b) => b.score - a.score).map(p => p.post)
    }

    if(tagFilters.length !== 0){
      //filtering and sorting on tags
      scoredPosts = scoredPosts.map(post => {
        let score = 0
        for(const tag of tagFilters){
          if(post.tag.includes(tag))
            score++
        }
        return {post, score}
      }).sort((a,b) => b.score - a.score)

      scoredPosts = scoredPosts.filter(p => isStrictTagFilter ? p.score === tagFilters.length : p.score > 0).map(p => p.post)
    }

    setFilteredPosts(scoredPosts)

  }, [searchText, tagFilters, isStrictTagFilter])

  const handleSearchChange = (e) => {
    const srchStr = e.target.value
    setSearchText(srchStr)
  }

  function handleTagClick(t){
    if(tagFilters.includes(t))
      return
    setTagFilters(prev => [...prev, t])
  }
  
  return ( 
    <section className="feed">
      {posts ? <>

      <form className="relative w-full flex-center" onSubmit={(e)=>{e.preventDefault()}}>
        <input 
          type="text" 
          placeholder="Search for a tag or username" 
          value = {searchText} 
          onChange = {handleSearchChange}
          required 
          className="search_input peer"/>
      </form>

        <TagList 
          tagFilters={tagFilters}
          setTagFilters={setTagFilters}
          setStrictTagFilter = {setStrictTagFilter}
          />
        <PostCardList
          data = {filteredPosts}
          handleTagClick = {handleTagClick}
        />
      </>
      :
      <p>Loading...</p>
      }
    </section>
  )
}

export default Feed