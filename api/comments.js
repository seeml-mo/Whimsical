const GIST_ID = "EZuEZS6hkM4kHcVFsIOgB4lIFgFW4v27MFXh";  // 你的 gist id
const TOKEN = process.env.GITHUB_TOKEN;                  // 在 Vercel 环境变量配置

export default async function handler(req, res) {
  if (req.method === "GET") {
    // 读取 gist
    const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      headers: { Authorization: `token ${TOKEN}` }
    });
    const gistData = await response.json();

    if (!gistData.files || !gistData.files["user_input.json"]) {
      return res.status(404).json([]);
    }

    const commentsContent = gistData.files["user_input.json"].content;
    const comments = JSON.parse(commentsContent);
    return res.status(200).json(comments);

  } else if (req.method === "POST") {
    // 更新评论，前端传来的评论数组字符串
    const newComments = req.body.comments;  // 前端传 { comments: [...] }
    if (!newComments) return res.status(400).json({ error: "No comments provided" });

    const patchRes = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      method: "PATCH",
      headers: {
        Authorization: `token ${TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        files: {
          "user_input.json": {
            content: JSON.stringify(newComments, null, 2)
          }
        }
      })
    });

    if (patchRes.ok) {
      return res.status(200).json({ message: "Update success" });
    } else {
      return res.status(500).json({ error: "Update failed" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
