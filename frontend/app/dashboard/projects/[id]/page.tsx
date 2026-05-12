'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2, Image as ImageIcon } from 'lucide-react'
import Dropzone from '@/components/upload/Dropzone'

type Project = {
  id: string
  name: string
  status: string
  image_count: number
  created_at: string
}

type ImageItem = {
  id: string
  filename: string
  original_url: string
  created_at: string
}

export default function ProjectPage() {
  const { id } = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [images, setImages] = useState<ImageItem[]>([])
  const [loading, setLoading] = useState(true)

  const projectId = id as string

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('sb-access-token') || ''
      
      // Fetch project
      const projectRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/projects/${projectId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      )
      if (projectRes.ok) {
        const data = await projectRes.json()
        setProject(data)
      }

      // Fetch images
      const imagesRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/projects/${projectId}/images`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      )
      if (imagesRes.ok) {
        const data = await imagesRes.json()
        setImages(data)
      }
    } catch (error) {
      console.error('Failed to fetch:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [projectId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Project not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">{project.name}</h1>
            <p className="text-sm text-gray-500">{images.length} images</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        <Dropzone projectId={projectId} onUploadComplete={fetchData} />

        {images.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Uploaded Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {images.map((image) => (
                <div key={image.id} className="group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border">
                    <img
                      src={image.original_url}
                      alt={image.filename}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1 truncate">{image.filename}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {images.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No images yet. Upload some!</p>
          </div>
        )}
      </main>
    </div>
  )
}