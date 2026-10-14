import Link from "next/link";

export default function NotFound() {
  return <main className="not-found"><div><strong>404</strong><h1>This road doesn’t go anywhere.</h1><p>Let’s get you back on the right track.</p><Link href="/" className="button button-primary">Back to Apex <span>↗</span></Link></div></main>;
}
