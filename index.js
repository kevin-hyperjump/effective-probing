const { addSeconds, differenceInSeconds } = require("date-fns");
const config = require("./config.json");

let probeQueue = [];

function run() {
  let firstTime = true;

  setInterval(() => {
    if (firstTime) {
      const probes = config.map((c) => ({
        ...c,
        finishedAt: addSeconds(new Date(), 1),
      }));

      probeQueue = probes;
      firstTime = false;
    } else {
      probeQueue.forEach((probe, idx) => {
        const diff = differenceInSeconds(new Date(), probe.finishedAt);

        if (diff >= probe.delay) {
          const tempQueue = probeQueue;

          probeQueue = tempQueue.map((p, i) => {
            if (i === idx) {
              return { ...p, finishedAt: addSeconds(new Date(), 1) };
            }

            return p;
          });

          console.log("RUNNING -", probe);
        }
      });
    }
  }, 1000);
}

run();