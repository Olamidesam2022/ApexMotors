"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { brand, benefits, bodyTypes, cars, faqs, stats, steps, testimonials } from "../content";

const CarScene = dynamic(() => import("./car-scene"), { ssr: false, loading: () => <div className="scene-loading"><span className="loading-wheel" /></div> });
const money = n => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n);
const carLayerBounds = [0, 185, 310, 425, 525, 620, 705, 780];
const heroCallouts = ["Aerodynamic body", "Leather interior", "V6 Turbo engine", "Adaptive suspension"];
const sectionReveal = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] }
};

function useTilt() {
  const ref = useRef(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const rx = useSpring(x, { stiffness: 150, damping: 18 }); const ry = useSpring(y, { stiffness: 150, damping: 18 });
  const move = event => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return;

    x.set(((event.clientY - bounds.top) / bounds.height - 0.5) * -7);
    y.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 8);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return { ref, rx, ry, move, reset };
}

function Hero() {
  const outer = useRef(null); const progress = useRef(0);
  const [step, setStep] = useState(0); const [ready, setReady] = useState(false); const [fallback, setFallback] = useState(false); const [reducedMotion, setReducedMotion] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isLowPower = navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4;
    const canvas = document.createElement("canvas");
    const supportsWebGL = Boolean(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
    const shouldUseFallback = prefersReducedMotion || isLowPower || !supportsWebGL;

    setReducedMotion(prefersReducedMotion);
    setFallback(shouldUseFallback);
    if (shouldUseFallback) setReady(true);
    if (prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);
    const trigger = ScrollTrigger.create({
      trigger: outer.current, start: "top top", end: "bottom bottom", pin: ".hero-stage", scrub: 0.7,
      onUpdate: ({ progress: scrollProgress }) => {
        progress.current = scrollProgress;
        const phase = scrollProgress < 0.4 ? 0 : scrollProgress < 0.75 ? 1 : 2;
        setStep(current => current === phase ? current : phase);
        const highlighted = Math.min(3, Math.floor(Math.max(0, scrollProgress - 0.4) / 0.35 * 4));
        outer.current?.querySelectorAll(".hero-callout").forEach((item, index) => {
          item.classList.toggle("is-highlighted", phase === 1 && index === highlighted);
        });
        const separation = scrollProgress < 0.4
          ? scrollProgress / 0.4
          : scrollProgress > 0.75
            ? 1 - (scrollProgress - 0.75) / 0.25
            : 1;
        const eased = separation * separation * (3 - 2 * separation);
        outer.current?.querySelectorAll(".fallback-car-slice").forEach((slice, index) => {
          const offset = index - 3;
          slice.style.transform = `translate3d(0, ${offset * 19 * eased}px, ${Math.abs(offset) * 30 * eased}px)`;
        });
      }
    });
    return () => trigger.kill();
  }, []);
  const onPointer = e => {
    if (fallback) return;
    const r = outer.current.getBoundingClientRect();
    setTilt({
      x: ((e.clientY - r.top) / r.height - 0.5) * -5,
      y: ((e.clientX - r.left) / r.width - 0.5) * 7
    });
  };
  return <section
    className="hero-scroll"
    ref={outer}
    onPointerMove={onPointer}
    onPointerLeave={() => setTilt({ x: 0, y: 0 })}
    aria-label="Apex Motors, drive the extraordinary"
  >
    <div className="hero-stage">
      <div className="hero-grain" />
      <div className="hero-topline"><span>LAGOS · EST. 2011</span><span>YOUR NEXT CHAPTER STARTS HERE <b>↘</b></span></div>
      <div className="hero-copy">
        <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2 }} className="eyebrow"><i /> PREMIUM AUTOMOTIVE, REDEFINED</motion.p>
        <h1><span>Drive the</span><span className="headline-second">extraordinary<span className="red-period">.</span></span></h1>
        <p className="hero-description">{brand.description}</p>
        <div className="hero-actions"><MagneticLink href="/inventory" primary>Explore inventory <span>↗</span></MagneticLink><Link className="text-link" href="/contact">Book a test drive <span>↗</span></Link></div>
      </div>
      <div className={`hero-vehicle ${fallback ? "fallback-mode" : ""}`} style={{ transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }} aria-hidden="true">
        {fallback
          ? reducedMotion
            ? <div className="fallback-car fallback-static">
              <Image
                src="/images/apex-exploded-car/exploded-car.png"
                alt=""
                fill
                priority
                sizes="(max-width: 700px) 90vw, 60vw"
                className="fallback-image"
              />
            </div>
            : <div className="fallback-car fallback-layered">
              {carLayerBounds.slice(0, -1).map((top, index) => (
                <span
                  key={index}
                  className="fallback-car-slice"
                  style={{
                    top: `${top / 780 * 100}%`,
                    height: `${(carLayerBounds[index + 1] - top) / 780 * 100}%`
                  }}
                >
                  <Image
                    src={`/images/apex-exploded-car/layer-${index + 1}.png`}
                    alt=""
                    fill
                    priority={index === 0}
                    sizes="(max-width: 700px) 90vw, 60vw"
                  />
                </span>
              ))}
            </div>
          : <CarScene progress={progress} onReady={setReady} />}
        <div className="vehicle-reflection" />
      </div>
      <div className="hero-labels" aria-live="polite">
        {step === 1 && heroCallouts.map((label, index) => (
          <div key={label} className={`hero-callout callout-${index}`}>
            <i />
            <span>{label}</span>
          </div>
        ))}
      </div>
      <div className="hero-bottomline"><span>01 — 04 <i /></span><span>SCROLL TO EXPLORE</span><span>VICTORIA ISLAND, LAGOS</span></div>
      {!ready && <div className="hero-preloader"><span className="loading-wheel" /><span>PREPARING YOUR DRIVE</span><i /></div>}
    </div>
  </section>;
}

function MagneticLink({ href, children, primary = false }) {
  const ref = useRef(null);
  const mouse = e => { const r = ref.current.getBoundingClientRect(); ref.current.style.setProperty("--mx", `${e.clientX - r.left - r.width / 2}px`); ref.current.style.setProperty("--my", `${e.clientY - r.top - r.height / 2}px`); };
  return <Link ref={ref} href={href} onMouseMove={mouse} onMouseLeave={e => { e.currentTarget.style.setProperty("--mx", "0px"); e.currentTarget.style.setProperty("--my", "0px"); }} className={`button ${primary ? "button-primary" : ""}`}>{children}</Link>;
}

function StatBlock({ stat, index }) {
  const ref = useRef(null); const [number, setNumber] = useState(0);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const tween = gsap.to({ value: 0 }, { value: stat.value, duration: 1.5, ease: "power2.out", scrollTrigger: { trigger: ref.current, start: "top 90%", once: true }, onUpdate: function () { setNumber(Math.round(this.targets()[0].value)); } });
    return () => tween.kill();
  }, [stat.value]);
  return <div className="stat-block" ref={ref}><span className="stat-index">0{index + 1}</span><strong>{number.toLocaleString()}{stat.suffix}</strong><span>{stat.label}</span><i className="stat-gauge"><b /></i></div>;
}

function CarCard({ car }) {
  const { ref, rx, ry, move, reset } = useTilt();
  return <motion.article ref={ref} onMouseMove={move} onMouseLeave={reset} style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }} className="car-card">
    <Link href={`/inventory/${car.slug}`} className="car-card-image"><Image src={car.image} alt={`${car.year} ${car.name}`} fill sizes="(max-width: 700px) 85vw, (max-width: 1100px) 45vw, 30vw" /><span className="car-year">{car.year}</span><span className="image-arrow">↗</span></Link>
    <div className="car-card-info"><div><span className="car-category">{car.category} <i /> {car.mileage}</span><h3>{car.name}</h3></div><span className="car-price">{car.priceLabel}</span></div>
    <div className="car-card-bottom"><span>{car.fuel} <i /> {car.transmission}</span><Link href={`/inventory/${car.slug}`}>View details <b>↗</b></Link></div>
  </motion.article>;
}

function InventoryCarousel() {
  const track = useRef(null);
  const scroll = direction => track.current?.scrollBy({ left: direction * track.current.clientWidth * 0.82, behavior: "smooth" });
  return <div className="inventory-carousel">
    <div className="carousel-controls"><button aria-label="Previous vehicles" onClick={() => scroll(-1)}>←</button><button aria-label="Next vehicles" onClick={() => scroll(1)}>→</button></div>
    <div className="car-carousel" ref={track} tabIndex={0} aria-label="Featured vehicles">
      {cars.map(car => <CarCard key={car.slug} car={car} />)}
    </div>
  </div>;
}

function Calculator() {
  const [price, setPrice] = useState(50000000); const [deposit, setDeposit] = useState(10000000); const [months, setMonths] = useState(36);
  const monthly = useMemo(() => { const principal = Math.max(price - deposit, 0); const rate = 0.18 / 12; return Math.round(principal * rate / (1 - Math.pow(1 + rate, -months))); }, [price, deposit, months]);
  return <div className="calculator">
    <div className="calculator-form">
      <label>Vehicle price <strong>{money(price)}</strong><input type="range" aria-label="Vehicle price" min="10000000" max="120000000" step="1000000" value={price} onChange={e => setPrice(+e.target.value)} /></label>
      <label>Down payment <strong>{money(deposit)}</strong><input type="range" aria-label="Down payment" min="0" max={Math.max(price - 1000000, 0)} step="500000" value={Math.min(deposit, price - 1000000)} onChange={e => setDeposit(+e.target.value)} /></label>
      <label>Payment period <strong>{months} months</strong><input type="range" aria-label="Payment period" min="12" max="60" step="12" value={months} onChange={e => setMonths(+e.target.value)} /></label>
    </div>
    <div className="calculator-result"><span>YOUR ESTIMATED MONTHLY PAYMENT</span><strong>{money(monthly)}</strong><p>Indicative estimate at 18% APR. Final terms are subject to approval.</p><Link href="/financing" className="button button-light">Explore financing <span>↗</span></Link></div>
  </div>;
}

function BookingForm() {
  const [sent, setSent] = useState(false);
  return <form className="booking-form" onSubmit={e => { e.preventDefault(); setSent(true); }}>
    <AnimatePresence mode="wait">{sent ? <motion.div key="success" className="form-success" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}><span>✓</span><h3>You’re in good hands.</h3><p>Thanks for getting in touch. A member of our team will be in touch shortly.</p><button type="button" className="text-link" onClick={() => setSent(false)}>Send another enquiry ↗</button></motion.div> : <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="form-fields">
      <label>Your name<input name="name" autoComplete="name" placeholder="e.g. Ada Okafor" required minLength="2" /></label>
      <label>Phone number<input name="phone" type="tel" autoComplete="tel" placeholder="+234" required pattern="[+0-9 ()-]{7,}" /></label>
      <label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>
      <label>Car of interest<select name="car" defaultValue=""><option value="" disabled>Select a vehicle</option>{cars.map(c => <option key={c.slug}>{c.name}</option>)}<option>Not sure yet</option></select></label>
      <label>Preferred date<input name="date" type="date" min={new Date().toISOString().split("T")[0]} /></label>
      <label className="form-wide">Anything we should know?<textarea name="message" rows="3" placeholder="Tell us a little about what you’re looking for." /></label>
      <button type="submit" className="button button-primary">Request a test drive <span>↗</span></button><p className="form-note">By submitting, you agree to be contacted by our team about your enquiry.</p>
    </motion.div>}</AnimatePresence>
  </form>;
}

function FAQ() {
  const [active, setActive] = useState(0);
  return <div className="faq-list">{faqs.map(([question, answer], i) => <div className={`faq-item ${active === i ? "active" : ""}`} key={question}><button aria-expanded={active === i} onClick={() => setActive(active === i ? -1 : i)}><span>{question}</span><b>{active === i ? "−" : "+"}</b></button><div className="faq-answer"><p>{answer}</p></div></div>)}</div>;
}

function TestimonialSlider() {
  const [active, setActive] = useState(0);
  const [quote, author, city] = testimonials[active];
  return <div className="testimonial-slider"><div className="quote-mark">“</div><AnimatePresence mode="wait"><motion.div key={active} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .3 }}><blockquote>{quote}</blockquote><div className="quote-author"><strong>{author}</strong><span>{city}</span></div></motion.div></AnimatePresence><div className="slider-controls"><span>0{active + 1} <i /> 0{testimonials.length}</span><div><button aria-label="Previous testimonial" onClick={() => setActive((active + testimonials.length - 1) % testimonials.length)}>←</button><button aria-label="Next testimonial" onClick={() => setActive((active + 1) % testimonials.length)}>→</button></div></div></div>;
}

export default function HomePage() {
  const reduceMotion = useReducedMotion();
  const revealProps = reduceMotion ? {} : sectionReveal;
  return <main>
    <Hero />
    <motion.section {...revealProps} className="stats-section"><div className="section-kicker"><span>01 / THE APEX DIFFERENCE</span><span>GOOD CARS. BETTER PEOPLE.</span></div><div className="stats-grid">{stats.map((stat, i) => <StatBlock key={stat.label} stat={stat} index={i} />)}</div></motion.section>
    <motion.section {...revealProps} className="inventory-section section-pad" id="inventory"><div className="section-heading"><div><span className="eyebrow dark-eyebrow"><i /> CURATED FOR THE ROAD AHEAD</span><h2>Consider this<br /><em>your shortlist.</em></h2></div><Link className="underlined-link" href="/inventory">View all vehicles <span>↗</span></Link></div><InventoryCarousel /><div className="inventory-foot"><span>01 — 06 / HANDPICKED. ROAD-READY.</span><Link className="underlined-link" href="/inventory">Explore full inventory <span>↗</span></Link></div></motion.section>
    <motion.section {...revealProps} className="bodytype-section"><div className="section-kicker"><span>02 / FIND YOUR FORM</span><span>MADE FOR YOUR KIND OF MILES</span></div><div className="bodytype-marquee"><div className="bodytype-track">{[...bodyTypes, ...bodyTypes].map((type, i) => <Link href={`/inventory?body=${encodeURIComponent(type.name)}`} className="bodytype-tile" key={`${type.name}-${i}`}><div style={{ backgroundImage: `url("${type.image}")` }} /><span>{type.name} <b>↗</b></span></Link>)}</div></div></motion.section>
    <motion.section {...revealProps} className="why-section section-pad"><div className="why-intro"><span className="eyebrow"><i /> WHY APEX</span><h2>Confidence,<br /><em>in every mile.</em></h2><p>Buying a car should feel as good as driving it. We make sure it does.</p><Link className="underlined-link light-link" href="/about">A little about us <span>↗</span></Link></div><div className="benefit-list">{benefits.map(([num, title, body]) => <article key={num}><span>{num}</span><div><h3>{title}</h3><p>{body}</p></div><b>↗</b></article>)}</div></motion.section>
    <motion.section {...revealProps} className="finance-section section-pad"><div className="section-heading"><div><span className="eyebrow dark-eyebrow"><i /> A CLEARER WAY FORWARD</span><h2>Your next car,<br /><em>within reach.</em></h2></div><p>Good things should be within reach. Build an estimate that works for you, then talk it through with our team.</p></div><Calculator /></motion.section>
    <motion.section {...revealProps} className="process-section section-pad"><div className="process-heading"><span className="eyebrow"><i /> NO GUESSWORK. JUST GOOD MILES.</span><h2>From “what if”<br />to <em>“let’s go.”</em></h2></div><div className="timeline">{steps.map(([num, title, body], i) => <motion.article key={num} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .3 }} transition={{ delay: i * .12 }}><span>{num}</span><i /><h3>{title}</h3><p>{body}</p></motion.article>)}</div></motion.section>
    <motion.section {...revealProps} className="trade-section"><div><span className="eyebrow"><i /> READY FOR WHAT’S NEXT?</span><h2>Your current car<br />could take you <em>there.</em></h2><p>Get a free valuation for your current car in 24 hours.</p></div><Link href="/contact" className="button button-light">Get my free valuation <span>↗</span></Link><div className="trade-number">TRADE<br />UP<span>↗</span></div></motion.section>
    <motion.section {...revealProps} className="testimonial-section section-pad"><div><span className="eyebrow dark-eyebrow"><i /> THE WORD ON THE ROAD</span><h2>Good stories<br /><em>travel far.</em></h2></div><TestimonialSlider /></motion.section>
    <motion.section {...revealProps} className="faq-section section-pad"><div><span className="eyebrow"><i /> THE DETAILS, MADE SIMPLE</span><h2>A few good<br /><em>questions.</em></h2><p>Still curious? We’re only a conversation away.</p><Link className="underlined-link light-link" href="/contact">Talk to our team <span>↗</span></Link></div><FAQ /></motion.section>
    <motion.section {...revealProps} className="contact-section section-pad" id="contact"><div className="contact-intro"><span className="eyebrow"><i /> LET’S GET YOU MOVING</span><h2>Meet your<br /><em>next drive.</em></h2><p>Tell us what you have in mind. We’ll take it from here.</p><div className="showroom-details"><span>COME BY THE SHOWROOM</span><p>{brand.address}</p><a href={`tel:${brand.phone.replaceAll(" ", "")}`}>{brand.phone}</a><span>{brand.hours}</span></div><div className="map-placeholder"><div className="map-lines" /><span className="map-pin">A</span><span className="map-caption">VICTORIA ISLAND · LAGOS</span></div></div><BookingForm /></motion.section>
  </main>;
}
