const GITHUB_USERNAME = process.env.GITHUB_USERNAME;
const GITHUB_REPO = process.env.GITHUB_REPO || "myportfolio";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const BASE_URL = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}`;

const headers = {
  Accept: "application/vnd.github.v3+json",
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  "X-GitHub-Api-Version": "2022-11-28",
};

export async function getFileSha(path: string): Promise<string | null> {
  if (!GITHUB_TOKEN) return null;
  
  try {
    const res = await fetch(`${BASE_URL}/contents/${path}`, {
      headers,
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.sha;
  } catch (error) {
    console.error("Error fetching file SHA:", error);
    return null;
  }
}

export async function updateFile(path: string, content: string, message: string): Promise<boolean> {
  if (!GITHUB_TOKEN) {
    console.error("Missing GITHUB_TOKEN");
    return false;
  }

  try {
    const sha = await getFileSha(path);
    
    // Base64 encode the content (handles unicode properly)
    const base64Content = Buffer.from(content, "utf-8").toString("base64");

    const body: any = {
      message,
      content: base64Content,
      branch: "main",
    };

    if (sha) {
      body.sha = sha;
    }

    const res = await fetch(`${BASE_URL}/contents/${path}`, {
      method: "PUT",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("GitHub API Error:", errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error updating file on GitHub:", error);
    return false;
  }
}
