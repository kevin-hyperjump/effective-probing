const { differenceInSeconds, differenceInMilliseconds } = require("date-fns");
const config = require("./config.json");
const {
  initializeProbeStates,
  getProbeState,
  setProbeFinish,
  setProbeRunning,
  getProbeContext,
} = require("./probe-state");

let nth = 0;

function run() {
  const probes = config;
  initializeProbeStates(probes);

  setInterval(() => {
    nth += 1;

    let startedProbes = []; // list of probes that are started in this interval
    let stillRunningProbes = []; // list of probes that are still running
    let waitingProbes = []; // list of probes that are waiting

    probes.forEach((probe) => {
      const probeState = getProbeState(probe.id);

      if (probeState === "running") {
        stillRunningProbes.push(probe.id);
        return;
      }

      const probeContext = getProbeContext(probe.id);
      const diff = differenceInSeconds(new Date(), probeContext.lastFinish);

      if (diff >= probe.delay) {
        runProbe(probe);
        startedProbes.push(probe.id);
      } else {
        waitingProbes.push(probe.id);
      }
    });

    console.log(
      `${nth} - STARTED: ${startedProbes.join(
        ", "
      )} - STILL RUNNING: ${stillRunningProbes.join(
        ", "
      )} - WAITING: ${waitingProbes.join(", ")}`
    );
  }, 1000);
}

// pretend sending request, simulate probing finish in random seconds between 100ms - 3s
function runProbe(probe) {
  setProbeRunning(probe.id);
  setTimeout(() => {
    setProbeFinish(probe.id);
    const probeContext = getProbeContext(probe.id);
    console.log(
      `    Probe ${probe.id} finishes in ${differenceInMilliseconds(
        probeContext.lastFinish,
        probeContext.lastStart
      )} milliseconds`
    );
  }, Math.random() * 3000 + 100);
}

run();
