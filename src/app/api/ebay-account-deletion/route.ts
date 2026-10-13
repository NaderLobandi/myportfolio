import { createHash } from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const token =
    process.env.EBAY_DELETION_VERIFICATION_TOKEN;

  if (!token) {
    console.error("Missing EBAY_DELETION_VERIFICATION_TOKEN");

    return Response.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  const url = new URL(request.url);

  const challengeCode =
    url.searchParams.get("challenge_code");

  if (!challengeCode) {
    return Response.json(
      { error: "Missing challenge_code" },
      { status: 400 }
    );
  }

  // This produces:
  //
  // https://whatever.vercel.app/api/ebay-account-deletion
  //
  // WITHOUT the ?challenge_code query parameter.
  const endpoint = `${url.origin}${url.pathname}`;

  const challengeResponse = createHash("sha256")
    .update(challengeCode, "utf8")
    .update(token, "utf8")
    .update(endpoint, "utf8")
    .digest("hex");

  console.log("=== EBAY VALIDATION ===");
  console.log("Endpoint:", endpoint);
  console.log("Challenge:", challengeCode);
  console.log("Token length:", token.length);
  console.log("Response:", challengeResponse);
  console.log("=======================");

  return new Response(
    JSON.stringify({
      challengeResponse,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}


export async function POST(request: Request) {
  try {
    const body = await request.text();

    console.log("=== EBAY NOTIFICATION ===");
    console.log(body);
    console.log("=========================");

    return new Response(null, {
      status: 200,
    });

  } catch (error) {
    console.error("eBay notification error:", error);

    return new Response(null, {
      status: 400,
    });
  }
}
