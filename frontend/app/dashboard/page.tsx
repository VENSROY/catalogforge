'use client'

import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Plus, Folder, LogOut } from 'lucide-react'

type Project = {
  id: string
  name: string
  status: string
  image_count: number
  created_at: string
}

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    // TODO: Fetch projects from API
    setLoading(false)
  }, [user, router])

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Folder className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-bold">CatalogForge</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user.email}</span>
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Your Projects</h2>
          <Button onClick={() => router.push('/dashboard/new')}>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : projects.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Folder className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No projects yet</h3>
              <p className="text-gray-500 mb-4">Create your first catalog project</p>
              <Button onClick={() => router.push('/dashboard/new')}>
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Card key={project.id} className="cursor-pointer hover:shadow-lg transition">
                <CardHeader>
                  <CardTitle>{project.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{project.image_count} images</p>
                  <p className="text-xs text-gray-400 mt-1">{project.status}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}