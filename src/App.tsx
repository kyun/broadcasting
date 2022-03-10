import React from 'react';
import logo from './logo.svg';
import './App.css';
import { getLocalMediaStream, getScreenStream } from "./utils/broadcast";

function App() {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  const handleStream = async () => {
    const stream = await getLocalMediaStream({
      audioinput: 0, videoinput: 0,
    }, true);

    const videoEl = document.createElement('video');
    videoEl.srcObject = stream;
    videoEl.volume = 0;
    videoEl.muted = true;
    videoRef.current = videoEl;
    document.body.append(videoEl);
    videoEl.oncanplay = () => {
      // //
      console.log('oncanplay')
      if (videoEl.paused) {
        videoEl.muted = true;
        videoEl.play();
      }
    };
    videoEl.onplay = () => {
      //
      console.log('onplay')
    };

  }

  const handleScreen = async () => {
        const stream = await (navigator.mediaDevices as any).getDisplayMedia({audio: false, video: { cursor: 'always' } })
    console.log(stream);
  }
  React.useEffect(() => {
    // 
    // handleStream();
    handleScreen();
  }, []);
  return (
    <div className="App">
      <video width={1280} height={720} ref={videoRef} autoPlay playsInline />
    </div>
  );
}

export default App;
