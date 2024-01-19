'use client'

import React from 'react'
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { BiLike, BiDislike, BiSolidLike, BiSolidDislike } from "react-icons/bi";

const Votechip = ({post, verticalFormat = false}) => {
  const actions = {NONE: "NONE", LIKED: "LIKED", DISLIKED: "DISLIKED"}
  const {data: session} = useSession()

  const [action, setAction] = useState(actions.NONE)
  const [likes, setLikes] = useState(post.likes || 0)
  const [dislikes, setDislikes] = useState(post.dislikes || 0)

  const [voteLoading, setVoteLoading] = useState(false)

  useEffect(()=>{
    const setupAction = async () => {
      const response = await fetch(`api/users/${session?.user.id}/${post._id}`, {method:"GET"})

      if (response.ok) {
        const data = await response.text()
        setAction(data)
      } else {
        console.error(`Failed to fetch data. Status: ${response.status}`)
      }
    }

    if(session?.user){
        setupAction()
    }
  }, [])

  const handleLike = async () => {
    if(voteLoading) 
      return
 
    setVoteLoading(true)
    try {
      await fetch(`api/post/${post._id}/like`,
        {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({userId: session?.user.id})
        }
      )
      switch(action){
        case actions.LIKED: //unlike
          setLikes(prev => prev - 1)
          setAction(actions.NONE)
          break;
        case actions.DISLIKED: //like and previously disliked
          setDislikes(prev => prev - 1)
          setLikes(prev => prev + 1)
          setAction(actions.LIKED)
          break; 
        case actions.NONE: //like
          setLikes(prev => prev + 1)
          setAction(actions.LIKED)
          break;
      }

      setVoteLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  const handleDislike =  async () => {
    if(voteLoading) 
      return

    setVoteLoading(true)

    try {
      await fetch(`api/post/${post._id}/dislike`,
        {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({userId: session?.user.id})
        }
      )
      switch(action){
        case actions.DISLIKED: //un-dislike
          setDislikes(prev => prev -1)
          setAction(actions.NONE)
          break;
        case actions.LIKED: //dislike and previously liked
          setDislikes(prev => prev + 1)
          setLikes(prev => prev - 1)
          setAction(actions.DISLIKED)
          break; 
        case actions.NONE: //dislike
          setDislikes(prev => prev + 1)
          setAction(actions.DISLIKED)
          break;
      }
      setVoteLoading(false)
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <div className={`flex gap-2 text-lg my-auto ${verticalFormat && "flex-col"}`}>
        <span className= {`${verticalFormat && "flex gap-2"}`}>
            <div>{action == actions.LIKED ? <BiSolidLike onClick={handleLike}/> : <BiLike onClick={handleLike}/>}</div>
            <div className="text-sm text-center">{likes || 0}</div>
        </span>

        <span className= {`${verticalFormat && "flex gap-2"}`}>
            <div>{action == actions.DISLIKED? <BiSolidDislike onClick={handleDislike}/> : <BiDislike onClick={handleDislike}/>}</div>
            <div className="text-sm text-center">{dislikes || 0}</div>         
        </span>
    </div>
  )
}

export default Votechip