import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import iglooImage from '../../assets/igloo_front.png'

const IglooWidgetSection = () => {
  const { t } = useTranslation('home')

  const widgets = [
    {
      id: 'dental',
      label: 'Dental',
      path: '/services/dental',
      // Positioning style for the radial layout
      positionClass: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2',
    },
    {
      id: 'beauty',
      label: 'Beauty',
      path: '/services/beauty',
      positionClass: 'bottom-0 left-0 -translate-x-1/4 translate-y-1/4',
    },
    {
      id: 'longevity',
      label: 'Longevity',
      path: '/services/longevity',
      positionClass: 'bottom-0 right-0 translate-x-1/4 translate-y-1/4',
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
            className="w-64 md:w-80 lg:w-96 drop-shadow-2xl"
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
                    w-48 h-32
                    lg:absolute ${widget.positionClass}
                `}
            >
                <span className="text-xl font-medium text-gray-900 group-hover:text-secondary">
                {widget.label}
                </span>
                <span className="mt-2 text-sm text-gray-500 group-hover:text-secondary/70">
                    {t('common:readMore', 'Mehr erfahren')} →
                </span>
            </Link>
            ))}
        </div>

        {/* Decorative connecting lines for desktop (optional, visualized via SVG) */}
        <svg className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none -z-10 text-gray-200">
             {/* Simple curves connecting widgets to center area */}
             {/* Top to Center */}
             <path d="M 400 100 Q 400 200 400 250" stroke="currentColor" strokeWidth="2" fill="none" />
             {/* Bottom Left to Center */}
             <path d="M 150 550 Q 250 450 350 350" stroke="currentColor" strokeWidth="2" fill="none" />
             {/* Bottom Right to Center */}
             <path d="M 650 550 Q 550 450 450 350" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>

      </div>
    </section>
  )
}

export default IglooWidgetSection
