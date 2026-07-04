import { NextResponse } from "next/server";
import { getFileSha, updateFile } from "@/lib/github";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string | null; // "image" or "resume"

    if (!file || !type) {
      return NextResponse.json({ success: false, error: "Missing file or type" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine the path based on type
    const folder = type === "resume" ? "resume" : "uploads";
    
    // Sanitize filename
    const ext = path.extname(file.name);
    const basename = path.basename(file.name, ext).replace(/[^a-zA-Z0-9-]/g, "-").toLowerCase();
    const filename = `${basename}-${Date.now()}${ext}`;
    
    const githubPath = `public/${folder}/${filename}`;
    const localPath = path.join(process.cwd(), "public", folder, filename);

    // Write locally for immediate dev preview
    try {
      await fs.mkdir(path.dirname(localPath), { recursive: true });
      await fs.writeFile(localPath, buffer);
    } catch (e) {
      console.warn("Failed to write file locally, but proceeding with GitHub push", e);
    }

    // Since updateFile expects a utf-8 string to base64 encode, but our buffer is binary (image/pdf)
    // We need a specific upload for binary files. Let's write a small custom fetch here for binary:
    
    const GITHUB_USERNAME = process.env.GITHUB_USERNAME;
    const GITHUB_REPO = process.env.GITHUB_REPO || "myportfolio";
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const BASE_URL = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}`;

    const sha = await getFileSha(githubPath);
    const base64Content = buffer.toString("base64");

    const body: any = {
      message: `Upload ${type}: ${filename}`,
      content: base64Content,
      branch: "main",
    };

    if (sha) body.sha = sha;

    const res = await fetch(`${BASE_URL}/contents/${githubPath}`, {
      method: "PUT",
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("GitHub upload error:", errorData);
      return NextResponse.json({ success: false, error: "Failed to upload to GitHub" }, { status: 500 });
    }

    const fileUrl = `/${folder}/${filename}`;

    return NextResponse.json({ success: true, url: fileUrl }, { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
