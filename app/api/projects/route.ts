import { projects } from "@/data/portfolio";

export function GET() {
  return Response.json(
    { projects, count: projects.length },
    {
      headers: {
        "Cache-Control":
          "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
        "X-Content-Type-Options": "nosniff"
      }
    }
  );
}
