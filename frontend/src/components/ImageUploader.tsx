'use client'

import { useState, useCallback } from 'react'
import { Upload, X, Image as ImageIcon, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { ensureBucketExists } from '@/lib/bucketUtils'
interface UploadedFile {
  file: File
  preview: string
  uploading: boolean
  uploaded: boolean
  error?: string
  url?: string
  supabaseUrl?: string
  fileName?: string
}

interface ImageUploaderProps {
  onImagesChange: (imageUrls: string[]) => void
  onError?: (error: string) => void
  maxFiles?: number
  acceptedTypes?: string[]
  bucket?: string
  folder?: string
  className?: string
  disabled?: boolean
}

export default function ImageUploader({
  onImagesChange,
  onError,
  maxFiles = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  bucket = 'images',
  folder = 'issues',
  className = '',
  disabled = false
}: ImageUploaderProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)

  const uploadToSupabase = async (file: File): Promise<{ url: string; fileName: string }> => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not properly configured. Please check your environment variables.')
    }

    // Generate unique filename
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 15)
    const extension = file.name.split('.').pop()
    const fileName = `${folder}/${timestamp}_${random}.${extension}`

    // Try to upload directly - let Supabase create bucket if needed
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Supabase upload error:', error)
      
      // Provide helpful error messages
      if (error.message.includes('Bucket not found')) {
        throw new Error(`Storage bucket "${bucket}" doesn't exist. Please create it in Supabase dashboard.`)
      } else if (error.message.includes('row-level security')) {
        throw new Error('Permission denied. Please check your Supabase storage policies.')
      } else {
        throw new Error(`Upload failed: ${error.message}`)
      }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)

    if (!urlData.publicUrl) {
      throw new Error('Failed to get public URL')
    }

    return { url: urlData.publicUrl, fileName }
  }

  const processFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const validFiles = fileArray.filter(file => {
      if (!acceptedTypes.includes(file.type)) {
        console.error(`Invalid file type: ${file.type}`)
        return false
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        console.error(`File too large: ${file.size} bytes`)
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    // Check if we're exceeding max files
    const currentCount = uploadedFiles.filter(f => !f.error).length
    const filesToAdd = validFiles.slice(0, maxFiles - currentCount)

    const newFiles: UploadedFile[] = filesToAdd.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      uploading: false,
      uploaded: false
    }))

    // Update state with new files first
    setUploadedFiles(prev => {
      const updated = [...prev, ...newFiles]
      
      // Start uploading each new file using a separate effect
      Promise.resolve().then(async () => {
        for (let i = 0; i < newFiles.length; i++) {
          const fileIndex = prev.length + i
          const fileToUpload = updated[fileIndex]
          if (fileToUpload) {
            await uploadFileDirectly(fileToUpload, fileIndex)
          }
        }
      })
      
      return updated
    })
  }, [uploadedFiles, maxFiles, acceptedTypes])

  const uploadFileDirectly = async (uploadedFile: UploadedFile, index: number) => {
    setUploadedFiles(prev => prev.map((f, i) => 
      i === index ? { ...f, uploading: true, error: undefined } : f
    ))

    try {
      if (!uploadedFile.file) {
        throw new Error('No file provided')
      }

      const { url, fileName } = await uploadToSupabase(uploadedFile.file)

      setUploadedFiles(prev => {
        const updated = prev.map((f, i) => 
          i === index ? { 
            ...f, 
            uploading: false, 
            uploaded: true, 
            supabaseUrl: url,
            url: url,
            fileName: fileName 
          } : f
        )
        
        // Update parent component with all uploaded URLs
        const allUrls = updated
          .filter(f => f.uploaded && f.url)
          .map(f => f.url!)
        
        onImagesChange(allUrls)
        
        return updated
      })

    } catch (error) {
      console.error('Upload error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      
      setUploadedFiles(prev => prev.map((f, i) => 
        i === index ? { 
          ...f, 
          uploading: false, 
          uploaded: false,
          error: errorMessage
        } : f
      ))

      // Call error callback after state update to avoid React warning
      if (onError) {
        setTimeout(() => onError(errorMessage), 0)
      }
    }
  }

  const uploadFile = async (index: number) => {
    const fileToUpload = uploadedFiles[index]
    if (!fileToUpload) {
      console.error('File not found at index:', index)
      return
    }
    await uploadFileDirectly(fileToUpload, index)
  }

  const removeFile = async (index: number) => {
    const fileToRemove = uploadedFiles[index]
    
    // Delete from Supabase if uploaded
    if (fileToRemove.uploaded && fileToRemove.fileName) {
      try {
        await supabase.storage.from(bucket).remove([fileToRemove.fileName])
      } catch (error) {
        console.error('Error deleting from Supabase:', error)
      }
    }

    // Clean up preview URL
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview)
    }

    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
    
    // Update parent component
    const remainingUrls = uploadedFiles
      .filter((_, i) => i !== index && _.uploaded && _.url)
      .map(f => f.url!)
    
    onImagesChange(remainingUrls)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      processFiles(files)
    }
    e.target.value = '' // Reset input
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    if (files) {
      processFiles(files)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const currentCount = uploadedFiles.filter(f => !f.error).length
  const canAddMore = currentCount < maxFiles

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <Upload size={16} className="inline mr-1" />
        Photos (Optional) - {currentCount}/{maxFiles}
      </label>

      {/* Upload Area */}
      {canAddMore && (
        <div
          className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
            isDragOver
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Drop photos here or click to select
                </span>
                <span className="mt-1 block text-xs text-gray-500">
                  PNG, JPG, WebP up to 10MB each
                </span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  multiple
                  accept={acceptedTypes.join(',')}
                  onChange={handleFileSelect}
                  disabled={disabled}
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Uploaded Files Grid */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {uploadedFiles.map((uploadedFile, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
            >
              {/* Image Preview */}
              <img
                src={uploadedFile.preview}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  disabled={uploadedFile.uploading}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Status Indicators */}
              <div className="absolute top-2 right-2">
                {uploadedFile.uploading && (
                  <div className="p-1 bg-blue-500 text-white rounded-full">
                    <Loader2 size={14} className="animate-spin" />
                  </div>
                )}
                {uploadedFile.uploaded && (
                  <div className="p-1 bg-green-500 text-white rounded-full">
                    <CheckCircle size={14} />
                  </div>
                )}
                {uploadedFile.error && (
                  <div className="p-1 bg-red-500 text-white rounded-full">
                    <AlertCircle size={14} />
                  </div>
                )}
              </div>

              {/* Error Message */}
              {uploadedFile.error && (
                <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white text-xs p-1 truncate">
                  {uploadedFile.error}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {uploadedFiles.length > 0 && (
        <div className="mt-3 text-xs text-gray-500">
          {uploadedFiles.filter(f => f.uploaded).length} uploaded, 
          {uploadedFiles.filter(f => f.uploading).length} uploading, 
          {uploadedFiles.filter(f => f.error).length} failed
        </div>
      )}
    </div>
  )
}