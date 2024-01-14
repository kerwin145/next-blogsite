'use client'

import Image from "next/image"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { usePathname, useRouter} from "next/navigation"
import { BiLike, BiDislike, BiSolidLike, BiSolidDislike, BiComment  } from "react-icons/bi";

const PostCard = ({post, handleTagClick, handleEdit, handleDelete}) => {
  const [isCopied, setCopied] = useState(false)
  const {data: session, status: sessionStatus} = useSession()
  const pathName = usePathname()

  const actions = {NONE: "NONE", LIKED: "LIKED", DISLIKED: "DISLIKED"}

  const [action, setAction] = useState(actions.NONE)
  const [likes, setLikes] = useState(post.likes || 0)
  const [dislikes, setDislikes] = useState(post.dislikes || 0)

  const [voteLoading, setVoteLoading] = useState(false)

  useEffect(()=>{
    const getData = async () => {
      const response = await fetch(`api/users/${session?.user.id}/${post._id}`, {method:"GET"})

      if (response.ok) {
        const data = await response.text()
        setAction(data)
      } else {
        console.error(`Failed to fetch data. Status: ${response.status}`)
      }
    }

    if(session?.user){
      getData()
    }
 
  }, [])

  const handleLike = async () => {
    if(voteLoading) 
      return
 
    setVoteLoading(true)
    console.log("Voting!")
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

  useEffect(()=>{
    let timeOutId;

    if(isCopied){
      timeOutId = setTimeout(()=>{
        setCopied(false)
      }, 1000)
    }

    return () => {
      clearTimeout(timeOutId)
    }
  }, [isCopied])

  return (
    <div className="prompt_card">
      <div className="flex justify-between items-start gap-5">
        <div className="flex-1 flex justify-start items-center gap-3 cursor-pointer">
          <Image
            src = {post.creator.image}
            alt = "user_image"
            width = {40}
            height = {40}
            className="rounded-full object-contain"
          />
          <div className="flex flex-col">
            <h3 className="font-satoshi font-semibold text-gray-900">{post.creator.username}</h3>
            <p className="font-inter text-sm text-gray-500">{post.creator.email}</p>
          </div>
        </div>

        <div className="copy_btn" onClick={()=>{setCopied(true); navigator.clipboard.writeText(post.text)}}>
          <Image
            src = {isCopied ? '/assets/icons/tick.svg' : '/assets/icons/copy.svg'}
            alt = "copy icon"
            width = {12}
            height = {12}
          />
        </div>
      </div>

      <p className="flex my-4 font-satoshi text-sm text-gray-700">{post.text}</p>
      <div className="flex justify-between ">
        <div className="flex gap-2">
          {post.tag.split(" ").map(t => 
            <p key = {`${t}_post`} className="font-inter text-sm blue_gradient cursor-pointer"
              onClick = {() => handleTagClick && handleTagClick(t)}
            >
              #{t}
            </p>
          )}
        </div>

        <div className="flex gap-2 text-lg mt-2">
          <span>
            <div>{action == actions.LIKED ? <BiSolidLike onClick={handleLike}/> : <BiLike onClick={handleLike}/>}</div>
            <div className="text-sm text-center">{likes || 0}</div>
          </span>

          <span>
            <div>{action == actions.DISLIKED? <BiSolidDislike onClick={handleDislike}/> : <BiDislike onClick={handleDislike}/>}</div>
            <div className="text-sm text-center">{dislikes || 0}</div>         
          </span>

          <span>
            {<BiComment/>}
          
          </span>
        </div>
      </div>


      {session?.user._id === post.creator.id && pathName === '/profile' ?
      <div className= {`mt-5 flex-center gap-4 border-t border-gray-100 pt-3 ${voteLoading && "text-gray-500"}`}>
        <p className="font-inter text-sm green_gradient cursor-pointer"
        onClick={handleEdit}>Edit</p>
        <p className="font-inter text-sm orange_gradient cursor-pointer"
        onClick={handleDelete}>Delete</p>
      </div>
      : <></> /*I'm using a ternary because idk if && cause weird behavior on deploys */
      }
  
    </div>
  )
}

export default PostCard