import { useEffect, useState } from 'react';
import axios from 'axios';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const deleteNotifications = async () => {
    try {
      await axios.delete('http://localhost:5000/api/notification/delete', {
        withCredentials: true,
      });

      // Clear notifications from UI
      setNotifications([]);
    } catch (err) {
      console.error('Error deleting notifications:', err);
      alert('Failed to delete notifications');
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/notification', {
        withCredentials: true,
      });

      setNotifications(res.data.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const formatTime = (date) => {
    const diff = Math.floor((new Date() - new Date(date)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-6">Notifications</h2>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Notifications</h2>

        {notifications.length > 0 && (
          <button
            onClick={deleteNotifications}
            className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete All
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications yet.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div
              key={notif._id}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                notif.read ? 'bg-white' : 'bg-blue-50'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Profile Image */}
                <img
                  src={
                    notif.from.profileimg ||
                    'https://cdn-icons-png.flaticon.com/512/149/149071.png'
                  }
                  alt="profile"
                  className="w-10 h-10 rounded-full object-cover"
                />

                {/* Message */}
                <div>
                  <p className="text-sm">
                    <span className="font-semibold">{notif.from.username}</span>{' '}
                    {notif.type === 'follow'
                      ? 'started following you'
                      : 'liked your post'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatTime(notif.createdAt)}
                  </p>
                </div>
              </div>

              {!notif.read && (
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationPage;
