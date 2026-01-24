import axios from 'axios';

export const getAllPosts = async () => {
  const res = await axios.get('http://localhost:5000/api/posts/home', {
    withCredentials: true,
  });
  return res.data;
};
