const listContainer = document.getElementById("list") as HTMLDivElement;
const deleteAllBtn = document.getElementById(
  "delete-all-btn",
) as HTMLButtonElement;

interface Snippet {
  timestamp: string;
  url: string;
  text: string;
  id: string;
}

function renderSnippets() {
  chrome.storage.local.get(
    { snippets: [] },
    (result: { snippets: Snippet[] }) => {
      if (!listContainer) return;

      if (result.snippets.length === 0) {
        listContainer.innerText =
          "Your Wournal is empty. To add something, select text on a page, right-click, and choose 'Add to Wournal'.";
        return;
      }

      listContainer.innerHTML = result.snippets
        .map(
          (item) => `
    <div class="card">
      <div class="card-details">
        <div>${new Date(item.timestamp).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}</div>
        <div>
          <a href="${item.url}" target="_blank">${item.url}</a>
        </div>
      </div>
      <p class="card-body">${item.text}</p>
      <div class="card-actions">
        <button class="delete-btn" data-id="${item.id}">delete</button>
        <button class="copy-btn" data-id=${item.id}>copy</button>
      </div>
    </div>
  `,
        )
        .join("");
    },
  );
}

deleteAllBtn.addEventListener("click", () => {
  chrome.storage.local.clear(() => {
    renderSnippets();
  });
});

listContainer.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;

  if (target.classList.contains("delete-btn")) {
    chrome.storage.local.get(
      { snippets: [] },
      (result: { snippets: Snippet[] }) => {
        const filtered_snippets = result.snippets.filter(
          (snippet) => snippet.id !== target.dataset.id,
        );
        chrome.storage.local.set({ snippets: filtered_snippets }, () => {
          renderSnippets();
        });
      },
    );
  }

  if (target.classList.contains("copy-btn")) {
    chrome.storage.local.get(
      { snippets: [] },
      (result: { snippets: Snippet[] }) => {
        const text = result.snippets.find(
          (snippet) => snippet.id === target.dataset.id,
        )?.text;
        if (text) {
          navigator.clipboard.writeText(text);
        }
      },
    );
  }
});

renderSnippets();
