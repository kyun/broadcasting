


export class BroadcastManager {
  private static _instance: {
    [uid: string]: BroadcastManager
  } = {};
  
  private _videoEl: HTMLVideoElement = document.createElement('video');

  private _mediaStream: MediaStream | null = null;

  private _uid: string = '';

  constructor(uid: string) {
    if (BroadcastManager._instance?.[uid]) {
      console.error('exist...', uid);
      return BroadcastManager._instance?.[uid];
    }
    this._uid = uid;
    BroadcastManager._instance[uid] = this;
  }
  
  delete = () => {
    const uid = this._uid;
    (this._videoEl.srcObject as MediaStream)?.getTracks().forEach(t => t.stop());
    (this._mediaStream as MediaStream)?.getTracks().forEach(t => t.stop());
    delete BroadcastManager._instance[uid];
  }
}