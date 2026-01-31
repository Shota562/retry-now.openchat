document.addEventListener("DOMContentLoaded", () => {

  // -------------------------------
  // 既存の照合処理の上部に追加（保存アナウンスの読み込み）
  const announceEl = document.getElementById("announce");

  // -------------------------------
  // 管理者ログイン
  const ADMIN_PASSWORD_HASH =
    "ab15b78885d5043704c07d8ffa7266baecf94064c072186a9a348a1831c7aa8a";

  const loginBtn = document.getElementById("login-btn");
  const passInput = document.getElementById("admin-pass");

  async function sha256(text) {
    const enc = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest("SHA-256", enc);
    return [...new Uint8Array(buf)]
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
  }

  loginBtn.addEventListener("click", async (event) => {
    event.preventDefault(); // フォーム送信をキャンセル

    if (passInput.value.trim() === "") {
      alert("パスワードを入力してください");
      return;
    }

    const inputHash = await sha256(passInput.value);

    if (inputHash !== ADMIN_PASSWORD_HASH) {
      alert("パスワードが一致しません");
      return;
    }

    // 成功 → 管理者ページに遷移
    window.location.href = "admin.html";
  });

  // -------------------------------
  // 照合ボタン処理
  const btn = document.getElementById("my-btn");

  btn.addEventListener("click", function () {
    const announce = announceEl.value || announceEl.placeholder;
    const message = document.getElementById("message").value;
    const result  = document.getElementById("result");
    const diffEl  = document.getElementById("diff");

    result.style.display = "block";
    diffEl.innerHTML = "";

    if (message.trim() === "") {
      result.textContent = "照合したいアナウンスを入力してください ⚠️";
      result.style.color = "yellow";
      return;
    }

    if (announce.trim() === message.trim()) {
      result.textContent = "一致しています ✅";
      result.style.color = "lime";
      diffEl.style.display = "none";
    } else {
      result.textContent = "一致していません ❌";
      result.style.color = "red";
      diffEl.style.display = "block";

      let html = "";
      const maxLen = Math.max(announce.length, message.length);

      for (let i = 0; i < maxLen; i++) {
        const a = announce[i] || "";
        const m = message[i] || "";

        if (a === m) {
          html += a;
        } else {
          html += `<span class="diff-wrong">${a || "□"}</span>`;
        }
      }

      diffEl.innerHTML = html;
    }
  });

}); // ← DOMContentLoaded の閉じ括弧・カッコ
