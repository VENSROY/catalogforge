'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2, Image as ImageIcon } from 'lucide-react'
import Dropzone from '@/components/upload/Dropzone'
import CategorySidebar from '@/components/project/CategorySidebar'
import PdfGenerator from '@/components/project/PdfGenerator'

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
  category_id: string | null
  created_at: string
}

type Category = {
  id: string
  name: string
  sort_order: number
  image_count: number
}

export default function ProjectPage() {
  const { id } = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [images, setImages] = useState<ImageItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const projectId = id as string

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('sb-access-token') || ''
      
      const [projectRes, imagesRes, categoriesRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/projects/${projectId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/projects/${projectId}/images`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories/project/${projectId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])

      if (projectRes.ok) setProject(await projectRes.json())
      if (imagesRes.ok) setImages(await imagesRes.json())
      if (categoriesRes.ok) setCategories(await categoriesRes.json())
    } catch (error) {
      console.error('Failed to fetch:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [projectId])

  const handleMoveImage = async (imageId: string, categoryId: string | null) => {
    try {
      const token = localStorage.getItem('sb-access-token') || ''
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories/move-image`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ image_id: imageId, category_id: categoryId })
        }
      )

      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('Failed to move image:', error)
    }
  }

  const filteredImages = selectedCategory
    ? images.filter(img => img.category_id === selectedCategory)
    : images

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
    <div className="min-h-screen bg-gray-50 flex">
      <CategorySidebar
        projectId={projectId}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onCategoryAdded={fetchData}
        onCategoryDeleted={fetchData}
      />

      <div className="flex-1">
        <header className="bg-white border-b px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">{project.name}</h1>
              <p className="text-sm text-gray-500">{images.length} images • {categories.length} categories</p>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto p-6 space-y-6">
          <Dropzone projectId={projectId} onUploadComplete={fetchData} />

          <div className="bg-white rounded-lg border p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Catalog Settings</h3>
            <PdfGenerator projectId={projectId} onPdfGenerated={fetchData} />
          </div>

          {filteredImages.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {selectedCategory 
                    ? categories.find(c => c.id === selectedCategory)?.name 
                    : 'All Images'}
                  <span className="text-sm font-normal text-gray-400 ml-2">({filteredImages.length})</span>
                </h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredImages.map((image) => (
                  <div key={image.id} className="group relative">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border">
                      <img
                        src={image.original_url}
                        alt={image.filename}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {image.category_id && (
                      <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                        {categories.find(c => c.id === image.category_id)?.name}
                      </span>
                    )}

                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1 rounded-lg">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => handleMoveImage(image.id, cat.id)}
                          className="bg-white text-gray-800 text-xs px-2 py-1 rounded hover:bg-blue-50"
                        >
                          {cat.name}
                        </button>
                      ))}
                      {image.category_id && (
                        <button
                          onClick={() => handleMoveImage(image.id, null)}
                          className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded hover:bg-red-200"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-gray-500 mt-1 truncate">{image.filename}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredImages.length === 0 && images.length > 0 && (
            <div className="text-center py-12">
              <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No images in this category</p>
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
    </div>
  )
}