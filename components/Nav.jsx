"use client"

// import React from 'react
import Link from 'next/link'
import Image from 'next/image'
import {signIn, signOut, useSession, getProviders} from 'next-auth/react'
import { useEffect, useState } from 'react'

const Nav = () => {
  const {data: session} = useSession()

  const [providers, setProviders] = useState(null)
  const [toggleDropdown, setToggleDropdown] = useState(false)

  useEffect(()=>{
    const setup = async () => {
      const response = await getProviders()
      setProviders(response)
    }

    setup()
  }, [])

  return (
    <nav className="flex-between w-full mb-16 pt-3">
      <Link href = "/" className='flex gap-2 flex-center'>
        <Image src = "/assets/images/logo.svg" alt='site-logo' width={30} height={30} className='object-contain'/>
        <p className='logo_text'>ponderous</p>
      </Link>

      {/* Desktop navgiation */}
      <div className="sm:flex hidden">
        {session?.user ? 
        <div className='flex gap-3 md:gap-5'>
          <Link href = "/put-post" className='black_btn'>Create Post</Link>
          <button type = "button" onClick={signOut} className='outline_btn'>Sign Out</button>
          <Link href = '/profile'>
            <Image src = {session?.user.image} width={37} height={37} className='rounded-full' alt = "profile picture"/>
          </Link>
        </div> 
        : 
        <>
          {providers && Object.values(providers).map(provider => 
            <button type = "button" key = {provider.name} onClick={()=>signIn(provider.id)} className='black_btn'>Sign in</button>
          )}
        </>
        }

      </div>

      {/* Mobile Navigation */}
      <div className="sm:hidden flex relative">
        {session?.user ? 
        <div className='flex'>
          <Image src = {session?.user.image}  
            width={37} 
            height={37} 
            className='rounded-full'
            alt = "profile"
            onClick={()=>{setToggleDropdown((prev)=> !prev)}}
          />
          {toggleDropdown && 
          <div className='dropdown' onMouseLeave={()=>{setToggleDropdown(false)}}>
            <Link href = '/profile' className='dropdown_link' onClick={()=>setToggleDropdown(false)}>My Profile</Link>
            <Link href = "/put-post" className='dropdown_link' onClick={() => setToggleDropdown(false)}>Create Post</Link>
            <button type='button' onClick={()=>{setToggleDropdown(false); signOut();}} className='mt-5 black_btn'>Sign out</button>
          </div>}
        </div>
        :<>
          {providers && Object.values(providers).map(provider => 
            <button type = "button" key = {provider.name} onClick={()=>signIn(provider.id)} className='black_btn'>Sign in</button>
          )}
        </>}
      </div>
    </nav>
  )
}

export default Nav