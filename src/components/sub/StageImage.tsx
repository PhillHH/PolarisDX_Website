import type { ArticleImageAsset } from '../../assets/articleImages'

/** 1 × 1 Pixel: die Telefon-Quelle des Desktop-Bilds — dort wird nichts aus dem Netz geladen. */
const NOTHING = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='

type StageImageProps = {
  image: ArticleImageAsset
  /** Darstellungsbreite neben dem Text (ab 901 px). */
  desktopSizes: string
  /** Darstellungsbreite unter dem Text (bis 900 px). */
  mobileSizes: string
  alt?: string
  className?: string
}

/**
 * SC-028: Bild in der Bühne einer Unterseite.
 *
 * Ab 901 px steht es neben dem Text im ersten Bildschirm und ist dort das größte Element (LCP):
 * `eager` mit Vorrang. Am Telefon steht es unter dem Text, also unter dem Falz — dort wäre `eager`
 * ein Verstoß gegen die Bildregeln (PT25.3) und `lazy` am Desktop einer gegen das LCP. `loading`
 * lässt sich nicht je Breite setzen, deshalb zwei Elemente: das Desktop-Bild bekommt am Telefon
 * eine 1-Pixel-Quelle (kein Abruf), das Telefon-Bild ist `lazy` und am Desktop ausgeblendet
 * (ausgeblendete `lazy`-Bilder werden nie geladen). Jede Breite lädt so genau ein Bild.
 */
const StageImage = ({
  image,
  desktopSizes,
  mobileSizes,
  alt = '',
  className = '',
}: StageImageProps) => {
  const srcSet = (format: 'avif' | 'webp') =>
    image.variants.map((variant) => `${variant[format]} ${variant.width}w`).join(', ')
  return (
    <>
      <picture className="contents">
        <source media="(max-width: 900px)" srcSet={NOTHING} />
        <source type="image/avif" srcSet={srcSet('avif')} sizes={desktopSizes} />
        <source type="image/webp" srcSet={srcSet('webp')} sizes={desktopSizes} />
        <img
          src={image.src}
          alt={alt}
          width={image.width}
          height={image.height}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className={`sc028-desk ${className}`}
        />
      </picture>
      <picture className="contents">
        <source type="image/avif" srcSet={srcSet('avif')} sizes={mobileSizes} />
        <img
          src={image.src}
          alt={alt}
          width={image.width}
          height={image.height}
          loading="lazy"
          decoding="async"
          className={`sc028-mob ${className}`}
        />
      </picture>
    </>
  )
}

export default StageImage
