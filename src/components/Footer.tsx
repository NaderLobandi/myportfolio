export default function Footer() {
  return (
    <footer className="bg-surface border-t border-edge-subtle py-6 px-6 text-center">
      <p className="text-fg-faint text-xs">
        © {new Date().getFullYear()} Nader Lobandi · naderlobandi.com
      </p>
    </footer>
  )
}
