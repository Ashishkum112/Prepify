import React, { useEffect, useState, useRef } from 'react';

export type TimerState = {
  category: string;
  elapsedMs: number; // accumulated elapsed milliseconds
  running: boolean;
  lastStartedAt?: number | null; // epoch ms when started
};

function formatMs(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export default function TimerCard({
  initial,
  onChange,
}: {
  initial: TimerState;
  onChange?: (s: TimerState) => void;
}) {
  const [state, setState] = useState<TimerState>(initial);
  const intervalRef = useRef<number | null>(null);

  // tick when running
  useEffect(() => {
    if (state.running) {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = window.setInterval(() => {
        setState(prev => ({ ...prev })); // force re-render
      }, 1000);
    } else {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [state.running]);

  // notify parent when state changes
  useEffect(() => {
    onChange?.(state);
  }, [state, onChange]);

  const start = () => {
    if (state.running) return;
    const now = Date.now();
    setState(prev => ({ ...prev, running: true, lastStartedAt: now }));
  };

  const stop = () => {
    if (!state.running) return;
    const now = Date.now();
    setState(prev => {
      const added = prev.lastStartedAt ? now - prev.lastStartedAt : 0;
      return { ...prev, running: false, elapsedMs: prev.elapsedMs + added, lastStartedAt: null };
    });
  };

  const reset = () => {
    setState({ ...state, running: false, elapsedMs: 0, lastStartedAt: null });
  };

  // compute display elapsed
  const displayedMs = state.running && state.lastStartedAt ? state.elapsedMs + (Date.now() - state.lastStartedAt) : state.elapsedMs;

  return (
    <div className="bg-gradient-to-br from-[#0f1724]/40 to-[#071427]/30 border border-brand-border rounded-xl p-4 w-full max-w-sm shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm text-brand-accent2 font-semibold">{state.category}</div>
          <div className="text-2xl font-mono mt-2">{formatMs(displayedMs)}</div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {state.running ? (
            <button onClick={stop} className="px-3 py-1 rounded-md bg-red-600 text-white text-sm">Stop</button>
          ) : (
            <button onClick={start} className="px-3 py-1 rounded-md bg-emerald-500 text-black text-sm">Start</button>
          )}
          <button onClick={reset} className="px-3 py-1 rounded-md bg-transparent border border-brand-border text-xs">Reset</button>
        </div>
      </div>
      <div className="mt-3 text-xs text-slate-300">Productive time tracked for this category.</div>
    </div>
  );
}
