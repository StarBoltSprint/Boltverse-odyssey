import { pub } from "./pub";

let el: HTMLAudioElement | null = null;
let current = "";

function node() {
  if (!el) {
    el = new Audio();
    el.loop = true;
    el.preload = "auto";
  }
  return el;
}

export const SONG = {
  hub: pub("citadel/hub-song.mp3") + "?v=1",
  hall: pub("citadel/hall-song.mp3") + "?v=1",
  den: pub("citadel/den-song.mp3") + "?v=1",
  denWalker: pub("citadel/den-walker-song.mp3") + "?v=1",
  denMaker: pub("citadel/den-maker-song.mp3") + "?v=1",
  forge: pub("citadel/forge-song.mp3") + "?v=1",
  pack: pub("citadel/pack-song.mp3") + "?v=1",
  relic: pub("citadel/relic-song.mp3") + "?v=1",
  howl: pub("citadel/howl-song.mp3") + "?v=1",
  stars: pub("citadel/stars-song.mp3") + "?v=1",
  starmap: pub("citadel/starmap-song.mp3") + "?v=5",
  landrun: pub("citadel/landrun-veil-song.mp3") + "?v=4",
  launch: pub("citadel/launch-veil-song.mp3") + "?v=2",
  kilnNew: pub("citadel/kiln-new-song.mp3") + "?v=1",
  kilnRemix: pub("citadel/kiln-remix-song.mp3") + "?v=1",
  kilnVersion: pub("citadel/kiln-version-song.mp3") + "?v=1",
  forgeBot: pub("citadel/forge-bot-song.mp3") + "?v=1",
  forgeHand: pub("citadel/forge-hand-song.mp3") + "?v=1",
};

export function playSong(src: string) {
  const a = node();
  if (current !== src) {
    a.src = src;
    current = src;
  }
  a.muted = false;
  a.volume = 1;
  a.loop = true;
  void a.play().catch(() => {});
}

export function warmSong(src: string) {
  const a = node();
  if (current) return;
  a.src = src;
  current = src;
  a.preload = "auto";
  a.load();
}
