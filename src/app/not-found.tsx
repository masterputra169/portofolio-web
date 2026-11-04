import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="notfound">
      <span className="eyebrow">404 · block not found</span>
      <h1 className="page-title">This block was never mined.</h1>
      <p>The page you are looking for is not on this chain.</p>
      <Link className="cta p" href="/">Back to genesis →</Link>
    </main>
  )
}
