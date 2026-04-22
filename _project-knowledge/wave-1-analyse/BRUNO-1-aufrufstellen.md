## Button Aufrufstellen

```
src/components/sections/CtaSection.tsx:1:import { Button } from '../ui/Button'
src/components/sections/HeroSection.tsx:2:import { Button } from '../ui/Button'
src/components/sections/SupportForm.tsx:3:import { Button } from '../ui/Button'
src/components/sections/ContactForm.tsx:2:import { Button } from '../ui/Button'

src/components/sections/CtaSection.tsx:35:          <Button to="/contact" variant="brand-secondary">
src/components/sections/HeroSection.tsx:129:                <Button
src/components/sections/HeroSection.tsx:137:                <Button
src/components/sections/SupportForm.tsx:174:        <Button type="submit" variant="primary" className="w-full justify-center md:w-auto" disabled={isSubmitting}>
src/components/sections/ContactForm.tsx:114:        <Button type="submit" variant="primary" className="w-full justify-center md:w-auto" disabled={isSubmitting}>
```

## PrimaryButton Aufrufstellen

```
src/routes/ServicePage.tsx:9:import PrimaryButton from '../components/ui/PrimaryButton'
src/routes/ArticlePage.tsx:6:import PrimaryButton from '../components/ui/PrimaryButton'
src/routes/AboutPage.tsx:5:import PrimaryButton from '../components/ui/PrimaryButton'
src/routes/ProductPage.tsx:4:import PrimaryButton from '../components/ui/PrimaryButton'
src/pages/IglooProPage.tsx:7:import PrimaryButton from '../components/ui/PrimaryButton';
src/components/layout/Header.tsx:5:import PrimaryButton from '../ui/PrimaryButton'
src/components/sections/DoctorsSection.tsx:3:import PrimaryButton from '../ui/PrimaryButton'
src/components/sections/TestimonialsSection.tsx:6:import PrimaryButton from '~/components/ui/PrimaryButton'
src/components/sections/AboutSection.tsx:4:import PrimaryButton from '../ui/PrimaryButton'

src/routes/ServicePage.tsx:256:                      <PrimaryButton as={Link} to="/contact" variant="primary">
src/routes/ServicePage.tsx:346:                <PrimaryButton as={Link} to="/contact" variant="brand-secondary" className="w-full justify-center">
src/routes/ArticlePage.tsx:72:              <PrimaryButton as={Link} to="/articles">
src/routes/ArticlePage.tsx:80:            <PrimaryButton as={Link} to="/articles">
src/routes/ArticlePage.tsx:312:                <PrimaryButton as={Link} to="/articles" variant="brand-secondary">
src/routes/ArticlePage.tsx:437:                <PrimaryButton as={Link} to="/contact" variant="brand-secondary" className="w-full justify-center">
src/routes/AboutPage.tsx:88:              <PrimaryButton as={Link} to="/diagnostics" size="sm">
src/routes/AboutPage.tsx:91:              <PrimaryButton as={Link} to="/contact" variant="brand-secondary" size="sm">
src/routes/ProductPage.tsx:156:            <PrimaryButton as={Link} to="/shop" variant="brand-secondary">
src/routes/ProductPage.tsx:178:            <PrimaryButton className="w-full justify-center" disabled>
src/pages/IglooProPage.tsx:129:                <PrimaryButton as="a" href="/contact">
src/pages/IglooProPage.tsx:289:            <PrimaryButton as="a" href="/contact" className="text-lg px-10 py-4 bg-white text-brand-deep hover:bg-gray-100 border-none shadow-xl">
src/components/layout/Header.tsx:142:                <PrimaryButton
src/components/layout/Header.tsx:247:                <PrimaryButton
src/components/sections/DoctorsSection.tsx:30:          <PrimaryButton as={Link} to="/igloo-pro" size="sm">
src/components/sections/TestimonialsSection.tsx:155:        <PrimaryButton as={Link} to="/contact" size="sm">
src/components/sections/AboutSection.tsx:58:          <PrimaryButton as={Link} to="/contact" size="lg">
```

## Zählung

- Button wird an 4 Stellen importiert (5 JSX-Usages)
- PrimaryButton wird an 9 Stellen importiert (17 JSX-Usages)
