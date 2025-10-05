export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function speak(text) {
  if (!text) return
  try {
    const u = new SpeechSynthesisUtterance(text)
    u.rate = 0.9
    u.pitch = 1.0
    u.lang = 'en-US'
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(u)
  } catch (e) {
    alert('Speech not supported in this browser.')
  }
}
