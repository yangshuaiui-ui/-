import { gsap } from 'gsap'
import { speedMultiplier } from './useSettings'

export function sleep(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms * speedMultiplier.value))
}

export async function flyElementToTarget(
  srcEl: HTMLElement,
  targetEl: HTMLElement,
  duration = 0.35
): Promise<void> {
  const srcRect = srcEl.getBoundingClientRect()
  const tgtRect = targetEl.getBoundingClientRect()

  const clone = srcEl.cloneNode(true) as HTMLElement
  clone.style.cssText = `
    position: fixed !important;
    top: ${srcRect.top}px !important;
    left: ${srcRect.left}px !important;
    width: ${srcRect.width}px !important;
    height: ${srcRect.height}px !important;
    z-index: 500;
    pointer-events: none;
    margin: 0 !important;
    transform: none !important;
  `
  document.body.appendChild(clone)

  const destX = tgtRect.left + tgtRect.width / 2 - srcRect.width / 2
  const destY = tgtRect.top + tgtRect.height / 2 - srcRect.height / 2

  await gsap.to(clone, {
    left: destX,
    top: destY,
    duration: duration * speedMultiplier.value,
    ease: 'power2.inOut',
  })
  clone.remove()
}

export async function flyTextTo(
  text: string,
  fromEl: HTMLElement,
  toEl: HTMLElement,
  color: string
): Promise<void> {
  const srcRect = fromEl.getBoundingClientRect()
  const tgtRect = toEl.getBoundingClientRect()

  const div = document.createElement('div')
  div.textContent = text
  div.style.cssText = `
    position: fixed;
    top: ${srcRect.top + srcRect.height / 2}px;
    left: ${srcRect.left + srcRect.width / 2}px;
    color: ${color};
    font-family: 'Press Start 2P', monospace;
    font-size: 13px;
    font-weight: 900;
    z-index: 600;
    pointer-events: none;
    transform: translate(-50%, -50%);
    text-shadow: 0 0 8px currentColor;
    white-space: nowrap;
  `
  document.body.appendChild(div)

  await gsap.to(div, {
    top: tgtRect.top + tgtRect.height / 2,
    left: tgtRect.left + tgtRect.width / 2,
    opacity: 0,
    duration: 0.4 * speedMultiplier.value,
    ease: 'power2.out',
  })
  div.remove()
}

export async function animateCounter(
  getter: () => number,
  setter: (v: number) => void,
  target: number,
  duration = 600
): Promise<void> {
  const start = getter()
  const startTime = performance.now()
  const dur = duration * speedMultiplier.value

  return new Promise(resolve => {
    function step(now: number) {
      const elapsed = now - startTime
      const t = Math.min(elapsed / dur, 1)
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
      setter(Math.round(start + (target - start) * eased))
      if (t < 1) requestAnimationFrame(step)
      else { setter(target); resolve() }
    }
    requestAnimationFrame(step)
  })
}
