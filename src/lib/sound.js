// Tiny Web Audio synth — no audio files. Off by default (browsers block
// autoplay anyway); the HUD toggle turns it on.
let ctx = null
let master = null
let on = false
let last = 0

const SCALE = [0, 3, 5, 7, 10] // minor pentatonic: every year is a note

function ensure() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return false
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = 0.6
    master.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') ctx.resume()
  return true
}

function tone(freq, { dur = 0.12, type = 'sine', vol = 0.08, delay = 0 } = {}) {
  if (!on || !ensure()) return
  const t0 = ctx.currentTime + delay
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(gain)
  gain.connect(master)
  osc.start(t0)
  osc.stop(t0 + dur + 0.05)
}

function throttle(ms) {
  const now = performance.now()
  if (now - last < ms) return false
  last = now
  return true
}

export const sound = {
  isOn: () => on,
  setOn(value) {
    on = value
    if (on) {
      ensure()
      sound.chord()
    }
  },
  /** year boundary crossed — i is years since the start */
  tick(i) {
    if (!on || !throttle(45)) return
    const n = SCALE[((i % 5) + 5) % 5] + 12 * Math.floor(i / 5)
    tone(220 * 2 ** (n / 12), { dur: 0.22, type: 'triangle', vol: 0.07 })
  },
  /** passed a commit */
  blip() {
    if (!on || !throttle(45)) return
    tone(1046.5, { dur: 0.06, vol: 0.05 })
  },
  open() {
    tone(523.25, { dur: 0.1, vol: 0.06 })
    tone(783.99, { dur: 0.16, vol: 0.05, delay: 0.06 })
  },
  close() {
    tone(783.99, { dur: 0.08, vol: 0.05 })
    tone(523.25, { dur: 0.14, vol: 0.04, delay: 0.05 })
  },
  chord() {
    ;[523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, { dur: 0.6, vol: 0.045, delay: i * 0.06 }))
  },
  error() {
    tone(110, { dur: 0.3, type: 'sawtooth', vol: 0.05 })
  },
  key() {
    tone(1700 + Math.random() * 500, { dur: 0.02, type: 'square', vol: 0.01 })
  },
}
