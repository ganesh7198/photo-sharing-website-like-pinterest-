import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 md:px-10 py-5 bg-white/90 backdrop-blur-sm shadow-lg sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg"></div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            PhotoShare
          </h1>
        </div>

        <div className="flex space-x-3">
          <Link
            to="/login"
            className="px-5 py-2.5 border-2 border-purple-500 text-purple-600 font-medium rounded-xl hover:bg-purple-50 hover:border-purple-600 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium rounded-xl hover:from-purple-700 hover:to-pink-600 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center justify-between px-6 md:px-10 py-16 md:py-24">
        <div className="max-w-2xl mb-12 lg:mb-0">

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Capture & Share
            <span className="block bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              Your Visual Story
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 leading-relaxed">
            A vibrant community where photographers share, explore, and inspire.
            From breathtaking landscapes to intimate portraits, discover the
            world through millions of lenses.
          </p>

          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              to="/signup"
              className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-600 transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl"
            >
              Start Sharing Free
            </Link>
            <Link
              to="/explore"
              className="px-8 py-3.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-purple-400 hover:text-purple-700 hover:bg-purple-50 transition-all duration-300"
            >
              Explore Gallery
            </Link>
          </div>

          <div className="flex items-center mt-10 space-x-6">
            <div className="flex -space-x-3">
            </div>
            <div>
           
              <div className="flex items-center mt-1">
              </div>
            </div>
          </div>
        </div>

        {/* Hero Images Grid */}
        <div className="relative w-full lg:w-auto">
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {[
              {
                src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
                color: 'from-blue-400 to-cyan-400',
              },
              {
                src: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
                color: 'from-purple-400 to-pink-400',
              },
              {
                src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
                color: 'from-orange-400 to-red-400',
              },
              {
                src: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7',
                color: 'from-green-400 to-emerald-400',
              },
            ].map((item, index) => (
              <div key={index} className="relative group">
                <div
                  className={`absolute -inset-1 bg-gradient-to-r ${item.color} rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300`}
                ></div>
                <img
                  src={item.src}
                  alt={`photo${index + 1}`}
                  loading="lazy"
                  className="relative w-48 h-48 md:w-56 md:h-56 object-cover rounded-xl shadow-2xl group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4 rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-sm font-medium">
                    By Creator {index + 1}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Floating Elements */}
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full blur-xl opacity-40"></div>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full blur-xl opacity-40"></div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="px-6 md:px-10 py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 mb-4">
            <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-2"></span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Explore{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Vibrant
            </span>{' '}
            Collection
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Discover handpicked photos from our global community of talented
            photographers
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
              category: 'Landscape',
              likes: '1.2k',
            },
            {
              src: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d',
              category: 'Portrait',
              likes: '2.4k',
            },
            {
              src: 'https://images.unsplash.com/photo-1500534314209-a26db0f5c4d4',
              category: 'Urban',
              likes: '856',
            },
            {
              src: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
              category: 'Fashion',
              likes: '3.1k',
            },
            {
              src: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b',
              category: 'Nature',
              likes: '1.8k',
            },
            {
              src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
              category: 'Night',
              likes: '945',
            },
            {
              src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
              category: 'Mountain',
              likes: '2.7k',
            },
            {
              src: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d',
              category: 'Forest',
              likes: '1.5k',
            },
          ].map((item, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10"></div>
              <img
                src={item.src}
                loading="lazy"
                alt={item.category}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute bottom-0 left-0 right-0 z-20 p-4 text-white">
                <div className="flex justify-between items-center mb-2">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                    #{item.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <span className="font-semibold">{item.likes}</span>
                  </div>
                </div>
                <p className="font-bold text-lg">Breathtaking Shot</p>
              </div>
              <div className="absolute top-4 right-4 z-20">
               
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/explore"
            className="inline-flex items-center px-8 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
          >
            Explore All Collections
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 md:px-10 py-16 bg-gradient-to-br from-white to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose{' '}
              <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                PhotoShare
              </span>
              ?
            </h2>
            <p className="text-gray-600">
              Everything you need to showcase your photography
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: '4K Uploads',
                description:
                  'Upload and display your photos in stunning 4K resolution',
                icon: '📸',
                color: 'from-blue-500 to-cyan-400',
              },
              {
                title: 'Smart Albums',
                description:
                  'AI-powered organization for your photo collections',
                icon: '🧠',
                color: 'from-purple-500 to-pink-400',
              },
              {
                title: 'Community',
                description: 'Connect with photographers worldwide',
                icon: '🌐',
                color: 'from-orange-500 to-yellow-400',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-2xl mb-6`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <span className="text-sm font-medium text-gray-500">
                    Learn more →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-purple-900 text-white">
        <div className="px-6 md:px-10 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"></div>
                <h2 className="text-2xl font-bold">PhotoShare</h2>
              </div>
              <p className="text-gray-300">
                Where every pixel tells a story. Join the revolution of visual
                storytelling.
              </p>
            </div>

            {['Product', 'Community', 'Company', 'Legal'].map((category) => (
              <div key={category}>
                <h3 className="font-bold text-lg mb-4">{category}</h3>
                <ul className="space-y-2">
                  {['Feature 1', 'Feature 2', 'Feature 3'].map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400">
                © 2026 PhotoShare. Crafted with ❤️ by creative minds worldwide.
              </p>
              <div className="flex space-x-4 mt-4 md:mt-0">
                {['twitter', 'instagram', 'github', 'dribbble'].map(
                  (social) => (
                    <a
                      key={social}
                      href="#"
                      className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
                    >
                      {social.charAt(0).toUpperCase()}
                    </a>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
