import { NextResponse } from "next/server";
import Papa from "papaparse";
import { parseMoney } from "@/lib/money";
import { ShoppingItem } from "@/types/shopping";

type SheetRow = Record<string, string>;

export async function GET() {
  try {
    const sheetId = process.env.GOOGLE_SHEET_ID;
    const gid = process.env.GOOGLE_SHEET_GID;

    if (!sheetId || !gid) {
      return NextResponse.json(
        { error: "Google Sheet configuration is missing." },
        { status: 500 }
      );
    }

    const url =
      `https://docs.google.com/spreadsheets/d/${sheetId}` +
      `/export?format=csv&gid=${gid}`;

    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        "Unable to read Google Sheet. Make sure the sheet can be viewed by anyone with the link."
      );
    }

    const csv = await response.text();

    const result = Papa.parse<SheetRow>(csv, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
    });

    const items: ShoppingItem[] = result.data
      .map((row, index) => ({
        id: index + 1,

        category: row["Category"]?.trim() || "Uncategorised",
        item: row["Item"]?.trim() || "",
        brand: row["Brand"]?.trim() || "",
        qty: row["Qty"]?.trim() || "",
        priority: (row["Priority"]?.trim() || "") as ShoppingItem["priority"],
        neededBy: row["Needed By"]?.trim() || "",

        budget: parseMoney(row["Budget"]),
        bestPrice: parseMoney(row["Best Price"]),
        boughtPrice: parseMoney(row["Bought Price"]),

        store: row["Store"]?.trim() || "",
        link: row["Link"]?.trim() || "",
        status: (row["Status"]?.trim() || "") as ShoppingItem["status"],
        note: row["Note"]?.trim() || "",
      }))
      .filter((item) => item.item);

    return NextResponse.json(items);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load shopping list.",
      },
      { status: 500 }
    );
  }
}