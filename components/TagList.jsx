'use client'
import { RiDeleteBack2Line } from "react-icons/ri";
import './TagList.css'

const TagList = ({tagFilters, setTagFilters, setStrictTagFilter}) => {
  return (
    <>{
    
    tagFilters.length !== 0 &&
    <div className="flex items-center gap-3 w-full m-2 px-2">
      <span>
        <label className = "mr-2 text-gray-500" htmlFor="strict_tag_filter">Strict tag filter</label>
        <input className="white_check inline-block align-middle	accent-orange-400" name = "strict_tag_filter" type="checkbox" onClick={() => setStrictTagFilter(prev => !prev)}/>
      </span>

        {tagFilters.map(t => 
            <div key = {`${t}_tagfilter`} className="flex-center gap-1 text-white bg-orange-400 px-2 rounded">
                {<span className="mb-1">{t}</span>}
                <RiDeleteBack2Line className = "" onClick={()=> setTagFilters((prev) => prev.filter(x => x !== t))}/>
            </div>
        )}
    </div>
    
    }</>
  )
}

export default TagList