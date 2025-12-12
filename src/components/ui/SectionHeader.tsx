type SectionHeaderProps = {
  id?: string
  caption: string
  title: string
  align?: 'left' | 'center'
  titleClassName?: string
  className?: string
}

const SectionHeader = ({
  id,
  caption,
  title,
  align = 'center',
  titleClassName,
  className = '',
}: SectionHeaderProps) => {
  const alignment = align === 'center' ? 'items-center text-center' : 'items-start text-left'
  const titleClasses =
    titleClassName ||
    'text-[40px] leading-[47px] font-medium tracking-tight text-gray-900 lg:text-[44px] lg:leading-[52px]'

  return (
    <div id={id} className={`flex flex-col gap-2 ${alignment} ${className}`}>
      <div className="inline-block rounded p-[1px] bg-gradient-to-r from-secondary via-primary to-primary-deep shadow-lg shadow-primary/20">
        <div className="rounded-sm bg-slate-50 px-4 py-2 lg:px-3 lg:py-1">
          <span className="text-sm font-semibold uppercase tracking-wide text-gray-900 lg:text-xs">
            {caption}
          </span>
        </div>
      </div>
      <h2
        className={titleClasses}
      >
        {title}
      </h2>
    </div>
  )
}

export default SectionHeader
