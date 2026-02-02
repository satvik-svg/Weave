import { supabase } from '@/lib/supabase'

export const ensureBucketExists = async (bucketName: string): Promise<boolean> => {
  try {
    // First check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('Error listing buckets:', listError)
      return false
    }

    const bucketExists = buckets?.some(bucket => bucket.name === bucketName)
    
    if (bucketExists) {
      return true
    }

    // Create bucket if it doesn't exist - with minimal options to avoid RLS issues
    const { data, error: createError } = await supabase.storage.createBucket(bucketName, {
      public: bucketName === 'images' // Only images bucket is public
    })

    if (createError) {
      console.error(`Error creating bucket ${bucketName}:`, createError)
      
      // If RLS error, try alternative approach
      if (createError.message.includes('row-level security')) {
        console.warn('RLS policy blocking bucket creation. Please create buckets manually in Supabase dashboard.')
        return false
      }
      return false
    }

    console.log(`✅ Created storage bucket: ${bucketName}`)
    return true

  } catch (error) {
    console.error('Error ensuring bucket exists:', error)
    return false
  }
}