"use client"

import React, { useState, useEffect, useRef } from "react"
import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import { BookOpen, Search, ChevronRight, Filter, X, ChevronLeft, Share2, Copy, Bookmark, Maximize2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAppSelector } from "@/store/hooks"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

export default function HadithPage() {
  const { books } = useAppSelector((state) => state.hadith)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBook, setSelectedBook] = useState<string | null>(null)
  const [allHadiths, setAllHadiths] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedHadithIndex, setSelectedHadithIndex] = useState<number | null>(null)
  const itemsPerPage = 20
  const readerRef = useRef<HTMLDivElement>(null)

  const filteredBooks = books.filter(book => 
    book.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const fetchBookContent = async (bookId: string) => {
    setLoading(true)
    setSelectedBook(bookId)
    setCurrentPage(1)
    try {
      const res = await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${bookId}.json`)
      const data = await res.json()
      setAllHadiths(data.hadiths)
    } catch (err) {
      console.error("Failed to fetch hadith book", err)
      toast.error("হাদিস লোড করতে সমস্যা হয়েছে")
    } finally {
      setLoading(false)
    }
  }

  const totalPages = Math.ceil(allHadiths.length / itemsPerPage)
  const currentHadiths = allHadiths.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const openReader = (index: number) => {
    setSelectedHadithIndex((currentPage - 1) * itemsPerPage + index)
  }

  const closeReader = () => {
    setSelectedHadithIndex(null)
  }

  const nextHadith = () => {
    if (selectedHadithIndex !== null && selectedHadithIndex < allHadiths.length - 1) {
      setSelectedHadithIndex(selectedHadithIndex + 1)
      // Update page if needed
      const newPage = Math.floor((selectedHadithIndex + 1) / itemsPerPage) + 1
      if (newPage !== currentPage) setCurrentPage(newPage)
    }
  }

  const prevHadith = () => {
    if (selectedHadithIndex !== null && selectedHadithIndex > 0) {
      setSelectedHadithIndex(selectedHadithIndex - 1)
      // Update page if needed
      const newPage = Math.floor((selectedHadithIndex - 1) / itemsPerPage) + 1
      if (newPage !== currentPage) setCurrentPage(newPage)
    }
  }

  const handleShare = (text: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Hadith Share',
        text: text,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(text)
      toast.success("হাদিসটি কপি করা হয়েছে")
    }
  }

  return (
    <AppShell>
      <PageHeader 
        title={<span className="text-gradient">হাদিস এক্সপ্লোরার</span>} 
        subtitle="রাসূলুল্লাহ (সা.) এর পবিত্র সুন্নাহ ও অমূল্য বাণীসমূহ" 
      />

      <div className="px-4 lg:px-8 pb-20">
        {!selectedBook ? (
          <div className="flex flex-col gap-8  mx-auto">
            {/* Search Bar */}
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="হাদিসের কিতাব খুঁজুন..." 
                className="pl-14 bg-zinc-900/40 border-white/5 h-16 rounded-3xl text-lg focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Books Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book) => (
                <motion.div
                  key={book.id}
                  whileHover={{ y: -5 }}
                  onClick={() => fetchBookContent(book.id)}
                >
                  <Card className="group relative overflow-hidden bg-zinc-950/40 border-white/5 p-8 cursor-pointer hover:border-primary/40 transition-all rounded-[2.5rem] shadow-2xl h-full flex flex-col justify-between backdrop-blur-md">
                    <div className="absolute -right-8 -bottom-8 text-primary/5 group-hover:text-primary/10 transition-all duration-500 transform group-hover:rotate-12 group-hover:scale-110">
                      <BookOpen size={180} />
                    </div>
                    
                    <div className="relative z-10">
                      <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 shadow-inner border border-primary/5 transition-transform group-hover:scale-110">
                        <BookOpen size={28} />
                      </div>
                      <h3 className="text-2xl font-black text-zinc-100 mb-2 font-inter">{book.name}</h3>
                      <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em] mb-8">Authentic Collection</p>
                    </div>

                    <div className="relative z-10 mt-auto flex items-center justify-between">
                      <div className="flex items-center text-primary text-sm font-black gap-2 group-hover:gap-4 transition-all uppercase tracking-tighter">
                        কিতাব দেখুন <ChevronRight className="h-5 w-5" />
                      </div>
                      <Badge variant="outline" className="rounded-full px-3 py-1 bg-white/5 border-white/10 text-[10px] text-zinc-400">
                        Verified
                      </Badge>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-8 max-w-5xl mx-auto">
            {/* Sticky Navigation Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-zinc-950/80 border border-white/5 p-6 rounded-[2.5rem] backdrop-blur-2xl sticky top-20 z-40 shadow-2xl">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="rounded-2xl h-12 w-12 hover:bg-primary/10 text-primary transition-all"
                  onClick={() => setSelectedBook(null)}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <div>
                  <h2 className="text-xl font-black text-white leading-tight">{books.find(b => b.id === selectedBook)?.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">পৃষ্ঠা {currentPage} / {totalPages}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 bg-zinc-900/50 p-1.5 rounded-2xl border border-white/5">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage(p => p - 1)
                    window.scrollTo({ top: 0, behavior: 'auto' })
                  }}
                  className="rounded-xl h-10 px-4 hover:bg-white/5 text-xs font-bold"
                >
                  আগের
                </Button>
                <div className="flex gap-1 h-10 items-center px-2">
                   <span className="text-xs font-black text-primary px-3">{currentPage}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage(p => p + 1)
                    window.scrollTo({ top: 0, behavior: 'auto' })
                  }}
                  className="rounded-xl h-10 px-4 hover:bg-white/5 text-xs font-bold"
                >
                  পরের
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-40 gap-6">
                <div className="relative h-20 w-20">
                  <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                  <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(255,107,0,0.3)]" />
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-white mb-1">হাদিস লোড হচ্ছে...</p>
                  <p className="text-sm text-zinc-500 font-medium italic">অনুগ্রহ করে কিছুক্ষণ অপেক্ষা করুন</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPage}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    className="grid grid-cols-1 gap-6"
                  >
                    {currentHadiths.map((hadith, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.01 }}
                        className="group relative p-10 rounded-[3rem] bg-zinc-950/40 border border-white/5 hover:border-primary/30 transition-all shadow-2xl cursor-pointer overflow-hidden backdrop-blur-sm"
                        onClick={() => openReader(index)}
                      >
                        {/* Decorative background element */}
                        <div className="absolute -right-4 -top-4 text-primary/5 h-24 w-24">
                           <Maximize2 size={80} />
                        </div>

                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mb-1">হাদিস নাম্বার</span>
                            <div className="flex items-center gap-3">
                               <div className="h-8 w-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary text-xs font-black">#</div>
                               <span className="text-2xl font-black text-primary font-mono">{hadith.hadithnumber}</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 justify-start md:justify-end">
                            {hadith.grades?.map((g: any, i: number) => (
                              <Badge key={i} variant="outline" className="border-emerald-500/20 bg-emerald-500/10 text-emerald-500 text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter">
                                {g.grade}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="relative">
                          <p className="text-xl leading-[1.8] text-zinc-100 font-medium font-inter line-clamp-4 italic group-hover:text-white transition-colors">
                            "{hadith.text}"
                          </p>
                          <div className="mt-8 flex items-center gap-2 text-primary text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                            বিস্তারিত পড়ুন <ChevronRight size={14} />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* Bottom Pagination */}
                <div className="flex items-center justify-center gap-6 pt-16">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => {
                      setCurrentPage(p => p - 1)
                      window.scrollTo({ top: 0, behavior: 'auto' })
                    }}
                    className="rounded-3xl h-14 px-10 border-white/5 hover:bg-primary/10 hover:text-primary transition-all font-black uppercase tracking-widest text-xs"
                  >
                    আগের পৃষ্ঠা
                  </Button>
                  <Button
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => {
                      setCurrentPage(p => p + 1)
                      window.scrollTo({ top: 0, behavior: 'auto' })
                    }}
                    className="rounded-3xl h-14 px-10 border-white/5 hover:bg-primary/10 hover:text-primary transition-all font-black uppercase tracking-widest text-xs"
                  >
                    পরের পৃষ্ঠা
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* HADITH READER MODE (OVERLAY) */}
      <AnimatePresence>
        {selectedHadithIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 md:p-8"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative bg-zinc-950 border border-white/10 w-full max-w-5xl max-h-[90vh] rounded-[3rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col"
              ref={readerRef}
            >
              {/* Reader Header */}
              <div className="flex items-center justify-between p-6 md:p-8 border-b border-white/5 bg-zinc-900/40">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">{books.find(b => b.id === selectedBook)?.name}</h3>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">হাদিস নাম্বার #{allHadiths[selectedHadithIndex].hadithnumber}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={closeReader}
                  className="h-12 w-12 rounded-2xl hover:bg-white/5 transition-all"
                >
                  <X size={24} />
                </Button>
              </div>

              {/* Reader Body */}
              <div className="flex-1 overflow-y-auto p-8 md:p-16 custom-scrollbar">
                <div className="max-w-3xl mx-auto space-y-12">
                   {/* Arabic text could go here if available */}
                   
                   <div className="space-y-6">
                      <div className="flex items-center gap-4">
                         <div className="h-px flex-1 bg-linear-to-r from-transparent to-primary/20" />
                         <Badge variant="outline" className="text-emerald-500 border-emerald-500/30 uppercase font-black text-xs px-4 py-1.5 rounded-full">
                           Authentic Source
                         </Badge>
                         <div className="h-px flex-1 bg-linear-to-l from-transparent to-primary/20" />
                      </div>
                      
                      <div className="flex flex-wrap gap-2 justify-center mb-10">
                        {allHadiths[selectedHadithIndex].grades?.map((g: any, i: number) => (
                          <div key={i} className="flex flex-col items-center gap-1">
                            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{g.name || "Status"}</span>
                            <span className="text-xs font-black text-emerald-400 bg-emerald-400/10 px-4 py-1.5 rounded-xl border border-emerald-400/20">{g.grade}</span>
                          </div>
                        ))}
                      </div>

                      <p className="text-2xl md:text-3xl leading-[1.8] text-white font-inter text-center font-medium italic">
                        "{allHadiths[selectedHadithIndex].text}"
                      </p>
                   </div>
                </div>
              </div>

              {/* Reader Footer / Navigation */}
              <div className="p-6 md:p-8 border-t border-white/5 bg-zinc-900/40 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="h-12 px-6 rounded-2xl border-white/10 hover:bg-white/5 transition-all text-xs font-bold gap-2"
                    onClick={() => handleShare(allHadiths[selectedHadithIndex].text)}
                  >
                    <Share2 size={16} /> শেয়ার করুন
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 w-12 rounded-2xl border-white/10 hover:bg-white/5 transition-all text-zinc-400"
                    onClick={() => {
                        navigator.clipboard.writeText(allHadiths[selectedHadithIndex].text)
                        toast.success("হাদিস কপি করা হয়েছে")
                    }}
                  >
                    <Copy size={16} />
                  </Button>
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    disabled={selectedHadithIndex === 0}
                    onClick={prevHadith}
                    className="h-14 w-14 rounded-full border-white/10 hover:bg-primary/20 hover:text-primary transition-all p-0"
                  >
                    <ChevronLeft size={24} />
                  </Button>
                  <div className="flex flex-col items-center min-w-[100px]">
                    <span className="text-xl font-black text-primary leading-none">{selectedHadithIndex + 1}</span>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mt-1">KITAB TOTAL: {allHadiths.length}</span>
                  </div>
                  <Button
                    variant="outline"
                    disabled={selectedHadithIndex === allHadiths.length - 1}
                    onClick={nextHadith}
                    className="h-14 w-14 rounded-full border-white/10 hover:bg-primary/20 hover:text-primary transition-all p-0"
                  >
                    <ChevronRight size={24} />
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  )
}
