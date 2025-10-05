'use client'
import { useEffect, useMemo, useState } from 'react'
import { getLists } from '@/lib/storage'
import { shuffle, speak } from '@/lib/utils'

export default function Study() {
  const [lists, setLists] = useState([])
  const [listId, setListId] = useState('')
  const [queue, setQueue] = useState([])
  const [current, setCurrent] = useState('')
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [showTiles, setShowTiles] = useState(false)

  useEffect(() => {
    const ls = getLists()
    setLists(ls)
    if (ls[0]) setListId(ls[0].id)
  }, [])

  useEffect(() => {
    if (!listId) return
    const list = lists.find(l => l.id === listId)
    if (!list) return
    const q = shuffle([...list.words])
    setQueue(q)
    setCurrent(q[0] ?? '')
    setAnswer('')
    setFeedback('')
  }, [listId, lists])

  function nextWord() {
    setAnswer('')
    setFeedback('')
    setQueue(q => {
      const [, ...rest] = q
      const next = rest[0] ?? ''
      setCurrent(next)
      return rest
    })
  }

  function check() {
    const normalized = answer.trim().toLowerCase()
    if (!normalized) return
    if (normalized === current.toLowerCase()) {
      setFeedback('✅ Great job!')
      setTimeout(nextWord, 500)
    } else {
      setFeedback('↺ Not yet — try again.')
    }
  }

  function giveHint() {
    // Simple hint: reveal first letter(s)
    const n = Math.min(2, current.length - 1)
    setAnswer(current.slice(0, n))
  }

  const letters = useMemo(() => current.split('').sort(() => Math.random() - 0.5), [current])

  const remaining = queue.length + (current ? 1 : 0)

  return (
    <main className="grid" style={{gap:24}}>
      <header className="grid" style={{gap:8}}>
        <h1>Study</h1>
        <p className="helper">Hear the word, then type it. Toggle tiles if your child prefers to build the word by tapping letters.</p>
      </header>

      {!lists.length && (
        <section className="card">
          <p>You have no lists yet. Add one in the Parent Dashboard.</p>
        </section>
      )}

      {!!lists.length && (
        <>
          <section className="card grid" style={{gap:12}}>
            <label className="label" htmlFor="list">Choose list</label>
            <select id="list" value={listId} onChange={e=>setListId(e.target.value)}>
              {lists.map(l => <option key={l.id} value={l.id}>{l.title} ({l.words.length})</option>)}
            </select>
            <div className="row">
              <button onClick={()=>speak(current)}>🔊 Hear word</button>
              <button onClick={()=>setShowTiles(s=>!s)} aria-pressed={showTiles}>
                {showTiles ? 'Hide letter tiles' : 'Show letter tiles'}
              </button>
              <span className="badge">{remaining} left</span>
            </div>
          </section>

          {current ? (
            <section className="card grid" style={{gap:16}}>
              <div className="helper">Type the word you hear.</div>
              <input
                aria-label="Type the word"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                value={answer}
                onChange={e=>setAnswer(e.target.value)}
                onKeyDown={e=>{ if (e.key==='Enter') check() }}
                className="answer"
                placeholder="Type here"
              />
              <div className="row">
                <button onClick={check}>Check</button>
                <button onClick={giveHint}>Hint</button>
                <button onClick={()=>speak(current)}>Hear again</button>
                <button onClick={nextWord}>Skip</button>
              </div>

              {showTiles && (
                <div className="grid" style={{gap:8}}>
                  <div className="helper">Tap letters to build the word:</div>
                  <div className="tile-row">
                    {letters.map((ch, i) => (
                      <div key={i} className="tile" role="button" tabIndex={0} onClick={()=>setAnswer(a=>a+ch)} onKeyDown={e=>{ if(e.key==='Enter' || e.key===' '){ setAnswer(a=>a+ch) }}}>{ch}</div>
                    ))}
                  </div>
                </div>
              )}

              <div aria-live="polite" className="helper">{feedback}</div>
            </section>
          ) : (
            <section className="card">
              <p className="helper">All done! Choose another list or add more words.</p>
            </section>
          )}
        </>
      )}
    </main>
  )
}
