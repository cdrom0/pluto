chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed and background script running.");
  checkAndUpdateIcon();
});

chrome.runtime.onStartup.addListener(() => {
  console.log("Browser started. Checking proxy status.");
  checkAndUpdateIcon();
});

function setProxy(proxyHost, proxyPort) {
  chrome.proxy.settings.set(
    {
      value: {
        mode: "fixed_servers",
        rules: {
          singleProxy: {
            scheme: "socks5",
            host: proxyHost,
            port: parseInt(proxyPort)
          }
        }
      },
      scope: "regular"
    },
    () => {
      console.log(`Proxy set to ${proxyHost}:${proxyPort}`);
      updateIcon(true);
    }
  );
}

function clearProxy() {
  chrome.proxy.settings.clear({ scope: "regular" }, () => {
    console.log("Proxy settings cleared.");
    updateIcon(false);
  });
}

function updateIcon(isActive) {
  const iconPath = isActive ? "icons/active_48.png" : "icons/inactive_48.png";
  chrome.action.setIcon({ path: iconPath });
}

function checkAndUpdateIcon() {
  chrome.storage.sync.get(["proxyHost", "proxyPort"], (data) => {
    if (data.proxyHost && data.proxyPort) {
      updateIcon(true);
    } else {
      updateIcon(false);
    }
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "setProxy") {
    setProxy(message.proxyHost, message.proxyPort);
    chrome.storage.sync.set({ proxyHost: message.proxyHost, proxyPort: message.proxyPort });
  } else if (message.action === "clearProxy") {
    clearProxy();
    chrome.storage.sync.remove(["proxyHost", "proxyPort"]);
  } else if (message.action === "getProxySettings") {
    chrome.storage.sync.get(["proxyHost", "proxyPort"], (data) => {
      sendResponse(data);
    });
    return true;
  }
  sendResponse({ status: "Proxy settings updated" });
});
