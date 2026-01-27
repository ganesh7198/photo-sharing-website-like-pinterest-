import { useEffect, useState, useCallback, useContext } from 'react';
import { getAllPosts } from '../services/getAllPosts';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';
import {
  FiHeart,
  FiMessageCircle,
  FiSend,
  FiBookmark,
  FiMoreHorizontal,
} from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';

const Homepage = () => {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likingPostId, setLikingPostId] = useState(null);
  const [followingUserId, setFollowingUserId] = useState(null);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [commentInputs, setCommentInputs] = useState({});
  const [postingCommentId, setPostingCommentId] = useState(null);
  const [expandedComments, setExpandedComments] = useState({});

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPosts();
        setPosts(data.posts);

        // Initialize comment inputs for each post
        const inputs = {};
        data.posts.forEach((post) => {
          inputs[post._id] = '';
        });
        setCommentInputs(inputs);
      } catch (error) {
        console.log('Error fetching posts', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Double tap to like
  const handleDoubleTap = useCallback(
    (postId) => {
      if (!userInfo) return;
      handleLike(postId);
      setLikedPosts((prev) => new Set(prev).add(postId));
      setTimeout(() => {
        setLikedPosts((prev) => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
      }, 1000);
    },
    [userInfo]
  );

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

      setUserInfo((prev) => ({ ...prev, following: res.data.following }));
      setPosts((prevPosts) => [...prevPosts]);
    } catch (error) {
      console.log('Error following/unfollowing user', error);
    } finally {
      setFollowingUserId(null);
    }
  };

  // Handle comment input change
  const handleCommentChange = (postId, value) => {
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };

  // Submit comment
  const handleCommentSubmit = async (postId) => {
    if (!userInfo || !commentInputs[postId]?.trim()) return;

    const commentText = commentInputs[postId].trim();
    setPostingCommentId(postId);

    try {
      // Optimistic update
      const newComment = {
        text: commentText,
        user: userInfo._id,
        _id: `temp-${Date.now()}`, // Temporary ID
      };

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                comment: [...(post.comment || []), newComment],
              }
            : post
        )
      );

      // Clear input
      setCommentInputs((prev) => ({
        ...prev,
        [postId]: '',
      }));

      // Send to API
      const res = await axios.post(
        `http://localhost:5000/api/post/comment-post/${postId}`,
        { text: commentText },
        { withCredentials: true }
      );

      // Update with real data from server
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, comment: res.data.comment || res.data.comments }
            : post
        )
      );
    } catch (error) {
      console.log('Error posting comment:', error);
      // Revert optimistic update on error
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                comment: post.comment.filter(
                  (c) => !c._id?.startsWith('temp-')
                ),
              }
            : post
        )
      );

      // Show error message (you could add a toast notification here)
      alert('Failed to post comment. Please try again.');
    } finally {
      setPostingCommentId(null);
    }
  };

  // Handle Enter key for comment submission
  const handleKeyPress = (e, postId) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCommentSubmit(postId);
    }
  };

  // Toggle expanded comments
  const toggleComments = (postId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen   from-gray-50 to-white">
        <div className="max-w-xl mx-auto py-6 px-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6 overflow-hidden animate-pulse"
            >
              <div className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div className="space-y-2 flex-1">
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                  <div className="h-2 bg-gray-200 rounded w-1/6" />
                </div>
              </div>
              <div className="w-full h-125 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <div className="max-w-xl mx-auto py-6 px-4">
        {posts.length === 0 ? (
          <div className="text-center mt-32">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-linear-to-br from-pink-100 to-purple-100 flex items-center justify-center">
              <FiMessageCircle className="text-4xl text-purple-400" />
            </div>
            <h2 className="text-2xl font-light text-gray-800 mb-2">
              Welcome to PhotoShare
            </h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              No posts yet. Be the first to share your moments with the
              community!
            </p>
            {userInfo && (
              <Link
                to={`/upload`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-full hover:shadow-lg transition-all duration-300"
              >
                <span className="font-medium">Share your first photo</span>
              </Link>
            )}
          </div>
        ) : (
          posts.map((post) => {
            const isPostLiked = post.likes.includes(userInfo?._id);
            const isFollowing = userInfo?.following.includes(post.user._id);
            const isOwnPost = post.user._id === userInfo?._id;
            const isDoubleTapLiked = likedPosts.has(post._id);
            const comments = post.comment || [];
            const showAllComments = expandedComments[post._id];
            const displayedComments = showAllComments
              ? comments
              : comments.slice(0, 2);
            const hasMoreComments = comments.length > 2;

            return (
              <div
                key={post._id}
                className="bg-white rounded-lg shadow-sm border border-gray-100 mb-8 overflow-hidden transition-all duration-300 hover:shadow-md"
              >
                {/* User Header */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/profile/${post.user.username}`}
                      className="group"
                    >
                      <div className="relative">
                        <img
                          src={
                            post.user?.profileimg ||
                            'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                          }
                          alt={post.user?.username || 'profile'}
                          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-purple-300 transition-colors duration-200"></div>
                      </div>
                    </Link>
                    <div>
                      <Link to={`/profile/${post.user.username}`}>
                        <h3 className="font-semibold text-gray-900 hover:text-gray-700 transition-colors">
                          {post.user?.username}
                        </h3>
                      </Link>
                      <p className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isOwnPost && (
                      <button
                        onClick={() => handleFollow(post.user._id)}
                        disabled={followingUserId === post.user._id}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                          isFollowing
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-linear-to-r from-blue-500 to-cyan-500 text-white hover:shadow-md'
                        }`}
                      >
                        {followingUserId === post.user._id
                          ? '...'
                          : isFollowing
                            ? 'Following'
                            : 'Follow'}
                      </button>
                    )}
                    <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                      <FiMoreHorizontal className="text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Post Image with Double Tap */}
                <div className="relative">
                  <div
                    className="w-full cursor-pointer"
                    onDoubleClick={() => handleDoubleTap(post._id)}
                  >
                    <img
                      src={post.img}
                      alt="post"
                      className="w-full h-auto max-h-150 object-cover bg-gray-50"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src =
                          'https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?w=600&h=600&fit=crop';
                      }}
                    />
                  </div>

                  {/* Double Tap Heart Animation */}
                  {isDoubleTapLiked && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="animate-ping-slow">
                        <FaHeart className="text-white text-8xl drop-shadow-2xl" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLike(post._id)}
                        disabled={likingPostId === post._id}
                        className="p-1.5 hover:scale-110 active:scale-95 transition-transform duration-200"
                      >
                        {isPostLiked ? (
                          <FaHeart className="text-red-500 text-xl" />
                        ) : (
                          <FiHeart className="text-gray-900 text-xl" />
                        )}
                      </button>
                      <button
                        className="p-1.5 hover:scale-110 active:scale-95 transition-transform duration-200"
                        onClick={() => {
                          // Focus on comment input when comment button is clicked
                          document
                            .getElementById(`comment-input-${post._id}`)
                            ?.focus();
                        }}
                      ></button>
                    </div>
                  </div>

                  {/* Likes */}
                  <div className="mb-3">
                    <p className="font-medium text-gray-900">
                      {post.likes.length}{' '}
                      {post.likes.length === 1 ? 'like' : 'likes'}
                    </p>
                  </div>

                  {/* Caption */}
                  <div className="mb-3">
                    <p className="text-gray-900">
                      <Link
                        to={`/profile/${post.user.username}`}
                        className="font-semibold mr-2 hover:text-gray-700"
                      >
                        {post.user?.username}
                      </Link>
                      {post.text}
                    </p>
                  </div>

                  {/* Comments Section */}
                  {comments.length > 0 && (
                    <div className="mb-3 space-y-2">
                      {/* View all comments button */}
                      {hasMoreComments && !showAllComments && (
                        <button
                          onClick={() => toggleComments(post._id)}
                          className="text-gray-500 text-sm hover:text-gray-700 transition-colors"
                        >
                          View all {comments.length} comments
                        </button>
                      )}

                      {/* Display comments */}
                      {displayedComments.map((comment, index) => (
                        <div key={comment._id || index} className="text-sm">
                          <p className="text-gray-900">
                            <span className="font-semibold mr-2"></span>
                            {comment.text}
                          </p>
                        </div>
                      ))}

                      {/* Show less button */}
                      {showAllComments && hasMoreComments && (
                        <button
                          onClick={() => toggleComments(post._id)}
                          className="text-gray-500 text-sm hover:text-gray-700 transition-colors"
                        >
                          Show less
                        </button>
                      )}
                    </div>
                  )}

                  {/* Time */}
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                {/* Add Comment */}
                <div className="border-t border-gray-100 p-4">
                  <div className="flex items-center gap-3">
                    <input
                      id={`comment-input-${post._id}`}
                      type="text"
                      placeholder="Add a comment..."
                      value={commentInputs[post._id] || ''}
                      onChange={(e) =>
                        handleCommentChange(post._id, e.target.value)
                      }
                      onKeyPress={(e) => handleKeyPress(e, post._id)}
                      disabled={postingCommentId === post._id}
                      className="flex-1 border-none outline-none text-sm placeholder-gray-400 disabled:opacity-50"
                    />
                    <button
                      onClick={() => handleCommentSubmit(post._id)}
                      disabled={
                        !commentInputs[post._id]?.trim() ||
                        postingCommentId === post._id
                      }
                      className={`font-medium text-sm transition-colors ${
                        commentInputs[post._id]?.trim() &&
                        postingCommentId !== post._id
                          ? 'text-blue-500 hover:text-blue-600'
                          : 'text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {postingCommentId === post._id ? 'Posting...' : 'Post'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add custom animation for ping */}
      <style jsx>{`
        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          70% {
            transform: scale(2);
            opacity: 0.7;
          }
          100% {
            transform: scale(3);
            opacity: 0;
          }
        }
        .animate-ping-slow {
          animation: ping-slow 1s cubic-bezier(0, 0, 0.2, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default Homepage;
