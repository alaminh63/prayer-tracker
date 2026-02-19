"use client"

import React from "react"
import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import { DeedsTracker } from "@/components/deeds-tracker"
import { Activity, Sparkles, Heart, ShieldCheck, Target, Award } from "lucide-react"

export default function TrackerPage() {
  return (
    <AppShell>
      <PageHeader 
        title={<span className="text-gradient">আমল ও ইবাদত ট্র্যাকার</span>} 
        subtitle="আপনার প্রতিদিনের নেক আমলগুলো সংরক্ষণ করুন এবং ধারাবাহিকতা বজায় রাখুন" 
      />

      <div className="px-4 lg:px-8 pb-20 flex flex-col gap-16 w-full">
        {/* Main Tracker */}
        <section className="w-full">
          <DeedsTracker />
        </section>

        {/* Stats / Info Section */}
        <section className="width-full grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="p-8 rounded-4xl bg-zinc-950/40 border border-white/5 flex flex-col items-center text-center gap-4">
              <div className="h-12 w-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                <Activity size={24} />
              </div>
              <h3 className="text-xl font-black text-white">নিয়মিত ট্র্যাকিং</h3>
              <p className="text-sm text-zinc-500">আপনার প্রতিদিনের আমল এবং নামাজ ট্র্যাক করুন সহজেই।</p>
           </div>
           
           <div className="p-8 rounded-4xl bg-zinc-950/40 border border-white/5 flex flex-col items-center text-center gap-4">
              <div className="h-12 w-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
                <Sparkles size={24} />
              </div>
              <h3 className="text-xl font-black text-white">আধ্যাত্মিক প্রগতি</h3>
              <p className="text-sm text-zinc-500">প্রতিটি আমল আপনার আত্মিক উন্নতির একটি ধাপ।</p>
           </div>

           <div className="p-8 rounded-4xl bg-primary/5 border border-primary/20 flex flex-col items-center text-center gap-4">
              <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Heart size={24} />
              </div>
              <h3 className="text-xl font-black text-white">ইকলাস ও একাগ্রতা</h3>
              <p className="text-sm text-zinc-500">আল্লাহর সন্তুষ্টির জন্য ইখলাসের সাথে আমল বজায় রাখুন।</p>
           </div>

           <div className="p-8 rounded-4xl bg-zinc-950/40 border border-white/5 flex flex-col items-center text-center gap-4">
              <div className="h-12 w-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                <ShieldCheck size={24} />
              </div>
              <h4 className="font-bold text-white">গোপনীয়তা</h4>
              <p className="text-xs text-zinc-500">আপনার সমস্ত ডাটা সুরক্ষিত এবং ব্যক্তিগতভাবে সংরক্ষিত থাকে।</p>
           </div>

           <div className="p-8 rounded-4xl bg-zinc-950/40 border border-white/5 flex flex-col items-center text-center gap-4">
              <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Target size={24} />
              </div>
              <h4 className="font-bold text-white">লক্ষ্য নির্ধারণ</h4>
              <p className="text-xs text-zinc-500">প্রতিদিন শতভাগ সম্পন্ন করার লক্ষ্য রাখুন এবং নিজের ইবাদতকে শানিত করুন।</p>
           </div>

           <div className="p-8 rounded-4xl bg-zinc-950/40 border border-white/5 flex flex-col items-center text-center gap-4">
              <div className="h-12 w-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
                <Award size={24} />
              </div>
              <h4 className="font-bold text-white">ধারাবাহিকতা</h4>
              <p className="text-xs text-zinc-500">"আল্লাহর কাছে সবচেয়ে প্রিয় আমল তা-ই, যা বিরতিহীনভাবে করা হয়।"</p>
           </div>
        </section>
      </div>
    </AppShell>
  )
}
