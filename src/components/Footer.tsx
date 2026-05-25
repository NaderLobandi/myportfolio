export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/[0.04] py-6 px-6 text-center">
      <p className="text-[#ededed]/20 text-xs">
        © {new Date().getFullYear()} Nader Lobandi · naderlobandi.com
      </p>
    </footer>
  )
}
