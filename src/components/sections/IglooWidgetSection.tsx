import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Smile, Sparkles, Infinity as InfinityIcon } from 'lucide-react'
import iglooImage from '../../assets/igloo_front.png'

const IglooWidgetSection = () => {
  const { t } = useTranslation('home')

  // Coordinates for the symmetrical triangle layout (1000x600 container)
  const positions = {
    dental: { x: 500, y: 80 },
    beauty: { x: 150, y: 500 },
    longevity: { x: 850, y: 500 },
  }

  const widgets = [
    {
      id: 'dental',
      label: 'Dental',
      path: '/services/dental',
      icon: <Smile className="w-8 h-8 text-cyan-500 mb-2" />,
      x: positions.dental.x,
      y: positions.dental.y,
    },
    {
      id: 'beauty',
      label: 'Beauty',
      path: '/services/beauty',
      icon: <Sparkles className="w-8 h-8 text-blue-500 mb-2" />,
      x: positions.beauty.x,
      y: positions.beauty.y,
    },
    {
      id: 'longevity',
      label: 'Longevity',
      path: '/services/longevity',
      icon: <InfinityIcon className="w-8 h-8 text-[#083358] mb-2" />,
      x: positions.longevity.x,
      y: positions.longevity.y,
    },
  ]

  return (
    <section className="relative py-20 lg:py-32 bg-slate-50 overflow-hidden">
       {/* Global background decoration could go here if needed */}

       <div className="mx-auto max-w-container px-4 text-center lg:px-0 mb-16 relative z-10">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-accentBlue mb-3">
             {t('services.caption', 'DIAGNOSTIK-FOKUS')}
          </h2>
          <h3 className="text-3xl font-medium tracking-tight sm:text-4xl lg:text-4xl">
             {t('igloo_widget.title', 'Anwendungsbereiche')}
          </h3>
       </div>

      <div className="mx-auto flex flex-col items-center justify-center gap-10 lg:block lg:h-[600px] lg:w-[1000px] relative">

        {/* Decorative connecting lines for desktop (Triangle) */}
        <svg className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none z-0">
             <defs>
                <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22d3ee">
                        <animate attributeName="stop-color" values="#22d3ee;#0ea5e9;#22d3ee" dur="4s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="100%" stopColor="#083358">
                         <animate attributeName="stop-color" values="#083358;#2563eb;#083358" dur="4s" repeatCount="indefinite" />
                    </stop>
                </linearGradient>
             </defs>

             {/* Path connecting the centers of the widgets */}
             <path
                d={`M ${positions.dental.x} ${positions.dental.y} L ${positions.beauty.x} ${positions.beauty.y} L ${positions.longevity.x} ${positions.longevity.y} Z`}
                stroke="url(#blueGradient)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-80"
             />
        </svg>

        {/* Central Image with Glow */}
        <div className="relative z-30 flex justify-center items-center h-full w-full pointer-events-auto cursor-pointer">
            {/* Blue Glow Effect */}
            <div className="absolute w-[300px] h-[300px] bg-blue-500/20 blur-[80px] rounded-full mix-blend-multiply" />

            <img
                src={iglooImage}
                alt="Igloo Pro"
                className="relative z-10 w-32 md:w-40 lg:w-48 drop-shadow-2xl transition-all duration-500 ease-in-out hover:scale-110"
            />
        </div>

        {/* Widgets */}
        <div className="flex flex-col gap-6 lg:absolute lg:inset-0 lg:block z-20 pointer-events-none">
            {widgets.map((widget) => (
            <Link
              key={widget.id}
              to={widget.path}
              className={`
                pointer-events-auto
                group flex items-center justify-center
                relative
                rounded-2xl
                shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl
                w-full max-w-[600px] h-40 sm:h-44
                bg-gradient-to-br from-cyan-400/50 via-blue-500/50 to-[#083358]/50 p-[1px]
                lg:absolute lg:left-[var(--x)] lg:top-[var(--y)] lg:-translate-x-1/2 lg:-translate-y-1/2
                lg:w-72 lg:h-48
              `}
              style={{
                '--x': `${widget.x}px`,
                '--y': `${widget.y}px`
              } as React.CSSProperties}
            >
                {/* Glassmorphism Inner Container */}
                <div className="flex h-full w-full flex-col items-center justify-center rounded-[15px] bg-white/70 backdrop-blur-xl border border-white/50 p-5 sm:p-6 transition-colors group-hover:bg-white/80">
                    <div className="transform transition-transform duration-300 group-hover:-translate-y-1">
                        {widget.icon}
                    </div>

                    <span className="text-2xl font-medium text-gray-900 group-hover:text-primary">
                        {widget.label}
                    </span>
                    <span className="mt-2 text-sm font-medium text-gray-500 group-hover:text-primary/70">
                        {t('common:readMore', 'Mehr erfahren')} →
                    </span>
                </div>
            </Link>
            ))}
        </div>

      </div>
    </section>
  )
}

export default IglooWidgetSection
