'use client'

import Image from "next/image"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { usePathname, useRouter} from "next/navigation"

const PostCard = ({post, handleTagClick, handleEdit, handleDelete}) => {
  const [isCopied, setCopied] = useState(false)
  const {data: session} = useSession()
  const pathName = usePathname()

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

      <p className="my-4 font-satoshi text-sm text-gray-700">{post.text}</p>
      <div className="flex gap-2">
        {post.tag.split(" ").map(t => 
          <p className="font-inter text-sm blue_gradient cursor-pointer"
            onClick = {() => handleTagClick && handleTagClick(t)}
          >
            #{t}
          </p>
        )}
      </div>
      {session?.user._id === post.creator.id && pathName === '/profile' && 
      <div className="mt-5 flex-center gap-4 border-t border-gray-100 pt-3">
        <p className="font-inter text-sm green_gradient cursor-pointer"
        onClick={handleEdit}>Edit</p>
        <p className="font-inter text-sm orange_gradient cursor-pointer"
        onClick={handleDelete}>Delete</p>
      </div>}
  
    </div>
  )
}

export default PostCard