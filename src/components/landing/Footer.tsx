import { Link } from "react-router-dom";
import { Shield } from "lucide-react";
import { DownloadCTA } from "@/components/landing/DownloadCTA";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-8">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-center items-center gap-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="h-4 w-4" />
            <p className="text-sm font-medium">
              © 2026 Ledger Stash
            </p>
          </div>
          <nav className="flex flex-wrap justify-center gap-6 text-sm">
            <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
            <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link to="/security" className="text-muted-foreground hover:text-foreground transition-colors">
              Security
            </Link>
            <DownloadCTA variant="footer" sourceSection="footer" />
          </nav>
        </div>
      </div>
    </footer>
  );
}
