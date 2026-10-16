import { createContext, useContext } from 'react'
import AreaNav from './AreaNav'
import NextSteps from './NextSteps'
import { diagnosticsAreaItems, serviceNeighbours } from './diagnosticsArea'

/**
 * AP34 (Owner-Entscheidung 2026-10-16) — Bereichsleiste und „Naechster
 * Schritt" als Shell-Bausteine.
 *
 * Sie tragen Epigenetik, Diagnostik, alle neun Service-Seiten und IglooPro.
 * Als gewoehnliche Importe der Seiten landeten sie in einem geteilten Chunk,
 * den das Budget-Gate (PT25.5) jeder dieser Routen als Route-JS anrechnet:
 * ~2 KB gzip je Route bei ~300 B Puffer. Das Layout (Entry-Chunk) stellt sie
 * deshalb ueber diesen Kontext bereit; einmal im Initial-JS kosten sie gemessen
 * ~1,2 KB gzip (Puffer danach ~1,9 KB). Kein Budget wurde dafuer gelockert.
 *
 * Seiten holen die Bausteine mit `useAreaShell()` statt sie zu importieren —
 * ein direkter Import haelt sie zwar ebenfalls im Entry, verschleiert aber,
 * warum sie dort liegen.
 */
export const AREA_SHELL = { AreaNav, NextSteps, diagnosticsAreaItems, serviceNeighbours }

export const AreaShellContext = createContext(AREA_SHELL)

export const useAreaShell = () => useContext(AreaShellContext)
