const Bree = require("bree");

const bree = new Bree({
  jobs: ["http-request"],
  workerMessageHandler: (msg) => {
    if (msg.name === "http-request") {
      console.log("MESSAGE FROM WORKER THREAD:", msg.message);
    }
  },
});

module.exports = { bree };
