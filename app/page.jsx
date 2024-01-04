'use client'
import Feed from "@components/Feed"

const Home = () => {
  return (
    <section className="w-full flex-center flex-col">
        <h1 className="head_text text-center">Discover & Share
        <br className="max-md:hidden"/>
        <span className="orange_gradient text-center"> Whatever u want to share</span>
        </h1>
        <p>
          This blogsite is a rip off from <a href="https://www.youtube.com/watch?v=wm5gMKuwSYk" className="text-indigo-500">this</a> tutorial. Hope y'alls enjoy. Just pls don't spam this
        </p>

        <Feed/>
        
    </section>
  )
}

export default Home