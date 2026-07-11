export function Footer() {
  return (
    <footer className="py-12 border-t border-border bg-transparent relative z-10">
      <div className="wrap flex justify-between items-center flex-wrap gap-4">
        {/* Copyright */}
        <div className="copy mono text-[13px] text-muted-foreground">
          © 2026 Deepak Vaishnav
        </div>

        {/* Links */}
        <div className="foot-links flex gap-6 text-sm font-medium text-muted-foreground">
          <a
            href="mailto:deepakvaishnav486@gmail.com"
            className="hover:text-foreground transition-colors duration-300 link-underline pb-0.5"
          >
            Email
          </a>
          <a
            href="https://www.linkedin.com/in/deepak-vaishnav-5185b9396/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors duration-300 link-underline pb-0.5"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/deepakvaishnav-dev"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors duration-300 link-underline pb-0.5"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
