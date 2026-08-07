import { Image as ImageIcon } from 'lucide-react'
import { cn } from '../../lib/utils'

/**
 * ImagePlaceholder — sprach-neutrale, wiederverwendbare Bildplatzhalter-Box.
 * Echte Fotos/Grafiken kommen spaeter vom Kunden. SSR-sicher (kein window/localStorage).
 *
 * Optik via className steuerbar (cn = tailwind-merge -> spaetere Klassen gewinnen):
 *  - hell  (Default): bg-slate-100 border-slate-300 text-slate-500
 *  - dunkel (auf dunklem Grund): z.B. 'bg-white/5 border-white/20 text-white/50'
 * Keine i18n noetig: dekoratives Icon + optionales label-Prop (role="img").
 */
type ImagePlaceholderProps = {
  label?: string
  className?: string
}

const ImagePlaceholder = ({ label, className }: ImagePlaceholderProps) => {
  return (
    <div
      role="img"
      aria-label={label || 'Bildplatzhalter'}
      className={cn(
        'flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-center select-none bg-slate-100 border-slate-300 text-slate-500',
        className,
      )}
    >
      <ImageIcon size={28} strokeWidth={1.5} aria-hidden="true" />
      {label ? <span className="text-xs font-medium">{label}</span> : null}
    </div>
  )
}

export default ImagePlaceholder
