"use client";
import React, { Suspense, useEffect, useRef, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { studentsData } from "@/data/students";
import { useSearchParams } from "next/navigation";
import { AuctionTimer } from "@/components/ui/skiper-ui/skiper37";

const PageInner = () => {
  const [highestBid, setHighestBid] = useState(0);
  const searchParams = useSearchParams();
  const [userName, setUserName] = useState("");
  const [bidHistory, setBidHistory] = useState<
    { name: string; amount: number }[]
  >([]);
  const [currentStudent, setCurrentStudent] = useState(studentsData[0]);
  const [timeLeft, setTimeLeft] = useState(10); // Server-driven
  const [purchases, setPurchases] = useState<
    { student: any; amount: number }[]
  >([]);
  const prevStudentIdRef = useRef<string | number | undefined>(
    studentsData[0]?.roll_no
  );

  // Initialize username from query/localStorage
  useEffect(() => {
    const fromQuery = searchParams.get("user") ?? "";
    if (fromQuery) {
      setUserName(fromQuery);
      try {
        localStorage.setItem("bob.user", fromQuery);
      } catch {}
      return;
    }
    try {
      const stored = localStorage.getItem("bob.user");
      if (stored) setUserName(stored);
    } catch {}
  }, [searchParams]);

  // Place bid (server enforces +50 over current highest)
  const handlePlaceBid = async () => {
    if (!userName) {
      alert("Please enter your name before bidding!");
      return;
    }
    const res = await fetch("/api/bid", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: userName }),
    });

    const data = await res.json();
    if (data.success) {
      // If server switched to a new student (sold), reset price and history
      if (
        data.currentStudent &&
        data.currentStudent.roll_no !== prevStudentIdRef.current
      ) {
        setBidHistory([]);
        setHighestBid(0);
        prevStudentIdRef.current = data.currentStudent.roll_no;
      } else {
        // trust server-authoritative highestBid
        if (typeof data.highestBid === "number") setHighestBid(data.highestBid);
      }
      setBidHistory(Array.isArray(data.bids) ? data.bids : []);
      if (typeof data.timer === "number") setTimeLeft(data.timer);
      if (data.currentStudent) setCurrentStudent(data.currentStudent);
    }
  };

  // Poll bids and timer every 1 sec; include user to get purchases
  useEffect(() => {
    const fetchBids = async () => {
      const q = userName ? `?user=${encodeURIComponent(userName)}` : "";
      const res = await fetch(`/api/bid${q}`);
      const data = await res.json();
      // Detect student change from server
      if (
        data.currentStudent &&
        data.currentStudent.roll_no !== prevStudentIdRef.current
      ) {
        setBidHistory([]);
        setHighestBid(0);
        prevStudentIdRef.current = data.currentStudent.roll_no;
      }
      const bids = Array.isArray(data.bids) ? data.bids : [];
      setBidHistory(bids);
      if (bids.length > 0) setHighestBid(bids[0].amount);
      if (typeof data.timer === "number") setTimeLeft(data.timer);
      if (Array.isArray(data.purchases)) setPurchases(data.purchases);
      if (data.currentStudent) setCurrentStudent(data.currentStudent);
    };
    fetchBids();
    const interval = setInterval(fetchBids, 1000);
    return () => clearInterval(interval);
  }, [userName]);

  // Random Student Change
  const nextStudent = () => {
    const random =
      studentsData[Math.floor(Math.random() * studentsData.length)];
    setCurrentStudent(random);
    setBidHistory([]);
    setHighestBid(0);
    setTimeLeft(10);
  };

  const sortedBidders = [...bidHistory].sort((a, b) => b.amount - a.amount);

  return (
    <div className="flex w-full h-screen  overflow-hidden">
      {/* ✅ Student Info Section */}
      <div className="flex-1 flex justify-center items-center bg-muted">
        <video
          src={"https://dqbr6kzn27lfn.cloudfront.net/loopbg.mp4"}
          autoPlay
          loop
          muted
          className=" absolute inset-0 mask-b-from-[60%]"
        />
        {currentStudent && (
          <div className="p-6  rounded-xl w-[80%] z-50  text-white">
            <h2 className="text-2xl font-bold  mb-4">
              Current Student for Auction
            </h2>

            <p className="text-lg  font-semibold">{currentStudent.name}</p>
            <p className=" text-sm">{currentStudent.roll_no}</p>
            <p className=" text-sm mb-3">{currentStudent.category}</p>

            <div className="mt-4">
              <p className="font-semibold mb-2 text-2xl"> Skills</p>
              {Object.entries(currentStudent.skills).map(
                ([skill, stars], i) => (
                  <p key={i} className="text-sm flex justify-between">
                    <span>{skill}</span>
                    <span>{stars || "☆ ☆ ☆ ☆ ☆"}</span>
                  </p>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {/* ✅ Auction Section */}
      <Card className="rounded-none w-md flex flex-col justify-between z-50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Auction Bidding</CardTitle>
          <div className="mt-2">
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
              Time Left
            </div>
            <AuctionTimer
              value={timeLeft}
              suffix="s"
              className={`text-5xl ${timeLeft < 3 ? "text-red-500" : ""}`}
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <p className="text-sm mb-2 font-medium">Enter Your Name</p>
            <Input
              placeholder="e.g. Vansh"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <div>
            <p className="text-sm mb-2">
              Current Highest Bid: <strong>₹{highestBid}</strong>
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handlePlaceBid()}
            >
              +50 Place Bid
            </Button>
          </div>

          <div>
            <p className="font-semibold text-lg mb-2">Bid History</p>
            <ul className="space-y-2 text-sm max-h-40 overflow-y-auto">
              {bidHistory.length === 0 && <li>No bids yet.</li>}
              {bidHistory.map((bid, index) => (
                <li key={index}>
                  {bid.name} — <strong>₹{bid.amount}</strong>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col w-full gap-2 items-start">
          {userName && (
            <div className="mt-4 w-full">
              <h4 className="text-md font-semibold mb-2">Your Purchases</h4>
              <div className="flex flex-col gap-2  overflow-y-auto">
                {purchases.length === 0 && (
                  <div className="text-sm">No purchases yet.</div>
                )}
                {purchases.map((p, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-sm border p-2 rounded"
                  >
                    <span>{p.student?.name ?? "Student"}</span>
                    <span className="font-bold">₹{p.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PageInner />
    </Suspense>
  );
}
