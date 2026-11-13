import type { ReactNode } from 'react'

type SubHeadProps = {
  kicker?: string
  title: string
  titleId?: string
  lead?: ReactNode
  as?: 'h2' | 'h3'
}

/** SC-028: Abschnittskopf wie auf der Startseite — Kennzeile mit Strich, dünne H2, Einleitung rechts. */
const SubHead = ({ kicker, title, titleId, lead, as: Tag = 'h2' }: SubHeadProps) => (
  <div className="sc025-head">
    {kicker && <span className="sc025-kicker">{kicker}</span>}
    <Tag id={titleId} className="sc025-h2">
      {title}
    </Tag>
    {lead && <p>{lead}</p>}
  </div>
)

export default SubHead
