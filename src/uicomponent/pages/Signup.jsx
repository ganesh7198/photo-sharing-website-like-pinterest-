import { useState } from "react";
import useSignup from "../../customhook/Signuphook";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Signup() {
  const { formData, error, handleChange, handleSubmit, isSignup, isSubmitting, isDisabled } = useSignup();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: 'url("https://wallpapers.com/images/hd/collage-background-2xxygaqtoeuzkrbl.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-lg">
            <span className="text-2xl font-bold text-red-600">P</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Welcome to our signup</h1>
          <p className="text-gray-200">Find new ideas to try</p>
        </div>

        {/* Signup Form Container */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Show API error */}
            {error.type === "api" && (
              <p className="text-red-600 text-sm text-center">{error.message}</p>
            )}

            {/* Email Field */}
            <div>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="Email"
                className={`w-full px-4 py-3 rounded-xl border ${
                  error.type === "email" ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/80 backdrop-blur-sm`}
              />
              {error.type === "email" && (
                <p className="mt-2 text-sm text-red-600 font-medium">{error.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="relative">
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                className={`w-full px-4 py-3 rounded-xl border ${
                  error.type === "password" ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent pr-12 bg-white/80 backdrop-blur-sm`}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {error.type === "password" && (
                <p className="mt-2 text-sm text-red-600 font-medium">{error.message}</p>
              )}
            </div>

            {/* Username Field */}
            <div>
              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                type="text"
                placeholder="Username"
                className={`w-full px-4 py-3 rounded-xl border ${
                  error.type === "username" ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/80 backdrop-blur-sm`}
              />
              {error.type === "username" && (
                <p className="mt-2 text-sm text-red-600 font-medium">{error.message}</p>
              )}
            </div>

            {/* Full Name Field */}
            <div>
              <input
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                type="text"
                placeholder="Full Name"
                className={`w-full px-4 py-3 rounded-xl border ${
                  error.type === "fullname" ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/80 backdrop-blur-sm`}
              />
              {error.type === "fullname" && (
                <p className="mt-2 text-sm text-red-600 font-medium">{error.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isDisabled}
              className={`w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 rounded-full transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg hover:shadow-xl ${
                isDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Creating..." : "Create Account"}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center text-sm">
            <p className="text-gray-700">
              Already have an account?{" "}
              <a href="/login" className="text-red-600 font-semibold hover:underline">
                Log in
              </a>
            </p>
            <p className="mt-3 text-xs text-gray-600">
              By continuing, you agree to our <br />
              <a href="#" className="text-red-600 hover:underline">Terms of Service</a> and acknowledge you've read our <br />
              <a href="#" className="text-red-600 hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
