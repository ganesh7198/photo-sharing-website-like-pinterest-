import { useState } from 'react';
import loginApi from '../services/loginApi';
import { Link } from 'react-router-dom';

const Loginpage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Data:', formData); // ✅ debug

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await loginApi(formData);
      setSuccess(res.message);
      console.log('User:', res);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Login to Your Account
        </h2>

        {error && (
          <p className="bg-red-100 text-red-600 p-2 rounded mb-3 text-sm">
            {error}
          </p>
        )}
        {success && (
          <p className="bg-green-100 text-green-600 p-2 rounded mb-3 text-sm">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username" // ✅ fixed
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <p className="text-center text-sm text-gray-500 mt-4">
                    Don't have an account?{' '}
                    <span className="text-indigo-600 cursor-pointer hover:underline">
                      <Link to="/signup">Signup</Link>
                    </span>
                  </p>
        </form>
      </div>
    </div>
  );
};

export default Loginpage;
