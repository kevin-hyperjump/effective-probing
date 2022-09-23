const { parentPort } = require("worker_threads");
const fetch = require("axios");
const delay = require("delay");
const ms = require("ms");

(async function httpRequest() {
  const res = await fetch.get("https://api.github.com/users/hyperjumptech");
  await delay(ms("2s"));

  parentPort.postMessage(res.data);
})();
