const MENU_ID = "addToWournal";

chrome.contextMenus.create({
  id: MENU_ID,
  title: "Add To Wournal",
  contexts: ["selection"],
});

function contextClick(
  info: chrome.contextMenus.OnClickData,
  tab?: chrome.tabs.Tab,
) {
  const { menuItemId, selectionText } = info;

  if (menuItemId === MENU_ID && selectionText) {
    const newItem = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      url: tab?.url,
      text: selectionText,
    };

    chrome.storage.local.get({ snippets: [] }, (result: { snippets: [] }) => {
      const updatedSnippets = [newItem, ...result.snippets];
      chrome.storage.local.set({ snippets: updatedSnippets });
    });
  }
}

chrome.contextMenus.onClicked.addListener(contextClick);
