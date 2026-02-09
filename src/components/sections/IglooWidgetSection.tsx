import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Sparkles, Infinity as InfinityIcon } from 'lucide-react'
import { Tooth } from '../ui/icons/Tooth'
import iglooImage from '../../assets/igloo_front.webp'

const IglooWidgetSection = () => {
  const { t } = useTranslation('home')

  // Coordinates for the symmetrical triangle layout (1200x600 container)
  const positions = {
    dental: { x: 600, y: 80 },
    beauty: { x: 150, y: 500 },
    longevity: { x: 1050, y: 500 },
  }

  const widgets = [
    {
      id: 'dental',
      label: t('igloo_widget.dental', 'Dental'),
      path: '/diagnostics/dental',
      icon: <Tooth className="w-12 h-12 text-brand-primary" />,
      x: positions.dental.x,
      y: positions.dental.y,
    },
    {
      id: 'beauty',
      label: t('igloo_widget.beauty', 'Beauty'),
      path: '/diagnostics/beauty',
      icon: <Sparkles className="w-12 h-12 text-brand-primary" />,
      x: positions.beauty.x,
      y: positions.beauty.y,
    },
    {
      id: 'longevity',
      label: t('igloo_widget.longevity', 'Longevity'),
      path: '/diagnostics/longevity',
      icon: <InfinityIcon className="w-12 h-12 text-brand-primary" />,
      x: positions.longevity.x,
      y: positions.longevity.y,
    },
  ]

  return (
    <section className="relative py-20 lg:py-32 bg-slate-50 overflow-visible">
       <div className="mx-auto max-w-container px-4 text-center lg:px-0 mb-16 relative z-10">
          <div className="inline-block rounded p-px bg-gradient-to-r from-brand-secondary via-brand-primary to-brand-deep shadow-lg shadow-brand-primary/20 mb-8">
            <div className="rounded-sm bg-slate-50 px-4 py-2 lg:px-3 lg:py-1">
              <span className="text-sm font-semibold uppercase tracking-wide text-gray-900 lg:text-xs">
                {t('igloo_widget.title', 'Anwendungsbereiche')}
              </span>
            </div>
          </div>
       </div>

      <div className="mx-auto flex w-full flex-col items-center justify-center gap-10 lg:block lg:h-[600px] lg:w-[1200px] relative px-4 lg:px-0">

        {/* Decorative connecting lines for desktop (Triangle) */}
        <svg className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none z-0">
             <defs>
                <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#e2e8f0">
                        <animate attributeName="stop-color" values="#e2e8f0;#cbd5e1;#e2e8f0" dur="4s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="100%" stopColor="#94a3b8">
                         <animate attributeName="stop-color" values="#94a3b8;#cbd5e1;#94a3b8" dur="4s" repeatCount="indefinite" />
                    </stop>
                </linearGradient>
             </defs>

             {/* Path connecting the centers of the widgets */}
             <path
                d={`M ${positions.dental.x} ${positions.dental.y} L ${positions.beauty.x} ${positions.beauty.y} L ${positions.longevity.x} ${positions.longevity.y} Z`}
                stroke="url(#blueGradient)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-50"
             />
        </svg>

        {/* Central Image with Glow */}
        <div className="relative z-10 flex justify-center items-center h-full w-full pointer-events-none">
            {/* Blue Glow Effect */}
            <div className="absolute w-[300px] h-[300px] bg-blue-100/50 blur-[80px] rounded-full mix-blend-multiply pointer-events-none" />

            <img
                src={iglooImage}
                alt="Igloo Pro"
                width={256}
                height={256}
                loading="lazy"
                decoding="async"
                className="relative z-10 w-64 sm:w-72 md:w-56 lg:w-64 drop-shadow-2xl transition-all duration-500 ease-in-out hover:scale-110 pointer-events-none"
            />
        </div>

        {/* Widgets */}
        <div className="flex w-full flex-col items-center gap-6 lg:absolute lg:inset-0 lg:block z-30 pointer-events-auto px-2 lg:px-0">
            {widgets.map((widget) => (
            <Link
              key={widget.id}
              to={widget.path}
              className={`
                pointer-events-auto
                group flex items-center justify-center
                relative z-40
                rounded-2xl
                shadow-lg shadow-brand-deep/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl
                w-full max-w-[95vw] sm:max-w-[90vw] h-32 sm:h-36
                bg-gradient-to-br from-brand-primary/90 via-brand-deep/90 to-gray-900/90
                border border-white/10 backdrop-blur-md
                lg:absolute lg:left-[var(--x)] lg:top-[var(--y)] lg:-translate-x-1/2 lg:-translate-y-1/2
                lg:w-80 lg:h-48
              `}
              style={{
                '--x': `${widget.x}px`,
                '--y': `${widget.y}px`
              } as React.CSSProperties}
            >
                {/* Inner Content */}
                <div className="flex h-full w-full flex-row items-center gap-4 sm:gap-5 p-3 sm:p-4 transition-colors">
                    <div className="flex-shrink-0 transform transition-transform duration-300 group-hover:-translate-y-1">
                        {widget.icon}
                    </div>
                    <div className="flex flex-col items-start gap-1">
                      <span className="text-2xl font-medium text-white text-left group-hover:text-white transition-colors">
                          {widget.label}
                      </span>
                      <span className="text-sm font-medium text-slate-100 group-hover:text-white transition-colors">
                          {t('common:read_more', 'Mehr erfahren')} →
                      </span>
                    </div>
                </div>
            </Link>
            ))}
        </div>

      </div>

      <div className="flex justify-center mt-8 relative z-10">
        <Link
          to="/diagnostics"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary hover:text-brand-deep transition-colors"
        >
          {t('igloo_widget.all_services', 'Alle Diagnostik-Services entdecken')} →
        </Link>
      </div>
    </section>
  )
}

export default IglooWidgetSection
