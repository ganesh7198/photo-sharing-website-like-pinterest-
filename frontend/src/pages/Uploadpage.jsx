import { useState, useContext, useEffect, useRef } from 'react'; // Added useRef
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import {
  FiImage,
  FiLink,
  FiUpload,
  FiLoader,
  FiExternalLink,
  FiX,
} from 'react-icons/fi';

const Uploadpage = () => {
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    text: '',
    img: '',
  });

  const [base64Image, setBase64Image] = useState('');
  const [loading, setLoading] = useState(false);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState('');
  const [previewError, setPreviewError] = useState(false);
  const [uploadMethod, setUploadMethod] = useState('url'); // 'url' or 'file'

  // Use useRef for file input
  const fileInputRef = useRef(null);

  // Removed selectedFile state since we're using base64Image directly

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  // Process file for file upload method
  const processFile = (file) => {
    // Check file type
    if (!file.type.match('image.*')) {
      setError('Please select an image file (JPEG, PNG, GIF, etc.)');
      return;
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should be less than 2MB for faster upload');
      return;
    }

    setError('');
    setUploadMethod('file');
    setFormData((prev) => ({ ...prev, img: file.name }));

    // Create preview and base64
    const reader = new FileReader();

    reader.onload = (event) => {
      const base64 = event.target.result;
      console.log('File base64 length:', base64.length);
      setBase64Image(base64);
    };

    reader.onerror = () => {
      setError('Failed to read image file');
    };

    reader.readAsDataURL(file);
  };

  // Convert URL to base64 when img URL changes
  useEffect(() => {
    const convertUrlToBase64 = async (url) => {
      if (!url.trim()) {
        setBase64Image('');
        return;
      }

      // Validate URL
      try {
        new URL(url);
      } catch {
        setError('Please enter a valid URL');
        setBase64Image('');
        return;
      }

      setConverting(true);
      setError('');
      setPreviewError(false);
      setUploadMethod('url');

      try {
        console.log('Fetching image from URL:', url);
        const response = await fetch(url, {
          mode: 'cors',
          headers: {
            Accept: 'image/*',
          },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch image: ${response.status} ${response.statusText}`
          );
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.startsWith('image/')) {
          throw new Error('URL does not point to an image');
        }

        const blob = await response.blob();
        console.log('Blob received:', {
          type: blob.type,
          size: blob.size,
          sizeKB: Math.round(blob.size / 1024),
        });

        // Convert blob to base64
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            console.log(
              'Base64 conversion successful, length:',
              event.target.result.length
            );
            resolve(event.target.result);
          };
          reader.onerror = () => {
            reject(new Error('Failed to convert image to base64'));
          };
          reader.readAsDataURL(blob);
        });

        if (!base64 || base64.length < 100) {
          throw new Error('Invalid base64 data received');
        }

        setBase64Image(base64);
        console.log('Base64 set, length:', base64.length);
      } catch (err) {
        console.error('Conversion error:', err);
        setError(`Failed to load image: ${err.message}`);
        setBase64Image('');
        setPreviewError(true);
      } finally {
        setConverting(false);
      }
    };

    if (formData.img.trim() && uploadMethod === 'url') {
      convertUrlToBase64(formData.img);
    }
  }, [formData.img, uploadMethod]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setFormData({ text: formData.text, img: '' });
    setBase64Image('');
    setPreviewError(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Trigger file input click
  const handleSelectFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle form submission - FIXED: removed selectedFile reference
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userInfo) {
      setError('Please login to upload posts');
      return;
    }

    if (!base64Image || base64Image.length < 100) {
      setError('Please select a valid image to upload');
      return;
    }

    if (!formData.text.trim()) {
      setError('Please add a caption');
      return;
    }

    if (converting) {
      setError('Please wait for the image to finish loading');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Submitting post...', {
        textLength: formData.text.length,
        base64Length: base64Image.length,
        base64StartsWith: base64Image.substring(0, 50),
      });

      const response = await axios.post(
        'http://localhost:5000/api/post/create-post',
        {
          text: formData.text,
          img: base64Image,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      console.log('Post created successfully:', response.data);

      // Reset form
      setFormData({
        text: '',
        img: '',
      });
      setBase64Image('');
      setPreviewError(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Redirect to home
      navigate('/home');

      // Show success message
      alert('Post uploaded successfully!');
    } catch (err) {
      console.error('Upload error details:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });

      if (err.response?.data?.message) {
        setError(`Server error: ${err.response.data.message}`);
      } else if (err.response?.status === 413) {
        setError(
          'Image is too large. Please select a smaller image (under 2MB).'
        );
      } else if (err.response?.status === 400) {
        setError('Bad request. Please check your image and caption.');
      } else {
        setError('Failed to upload post. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Character counter
  const charCount = formData.text.length;
  const maxChars = 2200;

  // Test with a known good image
  const testWithSampleImage = async () => {
    try {
      setConverting(true);
      setError('');

      // Use a very small test image
      const testImageUrl =
        'https://images.unsplash.com/photo-1575936123452-b67c3203c357?w=100&h=100&fit=crop&auto=format';

      const response = await fetch(testImageUrl);
      const blob = await response.blob();

      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      setBase64Image(base64);
      setFormData((prev) => ({ ...prev, img: testImageUrl }));
      setUploadMethod('url');
      console.log('Test image loaded, base64 length:', base64.length);
    } catch (err) {
      console.error('Test failed:', err);
      setError('Test failed: ' + err.message);
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
          <p className="text-gray-600 mt-2">
            Share your photos with the community
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Upload Method Selector */}
            <div className="mb-6">
              <div className="flex border-b border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setUploadMethod('url');
                    setFormData({ ...formData, img: '' });
                    setBase64Image('');
                  }}
                  className={`flex-1 py-3 font-medium text-center ${
                    uploadMethod === 'url'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <FiLink className="inline mr-2" />
                  Image URL
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUploadMethod('file');
                    setFormData({ ...formData, img: '' });
                    setBase64Image('');
                    handleSelectFile();
                  }}
                  className={`flex-1 py-3 font-medium text-center ${
                    uploadMethod === 'file'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <FiImage className="inline mr-2" />
                  Upload File
                </button>
              </div>
            </div>

            {/* URL Input (shown when URL method is selected) */}
            {uploadMethod === 'url' && (
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Image URL
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-400">
                    <FiLink />
                  </div>
                  <input
                    type="text"
                    name="img"
                    value={formData.img}
                    onChange={handleChange}
                    placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    disabled={converting}
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500">
                    {converting
                      ? 'Loading image...'
                      : 'Enter a public image URL'}
                  </p>
                  {converting && (
                    <FiLoader className="animate-spin text-blue-500" />
                  )}
                </div>
              </div>
            )}

            {/* File Input (hidden) */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {/* File Upload Message */}
            {uploadMethod === 'file' && !base64Image && (
              <div className="mb-8">
                <div
                  className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-gray-50 transition-all duration-300"
                  onClick={handleSelectFile}
                >
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mb-4">
                      <FiImage className="text-3xl text-blue-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Click to Select Image
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Select an image from your device (Max 2MB)
                    </p>
                    <button
                      type="button"
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Browse Files
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Image Preview */}
            {base64Image && (
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Image Preview
                </label>
                <div className="border-2 border-gray-200 rounded-2xl overflow-hidden relative">
                  <img
                    src={base64Image}
                    alt="Preview"
                    className="w-full h-64 object-contain bg-gray-100"
                    onError={() => setPreviewError(true)}
                  />

                  {previewError ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-500">
                      <FiImage className="text-4xl mb-2" />
                      <p>Unable to load image preview</p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-3 text-xs text-gray-600 border-t">
                      ✓ Image loaded ({Math.round(base64Image.length / 1024)}{' '}
                      KB)
                      {uploadMethod === 'url' && ` from URL`}
                      {uploadMethod === 'file' && ` from file upload`}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <FiX size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Caption Input */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Caption
              </label>
              <div className="relative">
                <textarea
                  name="text"
                  value={formData.text}
                  onChange={handleChange}
                  placeholder="What's on your mind? Add a caption to your photo..."
                  className="w-full h-40 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  maxLength={maxChars}
                  disabled={converting}
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                  {charCount}/{maxChars}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                disabled={converting}
              >
                Cancel
              </button>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={testWithSampleImage}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                  disabled={converting}
                >
                  Test Upload
                </button>

                <button
                  type="submit"
                  disabled={
                    loading ||
                    !base64Image ||
                    !formData.text.trim() ||
                    converting
                  }
                  className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                    loading ||
                    !base64Image ||
                    !formData.text.trim() ||
                    converting
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg'
                  }`}
                >
                  {loading ? (
                    <>
                      <FiLoader className="animate-spin" />
                      Creating Post...
                    </>
                  ) : (
                    <>
                      <FiUpload />
                      Share Post
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Quick URL Examples */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Try these example URLs:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  img: 'https://images.unsplash.com/photo-1575936123452-b67c3203c357?w=100&h=100&fit=crop&auto=format',
                }));
                setUploadMethod('url');
              }}
              className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
              disabled={converting}
            >
              <FiExternalLink className="text-blue-500" />
              <span className="text-sm text-blue-600">
                Small Test Image (100x100)
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&fit=crop',
                }));
                setUploadMethod('url');
              }}
              className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
              disabled={converting}
            >
              <FiExternalLink className="text-blue-500" />
              <span className="text-sm text-blue-600">Mountain (300px)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Uploadpage;
