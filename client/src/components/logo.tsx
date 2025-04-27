import Link from "next/link"
import { Database } from "lucide-react"

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <div className="relative">
        <Database className="h-6 w-6 text-[#02569B]" />
        <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-gradient-to-r from-emerald-400 to-green-500" />
      </div>
      <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-[#02569B] to-[#0288d1] bg-clip-text text-transparent">
        Connect<span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">X</span>
      </span>
    </Link>
  )
}
