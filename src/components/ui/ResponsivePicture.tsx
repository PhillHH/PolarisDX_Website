import type { ArticleImageAsset } from '../../assets/articleImages'

/**
 * AP25 PT25.3 — responsive Bild mit AVIF-, WebP- und `<img>`-Fallback.
 *
 * - `picture` bekommt `display: contents`: es erzeugt keine eigene Box, das `<img>` sitzt
 *   layoutseitig genau dort, wo vorher das nackte `<img>` sass (keine neue Grundlinienluecke,
 *   keine visuelle Aenderung).
 * - `width`/`height` sind die nativen Abmessungen und reservieren das Seitenverhaeltnis.
 * - `priority` ist ausschliesslich fuer das gemessene LCP-Bild einer Route gedacht: eager +
 *   `fetchpriority="high"`. Ohne `priority` laedt das Bild `lazy` — es gibt keine globale
 *   Vorrangstrategie.
 * - `alt` wird unveraendert durchgereicht; dekorative Bilder behalten ihr leeres `alt`.
 */
export function ResponsivePicture({
  image,
  alt,
  sizes,
  className,
  priority = false,
}: {
  image: ArticleImageAsset
  alt: string
  sizes: string
  className?: string
  priority?: boolean
}) {
  const srcSet = (format: 'avif' | 'webp') =>
    image.variants.map((variant) => `${variant[format]} ${variant.width}w`).join(', ')
  return (
    <picture className="contents">
      <source type="image/avif" srcSet={srcSet('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet('webp')} sizes={sizes} />
      <img
        src={image.src}
        alt={alt}
        width={image.width}
        height={image.height}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
        className={className}
      />
    </picture>
  )
}
