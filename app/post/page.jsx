'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { GrSend } from "react-icons/gr";
import Comment from '@components/Comment';

import Votechip from '@components/Votechip';

import { useSession } from 'next-auth/react';

const PostPage = () => {
  const searchParams = useSearchParams()
  const postId = searchParams.get('id');
  const {data: session} = useSession()
  const router = useRouter()

  const [post, setPost] = useState(null)
  const [loadingText, setLoadingText] = useState("Loading post...")
  const [comment, setComment] = useState("")
  
  async function getPost(){
    try{
      const response = await fetch(`api/post/${postId}`)
      const data = await response.json()

      setPost(data)
      console.log(data)
    } catch (error) {
      setLoadingText("Post unable to load")
      console.log(error)
    }
  }

  useEffect(()=>{
    getPost()
  }, [])

  async function handleSubmit(e){
    e.preventDefault()
    console.log("Submitting")
    if(!session?.user.id){
      router.push('/')
      return
    }
    try {
      const response = await fetch('api/comment', {
        method: 'POST',
        body: JSON.stringify({postId: post._id, userId: session?.user.id, text: comment}),
      });
  
      if(response.ok){
        setComment("")
        getPost()
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>{post ? 
    <div className='flex w-2/3 flex-col my-4 h-full'>

      <div className='flex gap-4 mb-4 items-center'>
        <div className="flex gap-4">
          <Image src = {post.creator.image}  
            width={48} 
            height={48} 
            className='rounded-full h-min'
            alt = "profile"
          />    
        </div>
        <h3>Post by <b>{post.creator.username}</b></h3>
      </div>

      <div className='flex gap-6 mb-4 align-center'>
        {post ? <span className='ml-2  my-auto'><Votechip post = {post} verticalFormat = {true}/></span> : <span className='w-[48px] h-[48px]'></span>}
        <p className='p-4 w-full mr-12 text-lg font-inter inline my-auto '>{post.text}</p>
      </div>

      {/* Comment list */}
      <h1 className='font-semibold text-xl mt-4'>Comments</h1>
      <div className="flex flex-col h-full">
        {
        post == null ? <div>Loading comments ... </div>
        :
        post.comments.length == 0 ? <div className='m-4'>No Comments yet... be the first to comment!</div>
        :
        <div className="flex flex-col">
          {post.comments.map(comment => <Comment key = {comment._id} comment = {comment} postId = {postId} userId = {session?.user.id} getPost = {getPost} />)}
        </div>
        }
      </div>

      {session && session.user && session.user.id &&
      <form onSubmit = {handleSubmit} className='flex gap-4 mt-4 '>
        <input type="text" placeholder='post a comment!' className=' font-inter my-4 p-2 h-10 w-full border border-gray-300 rounded focus:outline-none focus:border-orange-500 text-sm'  
           value={comment}
        onChange={(e) => {setComment(e.target.value)}}/>
        <button type="submit">
            <GrSend className='my-auto bg-slate-100 scale-125 rounded p-2 w-8 h-8' />
        </button>      
      </form>}

    </div>
    :
    <p>{loadingText}</p>
    }
    </>
  )
}

export default PostPage