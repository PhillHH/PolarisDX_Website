import { useTranslation } from 'react-i18next'
import { Mail, Linkedin } from 'lucide-react'
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
      email: 'timr@polarisdx.net',
      linkedin: 'https://www.linkedin.com/in/tim-ritson-0824491b/',
    },
    {
      id: 'adriano_zucalla',
      image: AdrianoZuccalaJPEG,
      email: 'adrianoz@polarisdx.net',
      linkedin: 'https://www.linkedin.com/in/adriano-zuccala-6532691b7/',
    },
    {
      id: 'frank_stoffels',
      image: FrankStoffelsJPG,
      email: 'franks@polarisdx.net',
      linkedin: 'https://www.linkedin.com/in/frank-stoffels-a732b0262/',
    },
    {
      id: 'ulrike_schuerholz',
      image: UlrikeSchuerholzJPG,
      email: 'ulrikes@polarisdx.net',
      linkedin: 'https://www.linkedin.com/in/ulrike-sch%C3%BCrholz-97b9b7301/',
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
                    <p className="mb-4 text-sm leading-relaxed text-gray-500">
                        {t(`team.members.${member.id}.bio`)}
                    </p>

                    <div className="mt-auto flex gap-4">
                        <a href={`mailto:${member.email}`} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary transition-colors">
                            <Mail className="h-4 w-4" />
                            Email
                        </a>
                        <a href={member.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#0077b5] transition-colors">
                            <Linkedin className="h-4 w-4" />
                            LinkedIn
                        </a>
                    </div>
                </div>
            ))}
        </div>
       </div>
    </section>
  )
}

export default TeamSection
