import Eyebrow from './Eyebrow'

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
    'text-hero-sm leading-[47px] font-medium tracking-tight text-gray-900 lg:text-[44px] lg:leading-[52px]'

  return (
    <div id={id} className={`flex flex-col gap-2 ${alignment} ${className}`}>
      <Eyebrow>{caption}</Eyebrow>
      <h2 className={titleClasses}>{title}</h2>
    </div>
  )
}

export default SectionHeader
