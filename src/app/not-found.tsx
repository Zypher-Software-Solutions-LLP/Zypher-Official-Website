import Link from "next/link";

export default function NotFound(): React.ReactNode {
  return (
    <main className="site-container flex min-h-[70svh] flex-col items-start justify-center py-24">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-5xl font-semibold tracking-tight text-mist-100">Page not found.</h1>
      <p className="mt-5 max-w-xl text-lg leading-8 text-mist-300">
        The page you requested may have moved, or it may not exist yet.
      </p>
      <Link
        className="mt-8 inline-flex min-h-12 items-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-ink-950 hover:bg-cyan-300"
        href="/"
      >
        Return home
      </Link>
    </main>
  );
}
