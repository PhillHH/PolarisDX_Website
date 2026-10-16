import type { ReactNode } from 'react'
import { AREA_SHELL, AreaShellContext } from './areaShell'

/** Stellt die Shell-Bausteine bereit; Begruendung in `areaShell.ts`. */
const AreaShellProvider = ({ children }: { children: ReactNode }) => (
  <AreaShellContext.Provider value={AREA_SHELL}>{children}</AreaShellContext.Provider>
)

export default AreaShellProvider
