"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { brand } from "../content";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = [["Inventory", "/inventory"], ["About", "/about"], ["Financing", "/financing"], ["Contact", "/contact"]];
  return <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
    <Link className="brand-lockup" href="/" aria-label="Apex Motors home"><span className="brand-mark">A</span><span>APEX<span className="brand-light"> MOTORS</span></span></Link>
    <nav className="desktop-nav" aria-label="Main navigation">{links.map(([label, href]) => <Link key={label} href={href}>{label}</Link>)}</nav>
    <Link className="header-cta" href="/contact">Book a test drive <span>↗</span></Link>
    <button className={`menu-toggle ${open ? "is-open" : ""}`} onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}><span /><span /></button>
    <div className={`mobile-menu ${open ? "is-open" : ""}`} aria-hidden={!open}>{links.map(([label, href], i) => <Link onClick={() => setOpen(false)} style={{ transitionDelay: `${i * 60}ms` }} key={label} href={href}>{label}<span>↗</span></Link>)}<p>{brand.address}</p></div>
  </header>;
}

export function Footer() {
  return <footer className="footer">
    <div className="footer-top"><div><Link className="brand-lockup" href="/"><span className="brand-mark">A</span><span>APEX<span className="brand-light"> MOTORS</span></span></Link><p className="footer-tagline">{brand.tagline}</p></div>
      <div className="footer-contact"><span>VISIT OUR SHOWROOM</span><p>{brand.address}</p><a href={`tel:${brand.phone.replaceAll(" ", "")}`}>{brand.phone}</a><a href={`mailto:${brand.email}`}>{brand.email}</a></div>
      <div className="footer-links"><span>EXPLORE</span><Link href="/inventory">Inventory</Link><Link href="/about">About Apex</Link><Link href="/financing">Financing</Link><Link href="/contact">Contact</Link></div>
      <div className="footer-links"><span>FOLLOW ALONG</span>{brand.socials.map(s => <a key={s.label} href={s.href} target="_blank" rel="noreferrer">{s.label} ↗</a>)}</div>
    </div>
    <form className="newsletter" onSubmit={e => { e.preventDefault(); e.currentTarget.reset(); }}><label htmlFor="newsletter">NOTES FROM THE DRIVER’S SEAT</label><div><input id="newsletter" type="email" placeholder="Your email address" required /><button type="submit" aria-label="Subscribe">↗</button></div></form>
    <div className="footer-bottom"><span>© 2026 Apex Motors. All rights reserved.</span><span>Made for the road ahead. <b>●</b> Lagos, Nigeria</span></div>
  </footer>;
}
