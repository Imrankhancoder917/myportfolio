import { NextResponse } from "next/server";
import { updateFile } from "@/lib/github";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const { data, message } = await request.json();

    if (!data) {
      return NextResponse.json({ success: false, error: "Missing data" }, { status: 400 });
    }

    const commitMessage = message || "Update portfolio from Admin Panel";
    const filePath = path.join(process.cwd(), "data", "portfolio.json");
    
    const updatedJsonString = JSON.stringify(data, null, 2);

    // Write back to local file so it's instantly available in development/preview
    await fs.writeFile(filePath, updatedJsonString, "utf-8");

    // Commit to GitHub
    const success = await updateFile("data/portfolio.json", updatedJsonString, commitMessage);

    if (success) {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, error: "Failed to commit to GitHub" }, { status: 500 });
    }
  } catch (error) {
    console.error("Publish error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
