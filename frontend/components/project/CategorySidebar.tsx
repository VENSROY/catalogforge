'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2, Folder } from 'lucide-react'

type Category = {
  id: string
  name: string
  sort_order: number
  image_count: number
}

export default function CategorySidebar({
  projectId,
  categories,
  selectedCategory,
  onSelectCategory,
  onCategoryAdded,
  onCategoryDeleted
}: {
  projectId: string
  categories: Category[]
  selectedCategory: string | null
  onSelectCategory: (id: string | null) => void
  onCategoryAdded: () => void
  onCategoryDeleted: () => void
}) {
  const [newCategoryName, setNewCategoryName] = useState('')
  const [adding, setAdding] = useState(false)

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return
    setAdding(true)

    try {
      const token = localStorage.getItem('sb-access-token') || ''
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories/project/${projectId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ name: newCategoryName, sort_order: categories.length })
        }
      )

      if (response.ok) {
        setNewCategoryName('')
        onCategoryAdded()
      }
    } catch (error) {
      console.error('Failed to add category:', error)
    } finally {
      setAdding(false)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Delete this category?')) return

    try {
      const token = localStorage.getItem('sb-access-token') || ''
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories/${categoryId}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      )
      onCategoryDeleted()
    } catch (error) {
      console.error('Failed to delete category:', error)
    }
  }

  return (
    <div className="w-64 bg-white border-r h-full p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-700">Categories</h3>
        <span className="text-xs text-gray-400">{categories.length}</span>
      </div>

      <div className="space-y-2">
        <button
          onClick={() => onSelectCategory(null)}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
            selectedCategory === null
              ? 'bg-blue-50 text-blue-700 font-medium'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center gap-2">
            <Folder className="w-4 h-4" />
            <span>All Images</span>
          </div>
        </button>

        {categories.map((category) => (
          <div key={category.id} className="group flex items-center gap-1">
            <button
              onClick={() => onSelectCategory(category.id)}
              className={`flex-1 text-left px-3 py-2 rounded-lg text-sm transition ${
                selectedCategory === category.id
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{category.name}</span>
                <span className="text-xs text-gray-400">{category.image_count || 0}</span>
              </div>
            </button>
            <button
              onClick={() => handleDeleteCategory(category.id)}
              className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 transition"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="New category..."
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
            className="text-sm h-8"
          />
          <Button size="sm" onClick={handleAddCategory} disabled={adding} className="h-8 px-2">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}