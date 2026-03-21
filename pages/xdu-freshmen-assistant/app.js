const promptInput = document.querySelector("#promptInput");
const sendButton = document.querySelector("#sendButton");
const conversationPanel = document.querySelector("#conversationPanel");

const API_CONFIG = {
  baseURL:
    new URLSearchParams(window.location.search).get("api_base") ||
    window.localStorage.getItem("xdu_api_base_url") ||
    "http://127.0.0.1:5000",
  chatEndpoint: "/v1/chat/completions",
  model: "xdu-freshmen-assistant",
};

const THINKING_MIN_MS = 10000;
const THINKING_MAX_MS = 20000;
const TYPEWRITER_CHAR_INTERVAL_MS = 22;

const chatHistory = [];
let isSending = false;

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderMultilineText(value) {
  return escapeHtml(value).replaceAll("\n", "<br>");
}

function setComposerState() {
  sendButton.disabled = isSending || promptInput.value.trim().length === 0;
  promptInput.disabled = isSending;
  sendButton.textContent = isSending ? "发送中..." : "发送";
}

function appendMessage(role, content) {
  const article = document.createElement("article");
  article.className = `message message-${role}`;

  const meta = document.createElement("div");
  meta.className = "message-meta";
  meta.textContent = role === "user" ? "你" : "校园助手";

  const body = document.createElement("div");
  body.className = "message-body";
  body.innerHTML = renderMultilineText(content);

  article.append(meta, body);
  conversationPanel.append(article);
  conversationPanel.scrollTop = conversationPanel.scrollHeight;

  return body;
}

function normalizeContent(content) {
  if (typeof content === "string") {
    return content.trim();
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }
        if (item?.type === "text") {
          return item.text || item.content || "";
        }
        if (typeof item?.text === "string") {
          return item.text;
        }
        if (typeof item?.content === "string") {
          return item.content;
        }
        if (typeof item?.text?.value === "string") {
          return item.text.value;
        }
        return "";
      })
      .join("\n")
      .trim();
  }

  return "";
}

function extractAssistantReply(payload) {
  const choice = payload?.choices?.[0];
  const content = choice?.message?.content;
  const normalized = normalizeContent(content);

  if (normalized) {
    return normalized;
  }

  const fallbackText =
    payload?.output_text || payload?.message || payload?.content;
  if (typeof fallbackText === "string" && fallbackText.trim()) {
    return fallbackText.trim();
  }

  return "后端返回了空内容。";
}

function extractErrorMessage(payload) {
  if (!payload) {
    return "请求失败，且没有拿到错误详情。";
  }

  if (typeof payload === "string") {
    return payload;
  }

  if (typeof payload?.detail === "string") {
    return payload.detail;
  }

  if (typeof payload?.detail?.error_message === "string") {
    return payload.detail.error_message;
  }

  if (typeof payload?.error?.message === "string") {
    return payload.error.message;
  }

  if (typeof payload?.message === "string") {
    return payload.message;
  }

  return JSON.stringify(payload, null, 2);
}

async function requestChatCompletion() {
  const response = await fetch(
    `${API_CONFIG.baseURL}${API_CONFIG.chatEndpoint}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: API_CONFIG.model,
        stream: false,
        messages: chatHistory,
      }),
    },
  );

  const text = await response.text();
  let payload = null;

  try {
    payload = text ? JSON.parse(text) : null;
  } catch (error) {
    payload = text;
  }

  if (!response.ok) {
    throw new Error(extractErrorMessage(payload));
  }

  return extractAssistantReply(payload);
}

async function typewriterRender(targetElement, fullText) {
  let output = "";
  for (const char of fullText) {
    output += char;
    targetElement.innerHTML = renderMultilineText(output);
    conversationPanel.scrollTop = conversationPanel.scrollHeight;
    await sleep(TYPEWRITER_CHAR_INTERVAL_MS);
  }
}

async function handleSend() {
  const content = promptInput.value.trim();
  if (!content || isSending) {
    return;
  }

  chatHistory.push({ role: "user", content });
  appendMessage("user", content);

  promptInput.value = "";
  isSending = true;
  setComposerState();

  const assistantBody = appendMessage("assistant", "正在思考...");
  const thinkingDuration = randomBetween(THINKING_MIN_MS, THINKING_MAX_MS);
  const thinkingStartAt = Date.now();
  let thinkingTick = 0;

  const thinkingTimer = setInterval(() => {
    thinkingTick = (thinkingTick + 1) % 4;
    assistantBody.innerHTML = renderMultilineText(
      `智能体正在思考${".".repeat(thinkingTick)}`,
    );
  }, 450);

  try {
    const assistantReplyPromise = requestChatCompletion();
    const assistantReply = await assistantReplyPromise;

    const elapsed = Date.now() - thinkingStartAt;
    if (elapsed < thinkingDuration) {
      await sleep(thinkingDuration - elapsed);
    }

    clearInterval(thinkingTimer);
    await typewriterRender(assistantBody, assistantReply);
    chatHistory.push({ role: "assistant", content: assistantReply });
  } catch (error) {
    clearInterval(thinkingTimer);
    const message = error instanceof Error ? error.message : "请求失败。";
    await typewriterRender(assistantBody, `请求后端失败：${message}`);
  } finally {
    clearInterval(thinkingTimer);
    isSending = false;
    setComposerState();
    promptInput.focus();
  }
}

promptInput.addEventListener("input", setComposerState);

promptInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    handleSend();
  }
});

sendButton.addEventListener("click", handleSend);

setComposerState();
