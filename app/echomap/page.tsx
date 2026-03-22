"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Emotion = "Love" | "Pain" | "Motivation" | "Secret" | "Wisdom" | "Regret";

type MemoryItem = {
  id: string;
  text: string;
  emotion: Emotion;
  x: number;
  y: number;
  upvotes: number;
  createdAt: string;
};

const GRID_SIZE = 10;
const EMOTIONS: Emotion[] = ["Love", "Pain", "Motivation", "Secret", "Wisdom", "Regret"];

const EMOTION_COLORS: Record<Emotion, string> = {
  Love: "#ff4d8d",
  Pain: "#9f7aea",
  Motivation: "#f6ad55",
  Secret: "#4fd1c5",
  Wisdom: "#68d391",
  Regret: "#fc8181",
};

const initialMemories: MemoryItem[] = [
  {
    id: "m1",
    text: "I forgave myself here, under a silent sky.",
    emotion: "Love",
    x: 2,
    y: 4,
    upvotes: 12,
    createdAt: "2026-01-08T07:15:00.000Z",
  },
  {
    id: "m2",
    text: "This corner reminds me that pain can still teach kindness.",
    emotion: "Pain",
    x: 6,
    y: 1,
    upvotes: 8,
    createdAt: "2025-11-02T17:45:00.000Z",
  },
  {
    id: "m3",
    text: "One step at a time still counts as moving forward.",
    emotion: "Motivation",
    x: 4,
    y: 7,
    upvotes: 21,
    createdAt: "2026-02-02T08:00:00.000Z",
  },
];

export default function EchoMapPage() {
  const [memories, setMemories] = useState<MemoryItem[]>(initialMemories);
  const [selectedCell, setSelectedCell] = useState<{ x: number; y: number } | null>(null);
  const [activeMemory, setActiveMemory] = useState<MemoryItem | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [text, setText] = useState("");
  const [emotion, setEmotion] = useState<Emotion>("Love");
  const [useTappedLocation, setUseTappedLocation] = useState(true);

  useEffect(() => {
    const saved = window.localStorage.getItem("echomap_memories");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as MemoryItem[];
        if (Array.isArray(parsed)) {
          setMemories(parsed);
        }
      } catch {
        // Fallback to initial memories if invalid local data.
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("echomap_memories", JSON.stringify(memories));
  }, [memories]);

  const pinsByCell = useMemo(() => {
    const map = new Map<string, MemoryItem[]>();
    for (const memory of memories) {
      const key = `${memory.x}-${memory.y}`;
      const list = map.get(key) ?? [];
      list.push(memory);
      map.set(key, list);
    }
    return map;
  }, [memories]);

  const addMemory = (e: FormEvent) => {
    e.preventDefault();
    const cleanText = text.trim();
    if (!cleanText) return;

    const x = useTappedLocation && selectedCell ? selectedCell.x : Math.floor(Math.random() * GRID_SIZE);
    const y = useTappedLocation && selectedCell ? selectedCell.y : Math.floor(Math.random() * GRID_SIZE);

    const newMemory: MemoryItem = {
      id: crypto.randomUUID(),
      text: cleanText,
      emotion,
      x,
      y,
      upvotes: 0,
      createdAt: new Date().toISOString(),
    };

    setMemories((prev) => [newMemory, ...prev]);
    setText("");
    setEmotion("Love");
    setIsAddOpen(false);
  };

  const upvote = (id: string) => {
    setMemories((prev) =>
      prev.map((memory) => (memory.id === id ? { ...memory, upvotes: memory.upvotes + 1 } : memory)),
    );
    setActiveMemory((current) =>
      current && current.id === id ? { ...current, upvotes: current.upvotes + 1 } : current,
    );
  };

  return (
    <main className="min-h-screen bg-[#090510] text-white">
      <section className="mx-auto w-full max-w-5xl px-4 py-6 md:py-10">
        <header className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-wide md:text-3xl">EchoMap Prototype</h1>
            <p className="text-sm text-violet-200/70">Offline web version · emotional memory map</p>
          </div>
          {selectedCell && (
            <span className="rounded-md bg-violet-900/50 px-3 py-1 text-xs text-violet-100">
              Selected: ({selectedCell.x}, {selectedCell.y})
            </span>
          )}
        </header>

        <div className="relative overflow-hidden rounded-2xl border border-violet-400/10 bg-gradient-to-b from-[#120a29] to-[#07040e] p-2 shadow-[0_0_60px_rgba(126,87,194,0.25)]">
          <div className="grid aspect-square w-full grid-cols-10 gap-1">
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
              const x = index % GRID_SIZE;
              const y = Math.floor(index / GRID_SIZE);
              const key = `${x}-${y}`;
              const memoriesInCell = pinsByCell.get(key) ?? [];
              const firstEmotion = memoriesInCell[0]?.emotion;

              return (
                <div
                  key={key}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedCell({ x, y })}
                  onKeyDown={(evt) => {
                    if (evt.key === "Enter" || evt.key === " ") {
                      evt.preventDefault();
                      setSelectedCell({ x, y });
                    }
                  }}
                  className="group relative flex items-center justify-center rounded-md border border-white/5 bg-violet-950/40 transition hover:border-violet-300/30 hover:bg-violet-900/40"
                  title={`Cell (${x}, ${y})`}
                >
                  <span className="pointer-events-none absolute inset-0 rounded-md bg-gradient-to-br from-violet-700/10 to-transparent opacity-0 transition group-hover:opacity-100" />

                  {memoriesInCell.length > 0 && firstEmotion && (
                    <button
                      type="button"
                      onClick={(evt) => {
                        evt.stopPropagation();
                        setActiveMemory(memoriesInCell[0]);
                      }}
                      className="relative z-10 h-6 w-6 animate-pulse rounded-full"
                      style={{ backgroundColor: EMOTION_COLORS[firstEmotion], boxShadow: `0 0 20px ${EMOTION_COLORS[firstEmotion]}` }}
                      title={memoriesInCell[0].emotion}
                    />
                  )}

                  {memoriesInCell.length > 1 && (
                    <span className="absolute bottom-1 right-1 rounded bg-black/60 px-1 text-[10px] text-violet-100">
                      +{memoriesInCell.length - 1}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="fixed bottom-6 right-6 rounded-full bg-violet-600 px-5 py-3 text-sm font-semibold shadow-lg shadow-violet-700/40 transition hover:bg-violet-500"
        >
          + Add Memory
        </button>
      </section>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 md:items-center">
          <form onSubmit={addMemory} className="w-full max-w-lg rounded-2xl border border-violet-300/20 bg-[#120a29] p-5">
            <h2 className="mb-4 text-xl font-semibold">Drop a Memory</h2>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write something only the night should hear..."
              rows={4}
              className="mb-3 w-full rounded-lg border border-violet-300/20 bg-violet-950/60 p-3 text-sm outline-none focus:border-violet-400"
              required
            />

            <label className="mb-2 block text-sm text-violet-200">Emotion</label>
            <select
              value={emotion}
              onChange={(e) => setEmotion(e.target.value as Emotion)}
              className="mb-4 w-full rounded-lg border border-violet-300/20 bg-violet-950/60 p-3 text-sm outline-none"
            >
              {EMOTIONS.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>

            <label className="mb-4 flex items-center gap-2 text-sm text-violet-100">
              <input
                type="checkbox"
                checked={useTappedLocation}
                onChange={(e) => setUseTappedLocation(e.target.checked)}
                className="h-4 w-4"
              />
              Use tapped location
              <span className="text-violet-300/70">
                ({selectedCell ? `${selectedCell.x}, ${selectedCell.y}` : "none selected"})
              </span>
            </label>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="rounded-lg border border-violet-300/20 px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button type="submit" className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold">
                Save Memory
              </button>
            </div>
          </form>
        </div>
      )}

      {activeMemory && (
        <div className="fixed inset-x-0 bottom-0 z-40 rounded-t-2xl border-t border-violet-300/20 bg-[#110823] p-5 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
          <div className="mx-auto w-full max-w-4xl">
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded-full bg-violet-900/60 px-3 py-1 text-xs">{activeMemory.emotion}</span>
              <button className="text-sm text-violet-200/80" onClick={() => setActiveMemory(null)}>
                Close
              </button>
            </div>
            <p className="mb-3 text-sm leading-relaxed text-violet-50">{activeMemory.text}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-violet-200/70">
                ({activeMemory.x}, {activeMemory.y}) · {new Date(activeMemory.createdAt).toLocaleString()}
              </span>
              <button
                onClick={() => upvote(activeMemory.id)}
                className="rounded-md bg-fuchsia-700 px-3 py-2 text-xs font-semibold transition hover:bg-fuchsia-600"
              >
                ❤️ Upvote ({activeMemory.upvotes})
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
