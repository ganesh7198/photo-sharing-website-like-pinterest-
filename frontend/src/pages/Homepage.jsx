import { useEffect, useState } from 'react';
import { getAllPosts } from '../services/postApi';

const Homepage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPosts();
        setPosts(data);
      } catch (error) {
        console.log('Error fetching posts', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <h2 className="text-center mt-10">Loading posts...</h2>;

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-gray-100 min-h-screen">
      {posts.map((post) => (
        <div
          key={post._id}
          className="bg-white w-full max-w-md rounded-xl shadow-md overflow-hidden"
        >
          {/* User Info */}
          <div className="flex items-center gap-3 p-4">
            <img
              src={post.user?.profileimg || 'https://via.placeholder.com/40'}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <h3 className="font-semibold">{post.user?.username}</h3>
          </div>

          {/* Post Image */}
          <img
            src={post.image}
            alt="post"
            className="w-full max-h-[400px] object-cover"
            loading="lazy"
          />

          {/* Caption */}
          <div className="p-4">
            <p className="text-sm">
              <span className="font-semibold mr-2">{post.user?.username}</span>
              {post.caption}
            </p>

            <p className="text-xs text-gray-500 mt-2">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Homepage;
