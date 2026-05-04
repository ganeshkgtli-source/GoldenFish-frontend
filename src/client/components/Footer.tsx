export default function Footer() {
  return (
    <footer className="border-t border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">

        {/* LEFT */}
        <div className="text-sm text-muted">
          © {new Date().getFullYear()}{" "}
          <span className="text-primary font-medium">GoldenFish</span>. All rights reserved.
        </div>

        {/* CENTER LINKS */}
        <div className="flex items-center gap-6 text-sm text-muted">
          <a href="#" className="hover:text-primary transition">Privacy</a>
          <a href="#" className="hover:text-primary transition">Terms</a>
          <a href="#" className="hover:text-primary transition">Support</a>
        </div>

        {/* RIGHT */}
        <div className="text-sm text-muted">
          Built with ❤️ for traders
        </div>

      </div>
    </footer>
  );
}