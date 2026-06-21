import { useEffect } from "react";
import {
  isRouteErrorResponse,
  Links,
  NavLink,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useNavigate,
} from "react-router";

import type { Route } from "./+types/root";
import "./styles/app.css";
import Navbar from './components/navbar';
import { MapProvider } from './lib/MapContext';
import DesktopMap from './components/DesktopMap';
import DesktopNav from './components/DesktopNav';


export const links: Route.LinksFunction = () => [
  { rel: "icon", type: "image/svg+xml", href: "./logo.svg" },

  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    const isAuthRoute = location.pathname === "/onboarding" || location.pathname === "/signup";
  
    if (!userType && !isAuthRoute) {
      navigate("/onboarding", { replace: true });
    } else if (location.pathname === "/" && userType) {
      const savedLens = localStorage.getItem("selectedLens") || "ann";
      navigate(`/lens/${savedLens}`, { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <MapProvider>
      <DesktopNav />
      <div className="map_panel">
        <DesktopMap />
      </div>
      <div className="app_panel">
        <div className="app_content">
          <Outlet />
        </div>
        <Navbar />
      </div>
      <div className="wheel_portal" data-wheel-portal="true" />
    </MapProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}