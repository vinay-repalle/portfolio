import { useEffect, useRef } from 'react'
import './Cursor.css'

// Dot follows the pointer exactly; the ring trails behind and grows over
// anything interactive. Elements can set data-cursor="label" to show a tag.
const INTERACTIVE = '[data-cursor], a, button, [role="button"], [role="slider"], input, textarea'

export default function Cursor() {
  const ringRef = useRef(null)
  const dotRef = useRef(null)
  const labelRef = useRef(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const root = document.documentElement
    const ring = ringRef.current
    root.classList.add('has-cursor')

    let x = -100
    let y = -100
    let rx = x
    let ry = y
    let raf = 0

    const move = (e) => {
      x = e.clientX
      y = e.clientY
      dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
      root.classList.remove('cursor-away')
    }
    const over = (e) => {
      const el = e.target.closest?.(INTERACTIVE)
      const text = el?.getAttribute('data-cursor') || ''
      ring.classList.toggle('is-hover', !!el && !el.matches('.graph'))
      ring.classList.toggle('has-label', !!text)
      labelRef.current.textContent = text
    }
    const down = () => ring.classList.add('is-down')
    const up = () => ring.classList.remove('is-down')
    const away = () => root.classList.add('cursor-away')

    const loop = () => {
      rx += (x - rx) * 0.2
      ry += (y - ry) * 0.2
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerover', over)
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    root.addEventListener('mouseleave', away)
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      root.removeEventListener('mouseleave', away)
      root.classList.remove('has-cursor')
    }
  }, [])

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true">
        <span ref={labelRef} className="cursor-ring__label" />
      </div>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  )
}
