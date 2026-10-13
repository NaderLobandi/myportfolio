import { createHash } from "crypto";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const verificationToken =
    process.env.EBAY_DELETION_VERIFICATION_TOKEN;

  const endpoint =
    process.env.EBAY_DELETION_ENDPOINT;

  if (!verificationToken || !endpoint) {
    console.error("Missing eBay environment variables.");

    return new Response(
      JSON.stringify({ error: "Server configuration error" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const url = new URL(request.url);
  const challengeCode = url.searchParams.get("challenge_code");

  console.log("eBay validation GET received");
  console.log("Request URL:", request.url);
  console.log("Configured endpoint:", endpoint);
  console.log("Challenge code:", challengeCode);

  if (!challengeCode) {
    return new Response(
      JSON.stringify({ error: "Missing challenge_code" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const challengeResponse = createHash("sha256")
    .update(challengeCode)
    .update(verificationToken)
    .update(endpoint)
    .digest("hex");

  console.log("Challenge response:", challengeResponse);

  return new Response(
    JSON.stringify({
      challengeResponse: challengeResponse,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    }
  );
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    console.log(
      "Received eBay account deletion notification:",
      JSON.stringify(payload)
    );

    return new Response(null, {
      status: 200,
    });
  } catch (error) {
    console.error(
      "Invalid eBay notification:",
      error
    );

    return new Response(null, {
      status: 400,
    });
  }
}
