// Web Worker: runs the full valuation off the main thread so assumption edits
// never block the UI. Receives {id, state, scen}, replies {id, R}.
import { runAll } from "./engine";

self.onmessage = (e) => {
  const { id, state, scen } = e.data || {};
  try {
    self.postMessage({ id, R: runAll(state, scen) });
  } catch (err) {
    self.postMessage({ id, R: null, error: String(err) });
  }
};
