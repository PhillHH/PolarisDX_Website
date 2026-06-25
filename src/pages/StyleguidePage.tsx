/**
 * StyleguidePage — Lebende Pattern Library (§Phase 7.1).
 *
 * HOLY GRAIL (§Phase 7.8): Diese Seite importiert **dieselben** Komponenten aus
 * dem Barrel `~/design-system` wie die Produktion — es gibt genau **eine**
 * Definition pro Komponente. Ändert sich ein Atom, ändert sich es hier und in
 * der App gleichzeitig (kein paralleler „Demo"-Klon).
 *
 * Jedes Atom/Molecule/Feedback-Element wird **isoliert** mit allen
 * Variants/Sizes/States + Edge-Cases gezeigt (§Phase 7.1). Anker-IDs matchen die
 * 5-teilige Komponenten-Doku in `docs/design-system/components/<id>.md`
 * (z. B. `/styleguide#button` ↔ `button.md`).
 *
 * Die Seite ist eine interne Referenz: `noindex` (nicht in Sitemap/Navigation),
 * eigene schlanke Chrome (kein B2B-Layout), `data-theme="light"` gepinnt.
 *
 * Snapshot-Ziel der visuellen Regressionssuite (`e2e/styleguide-visual.spec.ts`,
 * §Phase 7.3): die Galerie rendert deterministisch (keine Random-/Datums-Werte).
 */

import * as React from 'react'
import { Phone, Mail, FileText, Download, Microscope, Beaker, ArrowRight } from 'lucide-react'
import SEOHead from '~/components/seo/SEOHead'
import {
  Container,
  Stack,
  Cluster,
  Grid,
  Button,
  Input,
  Textarea,
  Select,
  Eyebrow,
  Badge,
  Stat,
  Accordion,
  AuthorByline,
  Breadcrumbs,
  Card,
  ContactCallout,
  InfoItem,
  MediaLink,
  NavTile,
  Panel,
  FormField,
  SectionHeader,
  Alert,
  EmptyState,
  Spinner,
} from '~/design-system'

// =============================================================================
// GALERIE-HILFEN (nur lokal — kein Teil der öffentlichen DS-API)
// =============================================================================

/** Ein dokumentierter Komponenten-Block mit Anker-ID (matcht die Doku-Datei). */
function Specimen({
  id,
  title,
  level,
  source,
  children,
}: {
  id: string
  title: string
  level: 'Atom' | 'Layout-Atom' | 'Molecule' | 'Feedback'
  source: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-[var(--color-border)] py-12">
      <header className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-2xl font-medium tracking-tight text-fg">{title}</h2>
        <Cluster gap={2}>
          <Badge variant="accent">{level}</Badge>
          <code className="text-xs text-fg-muted">{source}</code>
        </Cluster>
      </header>
      {children}
    </section>
  )
}

/** Eine beschriftete Spezimen-Variante (eine Zelle der Galerie). */
function Variant({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-wider text-fg-muted">{label}</span>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

const ACCORDION_ITEMS = [
  {
    id: 'a1',
    trigger: 'Wie funktioniert der POC-Reader?',
    content: 'Probe einlegen, 3–15 Minuten warten, Ergebnis ablesen.',
  },
  {
    id: 'a2',
    trigger: 'Welche Parameter werden gemessen?',
    content: 'Vitamin-D, CRP und weitere laborpräzise Marker.',
  },
]

const BREADCRUMB_ITEMS = [
  { label: 'Start', href: '/' },
  { label: 'Diagnostik', href: '/diagnostics' },
  { label: 'Aktuelle Seite' },
]

// =============================================================================
// SEITE
// =============================================================================

export default function StyleguidePage() {
  return (
    <div data-theme="light" className="min-h-screen bg-bg text-fg">
      <SEOHead
        title="Styleguide — Pattern Library"
        description="Lebende Pattern Library des Design-Systems: alle Atome, Molecules und Feedback-Elemente mit Variants, Sizes, States und Edge-Cases."
        noindex
      />

      <Container className="py-16">
        <Stack gap={4}>
          <Eyebrow>Design System</Eyebrow>
          <h1 className="text-4xl font-medium tracking-tight text-fg sm:text-5xl">
            Pattern Library
          </h1>
          <p className="max-w-reading text-lg leading-body text-fg-muted">
            Lebende Referenz aller öffentlichen Komponenten aus{' '}
            <code className="text-fg">~/design-system</code>. Holy Grail: Diese Seite und die
            Produktion teilen genau <strong>eine</strong> Definition pro Komponente. Jede Komponente
            hat eine 5-teilige Doku unter{' '}
            <code className="text-fg">docs/design-system/components/</code>.
          </p>
        </Stack>

        {/* ============================ LAYOUT-ATOME ============================ */}

        <Specimen
          id="container"
          title="Container"
          level="Layout-Atom"
          source="primitives-layout/container.tsx"
        >
          <p className="mb-4 text-sm text-fg-muted">
            Horizontal zentrierter Inhalts-Rahmen (max-w-container + seitliche Gutter). Diese ganze
            Seite läuft in einem <code>Container</code>.
          </p>
          <Container className="rounded-lg border border-dashed border-[var(--color-border)] bg-bg-subtle py-4 text-center text-sm text-fg-muted">
            mx-auto · max-w-container · px-4 lg:px-0
          </Container>
        </Specimen>

        <Specimen id="stack" title="Stack" level="Layout-Atom" source="primitives-layout/stack.tsx">
          <Stack gap={3}>
            <Variant label="gap=2 / gap=6 (8pt-Soft-Grid)">
              <Stack gap={2} className="rounded-lg bg-bg-subtle p-4">
                <div className="h-6 rounded bg-primary/20" />
                <div className="h-6 rounded bg-primary/20" />
                <div className="h-6 rounded bg-primary/20" />
              </Stack>
              <Stack gap={6} className="rounded-lg bg-bg-subtle p-4">
                <div className="h-6 rounded bg-primary/20" />
                <div className="h-6 rounded bg-primary/20" />
              </Stack>
            </Variant>
          </Stack>
        </Specimen>

        <Specimen
          id="cluster"
          title="Cluster"
          level="Layout-Atom"
          source="primitives-layout/cluster.tsx"
        >
          <Cluster gap={3} className="rounded-lg bg-bg-subtle p-4">
            <Badge>Tag A</Badge>
            <Badge variant="accent">Tag B</Badge>
            <Badge variant="success">Tag C</Badge>
            <Badge>Wrappt bei schmalen Viewports</Badge>
          </Cluster>
        </Specimen>

        <Specimen id="grid" title="Grid" level="Layout-Atom" source="primitives-layout/grid.tsx">
          <p className="mb-4 text-sm text-fg-muted">
            cols=3 — teilt 12 sauber (mobil 1 → sm 2 → lg 3).
          </p>
          <Grid cols={3} gap={4}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="rounded-lg bg-bg-subtle p-6 text-center text-sm text-fg-muted"
              >
                Zelle {n}
              </div>
            ))}
          </Grid>
        </Specimen>

        {/* ============================ CORE-ATOME ============================ */}

        <Specimen id="button" title="Button" level="Atom" source="core/button.tsx">
          <Stack gap={4}>
            <Variant label="variant">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <span className="rounded-lg bg-brand-navy p-3">
                <Button variant="outline">Outline (on-dark)</Button>
              </span>
            </Variant>
            <Variant label="size">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon" aria-label="Icon-Button">
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Variant>
            <Variant label="state">
              <Button>Default</Button>
              <Button disabled>Disabled</Button>
              <Button to="/diagnostics">Als Router-Link (to)</Button>
              <Button href="https://example.com">Als Anchor (href)</Button>
            </Variant>
          </Stack>
        </Specimen>

        <Specimen id="input" title="Input" level="Atom" source="core/input.tsx">
          <Stack gap={4} className="max-w-reading">
            <Variant label="state=default">
              <Input placeholder="z. B. Maria Musterfrau" defaultValue="" />
            </Variant>
            <Variant label="state=error">
              <Input state="error" defaultValue="Ungültige Eingabe" />
            </Variant>
            <Variant label="disabled">
              <Input placeholder="Deaktiviert" disabled />
            </Variant>
          </Stack>
        </Specimen>

        <Specimen id="textarea" title="Textarea" level="Atom" source="core/textarea.tsx">
          <Stack gap={4} className="max-w-reading">
            <Variant label="state=default">
              <Textarea placeholder="Ihre Nachricht …" />
            </Variant>
            <Variant label="state=error">
              <Textarea state="error" defaultValue="Bitte ausfüllen" />
            </Variant>
          </Stack>
        </Specimen>

        <Specimen id="select" title="Select" level="Atom" source="core/select.tsx">
          <Stack gap={4} className="max-w-reading">
            <Variant label="state=default">
              <Select defaultValue="1">
                <option value="1">Option A</option>
                <option value="2">Option B</option>
              </Select>
            </Variant>
            <Variant label="state=error">
              <Select state="error" defaultValue="1">
                <option value="1">Option A</option>
                <option value="2">Option B</option>
              </Select>
            </Variant>
          </Stack>
        </Specimen>

        <Specimen id="eyebrow" title="Eyebrow" level="Atom" source="core/eyebrow.tsx">
          <Variant label="size">
            <Eyebrow size="default">Default</Eyebrow>
            <Eyebrow size="sm">Small</Eyebrow>
          </Variant>
        </Specimen>

        <Specimen id="badge" title="Badge" level="Atom" source="core/badge.tsx">
          <Stack gap={4}>
            <Variant label="variant">
              <Badge variant="brand">Brand</Badge>
              <Badge variant="accent">Accent</Badge>
              <Badge variant="success">Success</Badge>
            </Variant>
            <Variant label="uppercase">
              <Badge uppercase>Kategorie</Badge>
            </Variant>
          </Stack>
        </Specimen>

        <Specimen id="stat" title="Stat" level="Atom" source="core/stat.tsx">
          <p className="mb-4 text-sm text-fg-muted">
            Lebt auf dunklem Grund (Hero) — on-dark-Tonalität.
          </p>
          <Cluster gap={8} className="rounded-xl bg-brand-navy p-8">
            <Stat value="48" suffix="h" label="Durchlaufzeit" />
            <Stat value="99.9" suffix="%" label="Verfügbarkeit" />
            <Stat value="15" suffix="min" label="bis Ergebnis" />
          </Cluster>
        </Specimen>

        {/* ============================ MOLECULES ============================ */}

        <Specimen
          id="section-header"
          title="SectionHeader"
          level="Molecule"
          source="compound/section-header.tsx"
        >
          <Stack gap={8}>
            <SectionHeader
              align="center"
              caption="Zentriert"
              title="Überschrift, zentriert ausgerichtet"
            />
            <SectionHeader
              align="left"
              caption="Linksbündig"
              title="Überschrift, links ausgerichtet"
            />
          </Stack>
        </Specimen>

        <Specimen
          id="form-field"
          title="FormField"
          level="Molecule"
          source="compound/form-field.tsx"
        >
          <Stack gap={4} className="max-w-reading">
            <FormField
              label="Name"
              placeholder="Maria Musterfrau"
              helperText="Vor- und Nachname."
            />
            <FormField
              label="E-Mail"
              error="Bitte eine gültige E-Mail-Adresse eingeben."
              defaultValue="ungültig"
            />
            <FormField as="textarea" label="Nachricht" placeholder="Ihre Nachricht …" />
            <FormField as="select" label="Anliegen" defaultValue="1">
              <option value="1">Allgemeine Anfrage</option>
              <option value="2">Support</option>
            </FormField>
          </Stack>
        </Specimen>

        <Specimen id="card" title="Card" level="Molecule" source="compound/card.tsx">
          <Grid cols={3} gap={4}>
            <Card>
              <p className="font-medium text-fg">Statisch (padding=md)</p>
              <p className="text-sm text-fg-muted">Glass-Panel-Fläche, kein Hover-Lift.</p>
            </Card>
            <Card interactive to="/diagnostics">
              <p className="font-medium text-fg">Interaktiv (to)</p>
              <p className="text-sm text-fg-muted">Hover-Lift + Focus-Ring.</p>
            </Card>
            <Card padding="none" className="overflow-hidden">
              <div className="bg-bg-subtle p-6">
                <p className="font-medium text-fg">padding=none</p>
                <p className="text-sm text-fg-muted">Eigenes inneres Padding.</p>
              </div>
            </Card>
          </Grid>
        </Specimen>

        <Specimen id="panel" title="Panel" level="Molecule" source="compound/panel.tsx">
          <Grid cols={3} gap={4}>
            <Panel padding="sm" bordered>
              <p className="font-medium text-fg">padding=sm · bordered</p>
            </Panel>
            <Panel padding="md">
              <p className="font-medium text-fg">padding=md</p>
            </Panel>
            <Panel padding="lg" radius="lg">
              <p className="font-medium text-fg">padding=lg · radius=lg</p>
            </Panel>
          </Grid>
        </Specimen>

        <Specimen id="accordion" title="Accordion" level="Molecule" source="compound/accordion.tsx">
          <div className="max-w-reading">
            <Accordion items={ACCORDION_ITEMS} />
            <p className="mt-3 text-xs text-fg-muted">
              Edge-Case: leeres <code>items</code> rendert <code>null</code>.
            </p>
          </div>
        </Specimen>

        <Specimen
          id="breadcrumbs"
          title="Breadcrumbs"
          level="Molecule"
          source="compound/breadcrumbs.tsx"
        >
          <Breadcrumbs items={BREADCRUMB_ITEMS} />
        </Specimen>

        <Specimen
          id="author-byline"
          title="AuthorByline"
          level="Molecule"
          source="compound/author-byline.tsx"
        >
          <div className="max-w-reading">
            <AuthorByline initials="MM" name="Dr. Maria Musterfrau" />
          </div>
        </Specimen>

        <Specimen id="nav-tile" title="NavTile" level="Molecule" source="compound/nav-tile.tsx">
          <Grid cols={2} gap={4} className="max-w-reading">
            <NavTile to="/diagnostics" icon={<Microscope className="h-5 w-5" />}>
              Diagnostik
            </NavTile>
            <NavTile to="/downloads" icon={<Download className="h-5 w-5" />}>
              Downloads
            </NavTile>
          </Grid>
        </Specimen>

        <Specimen id="info-item" title="InfoItem" level="Molecule" source="compound/info-item.tsx">
          <Stack gap={4} className="max-w-reading">
            <InfoItem icon={<Phone className="h-4 w-4" />} label="Telefon">
              +49 40 123 456
            </InfoItem>
            <InfoItem icon={<Mail className="h-4 w-4" />} label="E-Mail">
              kontakt@example.com
            </InfoItem>
          </Stack>
        </Specimen>

        <Specimen
          id="media-link"
          title="MediaLink"
          level="Molecule"
          source="compound/media-link.tsx"
        >
          <Stack gap={3} className="max-w-reading">
            <MediaLink
              to="/articles"
              accent="primary"
              icon={<FileText className="h-4 w-4" />}
              title="accent=primary"
              description="Verlinkt mit Icon-Kachel und Hover-State."
            />
            <MediaLink
              to="/diagnostics"
              accent="success"
              icon={<Beaker className="h-4 w-4" />}
              title="accent=success"
              description="Zweite Akzent-Achse."
            />
          </Stack>
        </Specimen>

        <Specimen
          id="contact-callout"
          title="ContactCallout"
          level="Molecule"
          source="compound/contact-callout.tsx"
        >
          <div className="max-w-reading">
            <ContactCallout
              icon={<Phone className="h-5 w-5" />}
              title="Fragen zur Diagnostik?"
              subtitle="Mo–Fr, 9–17 Uhr"
              phoneHref="tel:+4940123456"
              phoneLabel="+49 40 123 456"
              note="Wir rufen auch zurück."
            />
          </div>
        </Specimen>

        {/* ============================ FEEDBACK / UI-STATES ============================ */}

        <Specimen id="alert" title="Alert" level="Feedback" source="feedback/alert.tsx">
          <Stack gap={3} className="max-w-reading">
            <Alert variant="default" title="Hinweis">
              Neutrale Information für die Nutzerin.
            </Alert>
            <Alert variant="success" title="Gesendet">
              Ihre Nachricht wurde übermittelt.
            </Alert>
            <Alert variant="danger" title="Fehler">
              Bitte füllen Sie die Pflichtfelder aus.
            </Alert>
          </Stack>
        </Specimen>

        <Specimen
          id="empty-state"
          title="EmptyState"
          level="Feedback"
          source="feedback/empty-state.tsx"
        >
          <Stack gap={4} className="max-w-reading">
            <Variant label="variant=plain">
              <EmptyState title="Keine Ergebnisse gefunden." className="w-full" />
            </Variant>
            <Variant label="variant=outlined">
              <EmptyState
                variant="outlined"
                title="Noch keine Downloads verfügbar."
                className="w-full"
              />
            </Variant>
          </Stack>
        </Specimen>

        <Specimen id="spinner" title="Spinner" level="Feedback" source="feedback/spinner.tsx">
          <Variant label="size">
            <Spinner size="sm" label="Lädt …" />
            <Spinner size="md" label="Lädt …" />
            <Spinner size="lg" label="Lädt …" />
          </Variant>
        </Specimen>
      </Container>
    </div>
  )
}
