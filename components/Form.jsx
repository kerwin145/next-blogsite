import Link from "next/link"
import { FaInfoCircle } from 'react-icons/fa';
import './Form.css'
const Form = ({type, post, setPost, submitting, handleSubmit}) => {
  
  return (
    <section className="w-full max-w-2xl  flex-start flex-col">
      <h1 className="head_text">
        <span className="blue_gradient">{type} Post</span>
      </h1>
      <p className="desc max-w-md">{type} and share your thoughts and posts, and hopefully not get cancelled</p>
    
      <form onSubmit = {handleSubmit} className="mt-10 w-full flex flex-col gap-3 glassmorphism">
        <label htmlFor="formContent-text">
          <span className="font-satoshi font-semibold text-base text-gray-700">What content shall you compose?*</span>
        </label>
        <textarea name="formContent-text" id="formContent"
          value = {post.text}
          onChange={(e) => setPost({...post, text: e.target.value})}
          placeholder="Write your content here..."
          required
          className= "form_textarea"
        />

        <label htmlFor="formContent-tag">
          <div className="tag-info-container">
            <p className="font-satoshi font-semibold text-base text-gray-700">
              Tag*
              <FaInfoCircle
                className={"mx-2 inline"}
              />
            </p>
            <span className="text-sm tag-info-text text-gray-500">
              Tags can have maximum of 20 characters, and a maximum of 8 unique tags.
            </span>
            </div>

          <p className="font-normal text-sm"> To submit multiple tags, separate them with a space.</p>
        </label>
        <input name="formContent-tag" id="formContent"
          value = {post.tag}
          onChange={(e) => setPost({...post, tag: e.target.value})}
          placeholder="ex: cats"
          required
          className= "form_input"
          autoComplete="off"
        />
    
        <div className="flex-end items-center my-5 gap-3">
          <Link href = "/" className="text-sm text-gray-500">Cancel</Link>

          <button
          type = "submit"
          disabled = {submitting}
          className="px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white"
          >
            {submitting ? `${type}!` : type}
          </button>
          
        </div>
      </form>

      
    </section>
  )
}

export default Form