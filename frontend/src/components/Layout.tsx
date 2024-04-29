import clsx from "clsx";
import { Outlet } from "react-router";
import { Link, NavLink } from "react-router-dom";
import Typography from "./ui/typography";

export interface LayoutProps {}

const navLinks = [
  {
    to: "/food-trucks",
    title: "Home",
  },
  {
    to: "/food-trucks-map",
    title: "Map",
  },
];

export default function Layout() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center h-12 max-w-screen-2xl">
          <Link to="/">
            <Typography variant="h3" as="h1">
              Food Trucks
            </Typography>
          </Link>
          <div className="ml-6 flex items-center gap-4 text-sm lg:gap-6">
            {navLinks.map((l) => (
              <NavLink
                to={l.to}
                key={l.to}
                className={({ isActive }) =>
                  clsx(
                    "transition-colors hover:text-foreground/80",
                    isActive ? "text-foreground" : "text-foreground/60"
                  )
                }
              >
                {l.title}
              </NavLink>
            ))}
          </div>
        </div>
      </header>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
