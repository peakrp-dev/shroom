import { avatarFramesObject } from "./avatarFrames";

// Part types which are affected during the walk action
const walkActionTypes = new Set([
  "li", // Left item
  "lh", // Left hand
  "ls", // Left side
  "bd", // Body
  "sh", // Shoes
  "lg", // Legs
  "rh", // Right hand
  "rs", // Right side
  "ri", // Right item
  "rc",
  "lc",
]);

const sitActionTypes = new Set([
  "bd", // Body
  "sh", // Shoes
  "lg", // Legs
]);

const wavLeftActionTypes = new Set(["lc", "ls", "lh"]);

export function getActionForPart(
  actions: Set<string>,
  frame: number,
  type: string,
  frameInfo: { waveFrame: number; walkFrame: number }
) {
  const waveFrame = frameInfo.waveFrame % 2;
  const walkFrame = frameInfo.walkFrame % 4;

  if (actions.has("wav") && actions.has("sit")) {
    if (wavLeftActionTypes.has(type)) {
      return { action: "wav", frame: waveFrame };
    }

    if (sitActionTypes.has(type)) {
      return { action: "sit", frame: 0 };
    }
  }

  if (actions.has("wav") && actions.has("wlk")) {
    if (wavLeftActionTypes.has(type)) {
      return { action: "wav", frame: waveFrame };
    }

    if (walkActionTypes.has(type)) {
      return { action: "wlk", frame: walkFrame };
    }
  }

  if (actions.has("wlk")) {
    if (walkActionTypes.has(type)) {
      return { action: "wlk", frame: walkFrame };
    }
  }

  if (actions.has("wav")) {
    if (wavLeftActionTypes.has(type)) {
      return { action: "wav", frame: waveFrame };
    }
  }

  return { action: "std", frame: 0 };
}