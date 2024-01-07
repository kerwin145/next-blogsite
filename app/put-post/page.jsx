"use client"

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import useSessionValidation from '@utils/useSessionValidation'

import Form from '@components/Form'


const PutPost = () => {
    const router = useRouter()
    const {session} = useSessionValidation()
    const [submitting, setSubmitting] = useState(false)
    
    
    const searchParams = useSearchParams()
    const postId = searchParams.get('id')

    const [post, setPost] = useState({text: '', tag: ''})

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

    const handlePostRequest = async (url, method, data) => {
        const tagsModified = data.tag.split(/[ #]+/g)
        const tagSet = new Set(tagsModified)
        const finalTags = [...tagSet].filter(t => t.length > 0)

        if(finalTags.length > 8 || finalTags.some(t => t.length > 20)){
            alert("Tags can have maximum of 20 characters, and there is a maximum of 8 unique tags.")
            return
        }

        data.tag = finalTags.join(" ")

        setSubmitting(true) // like a loading
        try {
            const response = await fetch(url, {
                method: method,
                body: JSON.stringify(data),
            });
    
            if (response.ok) {
                router.push('/')
            }
        } catch (error) {
            console.log(error)
        } finally {
            setSubmitting(false)
        }
    };
    
    const updatePost = (e) => {
        e.preventDefault()
        handlePostRequest(`api/post/${postId}`, 'PATCH', { text: post.text, tag: post.tag })
    };
    
    const createPost = (e) => {
        e.preventDefault()
        handlePostRequest('/api/post/new', 'POST', {
            text: post.text,
            userId: session?.user.id,
            tag: post.tag,
        })
    }

    return (
    <Form
        type = {postId ? "Edit" : "Create"}
        post = {post}
        setPost = {setPost}
        submitting = {submitting}
        handleSubmit = {postId ? updatePost : createPost}
    />
    )
}

export default PutPost