import { useTranslation } from 'react-i18next'
import { Mail, Linkedin } from 'lucide-react'
import SectionHeader from '../ui/SectionHeader'
import ImagePlaceholder from '../ui/ImagePlaceholder'
import AdrianoZuccalaJPEG from '../../assets/Adriano Zuccala.webp'
import FrankStoffelsJPG from '../../assets/Frank Stoffels.webp'
import UlrikeSchuerholzJPG from '../../assets/Ulrike Schuerholz.webp'

const TeamSection = () => {
  const { t } = useTranslation('about')

  const team: {
    id: string
    image: string | null
    email: string
    linkedin: string
  }[] = [
    {
      id: 'tim_ritson',
      // Kein echtes Foto vorhanden -> sprach-neutraler ImagePlaceholder (kein externes placehold.co).
      image: null,
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

  const emailLabel = t('team.email', 'E-Mail')

  return (
    <section className="bg-slate-50 py-20 lg:py-28">
      <div className="mx-auto max-w-container px-4 lg:px-0">
        <SectionHeader
          caption={t('team.caption', 'UNSER TEAM')}
          title={t('team.title', 'Lernen Sie unsere Experten kennen')}
          align="center"
          className="mb-16"
        />

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => {
            const name = t(`team.members.${member.id}.name`)
            return (
              <div
                key={member.id}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-card"
              >
                {member.image ? (
                  <div className="relative w-full overflow-hidden bg-gray-100">
                    <img
                      src={member.image}
                      alt={name}
                      width={300}
                      height={360}
                      loading="lazy"
                      decoding="async"
                      className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <ImagePlaceholder
                    label={t('team.photo_placeholder', 'Teamfoto')}
                    className="h-72 w-full rounded-none border-0 border-b border-slate-200"
                  />
                )}

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-sans text-xl font-medium text-heading">{name}</h3>
                  <p className="mt-1 text-sm font-semibold leading-snug text-accent">
                    {t(`team.members.${member.id}.role`)}
                  </p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-500">
                    {t(`team.members.${member.id}.bio`)}
                  </p>

                  <div className="mt-5 flex gap-4 border-t border-slate-100 pt-4">
                    <a
                      href={`mailto:${member.email}`}
                      aria-label={`${emailLabel}: ${name}`}
                      className="flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-accent"
                    >
                      <Mail className="h-4 w-4" aria-hidden="true" />
                      {emailLabel}
                    </a>
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`LinkedIn: ${name}`}
                      className="flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-social-linkedin"
                    >
                      <Linkedin className="h-4 w-4" aria-hidden="true" />
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default TeamSection
