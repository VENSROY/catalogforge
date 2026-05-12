'use client'

import { useParams } from 'next/navigation'
import Dropzone from '@/components/upload/Dropzone'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ProjectPage() {
  const { id } = useParams()
  const router = useRouter()
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-bold">Project: {id}</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <Dropzone projectId={id as string} />
      </main>
    </div>
  )
}