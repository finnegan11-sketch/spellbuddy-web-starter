// lib/utils.js

// Shuffle helper (used for word order)
export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Text-to-speech (used by "Hear word")
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

// --- Audio recording helpers (iPad/Mac Safari & Chrome) ---
export async function startRecorder() {
  // Ask for mic permission
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

  // Safari/Chrome support MediaRecorder now; if not, show a friendly message
  if (typeof MediaRecorder === 'undefined') {
    stream.getTracks().forEach(t => t.stop())
    throw new Error('MediaRecorder not supported in this browser.')
  }

  const recorder = new MediaRecorder(stream)
  const chunks = []

  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data)
  }

  // We return a promise immediately so the caller can call rec.stop() later.
  return new Promise((resolve) => {
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' })
      const url = URL.createObjectURL(blob)
      const audio = new Audio(url)
      resolve({
        blob,
        url,
        audio,
        stopAll: () => stream.getTracks().forEach((t) => t.stop()),
      })
    }

    recorder.start()

    // Return control to the caller so they can stop recording later
    resolve({
      stop: () => recorder.state !== 'inactive' && recorder.stop(),
      stream,
    })
  })
}