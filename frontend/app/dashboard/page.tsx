'use client'

import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  Plus,
  Folder,
  LogOut,
  Loader2,
  FileText,
  Image
} from 'lucide-react'
import { motion } from 'framer-motion'

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
      router.push('/')
      return
    }

    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('sb-access-token') || ''

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/projects`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        if (response.ok) {
          const data: Project[] = await response.json()
          setProjects(data)
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [user, router])

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
      {/* Header */}
      <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Folder className="w-4 h-4 text-white" />
          </div>

          <h1 className="text-xl font-bold text-white">
            CatalogForge
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-400">
            {user.email}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={signOut}
            className="border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">
              Your Projects
            </h2>

            <p className="text-slate-400">
              Manage and organize your catalog projects
            </p>
          </div>

          <Button
            onClick={() => router.push('/dashboard/new')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 text-center py-16">
              <CardContent>
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Folder className="w-10 h-10 text-slate-500" />
                </div>

                <h3 className="text-xl font-medium text-white mb-2">
                  No projects yet
                </h3>

                <p className="text-slate-400 mb-6">
                  Create your first catalog project to get started
                </p>

                <Button
                  onClick={() => router.push('/dashboard/new')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project: Project, index: number) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all cursor-pointer group"
                  onClick={() =>
                    router.push(
                      `/dashboard/projects/${project.id}`
                    )
                  }
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg text-white group-hover:text-blue-400 transition">
                        {project.name}
                      </CardTitle>

                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          project.status === 'ready'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <div className="flex items-center gap-1">
                        <Image className="w-4 h-4" />
                        {project.image_count || 0} images
                      </div>

                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {project.status === 'ready'
                          ? 'PDF ready'
                          : 'Draft'}
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 mt-3">
                      {new Date(
                        project.created_at
                      ).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}