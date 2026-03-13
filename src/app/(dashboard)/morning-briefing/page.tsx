"use client";



import { useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import { Mic, Zap, AlertCircle, Play, ArrowRight, CheckCircle2, MessageSquareWarning, Users, LayoutList, Database as DbIcon, CheckSquare, VolumeX } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  useMorningBriefingKpis, 
  useRecentUnresolvedQueries, 
  useKbHealthStats, 
  useClerks, 
  useQueriesFeed 
} from "@/lib/queries";

function HealthScoreRing({ score }: { score: number }) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);
  
  useEffect(() => {
    // Animate on load
    setTimeout(() => {
      setOffset(circumference - (score / 100) * circumference);
    }, 100);
  }, [score, circumference]);

  return (
    <div className="relative flex items-center justify-center">
      <svg className="w-36 h-36 transform -rotate-90">
        <circle cx="72" cy="72" r="50" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100 dark:text-slate-800" />
        <circle 
          cx="72" cy="72" r="50" 
          stroke="currentColor" strokeWidth="8" fill="transparent" 
          strokeDasharray={circumference} 
          strokeDashoffset={offset} 
          className="text-[#3d5a3e] transition-all duration-1000 ease-out" 
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-serif font-bold text-slate-900 dark:text-white">{Math.round(score)}</span>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Score</span>
      </div>
    </div>
  );
}

export default function MorningBriefingPage() {
  const { data: kpis } = useMorningBriefingKpis();
  const { data: recentUnresolved } = useRecentUnresolvedQueries();
  const { data: kbStats } = useKbHealthStats();
  const { data: clerks } = useClerks();
  const { data: allQueries } = useQueriesFeed();

  const [briefing, setBriefing] = useState<{ greeting: string, action: string, audio?: string | null } | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMuted(sessionStorage.getItem("briefingMuted") === "true");
    }
  }, []);

  // Voice playback logic (ElevenLabs)
  const speak = async (audioBase64: string | null | undefined, forcePlay = false) => {
    if (!audioBase64 || typeof window === "undefined") return;
    
    const currentlyMuted = sessionStorage.getItem("briefingMuted") === "true";
    if (currentlyMuted && !forcePlay) return;

    // Stop currently playing audio
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
      } catch (e) { /* ignore */ }
      sourceNodeRef.current = null;
    }

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      console.log("[MorningBriefing] Decoding and playing audio...");
      const audioData = Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0));
      const buffer = await audioContextRef.current.decodeAudioData(audioData.buffer);
      
      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current.destination);
      
      source.onended = () => {
        setIsSpeaking(false);
        console.log("[MorningBriefing] Audio playback ended.");
      };
      
      sourceNodeRef.current = source;
      setIsSpeaking(true);
      source.start(0);
    } catch (err) {
      console.error("[MorningBriefing] Error playing ElevenLabs audio:", err);
      setIsSpeaking(false);
    }
  };

  const handleMute = () => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
      } catch (e) { /* ignore */ }
      sourceNodeRef.current = null;
    }
    
    if (typeof window !== "undefined") {
      sessionStorage.setItem("briefingMuted", "true");
    }
    setIsMuted(true);
    setIsSpeaking(false);
  };

  useEffect(() => {
    if (kpis && !briefing) {
      // Calculate a loading state or directly fetch
      fetch("/api/briefing/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(kpis)
      })
      .then(res => res.json())
      .then(data => {
        if (data.audio) {
          console.log("[MorningBriefing] Audio received from API, length:", data.audio.length);
        } else {
          console.warn("[MorningBriefing] No audio received from API.");
        }

        // Autoplay logic: Check if we've already played today or if we are muted
        const today = new Date().toLocaleDateString();
        // User requested to check briefing_played_date
        const lastPlayed = localStorage.getItem("briefing_played_date");
        const hasPlayedToday = lastPlayed === today;
        const currentlyMuted = sessionStorage.getItem("briefingMuted") === "true";

        console.log("[MorningBriefing] Autoplay check:", { hasPlayedToday, currentlyMuted, hasAudio: !!data.audio });

        if (data.audio && !hasPlayedToday && !currentlyMuted) {
          console.log("[MorningBriefing] Initiating autoplay...");
          speak(data.audio, true);
          localStorage.setItem("briefing_played_date", today);
        } else if (hasPlayedToday) {
          console.log("[MorningBriefing] Autoplay skipped: already played today.");
        } else if (currentlyMuted) {
          console.log("[MorningBriefing] Autoplay skipped: session is muted.");
        }
      })
      .catch(err => console.error("Error generating briefing:", err));
    }
  }, [kpis, briefing]);

  // Calculate Health Score
  let score = 0;
  if (kpis && kbStats) {
    const resolutionRate = kpis.queriesToday > 0 ? (kpis.resolvedToday / kpis.queriesToday) : 1;
    const pt1 = resolutionRate * 40;
    const pt2 = Math.min(kbStats.totalChunks / 100, 1) * 40;
    const pt3 = Math.min(kpis.activeClerks / 5, 1) * 20;
    score = pt1 + pt2 + pt3;
  }

  // Filter today's queries
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todaysQueries = allQueries?.filter(q => new Date(q.asked_at) >= todayStart) || [];

  // Urgency logic
  const oldestUnanswered = recentUnresolved?.[0];

  return (
    <div className="space-y-6 pb-12">
      {/* 1. URGENCY BANNER */}
      {oldestUnanswered && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-800 dark:text-red-300 p-4 rounded-xl flex items-center gap-3 shadow-sm">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-500 shrink-0" />
          <div className="font-medium text-sm sm:text-base">
            <span className="font-bold text-red-900 dark:text-red-400">URGENT:</span> &quot;{oldestUnanswered.question}&quot; — unanswered since {format(new Date(oldestUnanswered.asked_at), "MMM d, HH:mm")}
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-3xl font-serif font-semibold tracking-tight text-slate-900 dark:text-white">Morning Briefing</h2>
        <p className="text-muted-foreground mt-2">
          Your AI-powered daily digest and health overview.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Voice, Actions, Health) */}
        <div className="space-y-6 flex flex-col">
          
          {/* 2. VOICE GREETING */}
          <div className="rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif font-semibold text-lg flex items-center gap-2 dark:text-white">
                <Mic className={`h-5 w-5 ${isSpeaking ? 'text-green-500 animate-pulse' : 'text-slate-400 dark:text-slate-500'}`} />
                Daily Briefing
              </h3>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    if (typeof window !== "undefined") sessionStorage.removeItem("briefingMuted");
                    setIsMuted(false);
                    if (briefing?.audio) speak(briefing.audio, true);
                  }}
                  disabled={!briefing}
                  className="h-8 shadow-sm flex items-center gap-1.5 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                >
                  <Play className="h-3 w-3" />
                  Replay
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleMute}
                  className={`h-8 shadow-sm flex items-center gap-1.5 dark:border-slate-700 ${isMuted ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500' : 'text-slate-600 dark:text-slate-300'}`}
                >
                  <VolumeX className="h-3 w-3" />
                  Mute
                </Button>
              </div>
            </div>
            {briefing ? (
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                {briefing.greeting}
              </p>
            ) : (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full"></div>
                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-5/6"></div>
                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-4/6"></div>
              </div>
            )}
          </div>

          {/* 3. SMART ACTION CARD */}
          <div className="rounded-xl border-2 border-[#d19c3e] dark:border-[#d19c3e]/50 bg-[#fffdf5] dark:bg-[#1a160a] p-6 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#d19c3e] opacity-[0.05] rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
            <h3 className="font-sans font-bold text-[#b6822a] dark:text-[#d19c3e] tracking-widest text-xs uppercase mb-3 flex items-center gap-1.5">
              <Zap className="h-4 w-4" />
              Recommended Action
            </h3>
            {briefing ? (
              <p className="text-slate-800 dark:text-slate-200 font-medium">
                {briefing.action}
              </p>
            ) : (
              <div className="animate-pulse h-5 bg-slate-200/50 dark:bg-slate-800/50 rounded w-3/4"></div>
            )}
          </div>

          {/* 4. HEALTH SCORE RING */}
          <div className="rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm flex flex-col items-center justify-center py-8">
            <h3 className="font-serif font-semibold text-lg mb-6 w-full text-left dark:text-white">System Health</h3>
            <HealthScoreRing score={score} />
            <div className="mt-6 text-sm text-slate-500 dark:text-slate-400 text-center max-w-[200px]">
              Based on query resolution, KB coverage, and active clerks.
            </div>
          </div>

        </div>

        {/* Right Column (KPIs, Tables) */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          
          {/* 5. KPI CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 shadow-sm">
              <div className="flex flex-row items-center justify-between pb-2">
                <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Queries Today</h3>
                <MessageSquareWarning className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              </div>
              <div className="text-2xl font-serif font-semibold text-slate-900 dark:text-white">{kpis?.queriesToday ?? '-'}</div>
            </div>
            <div className="rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 shadow-sm">
              <div className="flex flex-row items-center justify-between pb-2">
                <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Resolved Today</h3>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </div>
              <div className="text-2xl font-serif font-semibold text-green-600 dark:text-green-500">{kpis?.resolvedToday ?? '-'}</div>
            </div>
            <div className="rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 shadow-sm">
              <div className="flex flex-row items-center justify-between pb-2">
                <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Unanswered</h3>
                <AlertCircle className="h-4 w-4 text-amber-500" />
              </div>
              <div className="text-2xl font-serif font-semibold text-amber-600 dark:text-amber-500">{kpis?.unansweredTotal ?? '-'}</div>
            </div>
            <div className="rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 shadow-sm">
              <div className="flex flex-row items-center justify-between pb-2">
                <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Clerks</h3>
                <Users className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              </div>
              <div className="text-2xl font-serif font-semibold text-slate-900 dark:text-white">{kpis?.activeClerks ?? '-'}</div>
            </div>
            <div className="rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 shadow-sm">
              <div className="flex flex-row items-center justify-between pb-2">
                <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pending Activation</h3>
                <CheckSquare className="h-4 w-4 text-[#d19c3e]" />
              </div>
              <div className="text-2xl font-serif font-semibold text-[#d19c3e]">{kpis?.pendingActivations ?? '-'}</div>
            </div>
            <div className="rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 shadow-sm">
              <div className="flex flex-row items-center justify-between pb-2">
                <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">New KB Chunks</h3>
                <DbIcon className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              </div>
              <div className="text-2xl font-serif font-semibold text-slate-900 dark:text-white">{kpis?.newKbChunksToday ?? '-'}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 6. TODAY'S QUERY SUMMARY */}
            <div className="rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm overflow-hidden flex flex-col">
              <div className="p-5 border-b dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
                <h3 className="font-serif font-semibold text-lg flex items-center gap-2 dark:text-white">
                  <LayoutList className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  Today&apos;s Queries
                </h3>
              </div>
              <div className="flex-1 overflow-auto max-h-[300px]">
                <Table>
                  <TableHeader className="bg-white dark:bg-slate-900 sticky top-0 shadow-sm z-10 border-b dark:border-slate-800">
                    <TableRow className="hover:bg-transparent border-b dark:border-slate-800">
                      <TableHead className="dark:text-slate-400">Question</TableHead>
                      <TableHead className="dark:text-slate-400">By</TableHead>
                      <TableHead className="dark:text-slate-400">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {todaysQueries.length > 0 ? todaysQueries.map((q) => (
                      <TableRow key={q.id} className="border-b dark:border-slate-800">
                        <TableCell className="font-medium max-w-[150px] truncate dark:text-slate-200" title={q.question}>
                          {q.question}
                        </TableCell>
                        <TableCell className="text-slate-500 dark:text-slate-400">@{q.asked_by}</TableCell>
                        <TableCell>
                          {q.status === "resolved" ? (
                            <Badge className="bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/40 border-none px-2 py-0">
                              Resolved
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-amber-100 dark:bg-amber-950/30 text-amber-800 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/40 border-none px-2 py-0">
                              Unanswered
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground h-24">
                          No queries today yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* 7. RECENT UNRESOLVED */}
            <div className="rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm overflow-hidden flex flex-col">
              <div className="p-5 border-b dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 flex items-center justify-between">
                <h3 className="font-serif font-semibold text-lg flex items-center gap-2 dark:text-white">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  Needs Attention
                </h3>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="p-0 flex-1">
                  {recentUnresolved && recentUnresolved.length > 0 ? (
                    <ul className="divide-y dark:divide-slate-800">
                      {recentUnresolved.map((q) => (
                        <li key={q.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <div className="flex flex-col gap-1.5">
                            <span className="font-medium text-slate-900 dark:text-slate-200 line-clamp-2">{q.question}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {format(new Date(q.asked_at), "MMM d, HH:mm")} • @{q.asked_by}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="h-full flex items-center justify-center p-8 text-slate-500 dark:text-slate-400 text-sm">
                      All caught up! No unanswered queries.
                    </div>
                  )}
                </div>
                <div className="p-4 border-t dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 mt-auto">
                  <Link href="/query-feed" className="w-full">
                    <Button variant="outline" className="w-full text-[#3d5a3e] dark:text-[#5c8a5e] border-[#3d5a3e]/20 dark:border-[#5c8a5e]/20 hover:bg-[#3d5a3e] dark:hover:bg-[#3d5a3e] hover:text-white transition-colors">
                      Go to Query Feed <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 8. KB HEALTH STATS */}
          <div className="rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm overflow-hidden">
            <div className="p-5 border-b dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
              <h3 className="font-serif font-semibold text-lg flex items-center gap-2 dark:text-white">
                <DbIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                Knowledge Base Health
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x dark:divide-slate-800 p-6">
              <div className="flex flex-col gap-1 p-2">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Chunks</span>
                <span className="text-2xl font-serif font-semibold text-slate-900 dark:text-white">{kbStats?.totalChunks ?? '-'}</span>
              </div>
              <div className="flex flex-col gap-1 p-2 md:px-6">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Chunks Added Today</span>
                <span className="text-2xl font-serif font-semibold text-slate-900 dark:text-white">{kbStats?.chunksAddedToday ?? '-'}</span>
              </div>
              <div className="flex flex-col gap-1 p-2 md:px-6">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Last Ingestion</span>
                <span className="text-2xl font-serif font-semibold text-slate-900 dark:text-white">
                  {kbStats?.mostRecentIngestionDate 
                    ? format(new Date(kbStats.mostRecentIngestionDate), "MMM d, yyyy") 
                    : '-'}
                </span>
              </div>
            </div>
          </div>

          {/* 9. CLERK ACTIVITY TABLE */}
          <div className="rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm overflow-hidden">
             <div className="p-5 border-b dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
              <h3 className="font-serif font-semibold text-lg flex items-center gap-2 dark:text-white">
                <Users className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                Clerk Activity
              </h3>
            </div>
            <div className="overflow-auto max-h-[300px]">
              <Table>
                <TableHeader className="bg-white dark:bg-slate-900 sticky top-0 shadow-sm z-10 border-b dark:border-slate-800">
                  <TableRow className="hover:bg-transparent border-b dark:border-slate-800">
                    <TableHead className="dark:text-slate-400">Name</TableHead>
                    <TableHead className="dark:text-slate-400">Status</TableHead>
                    <TableHead className="dark:text-slate-400">Telegram Access</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clerks && clerks.length > 0 ? clerks.map((c) => (
                    <TableRow key={c.id} className="border-b dark:border-slate-800">
                      <TableCell className="font-medium dark:text-slate-200">{c.full_name}</TableCell>
                      <TableCell className="text-slate-500 dark:text-slate-400">{c.status || 'Pending'}</TableCell>
                      <TableCell>
                        {c.telegram_access ? (
                          <Badge className="bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/40 border-none px-2 py-0">
                            Active
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-100 dark:bg-amber-950/30 text-amber-800 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/40 border-none px-2 py-0">
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground h-24">
                        No clerks found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
