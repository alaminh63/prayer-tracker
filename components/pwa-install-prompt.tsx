"use client"

import React, { useEffect, useState } from "react"
import { Download, X, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      
      // Show prompt after 10 seconds if not already installed
      const timer = setTimeout(() => {
        const isInstalled = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone
        if (!isInstalled) {
          setShowPrompt(true)
        }
      }, 10000)

      return () => clearTimeout(timer)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      toast.success("App installation started!")
    }
    
    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  if (!showPrompt) return null

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm animate-in fade-in slide-in-from-top-4">
      <div className="bg-zinc-950 border border-primary/30 rounded-3xl p-5 shadow-2xl shadow-primary/20 backdrop-blur-xl flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <Smartphone className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-zinc-100">ইনস্টল করুন (Install App)</h4>
          <p className="text-[11px] text-zinc-400 leading-tight mt-1">
            ভালো ব্যাকগ্রাউন্ড সাপোর্টের জন্য ফোনের হোম স্ক্রিনে অ্যাড করুন।
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Button size="sm" className="h-8 text-[10px] font-bold" onClick={handleInstall}>
            Install
          </Button>
          <Button size="icon" variant="ghost" className="h-6 w-6 rounded-full" onClick={() => setShowPrompt(false)}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}
