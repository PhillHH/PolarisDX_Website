/**
 * Oeffentliche API des Design-Systems (Barrel, §Phase 2.12).
 *
 * App und Pattern-Library importieren Komponenten ausschliesslich von hier
 * (eine Quelle pro Komponente — Holy Grail §Phase 7.8). Wird pro migrierter
 * Atomic-Ebene erweitert.
 */

// Atoms (primitives-layout/)
export { Container, type ContainerProps } from './primitives-layout/container'
export { Stack, type StackProps } from './primitives-layout/stack'
export { Cluster, type ClusterProps } from './primitives-layout/cluster'
export { Grid, type GridProps } from './primitives-layout/grid'

// Atoms (core/)
export { Button, type ButtonProps } from './core/button'
export { Input, type InputProps } from './core/input'
export { Textarea, type TextareaProps } from './core/textarea'
export { Select, type SelectProps } from './core/select'
export { Eyebrow, type EyebrowProps, type EyebrowSize } from './core/eyebrow'
export { Badge, type BadgeProps } from './core/badge'
export { Stat, type StatProps } from './core/stat'

// Molecules (compound/)
export { Accordion, type AccordionProps, type AccordionItem } from './compound/accordion'
export { AuthorByline, type AuthorBylineProps } from './compound/author-byline'
export { Breadcrumbs, type BreadcrumbsProps, type BreadcrumbItem } from './compound/breadcrumbs'
export { Card, type CardProps } from './compound/card'
export { ContactCallout, type ContactCalloutProps } from './compound/contact-callout'
export { InfoItem, type InfoItemProps } from './compound/info-item'
export { MediaLink, type MediaLinkProps } from './compound/media-link'
export { NavTile, type NavTileProps } from './compound/nav-tile'
export { Panel, type PanelProps } from './compound/panel'
export { FormField, type FormFieldProps } from './compound/form-field'
export { SectionHeader, type SectionHeaderProps } from './compound/section-header'

// Feedback (feedback/) — UI-States: loading/empty/error/success
export { Alert, type AlertProps } from './feedback/alert'
export { EmptyState, type EmptyStateProps } from './feedback/empty-state'
export { Spinner, type SpinnerProps } from './feedback/spinner'
