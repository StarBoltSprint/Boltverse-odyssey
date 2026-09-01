import { createFileRoute } from "@tanstack/react-router";
import { CitadelApp } from "@/components/citadel-app";

export const Route = createFileRoute("/")({
  ssr: false,
  component: Home,
});

function Home() {
  return <CitadelApp />;
}
