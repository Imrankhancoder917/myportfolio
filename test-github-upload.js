const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

async function run() {
  const GITHUB_USERNAME = process.env.GITHUB_USERNAME;
  const GITHUB_REPO = process.env.GITHUB_REPO || "myportfolio";
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const BASE_URL = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}`;

  const buffer = fs.readFileSync('public/resume/imran-khan-resume-3-1782989611035.pdf');
  const base64Content = buffer.toString('base64');

  const githubPath = `public/resume/test-upload.pdf`;

  const body = {
    message: `Upload test`,
    content: base64Content,
    branch: "main",
  };

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
    console.error("GitHub upload error:", JSON.stringify(errorData, null, 2));
  } else {
    console.log("Success!");
  }
}

run();
