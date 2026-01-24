import axios from 'axios';

export const getAllPosts = async () => {
  const res = await axios.get('http://localhost:5000/api/post/posts', {
    withCredentials: true,
  });
  return res.data;
};
