import { useEffect, useRef } from 'react'
import { clamp } from '../lib/utils.js'

// Background: drifting code glyphs that stretch into light-speed streaks
// while you scrub through time (speed + direction follow the scrub velocity).
// A second canvas on top handles confetti bursts (exposed through apiRef).
const GLYPHS = ['+', '−', '•', '{', '}', '/', '*', '0', '1', '#', '~', '<', '>', ';', '=']
const CONFETTI = ['#8ab4ff', '#ffc46b', '#ff7eb6', '#ffffff']

const accentRgb = () => document.documentElement.style.getPropertyValue('--accent-rgb') || '57 255 136'

export default function WarpField({ velocityRef, apiRef }) {
  const bgRef = useRef(null)
  const fxRef = useRef(null)

  useEffect(() => {
    const bg = bgRef.current.getContext('2d')
    const fx = fxRef.current.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0
    let h = 0
    let raf = 0
    let speed = 0
    let parts = []
    const bits = []
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 }

    const spawn = (x = Math.random() * w) => ({
      x,
      y: Math.random() * h,
      z: 0.2 + Math.random() * 0.8,
      g: GLYPHS[(Math.random() * GLYPHS.length) | 0],
    })

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      w = window.innerWidth
      h = window.innerHeight
      for (const [canvas, ctx] of [
        [bgRef.current, bg],
        [fxRef.current, fx],
      ]) {
        canvas.width = w * dpr
        canvas.height = h * dpr
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      }
      parts = Array.from({ length: Math.round((w * h) / 12500) }, () => spawn())
    }

    const onMove = (e) => {
      mouse.tx = e.clientX / w - 0.5
      mouse.ty = e.clientY / h - 0.5
    }

    apiRef.current = {
      burst(x = w / 2, y = h / 2) {
        const accent = `rgb(${accentRgb()})`
        for (let i = 0; i < 170; i++) {
          const a = Math.random() * Math.PI * 2
          const s = 3 + Math.random() * 10
          bits.push({
            x,
            y,
            vx: Math.cos(a) * s,
            vy: Math.sin(a) * s - 6,
            r: Math.random() * Math.PI,
            vr: (Math.random() - 0.5) * 0.4,
            life: 1,
            size: 4 + Math.random() * 6,
            c: i % 3 === 0 ? accent : CONFETTI[i % CONFETTI.length],
          })
        }
      },
    }

    const frame = () => {
      // velocity = years travelled since the last frame
      const v = velocityRef.current
      velocityRef.current = 0
      const target = reduce ? 0 : clamp(v * 2600, -95, 95)
      speed += (target - speed) * 0.16
      mouse.x += (mouse.tx - mouse.x) * 0.05
      mouse.y += (mouse.ty - mouse.y) * 0.05

      const accent = accentRgb()
      const streaking = Math.abs(speed) > 1.4
      bg.clearRect(0, 0, w, h)
      bg.lineCap = 'round'

      for (const p of parts) {
        if (!reduce) p.x += -(0.1 + p.z * 0.22) - speed * p.z
        if (p.x < -80) Object.assign(p, spawn(w + 40))
        else if (p.x > w + 80) Object.assign(p, spawn(-40))

        const ox = p.x - mouse.x * 36 * p.z
        const oy = p.y - mouse.y * 24 * p.z
        const alpha = 0.05 + p.z * 0.2

        if (streaking) {
          const len = Math.min(260, Math.abs(speed) * p.z * 4.5)
          bg.strokeStyle = `rgb(${accent} / ${Math.min(0.55, alpha * 1.5)})`
          bg.lineWidth = 0.6 + p.z * 1.4
          bg.beginPath()
          bg.moveTo(ox, oy)
          bg.lineTo(ox + Math.sign(speed) * len, oy)
          bg.stroke()
        } else {
          bg.fillStyle = `rgb(${accent} / ${alpha})`
          bg.font = `${Math.round(9 + p.z * 10)}px "JetBrains Mono", monospace`
          bg.fillText(p.g, ox, oy)
        }
      }

      fx.clearRect(0, 0, w, h)
      for (let i = bits.length - 1; i >= 0; i--) {
        const b = bits[i]
        b.vy += 0.24
        b.vx *= 0.985
        b.vy *= 0.985
        b.x += b.vx
        b.y += b.vy
        b.r += b.vr
        b.life -= 0.0065
        if (b.life <= 0 || b.y > h + 30) {
          bits.splice(i, 1)
          continue
        }
        fx.save()
        fx.globalAlpha = Math.min(1, b.life * 2)
        fx.translate(b.x, b.y)
        fx.rotate(b.r)
        fx.fillStyle = b.c
        fx.fillRect(-b.size / 2, -b.size / 4, b.size, b.size / 2)
        fx.restore()
      }

      raf = requestAnimationFrame(frame)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove)
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
    }
  }, [velocityRef, apiRef])

  return (
    <>
      <canvas ref={bgRef} className="warp" aria-hidden="true" />
      <canvas ref={fxRef} className="warp warp--fx" aria-hidden="true" />
    </>
  )
}
