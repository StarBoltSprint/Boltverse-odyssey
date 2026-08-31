import { createFileRoute } from "@tanstack/react-router";
import { RaisingApp } from "@/components/RaisingApp";

export const Route = createFileRoute("/")({
  ssr: false,
  component: RaisingApp,
});
