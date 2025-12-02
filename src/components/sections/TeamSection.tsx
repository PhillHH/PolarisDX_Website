import { useTranslation } from 'react-i18next'
import SectionHeader from '../ui/SectionHeader'
import AdrianoZuccalaJPEG from '../../assets/Adriano Zuccala.jpeg'
import FrankStoffelsJPG from '../../assets/Frank Stoffels.jpg'
import UlrikeSchuerholzJPG from '../../assets/Ulrike Schuerholz.jpg'

const TeamSection = () => {
  const { t } = useTranslation('about')

  const team = [
    {
      id: 'tim_ritson',
      image: 'https://placehold.co/400x400',
    },
    {
      id: 'adriano_zucalla',
      image: AdrianoZuccalaJPEG,
    },
    {
      id: 'frank_stoffels',
      image: FrankStoffelsJPG,
    },
    {
      id: 'ulrike_schuerholz',
      image: UlrikeSchuerholzJPG,
    },
  ]

  return (
    <section className="py-20 lg:py-32">
       <div className="mx-auto max-w-container px-4 lg:px-0">
        <SectionHeader
            caption={t('team.caption', 'UNSER TEAM')}
            title={t('team.title', 'Lernen Sie unsere Experten kennen')}
            align="center"
            className="mb-16"
        />

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
                <div key={member.id} className="flex flex-col items-start text-left group">
                    <div className="mb-6 w-full overflow-hidden rounded-2xl bg-gray-100 relative">
                         {/* Gradient overlay on hover could be nice, keeping it simple for now */}
                        <img
                            src={member.image}
                            alt={t(`team.members.${member.id}.name`)}
                            className="h-[400px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                    <h3 className="font-sans text-2xl font-medium text-gray-900">
                        {t(`team.members.${member.id}.name`)}
                    </h3>
                    <p className="mb-4 font-sans text-base font-normal leading-8 text-secondary h-16">
                         {t(`team.members.${member.id}.role`)}
                    </p>
                    <p className="text-sm leading-relaxed text-gray-500">
                        {t(`team.members.${member.id}.bio`)}
                    </p>
                </div>
            ))}
        </div>
       </div>
    </section>
  )
}

export default TeamSection
