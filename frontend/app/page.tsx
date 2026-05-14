import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Upload, Folder, FileText, Sparkles, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Folder className="w-6 h-6 text-blue-600" />
          <span className="text-xl font-bold">CatalogForge</span>
        </div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/login">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">
          Turn Bulk Images into<br />
          <span className="text-blue-600">Professional PDF Catalogs</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Upload thousands of product images. Auto-organize with AI. 
          Generate print-ready catalogs in minutes — not days.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/login">
            <Button size="lg" className="gap-2">
              Start Free <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl border">
            <Upload className="w-10 h-10 text-blue-600 mb-4" />
            <h3 className="text-lg font-bold mb-2">Bulk Upload</h3>
            <p className="text-gray-600">Drag & drop 1000+ images. Folder structure auto-detects categories.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border">
            <Sparkles className="w-10 h-10 text-purple-600 mb-4" />
            <h3 className="text-lg font-bold mb-2">AI Categorization</h3>
            <p className="text-gray-600">CLIP-powered auto-sorting. Detects duplicates. Smart layouts.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border">
            <FileText className="w-10 h-10 text-green-600 mb-4" />
            <h3 className="text-lg font-bold mb-2">PDF Export</h3>
            <p className="text-gray-600">1-up, 2-up, 4-up layouts. Watermarks. Print-ready quality.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to build your catalog?</h2>
        <p className="text-gray-600 mb-8">Free forever for small projects. No credit card.</p>
        <Link href="/login">
          <Button size="lg">Create Free Account</Button>
        </Link>
      </section>
    </div>
  )
}