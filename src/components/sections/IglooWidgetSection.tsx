import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import iglooImage from '../../assets/igloo_front.png'

const IglooWidgetSection = () => {
  const { t } = useTranslation('home')

  // Coordinates for the symmetrical triangle layout (800x600 container)
  const positions = {
    dental: { x: 400, y: 100 },
    beauty: { x: 130, y: 500 },
    longevity: { x: 670, y: 500 },
  }

  const widgets = [
    {
      id: 'dental',
      label: 'Dental',
      path: '/services/dental',
      x: positions.dental.x,
      y: positions.dental.y,
    },
    {
      id: 'beauty',
      label: 'Beauty',
      path: '/services/beauty',
      x: positions.beauty.x,
      y: positions.beauty.y,
    },
    {
      id: 'longevity',
      label: 'Longevity',
      path: '/services/longevity',
      x: positions.longevity.x,
      y: positions.longevity.y,
    },
  ]

  return (
    <section className="relative py-20 lg:py-32">
       <div className="mx-auto max-w-container px-4 text-center lg:px-0 mb-16">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-accentBlue mb-3">
             {t('services.caption', 'DIAGNOSTIK-FOKUS')}
          </h2>
          <h3 className="text-3xl font-medium tracking-tight sm:text-4xl lg:text-4xl">
             {t('igloo_widget.title', 'Anwendungsbereiche')}
          </h3>
       </div>

      <div className="mx-auto flex flex-col items-center justify-center gap-10 lg:block lg:h-[600px] lg:w-[800px] relative">

        {/* Central Image */}
        <div className="relative z-10 flex justify-center items-center h-full w-full">
            <img
            src={iglooImage}
            alt="Igloo Pro"
            className="w-48 md:w-60 lg:w-72 drop-shadow-2xl transition-all"
            />
        </div>

        {/* Widgets - Responsive: Stacked on mobile, Absolute positioned on Desktop */}
        <div className="flex flex-col gap-6 lg:absolute lg:inset-0 lg:block">
            {widgets.map((widget) => (
            <Link
                key={widget.id}
                to={widget.path}
                className={`
                    group flex flex-col items-center justify-center
                    rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition-all hover:scale-105 hover:shadow-xl hover:border-secondary/20
                    w-64 h-40
                    lg:absolute lg:-translate-x-1/2 lg:-translate-y-1/2
                `}
                style={{
                    // These styles only affect layout when position is absolute (lg)
                    left: `lg:calc(${widget.x}px)`, // Note: inline styles don't support 'lg:' prefix.
                    // We need to apply 'left' and 'top' conditionally or just let them be overridden by CSS if needed.
                    // However, standard style prop applies always.
                    // On mobile (flex-col), left/top have no effect on static position flow.
                    // So we can safely apply them.
                    left: `${widget.x}px`,
                    top: `${widget.y}px`
                }}
            >
                <span className="text-2xl font-medium text-gray-900 group-hover:text-secondary">
                {widget.label}
                </span>
                <span className="mt-2 text-base text-gray-500 group-hover:text-secondary/70">
                    {t('common:readMore', 'Mehr erfahren')} →
                </span>
            </Link>
            ))}
        </div>

        {/* Decorative connecting lines for desktop (Triangle) */}
        <svg className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none -z-10">
             <defs>
                <linearGradient id="animatedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22d3ee">
                        <animate attributeName="stop-color" values="#22d3ee;#3b82f6;#9333ea;#22d3ee" dur="3s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="50%" stopColor="#3b82f6">
                        <animate attributeName="stop-color" values="#3b82f6;#9333ea;#22d3ee;#3b82f6" dur="3s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="100%" stopColor="#9333ea">
                        <animate attributeName="stop-color" values="#9333ea;#22d3ee;#3b82f6;#9333ea" dur="3s" repeatCount="indefinite" />
                    </stop>
                </linearGradient>
             </defs>

             {/* Path connecting the centers of the widgets */}
             <path
                d={`M ${positions.dental.x} ${positions.dental.y} L ${positions.beauty.x} ${positions.beauty.y} L ${positions.longevity.x} ${positions.longevity.y} Z`}
                stroke="url(#animatedGradient)"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
             />
        </svg>

      </div>
    </section>
  )
}

export default IglooWidgetSection
