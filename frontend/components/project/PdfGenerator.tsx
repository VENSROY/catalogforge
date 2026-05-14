'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Loader2, FileText, Eye, Trash2 } from 'lucide-react'

type PdfItem = {
  id: string
  name: string
  url: string
  created_at: string
  size_bytes: number
}

export default function PdfGenerator({
  projectId,
  onPdfGenerated
}: {
  projectId: string
  onPdfGenerated?: () => void
}) {
  const [generating, setGenerating] = useState(false)
  const [template, setTemplate] = useState('grid-2')
  const [pdfs, setPdfs] = useState<PdfItem[]>([])

  const fetchPdfs = async () => {
    try {
      const token = localStorage.getItem('sb-access-token') || ''
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/pdf/project/${projectId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      )
      if (response.ok) {
        const data = await response.json()
        setPdfs(data)
      }
    } catch (error) {
      console.error('Failed to fetch PDFs:', error)
    }
  }

  useEffect(() => {
    fetchPdfs()
  }, [projectId])

  const handleGenerate = async () => {
    setGenerating(true)

    try {
      const token = localStorage.getItem('sb-access-token') || ''
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/pdf/project/${projectId}?template=${template}`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'PDF generation failed')
      }

      const data = await response.json()
      alert('PDF generated successfully!')
      fetchPdfs()
      onPdfGenerated?.()
    } catch (error: any) {
      alert('Failed: ' + error.message)
    } finally {
      setGenerating(false)
    }
  }

  const handleDeletePdf = async (pdfId: string) => {
    if (!confirm('Delete this PDF?')) return
    
    try {
      const token = localStorage.getItem('sb-access-token') || ''
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/pdf/${pdfId}`,
        {
          method: 'DELETE',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      
      if (response.ok) {
        fetchPdfs()
      } else {
        const error = await response.json()
        alert('Delete failed: ' + error.detail)
      }
    } catch (error: any) {
      console.error('Failed to delete PDF:', error)
      alert('Delete failed: ' + error.message)
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <select
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          className="text-sm border rounded px-2 py-1"
        >
          <option value="1-up">1 per page</option>
          <option value="grid-2">2 per page</option>
          <option value="grid-4">4 per page</option>
        </select>
        
        <Button onClick={handleGenerate} disabled={generating} size="sm">
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4 mr-2" />
              Generate PDF
            </>
          )}
        </Button>
      </div>

      {pdfs.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Generated Catalogs</h4>
          {pdfs.map((pdf) => (
            <div key={pdf.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">{pdf.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatSize(pdf.size_bytes)} • {new Date(pdf.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <a href={pdf.url} target="_blank" rel="noopener noreferrer">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={pdf.url} download>
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </a>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleDeletePdf(pdf.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}