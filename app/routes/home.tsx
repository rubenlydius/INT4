import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "INT4" },
    { name: "description", content: "Welcome to our project!" },
  ];
}

export default function Home() {
  return <Welcome />;
}
