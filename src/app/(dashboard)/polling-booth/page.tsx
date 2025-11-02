"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowDown, ArrowUp } from "lucide-react";
import { ElementInternals } from "@/components/etheral-shadow";

type PollOption = {
  id: string;
  text: string;
  members?: string;
  teamName?: string;
  tagline?: string;
  votes?: number;
  percent?: number;
};

type ActivePoll = {
  id: string;
  question: string;
  options: PollOption[];
};

type PollResults = {
  options: Required<PollOption>[];
  totalVotes: number;
};

function getFingerprint() {
  try {
    const key = "bob.fp";
    let fp = localStorage.getItem(key);
    if (!fp) {
      fp = crypto.randomUUID();
      localStorage.setItem(key, fp);
    }
    return fp;
  } catch {
    return "anon";
  }
}

export default function PollingBoothPage() {
  const [poll, setPoll] = useState<ActivePoll | null>(null);
  const [results, setResults] = useState<PollResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [votedOption, setVotedOption] = useState<string | null>(null);
  const prevRanksRef = useRef<Record<string, number>>({});
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const votedKey = useMemo(
    () => (poll ? `bob.poll.voted:${poll.id}` : null),
    [poll]
  );

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/polls/active");
        const ct = res.headers.get("content-type") || "";
        if (!res.ok || !ct.includes("application/json")) {
          setPoll(null);
          setResults(null);
          setLoadError(
            "No active poll or server error. You can seed a demo poll."
          );
          return;
        }
        const data = await res.json();
        if (data && data.id) {
          setPoll({
            id: data.id,
            question: data.question,
            options: data.options,
          });
          setLoadError(null);
        } else {
          setPoll(null);
          setResults(null);
          setLoadError("No active poll for today. You can seed a demo poll.");
        }
      } catch (e) {
        console.error(e);
        setLoadError("Failed to load poll. You can seed a demo poll.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Load vote from localStorage
  useEffect(() => {
    if (!votedKey) return;
    try {
      const saved = localStorage.getItem(votedKey);
      if (saved) setVotedOption(saved);
    } catch {}
  }, [votedKey]);

  // Poll results
  useEffect(() => {
    if (!poll) return;
    let stop = false;
    const tick = async () => {
      try {
        const res = await fetch(`/api/polls/${poll.id}/results`);
        const ct = res.headers.get("content-type") || "";
        if (!res.ok || !ct.includes("application/json")) return;
        const data: PollResults = await res.json();
        if (!stop && data && Array.isArray(data.options)) {
          // compute ranks and keep previous
          const sorted = [...data.options].sort(
            (a, b) => (b.votes ?? 0) - (a.votes ?? 0)
          );
          const ranks: Record<string, number> = {};
          sorted.forEach((o, idx) => (ranks[o.id] = idx + 1));
          prevRanksRef.current = prevRanksRef.current || {};
          setResults(data);
          // Store latest ranks for next comparison
          prevRanksRef.current = ranks;
        }
      } catch (e) {
        // ignore
      }
    };
    tick();
    const id = setInterval(tick, 10000);
    return () => {
      stop = true;
      clearInterval(id);
    };
  }, [poll]);

  const handleVote = async (optionId: string) => {
    if (!poll) return;
    if (votedOption) {
      toast("You have already voted today.");
      return;
    }
    setSubmitting(true);
    try {
      const fp = getFingerprint();
      const res = await fetch(`/api/polls/${poll.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId, fingerprint: fp }),
      });
      if (res.ok) {
        setVotedOption(optionId);
        if (votedKey) localStorage.setItem(votedKey, optionId);
        toast.success("Your vote has been recorded! ✅");
        // Refresh results soon after vote
        setTimeout(async () => {
          try {
            const r = await fetch(`/api/polls/${poll.id}/results`);
            const d = await r.json();
            setResults(d);
          } catch {}
        }, 500);
      } else {
        const err = await res.json().catch(() => ({}));
        if (err?.error?.code === "ALREADY_VOTED") {
          toast("You have already voted today.");
          if (votedKey && !votedOption)
            localStorage.setItem(votedKey, optionId);
        } else {
          toast.error("Failed to submit vote. Please try again.");
        }
      }
    } catch (e) {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const ranked = useMemo(() => {
    if (!results) return [] as Required<PollOption>[];
    return [...results.options].sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0));
  }, [results]);

  const trendFor = (optionId: string, currentRank: number) => {
    const prev = prevRanksRef.current[optionId];
    if (!prev) return null;
    if (currentRank < prev) return "up" as const;
    if (currentRank > prev) return "down" as const;
    return "same" as const;
  };

  const teamImages = [
    "https://res.cloudinary.com/dum6rd3ye/image/upload/v1762015364/WhatsApp_Image_2025-11-01_at_15.57.59_g2rsqt.jpg",
    "https://res.cloudinary.com/dum6rd3ye/image/upload/v1762017937/WhatsApp_Image_2025-11-01_at_15.57.59_fn3yga.jpg",
    "https://res.cloudinary.com/dum6rd3ye/image/upload/v1762017892/WhatsApp_Image_2025-11-01_at_15.58.07_ly4lyx.jpg",
    "https://res.cloudinary.com/dum6rd3ye/image/upload/v1762017938/WhatsApp_Image_2025-11-01_at_15.58.01_grdz5q.jpg",
    "https://res.cloudinary.com/dum6rd3ye/image/upload/v1762017939/WhatsApp_Image_2025-11-01_at_15.58.00_k021kf.jpg",
    "https://res.cloudinary.com/dum6rd3ye/image/upload/v1762017939/WhatsApp_Image_2025-11-01_at_15.58.00_1_kyzmfu.jpg",
    "https://res.cloudinary.com/dum6rd3ye/image/upload/v1762017940/WhatsApp_Image_2025-11-01_at_15.57.58_1_ckrhxo.jpg",
    "https://res.cloudinary.com/dum6rd3ye/image/upload/v1762017940/WhatsApp_Image_2025-11-01_at_15.57.58_ujryh1.jpg",
    "https://res.cloudinary.com/dum6rd3ye/image/upload/v1762017940/WhatsApp_Image_2025-11-01_at_15.57.57_ixvqm4.jpg",
  ];

  return (
    <div className="w-full min-h-[80vh] flex items-start justify-center py-10">
      {submitting && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 rounded-lg bg-white dark:bg-neutral-900 p-6 shadow-lg">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-transparent" />
            <div className="text-sm font-medium">Processing your vote…</div>
          </div>
        </div>
      )}
      <div className="w-full max-w-3xl px-4">
        <Card>
          <CardHeader>
            <CardTitle className=" text-2xl">Polling Booth</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading && <div className=" animate-pulse">Loading poll…</div>}
            {!loading && !poll && (
              <div className="space-y-3">
                <div>
                  {loadError ??
                    "No active poll. Be the first to vote when it opens!"}
                </div>
                <Button
                  variant="outline"
                  onClick={async () => {
                    try {
                      const res = await fetch("/api/polls/seed", {
                        method: "POST",
                      });
                      const ct = res.headers.get("content-type") || "";
                      if (!res.ok || !ct.includes("application/json")) {
                        toast.error("Failed to seed poll.");
                        return;
                      }
                      const data = await res.json();
                      if (data?.created) {
                        toast.success("Demo poll created. Loading…");
                        // reload active poll
                        const a = await fetch("/api/polls/active");
                        const act = await a.json();
                        if (act && act.id) {
                          setPoll({
                            id: act.id,
                            question: act.question,
                            options: act.options,
                          });
                          setLoadError(null);
                        }
                      } else {
                        toast.error("Seed did not create a poll.");
                      }
                    } catch {
                      toast.error("Failed to seed poll.");
                    }
                  }}
                >
                  Seed today's demo poll
                </Button>
              </div>
            )}

            {poll && !votedOption && (
              <div className="space-y-4">
                <div className="text-xl font-semibold">{poll.question}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {poll.options.map((opt, idx) => (
                    <Card key={opt.id}>
                      <CardHeader>
                        <img
                          className="h-20 w-20 rounded-full object-cover"
                          src={teamImages[idx % teamImages.length]}
                          alt={opt.teamName ?? opt.text}
                        />
                        <CardTitle className="text-base">
                          {opt.teamName ?? opt.text}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {opt.members && (
                          <div className="text-sm">{opt.members}</div>
                        )}
                        {opt.tagline && (
                          <div className="text-sm text-muted-foreground">
                            “{opt.tagline}”
                          </div>
                        )}
                        <div className="pt-2">
                          <Button
                            className="w-full"
                            disabled={submitting}
                            onClick={() => handleVote(opt.id)}
                          >
                            Vote for {opt.teamName ?? opt.text}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Leaderboard */}
            {votedOption && results && (
              <div className="mt-8">
                <div className="text-lg font-semibold mb-2">Leaderboard</div>
                <div className="space-y-2">
                  {ranked.map((o, idx) => {
                    const rank = idx + 1;
                    const trend = trendFor(o.id, rank);
                    return (
                      <div
                        key={o.id}
                        className="flex items-center justify-between border rounded-md p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 text-center font-semibold">
                            {rank}
                          </div>
                          <div className="font-medium">
                            {o.teamName ?? o.text}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-sm text-muted-foreground">
                            {o.votes ?? 0} votes · {o.percent ?? 0}%
                          </div>
                          {trend === "up" && (
                            <ArrowUp className="text-green-600" size={18} />
                          )}
                          {trend === "down" && (
                            <ArrowDown className="text-red-600" size={18} />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
