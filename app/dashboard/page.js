'use client'
import { useEffect, useState } from 'react'
import { saveList, getLists, deleteList } from '@/lib/storage'

export default function Dashboard() {
  const [title, setTitle] = useState('Week 1')
  const [raw, setRaw] = useState('because\nmountain\nthought')
  const [lists, setLists] = useState([])

  useEffect(() => {
    setLists(getLists())
  }, [])

  function onAdd(e) {
    e.preventDefault()
    const words = raw.split(/\r?\n|,|;/).map(w => w.trim()).filter(Boolean)
    if (!words.length) return alert('Please add at least one word.')
    saveList({ title, words })
    setLists(getLists())
    alert('Saved! Open the Study tab to begin.')
  }

  function onDelete(id) {
    if (!confirm('Delete this list?')) return
    deleteList(id)
    setLists(getLists())
  }

  return (
    <main className="grid" style={{gap: 24}}>
      <header className="grid" style={{gap:8}}>
        <h1>Parent Dashboard</h1>
        <p className="helper">Paste your child&rsquo;s weekly words. Keep one word per line (or separate by commas).</p>
      </header>

      <form className="card grid" style={{gap:14}} onSubmit={onAdd}>
        <label className="label" htmlFor="title">List title</label>
        <input id="title" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Week 6 (Oct 14)" required />

        <label className="label" htmlFor="words">Words</label>
        <textarea id="words" rows={8} value={raw} onChange={e=>setRaw(e.target.value)} placeholder="because\nmountain\nthought" />

        <div className="row">
          <button type="submit">Save List</button>
        </div>
        <p className="helper">Tip: You can create multiple lists (e.g., Week 6, Review List, Sight Words).</p>
      </form>

      <section className="card grid" style={{gap:10}}>
        <h2>Saved Lists</h2>
        <div className="list">
          {lists.map(l => (
            <div key={l.id} className="row" style={{justifyContent:'space-between', alignItems:'center'}}>
              <div>
                <strong>{l.title}</strong>
                <span className="helper"> — {l.words.length} words</span>
              </div>
              <div className="row">
                <button onClick={()=>onDelete(l.id)} aria-label={`Delete ${l.title}`}>Delete</button>
              </div>
            </div>
          ))}
          {!lists.length && <p className="helper">No lists yet. Add your first above.</p>}
        </div>
      </section>
    </main>
  )
}
