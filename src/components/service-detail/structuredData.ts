import { createBreadcrumbSchema, createFAQSchema, createServiceSchema } from '../seo'
import type { ServiceDetailViewModel } from './model'

export function createServiceDetailStructuredData(model: ServiceDetailViewModel, language: string) {
  const { content, entry, labels } = model
  return [
    createServiceSchema({
      name: content.hero.title,
      description: content.seo.description,
      url: entry.route.path,
      language,
      image: content.seo.image,
    }),
    createBreadcrumbSchema(
      [
        { name: labels.home, url: '/' },
        { name: labels.diagnostics, url: '/diagnostics' },
        { name: content.hero.title, url: entry.route.path },
      ],
      language,
    ),
    ...(content.faq?.items.length ? [createFAQSchema(content.faq.items, language)] : []),
  ]
}
