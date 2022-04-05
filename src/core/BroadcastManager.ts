export class BroadcastManager {
  private static _instance: BroadcastManager;

  private _videoEl: HTMLVideoElement = document.createElement("video");

  private _mediaStream: MediaStream | null = null;

  private text = "";

  constructor() {
    if (BroadcastManager._instance) {
      console.warn("BroadcastManager is Singleton...!");
      return BroadcastManager._instance;
    }
    BroadcastManager._instance = this;
    this.text = "constructor...";
  }

  set mediaStream(mediaStream: MediaStream | null) {
    this._mediaStream = mediaStream;
  }

  get mediaStream() {
    return this._mediaStream;
  }

  delete = () => {
    (this._videoEl.srcObject as MediaStream)
      ?.getTracks()
      .forEach((t) => t.stop());
    (this._mediaStream as MediaStream)?.getTracks().forEach((t) => t.stop());
    this.text = "delete";
  };

  remove = () => {
    this.text = "remove";
  };

  log = () => {
    console.log(this._mediaStream);
  };
}

// export class BroadcastManager {
//   private static _instance: {
//     [uid: string]: BroadcastManager
//   } = {};

//   private _videoEl: HTMLVideoElement = document.createElement('video');

//   private _mediaStream: MediaStream | null = null;

//   private _uid: string = '';

//   constructor(uid: string) {
//     if (BroadcastManager._instance?.[uid]) {
//       console.error('exist...', uid);
//       return BroadcastManager._instance?.[uid];
//     }
//     this._uid = uid;
//     BroadcastManager._instance[uid] = this;
//   }

//   delete = () => {
//     const uid = this._uid;
//     (this._videoEl.srcObject as MediaStream)?.getTracks().forEach(t => t.stop());
//     (this._mediaStream as MediaStream)?.getTracks().forEach(t => t.stop());
//     delete BroadcastManager._instance[uid];
//   }
// }
