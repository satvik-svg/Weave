import { supabase } from './supabase'

export interface UploadResult {
  url: string
  fileName: string
  error?: string
}

export interface UploadOptions {
  bucket?: string
  folder?: string
  maxSizeBytes?: number
  allowedTypes?: string[]
}

const DEFAULT_OPTIONS: Required<UploadOptions> = {
  bucket: 'images',
  folder: 'uploads',
  maxSizeBytes: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
}

/**
 * Upload a single file to Supabase Storage
 */
export async function uploadFile(
  file: File, 
  options: UploadOptions = {}
): Promise<UploadResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options }

  try {
    // Validate file
    if (file.size > opts.maxSizeBytes) {
      throw new Error(`File size too large. Maximum size is ${Math.round(opts.maxSizeBytes / 1024 / 1024)}MB`)
    }

    if (!opts.allowedTypes.includes(file.type)) {
      throw new Error(`File type not allowed. Allowed types: ${opts.allowedTypes.join(', ')}`)
    }

    // Generate unique filename
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 15)
    const extension = file.name.split('.').pop()
    const fileName = `${opts.folder}/${timestamp}_${random}.${extension}`

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from(opts.bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Supabase upload error:', error)
      throw new Error(`Upload failed: ${error.message}`)
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(opts.bucket)
      .getPublicUrl(fileName)

    if (!urlData.publicUrl) {
      throw new Error('Failed to get public URL')
    }

    return {
      url: urlData.publicUrl,
      fileName
    }

  } catch (error) {
    return {
      url: '',
      fileName: '',
      error: error instanceof Error ? error.message : 'Upload failed'
    }
  }
}

/**
 * Upload multiple files to Supabase Storage
 */
export async function uploadFiles(
  files: File[], 
  options: UploadOptions = {}
): Promise<UploadResult[]> {
  return Promise.all(files.map(file => uploadFile(file, options)))
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFile(
  fileName: string, 
  bucket: string = DEFAULT_OPTIONS.bucket
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName])

    if (error) {
      console.error('Supabase delete error:', error)
      return { success: false, error: error.message }
    }

    return { success: true }

  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Delete failed' 
    }
  }
}

/**
 * Get public URL for a file
 */
export function getPublicUrl(
  fileName: string, 
  bucket: string = DEFAULT_OPTIONS.bucket
): string {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName)

  return data.publicUrl || ''
}

/**
 * List files in a folder
 */
export async function listFiles(
  folder: string = '', 
  bucket: string = DEFAULT_OPTIONS.bucket
) {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      })

    if (error) {
      console.error('Supabase list error:', error)
      return { files: [], error: error.message }
    }

    return { files: data || [], error: null }

  } catch (error) {
    return { 
      files: [], 
      error: error instanceof Error ? error.message : 'List failed' 
    }
  }
}

/**
 * Create storage buckets if they don't exist (for setup)
 */
export async function ensureBucket(bucketName: string) {
  try {
    const { data: buckets } = await supabase.storage.listBuckets()
    
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName)
    
    if (!bucketExists) {
      const { data, error } = await supabase.storage.createBucket(bucketName, {
        public: true,
        allowedMimeTypes: DEFAULT_OPTIONS.allowedTypes,
        fileSizeLimit: DEFAULT_OPTIONS.maxSizeBytes
      })

      if (error) {
        console.error('Bucket creation error:', error)
        return { success: false, error: error.message }
      }

      console.log('Created bucket:', bucketName)
      return { success: true }
    }

    return { success: true }

  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Bucket creation failed' 
    }
  }
}