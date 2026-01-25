import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import {
  FiGrid,
  FiBookmark,
  FiUser,
  FiHeart,
  FiMessageCircle,
} from 'react-icons/fi';
import { BsCamera } from 'react-icons/bs';

const Profilepage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useContext(UserContext);

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [followingLoading, setFollowingLoading] = useState(false);
  const [postsLoading, setPostsLoading] = useState(false);

  // Instagram-like default images
  const defaultProfileImage =
    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
  const defaultPostImage =
    'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=600&h=600&fit=crop';

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        let targetUsername;

        if (username) {
          targetUsername = username;
        } else if (userInfo && userInfo.username) {
          navigate(`/profile/${userInfo.username}`, { replace: true });
          return;
        } else {
          setError('User not found');
          setLoading(false);
          return;
        }

        // Fetch user profile
        const profileUrl = `http://localhost:5000/api/user/profile/${targetUsername}`;
        const profileRes = await axios.get(profileUrl, {
          withCredentials: true,
        });

        if (profileRes.data) {
          setProfile(profileRes.data);

          // Now fetch user's posts separately
          await fetchUserPosts(targetUsername);
        }
      } catch (err) {
        console.error('Error fetching profile', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    const fetchUserPosts = async (username) => {
      try {
        setPostsLoading(true);
        const postsUrl = `http://localhost:5000/api/post/get-user-post/${username}`;
        const postsRes = await axios.get(postsUrl, { withCredentials: true });

        if (postsRes.data) {
          setPosts(postsRes.data);
        }
      } catch (err) {
        console.error('Error fetching user posts:', err);
        // Don't set error here, just show empty posts
        setPosts([]);
      } finally {
        setPostsLoading(false);
      }
    };

    fetchProfile();
  }, [username, userInfo, navigate]);

  const handleFollow = async () => {
    if (!profile || !userInfo) return;

    setFollowingLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:5000/api/user/follow/${profile._id}`,
        {},
        { withCredentials: true }
      );

      // FIX: Check if res.data.followers exists before using includes
      setProfile((prev) => ({
        ...prev,
        followers: res.data?.followers || prev.followers,
        isFollowing: res.data?.followers?.includes(userInfo._id) || false,
      }));
    } catch (err) {
      console.error('Error following user:', err);
    } finally {
      setFollowingLoading(false);
    }
  };

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  const handleLike = async (postId, e) => {
    e.stopPropagation(); // Prevent post click when liking
    if (!userInfo) return;

    try {
      // Optimistic update
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: post.likes?.includes(userInfo._id)
                  ? post.likes.filter((id) => id !== userInfo._id)
                  : [...(post.likes || []), userInfo._id],
              }
            : post
        )
      );

      await axios.post(
        `http://localhost:5000/api/post/like-post/${postId}`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error('Error liking post:', err);
      // Revert optimistic update on error
      // You might want to refetch posts here
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Instagram-like skeleton */}
          <div className="animate-pulse">
            <div className="flex items-center gap-8 mb-8">
              <div className="w-36 h-36 rounded-full bg-gray-200"></div>
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-6">
                  <div className="h-8 bg-gray-200 rounded w-32"></div>
                  <div className="h-8 bg-gray-200 rounded w-28"></div>
                </div>
                <div className="flex gap-12">
                  <div className="text-center">
                    <div className="h-6 bg-gray-200 rounded w-12 mx-auto"></div>
                    <div className="h-4 bg-gray-200 rounded w-16 mt-1"></div>
                  </div>
                  <div className="text-center">
                    <div className="h-6 bg-gray-200 rounded w-12 mx-auto"></div>
                    <div className="h-4 bg-gray-200 rounded w-16 mt-1"></div>
                  </div>
                  <div className="text-center">
                    <div className="h-6 bg-gray-200 rounded w-12 mx-auto"></div>
                    <div className="h-4 bg-gray-200 rounded w-16 mt-1"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-3 gap-1">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-square bg-gray-200"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">{error}</h2>
          <button
            onClick={() => navigate('/home')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">
            User not found
          </h2>
          <button
            onClick={() => navigate('/home')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // FIX: Add proper null checks for userInfo
  const isOwnProfile = userInfo && profile && userInfo._id === profile._id;

  // FIX: Check if userInfo exists and has following array
  const isFollowing = userInfo?.following
    ? userInfo.following.includes(profile._id)
    : false;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header - Instagram Style */}
        <div className="mb-12">
          <div className="flex items-center gap-8">
            {/* Profile Image - Instagram Circle */}
            <div className="relative">
              <div className="w-36 h-36 rounded-full p-1 bg-linear-to-r from-purple-500 via-pink-500 to-orange-500">
                <img
                  src={profile.profileimg || defaultProfileImage}
                  alt={`${profile.username}'s profile`}
                  className="w-full h-full rounded-full object-cover border-4 border-white"
                />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center gap-6 mb-5">
                <h1 className="text-2xl font-light text-gray-800">
                  {profile.username}
                </h1>

                <div className="flex items-center gap-3">
                  {isOwnProfile ? (
                    <>
                      <button
                        onClick={() => navigate('/settings')}
                        className="px-4 py-1.5 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                      >
                        Edit Profile
                      </button>
                      <button
                        onClick={() => navigate(`/upload/${userInfo?._id}`)}
                        className="px-4 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                      >
                        New Post
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleFollow}
                        disabled={followingLoading || !userInfo}
                        className={`px-6 py-1.5 rounded-lg font-medium transition-all duration-200 text-sm ${
                          isFollowing
                            ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        } ${!userInfo ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {followingLoading
                          ? '...'
                          : isFollowing
                            ? 'Following'
                            : 'Follow'}
                      </button>
                      <button
                        className="px-4 py-1.5 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                        disabled={!userInfo}
                      >
                        Message
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-10 mb-6">
                <div>
                  <span className="block text-lg font-semibold text-gray-900">
                    {posts.length}
                  </span>
                  <span className="text-gray-600 text-sm">posts</span>
                </div>
                <div>
                  <span className="block text-lg font-semibold text-gray-900">
                    {profile.followers?.length || 0}
                  </span>
                  <span className="text-gray-600 text-sm">followers</span>
                </div>
                <div>
                  <span className="block text-lg font-semibold text-gray-900">
                    {profile.following?.length || 0}
                  </span>
                  <span className="text-gray-600 text-sm">following</span>
                </div>
              </div>

              {/* Bio */}
              <div>
                <p className="text-gray-800 text-sm mt-1">
                  {profile.bio || 'No bio yet.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs - Instagram Style */}
        <div className="border-t border-gray-300">
          <div className="flex justify-center">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex items-center gap-2 px-6 py-4 font-medium border-t ${
                activeTab === 'posts'
                  ? 'text-gray-900 border-gray-900'
                  : 'text-gray-400 border-transparent'
              }`}
            >
              <FiGrid size={20} />
              <span className="text-xs tracking-widest">POSTS</span>
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex items-center gap-2 px-6 py-4 font-medium border-t ${
                activeTab === 'saved'
                  ? 'text-gray-900 border-gray-900'
                  : 'text-gray-400 border-transparent'
              }`}
            >
              <FiBookmark size={20} />
              <span className="text-xs tracking-widest">SAVED</span>
            </button>
            <button
              onClick={() => setActiveTab('tagged')}
              className={`flex items-center gap-2 px-6 py-4 font-medium border-t ${
                activeTab === 'tagged'
                  ? 'text-gray-900 border-gray-900'
                  : 'text-gray-400 border-transparent'
              }`}
            >
              <FiUser size={20} />
              <span className="text-xs tracking-widest">TAGGED</span>
            </button>
          </div>
        </div>

        {/* Posts Grid - Instagram Style */}
        {activeTab === 'posts' && (
          <>
            {postsLoading ? (
              <div className="grid grid-cols-3 gap-1 mt-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gray-200 animate-pulse"
                  ></div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                  <BsCamera size={48} className="text-gray-300" />
                </div>
                <h3 className="text-3xl font-light text-gray-800 mb-3">
                  No Posts Yet
                </h3>
                <p className="text-gray-500 mb-8">
                  {isOwnProfile
                    ? 'Share photos and videos'
                    : "When they post, you'll see their photos and videos here."}
                </p>
                {isOwnProfile && userInfo && (
                  <button
                    onClick={() => navigate(`/upload/${userInfo._id}`)}
                    className="px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
                  >
                    Share your first photo
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1">
                {posts.map((post) => {
                  // FIX: Check if userInfo exists and post.likes exists
                  const isLiked =
                    userInfo && post.likes
                      ? post.likes.includes(userInfo._id)
                      : false;

                  return (
                    <div
                      key={post._id}
                      className="relative aspect-square group cursor-pointer"
                      onClick={() => handlePostClick(post._id)}
                    >
                      <img
                        src={post.img || defaultPostImage}
                        alt={`Post by ${profile.username}`}
                        className="w-full h-full object-cover"
                      />

                      {/* Hover Overlay with Like/Comment Counts */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-white">
                        <div className="flex items-center gap-6">
                          <div
                            className="flex items-center gap-2"
                            onClick={(e) => userInfo && handleLike(post._id, e)}
                          >
                            {isLiked ? (
                              <FiHeart
                                className="text-red-500 fill-red-500"
                                size={20}
                              />
                            ) : (
                              <FiHeart size={20} />
                            )}
                            <span className="font-bold">
                              {post.likes?.length || 0}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FiMessageCircle size={20} />
                            <span className="font-bold">
                              {post.comment?.length || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Saved Tab */}
        {activeTab === 'saved' && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
              <FiBookmark size={48} className="text-gray-300" />
            </div>
            <h3 className="text-2xl font-light text-gray-800 mb-3">
              No Saved Posts
            </h3>
            <p className="text-gray-500">
              {isOwnProfile
                ? 'Save photos and videos that you want to see again.'
                : 'Only you can see your saved posts.'}
            </p>
          </div>
        )}

        {/* Tagged Tab */}
        {activeTab === 'tagged' && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
              <FiUser size={48} className="text-gray-300" />
            </div>
            <h3 className="text-2xl font-light text-gray-800 mb-3">
              No Photos of You
            </h3>
            <p className="text-gray-500">
              {isOwnProfile
                ? "When people tag you in photos, they'll appear here."
                : 'When people tag this user, photos will appear here.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profilepage;
