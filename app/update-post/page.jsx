"use client"

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import Form from '@components/Form'
import useSessionValidation from '@utils/useSessionValidation'

const EditPost = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const postId = searchParams.get('id')
    const {session, sessionStatus} = useSessionValidation()

    const [submitting, setSubmitting] = useState(false)
    const [post, setPost] = useState({
        text: '',
        tag: ''
    })

    useEffect(() => {
        if (sessionStatus === 'loading') {
          return;
        }
    
        if (!session || !session.user || !session.user.id) {
          alert("You need to be logged in to view this page")
          router.push('/')
          return;
        }    
    }, [sessionStatus])

    useEffect(() => {
        const getDetails = async () => {
            try{
                const response = await fetch(`api/post/${postId}`)
                const data = await response.json()
    
                setPost({
                    text: data.text,
                    tag: data.tag
                })
            } catch (error) {
                alert("error obtaining post details. Navigating back to home page")
                router.push('/')
            }
        }

        if(postId){
            getDetails()
        }
    }, [postId])

    const updatePost = async (e) => {
        e.preventDefault()
        setSubmitting(true)

        if(!postId){
            alert("error obtaining post details. Navigating back to home page")
            router.push('/')
        }

        try {
            const response = await fetch(`api/post/${postId}`, 
                {
                    method: "PATCH", 
                    body: JSON.stringify({text: post.text, tag: post.tag})
                })
            
            if(response.ok)
                router.push('/')
        } catch (error) {
            console.log("error updating post")
        } finally {
            setSubmitting(false)
        }
          
    }
    
    return (
    <Form
        type = "Edit"
        post = {post}
        setPost = {setPost}
        submitting = {submitting}
        handleSubmit = {updatePost}
    />
  )
}

export default EditPost