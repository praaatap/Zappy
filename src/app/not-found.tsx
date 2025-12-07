import Link from 'next/link'
import { FileQuestion, ArrowLeft } from 'lucide-react'
 
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-4">
      <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
        <FileQuestion className="w-12 h-12 text-orange-600" />
      </div>
      
      <h2 className="text-4xl font-extrabold text-slate-900 mb-2">Page Not Found</h2>
      <p className="text-slate-500 mb-8 max-w-md">
        Oops! It seems you've ventured into the unknown. The automation you are looking for doesn't exist.
      </p>
      
      <Link href="/dashboard">
        <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full font-bold hover:bg-slate-800 transition-all shadow-lg hover:-translate-y-1">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
      </Link>
    </div>
  )
}