const { subDays } = require("date-fns");
const { assign, createMachine, interpret } = require("xstate");

const probeStateMachine = createMachine(
  {
    id: "probe-state",
    initial: "idle",
    states: {
      idle: {
        on: {
          RUN: {
            target: "running",
            actions: "incrementCycle",
          },
        },
      },
      running: {
        on: {
          FINISH: {
            target: "idle",
            actions: "setLastFinish",
          },
        },
      },
    },
  },
  {
    actions: {
      incrementCycle: assign({
        cycle: (context) => context.cycle + 1,
      }),
      setLastFinish: assign({
        lastFinish: () => new Date(),
      }),
    },
  }
);

const probeInterpreters = new Map();

function initializeProbeStates(probes) {
  probeInterpreters.clear();

  probes.forEach((probe) => {
    const interpreter = interpret(
      probeStateMachine.withContext({
        cycle: 0,
        lastFinish: subDays(new Date(), 30),
      })
    ).start();
    probeInterpreters.set(probe.id, interpreter);
  });
}

function setProbeRunning(probeId) {
  const interpreter = probeInterpreters.get(probeId);
  interpreter.send("RUN");
}

function setProbeFinish(probeId) {
  const interpreter = probeInterpreters.get(probeId);
  interpreter.send("FINISH");
}

function getProbeState(probeId) {
  const interpreter = probeInterpreters.get(probeId);
  return interpreter.state.value;
}

function getProbeContext(probeId) {
  const interpreter = probeInterpreters.get(probeId);
  return interpreter.state.context;
}

module.exports = {
  initializeProbeStates,
  setProbeRunning,
  setProbeFinish,
  getProbeState,
  getProbeContext,
};
