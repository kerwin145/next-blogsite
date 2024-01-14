import PostCard from "./PostCard"


export const PostCardList = ({data, handleTagClick}) => {
    return (
      <div className="mt-16 prompt_layout">
        {data.map(post => {
          return (
          <PostCard
            key = {post._id}
            post = {post}
            handleTagClick = {handleTagClick}
          />)
          }
        )}
      </div>
    )
  }