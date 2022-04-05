import { atom } from 'recoil';


interface BoradcastState {
  mediaStream: MediaStream | null;
  deviceInput: {
    audioinput: number;
    videoinput: number;
  };
  cameraOn: boolean;
  muted: boolean;
}
const boradcastState = atom<BoradcastState>({
  key: 'broadcastState',
  default: {
    mediaStream: null,
    deviceInput: {
      audioinput: 0,
      videoinput: 0,
    },
    cameraOn: false,
    muted: false,
  }
});

export { boradcastState };