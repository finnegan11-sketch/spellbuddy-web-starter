// Local-only storage for lists: [{ id, title, words: [] }]
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

function setLists(lists) {
  localStorage.setItem(KEY, JSON.stringify(lists))
}

export function saveList({ title, words }) {
  const lists = getLists()
  const id = `list_${Date.now()}`
  lists.push({ id, title, words })
  setLists(lists)
  return id
}

export function deleteList(id) {
  const lists = getLists().filter(l => l.id !== id)
  setLists(lists)
}
