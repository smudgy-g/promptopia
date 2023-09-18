"use client";

import { useState, useEffect } from 'react'
import PromptCard from './PromptCard';
import { PostType, PromptCardListType } from '@/types';



const PromptCardList = ({ data, handleTagClick }: PromptCardListType) => (
  <div className="mt-16 prompt_layout">
    {data.map((post: PostType) => (
      <PromptCard key={post._id} post={post} handleTagClick={handleTagClick} />
    ))}
  </div>
);

const Feed = () => {
  const [searchText, setSearchText] = useState('');
  const [posts, setPosts] = useState<PostType[]>([]);
  const [searchTimeout, setSearchTimeout] = useState<string | number | ReturnType<typeof setTimeout> | undefined>();
  const [searchedResults, setSearchedResults] = useState<PostType[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const response = await fetch('/api/prompt');
    const data = await response.json();
    setPosts(data)
  };

  const filterPrompts = (searchtext: string) => {
    const regex = new RegExp(searchtext, "i"); // 'i' flag for case-insensitive search
    return posts.filter(
      (item) =>
        regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    );
  };

  const handleSearchChange = (e: any) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts(e.target.value);
        setSearchedResults(searchResult)
      }, 800)
    );
  };

  const handleTagClick = (tagName: string) => {
    setSearchText(tagName);

    // const searchResult = filterPrompts(tagName);
    // setSearchedResults(searchResult);
  };

  return (
    <section className="feed">
      <form className='relative w-ful flex-center'>
        <input 
          type="text"
          placeholder='Search for a tag or username'
          value={searchText}
          onChange={handleSearchChange}
          required
          className='search_input peer'
           />
      </form>
      {
        searchText ? (
          <PromptCardList
          data={searchedResults}
          handleTagClick={handleTagClick} />
        ) : (
          <PromptCardList
            data={posts}
            handleTagClick={handleTagClick} />
        )
      }
    </section>
  )
}

export default Feed