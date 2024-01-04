"use client"

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import useSessionValidation from '@utils/useSessionValidation'

import Form from '@components/Form'

const CreatePost = () => {
    const router = useRouter()
    const {session, sessionStatus} = useSessionValidation()

    const [submitting, setSubmitting] = useState(false)
    const [post, setPost] = useState({
        text: '',
        tag: ''
    })

    const createPost = async (e) => {
        e.preventDefault()

        if(!session){
            alert("You must be signed in to create a post!")
            router.push('/')
            return
        }

        setSubmitting(true) //like a loading
        try {
            const response = await fetch('/api/post/new', 
            {
                method: 'POST', 
                body: JSON.stringify({
                    text: post.text,
                    userId: session?.user.id,
                    tag: post.tag
                })
            })

            if(response.ok){
                router.push('/')
            }
        } catch (error) {
            console.log(error)
        }finally{
            setSubmitting(false)
        }
    }
    
    return (
    <Form
        type = "Create"
        post = {post}
        setPost = {setPost}
        submitting = {submitting}
        handleSubmit = {createPost}
    />
  )
}

export default CreatePost