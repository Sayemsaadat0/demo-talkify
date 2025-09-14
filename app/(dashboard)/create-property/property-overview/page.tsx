'use client'
import { Suspense, useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useGetPropertyDetails } from '@/hooks/useGetPropertyDetails';
import { Building2, ArrowLeft, Save, Upload, X, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
// import Image from 'next/image';
import { GET_PROPERTY_DETAILS_API } from '@/api/api';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Image from 'next/image';
import { useGetPropertyList } from '@/hooks/useGetPropertyList';
import { setIsRefetchPropertyList, setUpdateProperty } from '@/redux/features/dashboardPropertySlice';
// import { useSelector } from 'react-redux';
// import { RootState } from '@/redux/store';
// import { UPDATE_PROPERTY_API } from '@/api/api';

interface PropertyFormData {
  property_name: string;
  site_url: string;
  region: string;
  // driver: string;
  status: number | null;
  visitor_ip_tracking: number;
  image: File | null;
}

const PropertyOverview = () => {
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL;

  const searchParams = useSearchParams();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const propertyId = searchParams.get('propertyId');
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch();

  if (!propertyId) throw new Error("No propertyId found");
  const { refetch } = useGetPropertyList();


  const { data: property, loading } = useGetPropertyDetails({ propertyId: propertyId ? propertyId : undefined });
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<PropertyFormData>({
    property_name: '',
    site_url: '',
    region: '',
    // driver: '',
    status: null,
    visitor_ip_tracking: 1,
    image: null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Create the full URL for existing images from API
  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return null;
    // If it's already a full URL or data URL, return as-is
    if (/^(https?:\/\/|data:)/i.test(imagePath)) return imagePath;
    return `${API_BASE_URL}/assets/upload/${imagePath}`; // For existing images, prepend base URL
  };


  // Update form data when property data is loaded
  useEffect(() => {
    if (property) {
      setFormData({
        property_name: property.property_name || '',
        site_url: property.site_url || '',
        region: property.region || '',
        // driver: property.driver || '',
        status: property.status ?? 1,
        visitor_ip_tracking: property.visitor_ip_tracking ?? 1,
        image: null,
      });
      // Set image preview only if property has a valid image string
      if (
        property.image &&
        typeof property.image === 'string' &&
        property.image.trim() !== '' &&
        property.image.toLowerCase() !== 'null'
      ) {
        setImagePreview(property.image);
      } else {
        setImagePreview(null);
      }
    }
  }, [property]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = (): boolean => {
    if (!formData.property_name.trim()) {
      toast.error('Property name is required');
      return false;
    }

    // Only validate site_url if it's not empty
    if (formData.site_url.trim()) {
      // Basic URL validation
      try {
        new URL(formData.site_url);
      } catch {
        toast.error('Please enter a valid URL');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {


      const submittedData = new FormData();


      // Append text fields
      submittedData.append('property_name', formData.property_name);
      submittedData.append('site_url', formData.site_url);
      submittedData.append('region', formData.region || '');

      // Numbers are always strings in FormData → backend must parse them
      submittedData.append('status', formData.status !== null && formData.status !== undefined ? String(formData.status) : '');
      submittedData.append('visitor_ip_tracking', String(formData.visitor_ip_tracking));

      // Append image
      if (formData.image) {
        submittedData.append('image', formData.image);
      }

      // Send the FormData to the API
      // return console.log(Object.fromEntries(submittedData.entries()));
      const response = await fetch(`${GET_PROPERTY_DETAILS_API}${propertyId}`, {
        method: 'POST',
        body: submittedData,
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });



      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.status) {
        // console.log(result)
        toast.success('Property updated successfully!');
        dispatch(setUpdateProperty(result.data.property));
        dispatch(setIsRefetchPropertyList())
        refetch();

      } else {
        toast.error(result.message);
      }

    } catch (err) {
      console.error('Error updating property:', err);
      toast.error('An error occurred while updating the property');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center text-gray-600">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-lg font-medium">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 max-w-md mx-auto text-center">
          <div className="p-4 bg-red-100 rounded-full">
            <Building2 className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Property Not Found</h2>
          <p className="text-gray-600">
            {` The property you're looking for doesn't exist or you don't have permission to view it.`}
          </p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.back()}
              className="p-3 hover:bg-white/80 rounded-xl transition-all duration-200 shadow-sm"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                <Building2 className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Property Overview</h1>
                <p className="text-gray-600">Edit your property information and settings</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Upload Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-indigo-600" />
                Property Image
              </h3>

              <div className="space-y-4">
                {/* Image Preview */}
                {imagePreview && getImageUrl(imagePreview) && (
                  <div className="relative">
                    <Image
                      width={400}
                      height={400}
                      src={getImageUrl(imagePreview) as string}
                      alt="Property preview"
                      className="w-full h-48 object-cover rounded-xl shadow-md"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* Upload Area */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${imagePreview
                    ? 'border-gray-300 bg-gray-50'
                    : 'border-indigo-300 bg-indigo-50 hover:border-indigo-400 hover:bg-indigo-100'
                    }`}
                >
                  <Upload className={`h-8 w-8 mx-auto mb-2 ${imagePreview ? 'text-gray-400' : 'text-indigo-500'
                    }`} />
                  <p className={`text-sm font-medium ${imagePreview ? 'text-gray-500' : 'text-indigo-600'
                    }`}>
                    {imagePreview ? 'Click to change image' : 'Click to upload image'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG up to 5MB
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Property Information</h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="property_name" className="block text-sm font-semibold text-gray-700">
                      Property Name *
                    </label>
                    <input
                      type="text"
                      id="property_name"
                      name="property_name"
                      value={formData.property_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      placeholder="Enter property name"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="region" className="block text-sm font-semibold text-gray-700">
                      Region
                    </label>
                    <input
                      type="text"
                      id="region"
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      placeholder="e.g., North America, Europe"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="status" className="block text-sm font-semibold text-gray-700">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status ?? ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      disabled={isLoading}
                    >
                      <option value={1}>🟢 Active</option>
                      <option value={0}>🔴 Inactive</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="visitor_ip_tracking" className="block text-sm font-semibold text-gray-700">
                      IP Tracking
                    </label>
                    <select
                      id="visitor_ip_tracking"
                      name="visitor_ip_tracking"
                      value={formData.visitor_ip_tracking}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      disabled={isLoading}
                    >
                      <option value={1}>✅ Enabled</option>
                      <option value={0}>❌ Disabled</option>
                    </select>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <Save className="h-5 w-5" />
                    {isLoading ? 'Updating Property...' : 'Update Property'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Page = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <PropertyOverview />
  </Suspense>
);

export default Page;