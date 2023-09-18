"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Profile from "@/components/Profile";
import { PostType } from "@/types";


const MyProfile = () => {
  const {data: session} = useSession();
  const [posts, setPosts] = useState<PostType[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${session?.user.id}/posts`);
      const data = await response.json();
  
      setPosts(data)
    }
    if (session?.user.id) fetchPosts();
  }, [])

  

  
  const handleEdit = (post: PostType) => {
    router.push(`/update-prompt?id=${post._id}`)
  }
  
  const handleDelete = async (post: PostType) => {
    const hasConfirmed = confirm('Are you sure you want to delete this prompt?');

    if(hasConfirmed) {
      try {
        await fetch(`/api/prompt/${post._id?.toString()}`, {
          method: 'DELETE'
        })
        
        const filteredposts = posts.filter((p: PostType) => p._id !== post._id);
        setPosts(filteredposts)
      } catch (error) {
        console.log(error);
      }
    }
  }


  return (
    <Profile
      name='My'
      desc='Welcome to your personalised profile page'
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete} />
  )
}

export default MyProfile;