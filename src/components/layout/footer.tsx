import { Smile } from "lucide-react";

export const Footer = () => (
  <footer className="border-t backdrop-blur supports-backdrop-filter:bg-background/60 py-4">
    <div className="container mx-auto px-4 text-center text-gray-200">
      <p className="flex items-center justify-center gap-2">
        Made with
        <Smile className="h-5 w-5 text-yellow-400" aria-hidden="true" />
        by abr-ya and shkatulo4ka
      </p>
    </div>
  </footer>
);
