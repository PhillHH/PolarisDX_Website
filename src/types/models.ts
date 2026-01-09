import type { ReactNode } from 'react'

export type ProductCategory =
  | 'Diagnostics'
  | 'Monitoring'
  | 'Home Care'
  | 'Chronic Care'
  | 'Protection'
  | 'Hygiene'
  | 'Recovery'
  | 'Emergency'
  | 'Service'

export type ProductBadge = 'New' | 'Popular' | 'Limited'

export interface TechSpec {
  parameter: string
  specification: string
}

export interface Product {
  id: string
  slug: string
  category: ProductCategory
  price: number
  badge?: ProductBadge
  image?: string
}

export type ArticleCategory =
  | 'Sustainability'
  | 'Telemedicine'
  | 'Economics'
  | 'Health Article'

export interface ArticleSection {
  heading?: string
  paragraphs: string[]
  listItems?: string[]
  image?: string
}

export interface Article {
  id: string
  slug: string
  category: ArticleCategory
  author: string
  date: string
  readTime: string
  sections: ArticleSection[]
}

export type ServiceId =
  | 'dental'
  | 'beauty'
  | 'longevity'
  | 'poc-systemloesungen'
  | 'praeventions-checks'
  | 'infektion-entzuendung'
  | 'stoffwechsel-herz'
  | 'hormon-tests'
  | 'kompatibilitaet-integration'

export interface Service {
  id: ServiceId
  title: string
  description: string
  translationKey: string
  icon?: ReactNode
}

export interface Event {
  id: number
  title: string
  date: string
  endDate?: string
  location: string
  description?: string
  link?: string
}

export interface Testimonial {
  id: string
  role: string
  name: string
  title: string
  focus: string
  text: string
  avatar?: string
  rating?: number
}

export interface BlogPost {
  id: string
  slug: string
  image?: string
}

export interface SocialLink {
  label: string
  href: string
  icon: ReactNode
}

export interface AgbSection {
  id: string
  title: string
  content: string[]
}

export interface AgbData {
  title: string
  subtitle: string
  date: string
  sections: AgbSection[]
}
