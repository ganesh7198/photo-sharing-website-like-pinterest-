import { useEffect, useState, useCallback, useContext } from 'react';
import { getAllPosts } from '../services/getAllPosts';
import axios from 'axios';
import { UserContext } from '../context/UserContext';

const Homepage = () => {
  const { userInfo, setUserInfo } = useContext(UserContext); // get logged-in user
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likingPostId, setLikingPostId] = useState(null);
  const [followingUserId, setFollowingUserId] = useState(null);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPosts();
        setPosts(data.posts);
      } catch (error) {
        console.log('Error fetching posts', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Like handler
  const handleLike = useCallback(
    async (postId) => {
      if (!userInfo) return;
      if (likingPostId === postId) return;

      setLikingPostId(postId);

      try {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  likes: post.likes.includes(userInfo._id)
                    ? post.likes.filter((id) => id !== userInfo._id)
                    : [...post.likes, userInfo._id],
                  isLiking: true,
                }
              : post
          )
        );

        const res = await axios.post(
          `http://localhost:5000/api/post/like-post/${postId}`,
          {},
          { withCredentials: true }
        );

        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? { ...post, likes: res.data.likes, isLiking: false }
              : post
          )
        );
      } catch (error) {
        console.log('Error liking post', error);
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId ? { ...post, isLiking: false } : post
          )
        );
      } finally {
        setLikingPostId(null);
      }
    },
    [likingPostId, userInfo]
  );

  // Follow/Unfollow handler
  const handleFollow = async (userId) => {
    if (!userInfo || userInfo._id === userId || followingUserId === userId)
      return;

    setFollowingUserId(userId);

    try {
      const res = await axios.post(
        `http://localhost:5000/api/user/follow/${userId}`,
        {},
        { withCredentials: true }
      );

      // Update logged-in user's following list
      setUserInfo((prev) => ({ ...prev, following: res.data.following }));

      // Optionally, update the posts state to re-render follow buttons
      setPosts((prevPosts) => [...prevPosts]);
    } catch (error) {
      console.log('Error following/unfollowing user', error);
    } finally {
      setFollowingUserId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-6 p-6 bg-gray-100 min-h-screen">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white w-full max-w-md rounded-xl shadow-md overflow-hidden animate-pulse"
          >
            <div className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-full bg-gray-300" />
              <div className="h-4 bg-gray-300 rounded w-1/4" />
            </div>
            <div className="w-full h-[400px] bg-gray-300" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-300 rounded w-3/4" />
              <div className="h-3 bg-gray-300 rounded w-1/2" />
              <div className="h-8 bg-gray-300 rounded w-1/4 mt-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 p-4 md:p-6 bg-gray-50 min-h-screen">
      {posts.length === 0 ? (
        <div className="text-center mt-20">
          <p className="text-gray-500 text-lg">
            No posts yet. Be the first to share!
          </p>
        </div>
      ) : (
        posts.map((post) => {
          const isPostLiked = post.likes.includes(userInfo?._id);
          const isFollowing = userInfo?.following.includes(post.user._id);
          const isOwnPost = post.user._id === userInfo?._id;

          return (
            <div
              key={post._id}
              className="bg-white w-full max-w-md rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
            >
              {/* User Info */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      post.user?.profileimg || 'https://via.placeholder.com/40'
                    }
                    alt={post.user?.username || 'profile'}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                  />
                  <h3 className="font-semibold text-gray-800">
                    {post.user?.username || 'Anonymous'}
                  </h3>
                </div>

                {/* Follow Button */}
                {!isOwnPost && (
                  <button
                    onClick={() => handleFollow(post.user._id)}
                    disabled={followingUserId === post.user._id}
                    className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                      isFollowing
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>

              {/* Post Image */}
              <div className="relative">
                <img
                  src={post.img}
                  alt="post"
                  className="w-full h-auto max-h-[500px] object-contain bg-gray-100"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src =
                      'https://via.placeholder.com/400x400?text=Image+Not+Found';
                  }}
                />
              </div>

              {/* Like + Caption */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleLike(post._id)}
                    disabled={likingPostId === post._id}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isPostLiked
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-xl">{isPostLiked ? '❤️' : '🤍'}</span>
                    <span className="font-medium">
                      {isPostLiked ? 'Liked' : 'Like'}
                    </span>
                  </button>

                  <div className="flex items-center gap-1 text-gray-600">
                    <span className="text-lg">❤️</span>
                    <span className="font-medium">
                      {post.likes.length}{' '}
                      {post.likes.length === 1 ? 'Like' : 'Likes'}
                    </span>
                  </div>
                </div>

                <p className="text-gray-800">
                  <span className="font-semibold mr-2">
                    {post.user?.username || 'Anonymous'}
                  </span>
                  {post.text}
                </p>

                <p className="text-xs text-gray-400 border-t pt-2">
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Homepage;
