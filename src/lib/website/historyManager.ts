import { WebsiteData } from "@/types";

export interface HistoryState {
  past: WebsiteData[];
  present: WebsiteData;
  future: WebsiteData[];
}

/**
 * Initializes the history state stack with a present state.
 */
export function initHistory(initialData: WebsiteData): HistoryState {
  return {
    past: [],
    present: initialData,
    future: [],
  };
}

/**
 * Pushes a new state to the history stack. Clears the future stack.
 */
export function recordHistory(state: HistoryState, newData: WebsiteData): HistoryState {
  // If the new state matches the present state exactly, ignore the record
  if (JSON.stringify(state.present) === JSON.stringify(newData)) {
    return state;
  }
  
  return {
    past: [...state.past, state.present],
    present: newData,
    future: [],
  };
}

/**
 * Moves back one step in the history stack, if possible.
 */
export function undo(state: HistoryState): HistoryState {
  if (state.past.length === 0) {
    return state;
  }

  const previous = state.past[state.past.length - 1];
  const newPast = state.past.slice(0, state.past.length - 1);

  return {
    past: newPast,
    present: previous,
    future: [state.present, ...state.future],
  };
}

/**
 * Moves forward one step in the history stack, if possible.
 */
export function redo(state: HistoryState): HistoryState {
  if (state.future.length === 0) {
    return state;
  }

  const next = state.future[0];
  const newFuture = state.future.slice(1);

  return {
    past: [...state.past, state.present],
    present: next,
    future: newFuture,
  };
}
