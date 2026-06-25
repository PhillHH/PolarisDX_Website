# Proto-Persona: Lena Fischer — Endverbraucherin (Consumer-LP, Paid-Traffic)

> Proto-Persona (`assumption`-basiert). Consumer-Bereich ist Tabu §5 (Checkout unangetastet) —
> Persona dient nur dem Verständnis, nicht der Code-Änderung. `ASSUMPTION — needs human confirmation`.

## Vier Quadranten

- **Demografie/Rolle:** 31, gesundheitsbewusste Endkundin, kommt über eine Anzeige auf `/consumer/vitamin-d3-spray`.
- **Verhalten:** mobil, scrollt schnell, entscheidet emotional + nutzenorientiert, bricht bei Reibung ab.
- **Bedürfnisse/Ziele:** schnell verstehen, ob das Produkt hilft, und unkompliziert bestellen.
- **Schmerzpunkte:** unklarer Preis, zu viele Schritte, Vertrauensmangel.

## 3-Akt-Story

1. **Setup:** Lena klickt eine Anzeige, landet auf der Consumer-LP (eigener heller/teal Look).
2. **Konflikt:** Sie will Preis/Nutzen sofort sehen und mit wenig Schritten bestellen.
3. **Auflösung:** Klarer Hero, sichtbarer Preis (PriceBadge), schlanker Bestell-Flow (OrderModal) → `consumer_order_submit`.

## Narrative Akzeptanzkriterien (nur Beobachtung — Bereich Tabu)

- „Wenn Lena die LP öffnet, sieht sie above-the-fold Nutzen + Preis + einen CTA."
- „Der Consumer-Look (light/teal) bleibt bewusst vom Main-Site-Dark-Theme getrennt."
- „Conversion wird über `consumer_order_submit` gemessen (Outcome), nicht über reine Pageviews."
