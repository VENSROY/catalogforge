'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

type PreviewFile = {
  file: File
  preview: string
  id: string
}

export default function Dropzone({ projectId }: { projectId: string }) {
  const [files, setFiles] = useState<PreviewFile[]>([])
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substring(7)
    }))
    setFiles(prev => [...prev, ...newFiles])
  }, [])

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true
  })

  const handleUpload = async () => {
    if (files.length === 0) return
    setUploading(true)
    
    const formData = new FormData()
    files.forEach(f => formData.append('files', f.file))
    formData.append('project_id', projectId)

    try {
      // TODO: Replace with actual API call
      console.log('Uploading', files.length, 'files')
      await new Promise(resolve => setTimeout(resolve, 2000)) // Mock delay
      alert('Upload complete!')
      setFiles([])
    } catch (error) {
      alert('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-700">
          {isDragActive ? 'Drop images here...' : 'Drag & drop images here'}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          or click to select files (JPG, PNG, WebP)
        </p>
        <p className="text-xs text-gray-400 mt-1">Supports bulk upload</p>
      </div>

      {/* Preview Grid */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{files.length} files selected</p>
            <Button variant="outline" size="sm" onClick={() => setFiles([])}>
              Clear All
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {files.map((file) => (
              <div key={file.id} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border">
                  <img
                    src={file.preview}
                    alt={file.file.name}
                    className="w-full h-full object-cover"
                    onLoad={() => URL.revokeObjectURL(file.preview)}
                  />
                </div>
                <button
                  onClick={() => removeFile(file.id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                >
                  <X className="w-3 h-3" />
                </button>
                <p className="text-xs text-gray-500 mt-1 truncate">{file.file.name}</p>
              </div>
            ))}
          </div>

          <Button 
            onClick={handleUpload} 
            disabled={uploading}
            className="w-full"
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            {uploading ? 'Uploading...' : `Upload ${files.length} Images`}
          </Button>
        </div>
      )}
    </div>
  )
}