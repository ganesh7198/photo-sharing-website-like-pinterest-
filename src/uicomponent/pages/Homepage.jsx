import { Link } from "react-router-dom";
import { FaPinterest, FaSearch, FaCamera, FaHeart, FaUserPlus, FaMagic, FaGoogle, FaFacebookF } from "react-icons/fa";
import { MdExplore } from "react-icons/md";
import { useCallback } from "react";

function Homepage() {
  // Pinterest-style image cards
const pinterestCards = [
  {
    id: 1,
    title: "Nature Escape",
    desc: "Peaceful landscapes",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    height: "h-[320px]",
  },
  {
    id: 2,
    title: "Urban Vibes",
    desc: "City inspiration",
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156",
    height: "h-[420px]",
  },
  {
    id: 3,
    title: "Creative Workspace",
    desc: "Design & productivity",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36",
    height: "h-[360px]",
  },
];


  // Features
  const features = [
    { icon: <FaCamera />, title: "Save ideas", desc: "Collect inspiring images" },
    { icon: <MdExplore />, title: "Discover", desc: "Find new interests" },
    { icon: <FaHeart />, title: "Get inspired", desc: "Spark creativity" },
    { icon: <FaUserPlus />, title: "Connect", desc: "Follow creators" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                <FaPinterest className="text-xl text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">SnapShare</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-700 hover:text-red-500 font-medium">Features</a>
              <a href="#explore" className="text-gray-700 hover:text-red-500 font-medium">Explore</a>
              <a href="#about" className="text-gray-700 hover:text-red-500 font-medium">About</a>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-red-500 font-medium"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-full font-medium transition-all duration-300"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-24 md:pt-32">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full mb-6">
              <FaMagic className="text-sm" />
              <span className="text-sm font-medium">Where ideas come to life</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight mb-6">
              Find your next
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-pink-500 to-purple-500">
                favorite idea
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              Discover recipes, home inspiration, style ideas, and more from creators worldwide.
            </p>

            {/* Quick Categories */}
            <div className="flex flex-wrap justify-center gap-3 mb-16">
              {["Home Decor", "Recipes", "Travel", "Fashion", "DIY", "Wedding", "Art", "Gardening"].map((cat) => (
                <button
                  key={cat}
                  className="px-5 py-2.5 bg-white border border-gray-300 rounded-full hover:border-red-400 hover:text-red-500 transition-all duration-300 hover:shadow-md"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Pinterest Grid Preview */}
          <div id="explore" className="mb-20">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
              Explore popular ideas
            </h2>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 max-w-6xl mx-auto">
             {pinterestCards.map((card) => (
  <div
    key={card.id}
    className={`${card.height} rounded-2xl mb-6 break-inside-avoid shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden group cursor-pointer`}
  >
    {/* Image */}
    <img
      src={card.image}
      alt={card.title}
      className="w-full h-full object-cover"
      loading="lazy"
    />

    {/* Dark gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

    {/* Text on hover */}
    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
      <h3 className="text-white font-bold text-lg">{card.title}</h3>
      <p className="text-white/80 text-sm">{card.desc}</p>
    </div>
  </div>
))}

            </div>
          </div>

          {/* Features */}
          <div id="features" className="py-16 bg-gradient-to-b from-white to-gray-50 rounded-3xl mb-20">
            <div className="max-w-6xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                Why creators love SnapShare !
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-red-200 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 text-white text-xl">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="max-w-4xl mx-auto text-center mb-20">
            <div className="bg-gradient-to-r from-red-500/10 via-pink-500/10 to-purple-500/10 rounded-3xl p-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Ready to find inspiration?
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl shadow-lg"
                >
                  Sign up free
                </Link>
                <Link
                  to="/login"
                  className="bg-white border-2 border-gray-300 hover:border-red-400 text-gray-800 hover:text-red-600 px-8 py-4 rounded-full font-semibold transition-all duration-300"
                >
                  See how it works
                </Link>
              </div>
            </div>
          </div>

          {/* Stats */}
		  </div>
        
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <FaPinterest className="text-xl text-white" />
                </div>
                <span className="text-2xl font-bold">SnapShare</span>
              </div>
              <p className="text-gray-400">© 2024 SnapShare. All rights reserved.</p>
            </div>
            
            <div className="flex gap-8">
              <a href="#" className="text-gray-400 hover:text-white">About</a>
              <a href="#" className="text-gray-400 hover:text-white">Blog</a>
              <a href="#" className="text-gray-400 hover:text-white">Jobs</a>
              <a href="#" className="text-gray-400 hover:text-white">Help</a>
              <a href="#" className="text-gray-400 hover:text-white">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white">Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Homepage;