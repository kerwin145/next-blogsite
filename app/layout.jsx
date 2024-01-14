import React from 'react'
import Nav from '@components/Nav'
import Provider from '@components/Provider'
import '@styles/globals.css' //note, the @ can be seen defined in the jsconfig.json file, where it serves to point to the root directory

export const metadata = {
    title: "blogsite",
    description: "share your posts or whatever"
}

const RootLayout = ({children}) => {
  return (
    <html lang='en'>
        <body>
            <Provider>
                <div className="main">
                    <div className="gradient"></div>
                </div>

                <main className='app'>
                    <Nav/>
                    {children}
                </main>
            </Provider>
        </body>
   
    </html>
  )
}

export default RootLayout