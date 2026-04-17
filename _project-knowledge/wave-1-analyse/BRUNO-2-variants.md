## Button.tsx Variants

```
primary:     'bg-gradient-to-r from-brand-secondary via-brand-primary to-brand-deep text-brand-deep shadow-lg shadow-brand-primary/20 border-0 hover:opacity-95 focus-visible:ring-brand-primary'
secondary:   'bg-brand-deep text-white shadow-lg shadow-brand-deep/20 hover:bg-brand-deep/90 focus-visible:ring-brand-deep'
outline:     'border border-white/80 bg-transparent text-white hover:bg-white/10 focus-visible:ring-white'
outline-light: 'border border-white/80 bg-transparent text-white hover:bg-white/10 focus-visible:ring-white'
ghost:       'hover:bg-gray-100 hover:text-gray-900'
link:        'text-brand-primary underline-offset-4 hover:underline'
brand-secondary: 'bg-brand-deep text-white shadow-lg shadow-brand-deep/20 hover:bg-brand-deep/90 focus-visible:ring-brand-deep'
```

## Duplicate-Variants

- `outline` und `outline-light` sind **byte-identisch** (exakt gleicher Klassenstring)
- `secondary` und `brand-secondary` sind **byte-identisch** (exakt gleicher Klassenstring)
- `ghost` und `link` werden **nirgends** in der Codebase verwendet (toter Code)

## PrimaryButton.tsx Klassen

```
base:            'inline-flex items-center justify-center gap-2 rounded-md text-base font-medium tracking-tight transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent'
brand-secondary: 'border-transparent bg-brand-deep text-white hover:bg-brand-deep/90 shadow-lg shadow-brand-deep/20 focus-visible:ring-brand-deep'
outline-light:   'border border-white/80 bg-transparent text-white hover:bg-white/10 focus-visible:ring-white'
primary (inner):  'flex h-full w-full items-center justify-center gap-2 rounded-[4px] bg-white text-brand-deep hover:bg-gray-50 transition-colors'
primary (outer):  'border-0 p-0.5 bg-gradient-to-r from-brand-secondary via-brand-primary to-brand-deep shadow-lg shadow-brand-primary/20 focus-visible:ring-brand-primary'
```

## Gradient-Border-Hack

Beide Komponenten implementieren denselben Trick: Das äußere Element bekommt `bg-gradient-to-r` als Hintergrund und ein minimales Padding (`p-0.5` / `!p-[2px]`). Ein inneres `<span>` (Button.tsx) bzw. `<div>` (PrimaryButton.tsx) mit `bg-white` und `rounded-[4px]` füllt den Innenraum, sodass der Gradient nur als 2px-Rand durchscheint. Die Size-Klassen (px/py) werden manuell auf das innere Element dupliziert, da das äußere Padding überschrieben wird.

## Visueller Unterschied in einem Satz

Keiner — beide erzeugen optisch denselben Gradient-Border-Button mit weißem Inneren; der einzige Codeunterschied ist `span` vs `div` und `!p-[2px]` vs `p-0.5` (effektiv identisch: 2px).
