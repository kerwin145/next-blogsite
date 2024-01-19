import React from 'react'
import Image from 'next/image'

import { BsArrowReturnRight } from "react-icons/bs";
import { GoTrash } from "react-icons/go";
const Comment = ({comment, postId, userId, getPost}) => {

  async function deleteComment(commentId){
    const hasConfirmed = confirm("Are you sure you want to delete?")

    if(!hasConfirmed) return

    try {
        const response = await fetch(`api/comment/${commentId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ postId: postId })
        })

      if(response.ok)
        getPost()
    
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="flex gap-2 my-3 items-center">
        {userId && postId && userId === comment.creator._id ? 
        <GoTrash className='min-w-[1rem]' onClick={() => deleteComment(comment._id)}/> 
        :
        <span className='ml-4'></span>}
        <div key = {comment._id} className="flex flex-col w-full">
        <div className="flex gap-2 mb-1">
            <Image src = {comment.creator.image}  
            width={28} 
            height={28} 
            className='rounded-full h-min'
            alt = "profile"
            />    
            <p className='text-sm my-auto'>{comment.creator.username}</p>
        </div>

        <div className="flex gap-2 pl-2">
            <BsArrowReturnRight className='min-w-[28px] my-auto'></BsArrowReturnRight>
            <p className='my-auto break-words text-wrap	w-full'>{comment.text}</p>
        </div>
        </div>
    </div>  
  )
}

export default Comment