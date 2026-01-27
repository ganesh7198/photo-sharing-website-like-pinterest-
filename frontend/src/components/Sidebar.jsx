import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { useContext } from 'react';

const Sidebar = () => {
  const { userInfo } = useContext(UserContext);

  return (
    <div className="w-64 bg-black text-white p-5">
      <h2 className="text-xl font-bold mb-6">📸 PhotoShare</h2>

      <ul className="space-y-4">
        <li>
          <Link to="/home" className="hover:text-gray-300">
            Home
          </Link>
        </li>

        <li>
          <Link
            to={userInfo ? `/profile/${userInfo.username}` : '/profile'}
            className="hover:text-gray-300"
          >
            Profile
          </Link>
        </li>

        <li>
          <Link to={'/upload'} className="hover:text-gray-300">
            Upload
          </Link>
        </li>
        <li>
          <Link to={'/notification'} className="hover:text-gray-300">
            notification
          </Link>
        </li>

        <li>
          <Link to={'/logout'}>logout</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
