import { Link } from "react-router-dom";
// import { useTheme } from "@/hooks/use-theme";
import { HeaderAuth } from "./header-auth";
import { ThemeToggle } from "./theme-toggle";
import { TopMenu } from "./top-menu";

export const Header = () => {
  // const { theme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 py-2">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to={"/"}>
          <p className="logo">Trekking Food 🛒</p>
          {/* <img
            src={theme === "dark" ? "/klimate-logo-dark.png" : "/klimate-logo.png"}
            alt="Klimate logo"
            className="h-14"
          /> */}
        </Link>

        <TopMenu />

        <div className="flex items-center gap-4">
          <HeaderAuth />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
