'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Folder, Zap, Shield, Globe, ArrowRight, Upload, FileText, Sparkles, Check } from 'lucide-react'

export default function HomePage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isSignUp) {
        await signUp(email, password)
        await signIn(email, password)
      } else {
        await signIn(email, password)
      }
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const features = [
    { icon: Upload, title: 'Bulk Upload', desc: 'Drag & drop 1000+ images instantly', color: 'text-blue-400' },
    { icon: Sparkles, title: 'AI Categorization', desc: 'Auto-sort with smart suggestions', color: 'text-purple-400' },
    { icon: FileText, title: 'PDF Export', desc: 'Print-ready catalogs in one click', color: 'text-green-400' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 border-b border-white/10 bg-white/5 backdrop-blur-xl px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Folder className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold">CatalogForge</span>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" className="text-slate-300 hover:text-white" onClick={() => setIsSignUp(false)}>
              Sign In
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" onClick={() => setIsSignUp(true)}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-6">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-300">Beta Now Live</span>
          </div>
          
          <h1 className="text-6xl font-bold mb-6 leading-tight">
            Turn Bulk Images into<br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Professional Catalogs
            </span>
          </h1>
          
          <p className="text-xl text-slate-400 mb-8 max-w-lg">
            Upload thousands of product images. Auto-organize with AI. Generate print-ready PDF catalogs in minutes — not days.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2 text-lg px-8" onClick={() => setIsSignUp(true)}>
              Start Free <ArrowRight className="w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 text-lg px-8">
              View Demo
            </Button>
          </div>

          <div className="flex items-center gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> No credit card</span>
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Free forever</span>
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Unlimited catalogs</span>
          </div>
        </motion.div>

        {/* Login Card */}
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-white">
                {isSignUp ? 'Create Free Account' : 'Welcome Back'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm text-slate-300 mb-1 block">Email</label>
                  <Input type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-1 block">Password</label>
                  <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-blue-500" />
                </div>
                {error && <p className="text-red-400 text-sm bg-red-500/10 p-2 rounded border border-red-500/20">{error}</p>}
                <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3" disabled={loading}>
                  {loading ? (isSignUp ? 'Creating...' : 'Signing in...') : (isSignUp ? 'Create Account' : 'Sign In')}
                </Button>
              </form>
              <p className="text-center mt-4 text-sm text-slate-400">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button onClick={() => { setIsSignUp(!isSignUp); setError('') }} className="text-blue-400 hover:text-blue-300 font-medium transition">
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 bg-white/5 border-y border-white/10 py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:border-blue-500/30 transition">
                <f.icon className={`w-12 h-12 ${f.color} mb-4`} />
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-slate-400">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-20 text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to build your catalog?</h2>
        <p className="text-slate-400 mb-8 text-lg">Join hundreds of businesses saving hours every week.</p>
        <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8" onClick={() => setIsSignUp(true)}>
          Create Free Account
        </Button>
      </section>
    </div>
  )
}