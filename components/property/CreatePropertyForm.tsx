'use client'
import { CREATE_PROPERTY_API } from '@/api/api'
import { RootState } from '@/redux/store'
import { Building2 } from 'lucide-react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'

interface PropertyFormData {
    property_name: string
    site_url: string
}

const CreatePropertyForm = () => {
    const token = useSelector((state: RootState) => state.auth.token)

    const [formData, setFormData] = useState<PropertyFormData>({
        property_name: '',
        site_url: ''
    })
    const [isLoading, setIsLoading] = useState(false)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const validateForm = (): boolean => {
        if (!formData.property_name.trim()) {
            toast.error('Property name is required')
            return false
        }
        if (!formData.site_url.trim()) {
            toast.error('Site URL is required')
            return false
        }

        // Basic URL validation
        try {
            new URL(formData.site_url)
        } catch (error) {
            console.error('CreatePropertyPage: URL validation failed:', error)
            toast.error('Please enter a valid URL')
            return false
        }

        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        try {
            if (!token) {
                throw new Error('Authentication token not found. Please login again.')
            }

            const response = await fetch(CREATE_PROPERTY_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    property_name: formData.property_name,
                    site_url: formData.site_url
                })
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
            }

            const successData = await response.json()
            toast.success(successData.message)

            // Reset form
            setFormData({
                property_name: '',
                site_url: ''
            })
            // console.log('CreatePropertyPage: Form reset after successful submission')

        } catch (err) {
            if (err instanceof Error) {
                // console.log('CreatePropertyPage: Error message:', err.message)
                // console.log('CreatePropertyPage: Error stack:', err.stack)
            }
            toast.error(err instanceof Error ? err.message : 'An error occurred while creating the property')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full max-w-2xl space-y-6">
            <div className="">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                        <Building2 className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Create Property</h1>
                        <p className="text-gray-600">Add a new property to your portfolio</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Property Information</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="property_name" className="block text-sm font-medium text-gray-700 mb-2">
                            Property Name *
                        </label>
                        <input
                            type="text"
                            id="property_name"
                            name="property_name"
                            value={formData.property_name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Enter property name"
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label htmlFor="site_url" className="block text-sm font-medium text-gray-700 mb-2">
                            Site URL *
                        </label>
                        <input
                            type="url"
                            id="site_url"
                            name="site_url"
                            value={formData.site_url}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="https://example.com"
                            disabled={isLoading}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Enter the full URL including https://
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? 'Creating...' : 'Create Property'}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                // console.log('CreatePropertyPage: Reset button clicked')
                                setFormData({ property_name: '', site_url: '' })
                                // console.log('CreatePropertyPage: Form data reset')
                            }}
                            disabled={isLoading}
                            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Reset
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreatePropertyForm
