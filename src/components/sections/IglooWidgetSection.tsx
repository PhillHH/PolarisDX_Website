import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import iglooImage from '../../assets/igloo_front.png'

const IglooWidgetSection = () => {
  const { t } = useTranslation('home')

  // Positions on a 0-100 scale (percentages of container width/height)
  // Based on former 800x600 layout: x/800 and y/600 converted to %
  const positions = {
    dental: { x: 50, y: 13.33 },      // 400/800, 80/600
    beauty: { x: 16.25, y: 83.33 },   // 130/800, 500/600
    longevity: { x: 83.75, y: 83.33 } // 670/800, 500/600
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
    <section className="relative py-20 lg:py-32 bg-slate-50 overflow-visible">

       <div className="mx-auto max-w-container px-4 text-center lg:px-0 mb-16 relative z-20">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-accentBlue mb-3">
             {t('services.caption', 'DIAGNOSTIK-FOKUS')}
          </h2>
          <h3 className="text-3xl font-medium tracking-tight sm:text-4xl lg:text-4xl">
             {t('igloo_widget.title', 'Anwendungsbereiche')}
          </h3>
       </div>

      <div className="mx-auto flex flex-col items-center justify-center gap-10 w-full max-w-container px-4 lg:px-0 lg:block lg:h-[620px] lg:w-full relative">

        {/* Decorative connecting lines for desktop (Triangle)
            Using viewBox="0 0 100 100" and preserveAspectRatio="none" to stretch the SVG to full container size.
        */}
        <svg
          className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ overflow: 'visible' }}
        >
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

             {/* Path connecting the centers of the widgets
                 Coordinates are now unitless (0-100) matching the viewBox
             */}
             <path
                d={`M ${positions.dental.x} ${positions.dental.y} L ${positions.beauty.x} ${positions.beauty.y} L ${positions.longevity.x} ${positions.longevity.y} Z`}
                stroke="url(#animatedGradient)"
                strokeWidth="0.5" // Thinner stroke relative to 100x100 coord system, roughly 3-5px equivalent depending on aspect ratio. Adjusted for visual balance.
                vectorEffect="non-scaling-stroke" // Ensures the line thickness is constant in pixels, if supported. Otherwise, rely on strokeWidth.
                strokeOpacity="1"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="drop-shadow(0 0 4px rgba(59,130,246,0.35))"
             />
             {/* Fallback stroke width without non-scaling-stroke might be weird if aspect ratio is extreme.
                 Let's stick to standard strokeWidth="0.8" or similar which is ~0.8% of viewbox.
                 On 1200px width, 0.8% is ~9px.
             */}
        </svg>

        {/* Central Image */}
        <div className="relative z-20 flex justify-center items-center h-full w-full pointer-events-none">
            <img
            src={iglooImage}
            alt="Igloo Pro"
            className="w-[260px] sm:w-[300px] lg:w-60 drop-shadow-2xl transition-all"
            />
        </div>

        {/* Widgets */}
        <div className="flex flex-col gap-6 lg:absolute lg:inset-0 lg:block z-30">
            {widgets.map((widget) => (
            <Link
              key={widget.id}
              to={widget.path}
              className={`
                group flex items-center justify-center
                relative
                rounded-2xl
                shadow-lg transition-all hover:scale-105 hover:shadow-xl
                w-[88vw] max-w-[660px] h-[110px] sm:h-[120px]
                bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 p-[2px]
                lg:absolute lg:left-[var(--x)] lg:top-[var(--y)] lg:-translate-x-1/2 lg:-translate-y-1/2
                lg:w-64 lg:h-40
              `}
              style={{
                '--x': `${widget.x}%`,
                '--y': `${widget.y}%`
              } as React.CSSProperties}
            >
                {/* Inner white container to create the border effect */}
                <div className="flex h-full w-full flex-col items-center justify-center rounded-[14px] bg-white p-3.5 sm:p-4.5">
                    <span className="text-2xl font-medium text-gray-900 group-hover:text-secondary">
                        {widget.label}
                    </span>
                    <span className="mt-2 text-base text-gray-500 group-hover:text-secondary/70">
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
