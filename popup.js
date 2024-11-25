function fetchApiData() {
  const apiUrl = "https://ipecho.net/ip";
  
  fetch(apiUrl)
    .then(response => response.text())
    .then(data => {
      document.getElementById("apiResponse").textContent = "External IP: " + data;
    })
    .catch(error => {
      console.error("Error fetching API data:", error);
      document.getElementById("apiResponse").textContent = "Failed to load API data. No connection or check DNS";
    });
}

chrome.runtime.sendMessage({ action: "getProxySettings" }, (data) => {
  if (data.proxyHost) document.getElementById("proxyHost").value = data.proxyHost;
  if (data.proxyPort) document.getElementById("proxyPort").value = data.proxyPort;
});

document.getElementById("setProxyBtn").addEventListener("click", () => {
  const proxyHost = document.getElementById("proxyHost").value;
  const proxyPort = document.getElementById("proxyPort").value;

  chrome.runtime.sendMessage({ action: "setProxy", proxyHost, proxyPort }, (response) => {
    console.log(response.status);
  });
});

document.getElementById("clearProxyBtn").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "clearProxy" }, (response) => {
    console.log(response.status);
  });
});


document.addEventListener("DOMContentLoaded", fetchApiData);
