'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sparkles, Copy, Loader2 } from 'lucide-react'

export default function AiActions({ projectId, onComplete }: { projectId: string, onComplete?: () => void }) {
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<any[]>([])

  const handleAutoCategorize = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('sb-access-token') || ''
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/ai/categorize/${projectId}`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      )
      if (res.ok) {
        const data = await res.json()
        alert(`AI categorized ${data.processed} images!`)
        onComplete?.()
      }
    } catch (e) {
      alert('AI categorization failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDetectDuplicates = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('sb-access-token') || ''
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/ai/detect-duplicates/${projectId}`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      )
      if (res.ok) {
        const data = await res.json()
        alert(`Found ${data.duplicates.length} duplicate groups!`)
        onComplete?.()
      }
    } catch (e) {
      alert('Duplicate detection failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-purple-700">AI Actions</h4>
      <div className="flex gap-2">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleAutoCategorize}
          disabled={loading}
          className="border-purple-200 text-purple-700 hover:bg-purple-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 mr-1" />}
          Auto-Categorize
        </Button>
        
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleDetectDuplicates}
          disabled={loading}
          className="border-orange-200 text-orange-700 hover:bg-orange-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Copy className="w-4 h-4 mr-1" />}
          Find Duplicates
        </Button>
      </div>
    </div>
  )
}