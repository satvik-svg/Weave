'use client'

import { useState, useEffect } from 'react'
import { MapPin, Target, Search, AlertTriangle } from 'lucide-react'

interface LocationPickerProps {
  onLocationChange: (location: {
    address: string
    coordinates?: { lat: number; lng: number }
  }) => void
  initialAddress?: string
  initialLocation?: { lat: number; lng: number; address?: string } | null
  placeholder?: string
  className?: string
}

interface LocationState {
  address: string
  coordinates?: { lat: number; lng: number }
  error?: string
  isDetecting: boolean
}

export default function LocationPicker({ 
  onLocationChange, 
  initialAddress = '',
  initialLocation = null,
  placeholder = 'Enter location or detect automatically',
  className = '' 
}: LocationPickerProps) {
  const [location, setLocation] = useState<LocationState>({
    address: initialAddress || initialLocation?.address || '',
    coordinates: initialLocation ? { lat: initialLocation.lat, lng: initialLocation.lng } : undefined,
    isDetecting: false
  })

  // Auto-detect location on component mount
  useEffect(() => {
    // Only auto-detect if no initial address or location is provided
    if (!initialAddress && !initialLocation) {
      detectCurrentLocation()
    }
  }, [initialAddress, initialLocation])

  const detectCurrentLocation = async () => {
    setLocation(prev => ({ ...prev, isDetecting: true, error: undefined }))

    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        isDetecting: false,
        error: 'Geolocation is not supported by this browser'
      }))
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        
        try {
          // Reverse geocode to get address
          const address = await reverseGeocode(latitude, longitude)
          
          const newLocation = {
            address,
            coordinates: { lat: latitude, lng: longitude }
          }
          
          setLocation({
            ...newLocation,
            isDetecting: false
          })
          
          onLocationChange(newLocation)
        } catch (error) {
          console.error('Reverse geocoding failed:', error)
          const newLocation = {
            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
            coordinates: { lat: latitude, lng: longitude }
          }
          
          setLocation({
            ...newLocation,
            isDetecting: false
          })
          
          onLocationChange(newLocation)
        }
      },
      (error) => {
        let errorMessage = 'Unable to detect location'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enter address manually.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable'
            break
          case error.TIMEOUT:
            errorMessage = 'Location detection timed out'
            break
        }
        
        setLocation(prev => ({
          ...prev,
          isDetecting: false,
          error: errorMessage
        }))
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  }

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    // Using OpenStreetMap Nominatim (free, no API key needed)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
    )
    
    if (!response.ok) {
      throw new Error('Geocoding failed')
    }
    
    const data = await response.json()
    return data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
  }

  const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
    if (!address.trim()) return null

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&addressdetails=1`
      )
      
      if (!response.ok) throw new Error('Geocoding failed')
      
      const data = await response.json()
      if (data.length === 0) return null
      
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      }
    } catch (error) {
      console.error('Geocoding error:', error)
      return null
    }
  }

  const handleAddressChange = async (address: string) => {
    const newLocation = { ...location, address, error: undefined }
    setLocation(newLocation)
    
    // Try to geocode the address
    const coordinates = await geocodeAddress(address)
    if (coordinates) {
      newLocation.coordinates = coordinates
      setLocation(newLocation)
    }
    
    onLocationChange({
      address,
      coordinates: coordinates || location.coordinates
    })
  }

  const handleDetectClick = () => {
    detectCurrentLocation()
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-2">
        <MapPin size={16} />
        <span className="text-sm font-medium text-gray-700">Location *</span>
        {location.coordinates && (
          <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
            <Target size={12} className="mr-1" />
            GPS Located
          </div>
        )}
      </div>

      <div className="space-y-3">
        {/* Address Input */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={location.address}
            onChange={(e) => handleAddressChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={placeholder}
          />
        </div>

        {/* GPS Detection Button */}
        <button
          type="button"
          onClick={handleDetectClick}
          disabled={location.isDetecting}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Target size={14} className={location.isDetecting ? 'animate-pulse' : ''} />
          {location.isDetecting ? 'Detecting location...' : 'Use my current location'}
        </button>

        {/* Location Info */}
        {location.coordinates && (
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded border">
            📍 Coordinates: {location.coordinates.lat.toFixed(6)}, {location.coordinates.lng.toFixed(6)}
          </div>
        )}

        {/* Error Display */}
        {location.error && (
          <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
            <AlertTriangle size={14} />
            {location.error}
          </div>
        )}
      </div>
    </div>
  )
}