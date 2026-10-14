"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { cars } from "../../content";

export default function InventoryPage() {
  const [body, setBody] = useState("All body types");
  const [year, setYear] = useState("Any year");
  const [price, setPrice] = useState("Any price");
  const [sort, setSort] = useState("Featured");
  const filtered = useMemo(() => {
    const result = cars.filter(car => (body === "All body types" || car.category === body)
      && (year === "Any year" || car.year === Number(year))
      && (price === "Any price" || (price === "Under ₦40M" && car.price < 40000000) || (price === "₦40M – ₦80M" && car.price >= 40000000 && car.price <= 80000000) || (price === "Over ₦80M" && car.price > 80000000)));
    if (sort === "Price: low to high") result.sort((a, b) => a.price - b.price);
    if (sort === "Price: high to low") result.sort((a, b) => b.price - a.price);
    if (sort === "Newest first") result.sort((a, b) => b.year - a.year);
    return result;
  }, [body, year, price, sort]);
  return <main><section className="page-hero"><span className="eyebrow"><i /> THE APEX COLLECTION</span><h1>Find your<br /><em>next favourite.</em></h1><p>Six considered choices to get you started. Every vehicle is independently inspected and ready for its next story.</p></section><section className="page-main"><div className="filter-bar">
    <label>Body type<select value={body} onChange={e => setBody(e.target.value)}>{["All body types", "SUV", "Sedan", "Coupe", "Truck", "Electric / Hybrid"].map(x => <option key={x}>{x}</option>)}</select></label>
    <label>Price range<select value={price} onChange={e => setPrice(e.target.value)}>{["Any price", "Under ₦40M", "₦40M – ₦80M", "Over ₦80M"].map(x => <option key={x}>{x}</option>)}</select></label>
    <label>Year<select value={year} onChange={e => setYear(e.target.value)}>{["Any year", "2024", "2023", "2022", "2021"].map(x => <option key={x}>{x}</option>)}</select></label>
    <label>Sort by<select value={sort} onChange={e => setSort(e.target.value)}>{["Featured", "Newest first", "Price: low to high", "Price: high to low"].map(x => <option key={x}>{x}</option>)}</select></label>
    <span className="filter-count">{filtered.length} {filtered.length === 1 ? "vehicle" : "vehicles"}</span>
  </div>{filtered.length ? <div className="car-grid">{filtered.map(car => <article className="car-card" key={car.slug}><Link href={`/inventory/${car.slug}`} className="car-card-image"><Image src={car.image} alt={`${car.year} ${car.name}`} fill sizes="(max-width: 700px) 90vw, 30vw" /><span className="car-year">{car.year}</span></Link><div className="car-card-info"><div><span className="car-category">{car.category} <i /> {car.mileage}</span><h3>{car.name}</h3></div><span className="car-price">{car.priceLabel}</span></div><div className="car-card-bottom"><span>{car.fuel} <i /> {car.transmission}</span><Link href={`/inventory/${car.slug}`}>View details <b>↗</b></Link></div></article>)}</div> : <p>No vehicles match those filters. Try adjusting your search.</p>}</section></main>;
}
