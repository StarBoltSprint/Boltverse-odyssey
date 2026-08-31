import { useEffect, useRef, type RefObject } from "react";
import { useP2PRoom } from "@/lib/multiplayer";
import type { CivicSnap, RaisingHandle } from "@/game/raising-engine";

type Props = {
  engineRef: RefObject<RaisingHandle | null>;
  playing: boolean;
  host: boolean;
  room: string;
  onPack: (n: number, live: boolean, failed: number) => void;
};

type PoseMsg = { t: "p"; x: number; z: number; yaw: number; howl: boolean };
type CivicMsg = CivicSnap & { t: "civic" | "snap"; line?: string };
type HelloMsg = { t: "hello" };
type Wire = PoseMsg | CivicMsg | HelloMsg;

function isCivic(m: Wire): m is CivicMsg {
  return m.t === "civic" || m.t === "snap";
}

export function CircuitNet({ engineRef, playing, host, room, onPack }: Props) {
  const p2p = useP2PRoom({ room, name: host ? "home" : "guest", star: false });
  const playingRef = useRef(playing);
  playingRef.current = playing;
  const hostRef = useRef(host);
  hostRef.current = host;
  const seen = useRef(new Set<string>());

  useEffect(() => {
    const live = p2p.peers.filter((p) => p.connectionState === "connected").length;
    const failed = p2p.peers.filter((p) => p.connectionState === "failed").length;
    onPack(live + 1, p2p.joined, failed);
    (window as unknown as { __circuitNet?: unknown }).__circuitNet = {
      selfId: p2p.selfId,
      room: p2p.room,
      host,
      joined: p2p.joined,
      peers: p2p.peers.map((p) => ({ id: p.id, name: p.name, state: p.connectionState, rtt: p.rttMs, ice: p.candidateType })),
    };
  }, [p2p.peers, p2p.joined, p2p.selfId, p2p.room, host, onPack]);

  useEffect(() => {
    const gone = new Set(seen.current);
    for (const p of p2p.peers) {
      gone.delete(p.id);
      if (seen.current.has(p.id)) continue;
      seen.current.add(p.id);
      if (hostRef.current) {
        const snap = engineRef.current?.civicSnap();
        if (snap) p2p.send({ t: "snap", ...snap } satisfies CivicMsg, p.id);
      }
    }
    for (const id of gone) {
      seen.current.delete(id);
      engineRef.current?.dropPeer(id);
    }
  }, [p2p.peers, p2p.send, engineRef]);

  useEffect(
    () =>
      p2p.onMessage((from, data) => {
        const msg = data as Wire;
        if (!msg || typeof msg !== "object" || !("t" in msg)) return;
        const eng = engineRef.current;
        if (!eng) return;
        if (msg.t === "hello") {
          if (hostRef.current) {
            const snap = eng.civicSnap();
            p2p.send({ t: "snap", ...snap } satisfies CivicMsg, from);
          }
          return;
        }
        if (msg.t === "p") {
          eng.setPeer(from, { x: msg.x, z: msg.z, yaw: msg.yaw, howl: msg.howl });
          return;
        }
        if (isCivic(msg) && !hostRef.current) {
          eng.applyCivic(msg, msg.line);
        }
      }),
    [p2p.onMessage, p2p.send],
  );

  useEffect(() => {
    if (!playing) return;
    p2p.send({ t: "hello" } satisfies HelloMsg);
    if (!host) return;
    return engineRef.current?.onCivic((snap, line) => {
      p2p.send({ t: "civic", ...snap, line } satisfies CivicMsg);
    });
  }, [playing, host, p2p.send]);

  useEffect(() => {
    if (!playing) return;
    let last = 0;
    let raf = 0;
    const loop = (now: number) => {
      if (now - last >= 50) {
        const eng = engineRef.current;
        if (eng && playingRef.current) {
          const pose = eng.netPose();
          p2p.broadcast({ t: "p", ...pose } satisfies PoseMsg);
        }
        last = now;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing, p2p.broadcast]);

  return null;
}
