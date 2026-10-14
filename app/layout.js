import "./globals.css";
import { brand } from "../content";
import { Header, Footer } from "../components/site";

export const metadata = {
  title: "Apex Motors — Drive the extraordinary",
  description: "Discover premium new and certified pre-owned vehicles at Apex Motors, Victoria Island, Lagos. Honest advice, quality cars, extraordinary service.",
  openGraph: { title: "Apex Motors — Drive the extraordinary", description: brand.description, type: "website" }
};

export default function RootLayout({ children }) {
  const dealer = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: brand.name,
    telephone: brand.phone,
    email: brand.email,
    address: { "@type": "PostalAddress", streetAddress: brand.address, addressLocality: "Lagos", addressCountry: "NG" },
    openingHours: "Mo-Sa 08:00-19:00"
  };

  return <html lang="en"><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(dealer) }} /><Header />{children}<Footer /></body></html>;
}
