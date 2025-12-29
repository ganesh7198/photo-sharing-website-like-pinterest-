import { FaEye, FaEyeSlash, FaPinterest, FaHeart, FaPalette } from "react-icons/fa";
import useLoginHook from "../../customhook/Loginhook";

function Login() {
  const {
    handleChange,
    formData,
    handleSubmit,
    showPassword,
    togglePassword,
    isSubmitting,
    isDisabled,
    error,
  } = useLoginHook();

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: 'url("https://wallpapers.com/images/hd/collage-background-2xxygaqtoeuzkrbl.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-lg">
            <span className="text-2xl font-bold text-red-600">P</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Welcome to our login </h1>
        </div>

        {/* Glassmorphism form container */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
            {error.type=="api"&& <p className="text-red-500 ">{error.message}</p>}
        {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div>
              <div className="relative ">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  className={`w-full px-4 py-3 rounded-xl border ${
                  error.type === "username" ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/80 backdrop-blur-sm`}
                />
              </div>
              {error.type === "username" && (
                <p className="mt-2 text-sm text-red-300 font-medium">{error.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-3 rounded-xl border ${
                  error.type === "password" ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/80 backdrop-blur-sm`}
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            
            </div>

           
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isDisabled}
              className={`w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 rounded-full transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg hover:shadow-xl ${
                isDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Logging in...
                </div>
              ) : (
                "Log in"
              )}
            </button>
          </form>

          {/* Sign up link */}
          <div className="mt-8 text-center text-sm">
            <p className="text-gray-700">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="text-red-500 font-bold hover:underline"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;