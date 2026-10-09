import config from "../data/fitness/config.json";

const API = "https://api.github.com";
const { owner, name } = config.repo;

async function gh(path, token, { method = "GET", body, raw = false } = {}) {
  const headers = {
    Accept: raw ? "application/vnd.github.raw" : "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (body) headers["Content-Type"] = "application/json";
  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    let detail = "";
    try {
      const data = await res.json();
      detail = data.message || "";
    } catch { /* ignore */ }
    const hint =
      res.status === 401
        ? "Token 无效或已过期"
        : res.status === 403
          ? "权限不足：请确认 Token 已授予该仓库的 Contents 读写权限"
          : res.status === 404
            ? "仓库或文件不存在：请确认 Token 授权了 Hongjin-Lin/portfolio-site"
            : res.status === 409
              ? "分支已被并发更新，请重试"
              : "";
    throw new Error(`GitHub API ${res.status}${detail ? `：${detail}` : ""}${hint ? `（${hint}）` : ""}`);
  }
  return raw ? res.text() : res.json();
}

let cachedBranch = null;

export async function getDefaultBranch(token) {
  if (cachedBranch) return cachedBranch;
  const repo = await gh(`/repos/${owner}/${name}`, token);
  cachedBranch = repo.default_branch || "main";
  return cachedBranch;
}

export async function fetchEntriesRaw(token) {
  const branch = await getDefaultBranch(token);
  return gh(`/repos/${owner}/${name}/contents/${encodeURIComponent(config.repo.dataPath)}?ref=${branch}`, token, { raw: true });
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1]);
    reader.onerror = () => reject(new Error("读取图片失败"));
    reader.readAsDataURL(blob);
  });
}

export async function compressImage(file, maxDim = 1600, quality = 0.82) {
  let bitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    if (file.size <= 8 * 1024 * 1024) return blobToBase64(file);
    throw new Error(`${file.name}：无法解码图片（如 HEIC），请改用 JPG / PNG / WebP`);
  }
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d").drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
  if (!blob) throw new Error(`${file.name}：图片压缩失败`);
  return blobToBase64(blob);
}

/** Atomically commit multiple files to the default branch in a single commit. */
export async function commitFiles(token, files, message) {
  const branch = await getDefaultBranch(token);
  const ref = await gh(`/repos/${owner}/${name}/git/ref/heads/${branch}`, token);
  const headSha = ref.object.sha;
  const head = await gh(`/repos/${owner}/${name}/git/commits/${headSha}`, token);

  const blobs = await Promise.all(
    files.map((f) =>
      gh(`/repos/${owner}/${name}/git/blobs`, token, {
        method: "POST",
        body: { content: f.base64, encoding: "base64" },
      }),
    ),
  );
  const tree = await gh(`/repos/${owner}/${name}/git/trees`, token, {
    method: "POST",
    body: {
      base_tree: head.tree.sha,
      tree: files.map((f, i) => ({ path: f.path, mode: "100644", type: "blob", sha: blobs[i].sha })),
    },
  });
  const commit = await gh(`/repos/${owner}/${name}/git/commits`, token, {
    method: "POST",
    body: { message, tree: tree.sha, parents: [headSha] },
  });
  await gh(`/repos/${owner}/${name}/git/refs/heads/${branch}`, token, {
    method: "PATCH",
    body: { sha: commit.sha, force: false },
  });
  return commit.sha;
}
