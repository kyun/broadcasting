import { atom } from "recoil";

interface BoradcastState {
  mediaStream: MediaStream | null;
  screenStream: MediaStream | null;
  deviceInput: {
    audioinput: number;
    videoinput: number;
  };
  cameraOn: boolean;
  muted: boolean;
  screenMode: boolean;
  mirrorMode: boolean;
}
const boradcastState = atom<BoradcastState>({
  key: "broadcastState",
  default: {
    mediaStream: null,
    screenStream: null,
    deviceInput: {
      audioinput: 0,
      videoinput: 0,
    },
    cameraOn: false,
    muted: false,
    screenMode: false,
    mirrorMode: false,
  },
});

export { boradcastState };
