// GPS verification utilities for volunteer check-in system

/**
 * Calculate distance between two GPS coordinates using Haversine formula
 * @param lat1 Latitude of point 1
 * @param lng1 Longitude of point 1
 * @param lat2 Latitude of point 2
 * @param lng2 Longitude of point 2
 * @returns Distance in meters
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371e3 // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lng2 - lng1) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c // Distance in meters
}

/**
 * Verify if volunteer is within acceptable range of task location
 * @param volunteerLocation Current GPS location of volunteer
 * @param taskLocation Task's required location
 * @param maxDistanceMeters Maximum allowed distance (default 100m)
 * @returns Object with verification status and distance
 */
export function verifyLocationProximity(
  volunteerLocation: { lat: number; lng: number },
  taskLocation: { lat: number; lng: number },
  maxDistanceMeters: number = 100
): {
  isValid: boolean
  distance: number
  message: string
} {
  const distance = calculateDistance(
    volunteerLocation.lat,
    volunteerLocation.lng,
    taskLocation.lat,
    taskLocation.lng
  )

  const isValid = distance <= maxDistanceMeters

  return {
    isValid,
    distance: Math.round(distance),
    message: isValid
      ? `You are ${Math.round(distance)}m from the task location ✓`
      : `You are ${Math.round(distance)}m away. Please get within ${maxDistanceMeters}m to check in.`
  }
}

/**
 * Get current GPS location from browser
 * @returns Promise with coordinates or error
 */
export function getCurrentLocation(): Promise<{
  lat: number
  lng: number
  accuracy: number
}> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        })
      },
      (error) => {
        let message = 'Unable to get your location'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location permission denied. Please enable location access.'
            break
          case error.POSITION_UNAVAILABLE:
            message = 'Location information unavailable.'
            break
          case error.TIMEOUT:
            message = 'Location request timed out.'
            break
        }
        reject(new Error(message))
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  })
}

/**
 * Format distance for display
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`
  }
  return `${(meters / 1000).toFixed(1)}km`
}

/**
 * Calculate time spent on task
 */
export function calculateTimeSpent(startTime: string, endTime?: string): {
  hours: number
  minutes: number
  formatted: string
} {
  const start = new Date(startTime)
  const end = endTime ? new Date(endTime) : new Date()
  const diffMs = end.getTime() - start.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const hours = Math.floor(diffMins / 60)
  const minutes = diffMins % 60

  return {
    hours,
    minutes,
    formatted: hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }
}
