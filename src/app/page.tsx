"use client";

import { setLoading } from "@/features/loading/loadingSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function Home() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setLoading(false));
  },[])
  return (
    <main className='flex flex-col items-center justify-center min-h-screen'>
      <h1 className='text-4xl font-bold mb-2'>Status Dashboard</h1>
      <p className='text-gray-500'>Monitor system health in real-time</p>
    </main>
  );
}
