
import { NextRequest, NextResponse } from "next/server";

function config() {
  const url = process.env.MOVEMENT_SCRIPT_URL;
  const token = process.env.MOVEMENT_SECRET;

  console.log("Movement URL configured:", !!process.env.MOVEMENT_SCRIPT_URL);
  console.log("Movement secret configured:", !!process.env.MOVEMENT_SECRET);

  if (!url || !token) {
    throw new Error("Movement connection is not configured");
  }

  return { url, token };
}

async function readResponse(response: Response) {
  if (!response.ok) {
    throw new Error(`Google Script returned ${response.status}`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Google Sheet request failed");
  }

  return result;
}

export async function GET() {
  try {
    const { url, token } = config();

    const endpoint = new URL(url);
    endpoint.searchParams.set("token", token);

    const response = await fetch(endpoint, {
      cache: "no-store",
      redirect: "follow",
    });

    return NextResponse.json(await readResponse(response));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Load failed" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Replace this with authenticated access before public deployment.
    const { url, token } = config();
    const { type, group } = await request.json();

    if (
      !["Kick", "Flutter", "Wriggle", "Roll", "Stretch"].includes(type) ||
      !["New", "Same"].includes(group)
    ) {
      return NextResponse.json(
        { error: "Invalid movement entry" },
        { status: 400 }
      );
    }

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify({ token, type, group }),
        cache: "no-store",
        redirect: "follow",
        });

        const responseText = await response.text();

        console.log("Apps Script POST status:", response.status);
        console.log("Apps Script POST response:", responseText.slice(0, 300));

        let result;

        try {
        result = JSON.parse(responseText);
        } catch {
        throw new Error(
            "Google Apps Script returned HTML instead of JSON. Check deployment permissions and POST execution."
        );
        }

        if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to save movement");
        }

        return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Save failed" },
      { status: 500 }
    );
  }
}
