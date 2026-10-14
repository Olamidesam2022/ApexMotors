import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cars } from "../../../content";

export function generateStaticParams() {
  return cars.map(car => ({ slug: car.slug }));
}

export async function generateMetadata({ params }) {
  const car = cars.find(item => item.slug === params.slug);
  return { title: car ? `${car.name} ${car.year} | Apex Motors` : "Vehicle | Apex Motors", description: car?.blurb };
}

export default function CarDetailsPage({ params }) {
  const car = cars.find(item => item.slug === params.slug);
  if (!car) notFound();
  return <main><section className="page-hero"><span className="eyebrow"><i /> {car.category.toUpperCase()} · {car.year}</span><h1>{car.name}<br /><em>{car.year} collection.</em></h1><p>{car.blurb}</p></section><section className="page-main"><div className="detail-layout"><div><div className="detail-main-image"><Image src={car.image} alt={`${car.year} ${car.name}`} fill priority sizes="(max-width: 700px) 100vw, 60vw" /></div><div className="detail-gallery"><div><Image src={car.image} alt={`${car.name} exterior`} fill sizes="20vw" /></div><div><Image src={car.image} alt={`${car.name} detail`} fill sizes="20vw" /></div><div><Image src={car.image} alt={`${car.name} in the showroom`} fill sizes="20vw" /></div></div></div><div className="detail-info"><span className="car-category">{car.year} <i /> {car.mileage} <i /> {car.category}</span><h2>{car.name}</h2><strong className="car-price">{car.priceLabel}</strong><p>{car.blurb}</p><table className="spec-table"><tbody>{car.specs.map(([key, val]) => <tr key={key}><td>{key}</td><td>{val}</td></tr>)}<tr><td>Fuel</td><td>{car.fuel}</td></tr><tr><td>Transmission</td><td>{car.transmission}</td></tr></tbody></table><h3>Thoughtful details</h3><ul className="feature-list">{car.features.map(feature => <li key={feature}>{feature}</li>)}</ul><Link href={`/contact?car=${car.slug}`} className="button button-primary">Enquire about this car <span>↗</span></Link></div></div></section></main>;
}
