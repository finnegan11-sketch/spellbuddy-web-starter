// === List storage ===
const KEY = 'sb_lists_v1'

export function getLists() {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveList({ title, words }) {
  const lists = getLists()
  const id = crypto.randomUUID()
  const newList = { id, title, words }
  lists.push(newList)
  localStorage.setItem(KEY, JSON.stringify(lists))
}

export function deleteList(id) {
  const lists = getLists().filter(l => l.id !== id)
  localStorage.setItem(KEY, JSON.stringify(lists))
}

export function setLists(lists) {
  localStorage.setItem(KEY, JSON.stringify(lists))
}

// === Definitions storage (global, by word) ===
const DEF_KEY = 'sb_defs_v1'

export function getAllDefinitions() {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(DEF_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function getDefinition(word) {
  const defs = getAllDefinitions()
  return defs[(word || '').toLowerCase()] || ''
}

export function setDefinition(word, definition) {
  const w = (word || '').toLowerCase().trim()
  const d = (definition || '').trim()
  if (!w) return
  const defs = getAllDefinitions()
  if (d) defs[w] = d
  else delete defs[w]
  localStorage.setItem(DEF_KEY, JSON.stringify(defs))
}

export function getDefinitionOptions(correctWord, max = 4) {
  const defs = getAllDefinitions()
  const correct = defs[(correctWord || '').toLowerCase()]
  if (!correct) return []
  const pool = Object.entries(defs)
    .filter(([w]) => w !== (correctWord || '').toLowerCase())
    .map(([, def]) => def)
  const picks = pool.sort(() => Math.random() - 0.5).slice(0, Math.max(0, max - 1))
  return [correct, ...picks].sort(() => Math.random() - 0.5)
}