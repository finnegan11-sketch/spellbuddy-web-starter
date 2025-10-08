'use client'
import { useEffect, useMemo, useState } from 'react'
import { getLists } from '@/lib/storage'
import { getDefinition, setDefinition, getDefinitionOptions } from '@/lib/storage'

export default function Flashcards() {
  const [lists, setLists] = useState([])
  const [listId, setListId] = useState('')
  const [queue, setQueue] = useState([])       // words to quiz
  const [current, setCurrent] = useState('')   // current word
  const [options, setOptions] = useState([])   // multiple choice options (definitions)
  const [selection, setSelection] = useState('')
  const [feedback, setFeedback] = useState('')
  const [defInput, setDefInput] = useState('') // edit/add definition for current word

  useEffect(() => {
    const ls = getLists()
    setLists(ls)
    if (ls[0]) setListId(ls[0].id)
  }, [])

  // When list changes, create a shuffled queue of words
  useEffect(() => {
    if (!listId) return
    const list = lists.find(l => l.id === listId)
    if (!list) return
    const words = [...list.words]
    // Shuffle words
    words.sort(() => Math.random() - 0.5)
    setQueue(words)
    // seed first word
    const first = words[0] || ''
    setCurrent(first)
  }, [listId, lists])

  // Whenever 'current' changes, rebuild multiple-choice options and load def input
  useEffect(() => {
    if (!current) {
      setOptions([])
      setDefInput('')
      return
    }
    const defined = getDefinition(current)
    setDefInput(defined || '')
    const opts = getDefinitionOptions(current, 4)
    setOptions(opts)
    setSelection('')
    setFeedback('')
  }, [current])

  const correctDef = useMemo(() => getDefinition(current), [current])

  function nextCard() {
    setSelection('')
    setFeedback('')
    setQueue(q => {
      const [, ...rest] = q
      const next = rest[0] || ''
      setCurrent(next)
      return rest
    })
  }

  function saveDefinition() {
    if (!current) return
    const val = (defInput || '').trim()
    if (!val) return
    setDefinition(current, val)
    // Rebuild options including the new correct def
    const opts = getDefinitionOptions(current, 4)
    setOptions(opts)
  }

  function choose(opt) {
    setSelection(opt)
    if (!correctDef) {
      setFeedback('Add a definition first, then try again.')
      return
    }
    if (opt === correctDef) {
      setFeedback('✅ Nice! That’s correct.')
      // Move to next after a short delay
      setTimeout(nextCard, 700)
    } else {
      setFeedback('↺ Not quite. Try another choice or review the definition.')
    }
  }

  const remaining = queue.length + (current ? 1 : 0)

  return (
    <main className="grid" style={{ gap: 24 }}>
      <header className="grid" style={{ gap: 8 }}>
        <h1>Flashcards</h1>
        <p className="helper">Choose the correct definition for the word shown. Add/edit definitions below if needed.</p>
      </header>

      {!lists.length && (
        <section className="card">
          <p>You have no lists yet. Add one in the Parent Dashboard.</p>
        </section>
      )}

      {!!lists.length && (
        <>
          <section className="card grid" style={{ gap: 12 }}>
            <label className="label" htmlFor="list">Choose list</label>
            <select id="list" value={listId} onChange={e => setListId(e.target.value)}>
              {lists.map(l => <option key={l.id} value={l.id}>{l.title} ({l.words.length})</option>)}
            </select>
            <div><span className="badge">{remaining} left</span></div>
          </section>

          {current ? (
            <section className="card grid" style={{ gap: 16 }}>
              <div className="helper">Word</div>
              <div className="answer" aria-live="polite">{current}</div>

              <div className="grid" style={{ gap: 10 }}>
                {correctDef ? (
                  <>
                    <div className="helper">Choose the correct definition:</div>
                    <div className="grid" style={{ gap: 10 }}>
                      {(options.length ? options : [correctDef]).map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => choose(opt)}
                          aria-pressed={selection === opt}
                          style={{ textAlign: 'left' }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="helper">No definition yet—add one below, then you can quiz.</div>
                )}
              </div>

              <div className="grid" style={{ gap: 8 }}>
                <label className="label" htmlFor="def">Add or edit definition (kid-friendly):</label>
                <textarea
                  id="def"
                  rows={3}
                  value={defInput}
                  onChange={e => setDefInput(e.target.value)}
                  placeholder="e.g., A very high hill."
                />
                <div className="row">
                  <button onClick={saveDefinition}>Save definition</button>
                  <button onClick={nextCard}>Skip word</button>
                </div>
              </div>

              <div aria-live="polite" className="helper">{feedback}</div>
            </section>
          ) : (
            <section className="card">
              <p className="helper">All done! Pick another list or add more words/definitions.</p>
            </section>
          )}
        </>
      )}
    </main>
  )
}