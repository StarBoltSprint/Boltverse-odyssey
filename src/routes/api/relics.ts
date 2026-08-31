import { createFileRoute } from "@tanstack/react-router";
import { handleRelics } from "@/lib/relics.server";

const handle = ({ request }: { request: Request }) => handleRelics(request);

export const Route = createFileRoute("/api/relics")({
  server: { handlers: { GET: handle, POST: handle } },
});
