export function GET() {
  return Response.json(
    {
      ok: true,
      service: "oem-portfolio",
      timestamp: new Date().toISOString()
    },
    {
      headers: {
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff"
      }
    }
  );
}
