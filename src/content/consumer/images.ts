/**
 * Consumer-Produktbilder als responsive Quellen (AP21 PT21.7).
 *
 * Bis PT21.6 lieferten die drei Produktseiten ihre Bilder als JPEG-Original
 * aus — gemessen 1122px nativ in ein 358–570px breites Feld, also Faktor
 * 2,0x bis 3,1x, ohne `srcset`, ohne WebP und ohne `width`/`height`. Der
 * Spray-Hero kostete damit 325 KB fuer einen 358px-Platz auf dem Handy.
 *
 * Dieses Modul buendelt pro Bild die von `scripts/build-consumer-images.mjs`
 * erzeugten WebP-Breiten plus das JPEG als `<picture>`-Fallback. Es ist die
 * EINE Stelle, an der Bildquellen stehen; `check:consumer-images` prueft,
 * dass Modul, Dateien und Generator nicht auseinanderlaufen.
 */

import duoHeroJpeg from '../../assets/landingpages-consumer/duo-hero-products-together.jpeg'
import duoHero448 from '../../assets/landingpages-consumer/duo-hero-products-together-448w.webp'
import duoHero768 from '../../assets/landingpages-consumer/duo-hero-products-together-768w.webp'
import duoHero1122 from '../../assets/landingpages-consumer/duo-hero-products-together-1122w.webp'

import maskHeroJpeg from '../../assets/landingpages-consumer/mask-hero-botanical.jpeg'
import maskHero448 from '../../assets/landingpages-consumer/mask-hero-botanical-448w.webp'
import maskHero768 from '../../assets/landingpages-consumer/mask-hero-botanical-768w.webp'
import maskHero1122 from '../../assets/landingpages-consumer/mask-hero-botanical-1122w.webp'

import sprayHeroJpeg from '../../assets/landingpages-consumer/spray-hero-12pack-office.jpeg'
import sprayHero448 from '../../assets/landingpages-consumer/spray-hero-12pack-office-448w.webp'
import sprayHero768 from '../../assets/landingpages-consumer/spray-hero-12pack-office-768w.webp'
import sprayHero1122 from '../../assets/landingpages-consumer/spray-hero-12pack-office-1122w.webp'

import sprayStillJpeg from '../../assets/landingpages-consumer/spray-still-life.jpeg'
import sprayStill448 from '../../assets/landingpages-consumer/spray-still-life-448w.webp'
import sprayStill768 from '../../assets/landingpages-consumer/spray-still-life-768w.webp'
import sprayStill1122 from '../../assets/landingpages-consumer/spray-still-life-1122w.webp'

/** Die Breiten, die der Generator erzeugt — aus der gemessenen Darstellung. */
export const CONSUMER_IMAGE_WIDTHS = [448, 768, 1122] as const

export interface ResponsiveImage {
  /** JPEG-Original als `<img src>`-Fallback fuer Browser ohne WebP. */
  readonly fallback: string
  /** WebP-Kandidaten mit ihrer echten Breite. */
  readonly webp: readonly { readonly width: number; readonly src: string }[]
  /** Native Abmessungen — als `width`/`height` gesetzt, damit nichts springt. */
  readonly width: number
  readonly height: number
}

const image = (
  fallback: string,
  sources: readonly string[],
  width: number,
  height: number,
): ResponsiveImage => ({
  fallback,
  webp: CONSUMER_IMAGE_WIDTHS.map((candidate, index) => ({
    width: candidate,
    src: sources[index],
  })),
  width,
  height,
})

export const CONSUMER_IMAGES = {
  duoHero: image(duoHeroJpeg, [duoHero448, duoHero768, duoHero1122], 1122, 1402),
  maskHero: image(maskHeroJpeg, [maskHero448, maskHero768, maskHero1122], 1122, 1402),
  sprayHero: image(sprayHeroJpeg, [sprayHero448, sprayHero768, sprayHero1122], 1122, 1402),
  sprayStill: image(sprayStillJpeg, [sprayStill448, sprayStill768, sprayStill1122], 1254, 1254),
} as const satisfies Record<string, ResponsiveImage>

export type ConsumerImageKey = keyof typeof CONSUMER_IMAGES

/** `srcset`-Zeichenkette aus den WebP-Kandidaten. */
export const webpSrcSet = (source: ResponsiveImage): string =>
  source.webp.map(({ src, width }) => `${src} ${width}w`).join(', ')
