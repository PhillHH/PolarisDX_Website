import { motion, useInView, useAnimation } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { useEffect, useRef } from 'react'

interface RevealProps {
  children: React.ReactNode
  width?: 'fit-content' | '100%'
  className?: string
  delay?: number
  duration?: number
  yOffset?: number
}

const Reveal = ({
  children,
  width = 'fit-content',
  className = "",
  delay = 0.1,
  duration = 0.5,
  yOffset = 30
}: RevealProps) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" }) // Trigger when 10% visible from bottom
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  const variants: Variants = {
    hidden: { opacity: 0, y: yOffset },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div ref={ref} style={{ width }} className={className}>
      <motion.div
        variants={variants}
        initial="hidden"
        animate={controls}
        transition={{ duration, delay, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </div>
  )
}

export default Reveal
