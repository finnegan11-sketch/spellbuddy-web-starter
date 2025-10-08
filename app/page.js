'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getLists } from '@/lib/storage'

export default function Home() {
  const [count, setCount] = useState(0)
  useEffect(() => setCount(getLists().length), [])

  return (
    <main className="grid" style={{gap: 24}}>
      <header className="grid" style={{gap: 8}}>
        <h1>SpellBuddy</h1>
        <p className="helper">
          A simple, kid-friendly study app for weekly spelling & vocab. Optimized for iPad.
        </p>
      </header>

      <section className="card grid" style={{gap:16}} aria-labelledby="quickstart">
        <h2 id="quickstart">Quick Start</h2>
        <ol>
          <li>Go to the <Link href="/dashboard">Parent Dashboard</Link> and paste this week’s words.</li>
          <li>Open <Link href="/study">Study</Link> or <Link href="/flashcards">Flashcards</Link> to practice.</li>
        </ol>
        <p className="helper">Lists are saved locally on this device. You can add cloud sync later.</p>
        <div className="row">
          <Link href="/dashboard"><button>Open Parent Dashboard</button></Link>
          <Link href="/study"><button>Start Studying</button></Link>
          <Link href="/flashcards"><button>Flashcards (Definitions)</button></Link>
        </div>
      </section>

      <section className="card grid" style={{gap:10}}>
        <h3>Status</h3>
        <p><span className="badge">{count}</span> lists saved on this device.</p>
      </section>
    </main>
  )
}