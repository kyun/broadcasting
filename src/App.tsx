import React from "react";
import styled from "styled-components";
import "./App.css";
import Header from "./components/Header";
import { getLocalMediaStream, getScreenStream } from "./utils/broadcast";
import {
  BsCameraVideo,
  BsCameraVideoOff,
  BsMic,
  BsMicMute,
  BsSymmetryVertical,
  BsDisplay,
  BsGear,
  BsThreeDots,
} from "react-icons/bs";
import ToggleIconButton from "./components/ToggleButton";
import usePrevious from "./hooks/usePrevious";
import SoundMeter from "./utils/soundMeter";

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  border: 4px solid #000;
  padding: 32px 0;
  height: 100vh;
  box-sizing: border-box;
`;

const VideoBox = styled.div`
  position: relative;
  display: flex;
  max-width: 1280px;
  width: 100%;
  max-height: 640px;
  background-color: #4b4b4b;
  border-radius: 5px;
  overflow: hidden;
`;

const VideoPlaceholder = styled.div<{ showBg?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${({ showBg }) =>
    showBg ? "rgba(0,0,0,0.4);" : "transparent"};
`;
const NoCameraMessage = styled.h3`
  margin: 0;
  padding: 0;
  font-size: 24px;
  color: white;
`;

const MuteMessage = styled.p`
  margin: 0;
  padding: 0;
  font-size: 16px;
  font-weight: 800;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  background-color: rgba(0, 0, 0, 0.46);
  position: absolute;
  bottom: 40px;
`;

const Video = styled.video<{ mirrorMode?: boolean }>`
  width: 100%;
  height: 100%;
  transform: ${({ mirrorMode }) => (mirrorMode ? "scaleX(-1);" : "scaleX(1):")};
`;

const ToolBox = styled.div`
  background-color: #4b4b4b;
  border-radius: 5px;
`;

const ToolButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: white;
  font-size: 20px;
  &:hover {
    background-color: rgba(0, 0, 0, 0.16);
  }
`;

const AudioLevelBar = styled.div`
  position: relative;
  width: 400px;
  height: 8px;
  background-color: #4b4b4b;
  border-radius: 8px;
  overflow: hidden;
`;
const LevelCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
`;

function App() {
  const [mediaStream, setMediaStream] = React.useState<null | MediaStream>(
    null
  );
  const prevMediaStream = usePrevious<null | MediaStream>(mediaStream);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [cameraOn, setCameraOn] = React.useState(true);
  const [muted, setMuted] = React.useState(false);
  const [isVideoLoading, setIsVideoLoading] = React.useState(false);
  const [mirrorMode, setMirrorMode] = React.useState(false);

  const handleSoundMeter = (stream: MediaStream) => {
    const soundMeter = new SoundMeter(new AudioContext());
    soundMeter.connectToSource(stream, (e: any) => {
      console.log(e);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const draw = () => {
        ctx.clearRect(0, 0, 400, 8);
        ctx.fillStyle = "#feca00";
        ctx.fillRect(0, 0, soundMeter.slow * 1000, 8);
        window.requestAnimationFrame(draw);
      };
      draw();
    });
  };

  const handleLocalMediaStream = async () => {
    if (prevMediaStream && !cameraOn) {
      console.log("카메라 오프되었습니다. 캠을 끕니다..");
      const videoTrack = prevMediaStream.getVideoTracks();
      videoTrack.forEach((t) => {
        t.enabled = false;
        t.stop();
      });
    }

    const stream = await getLocalMediaStream(
      { audioinput: 0, videoinput: 0 },
      cameraOn
    );
    if (muted) {
      (stream as MediaStream).getAudioTracks()[0].enabled = muted;
    }
    handleSoundMeter(stream as MediaStream);
    setMediaStream(stream);
    const video = videoRef.current;
    if (!video || !stream) return;
    video.srcObject = stream;
    video.volume = 0;
    video.muted = true;
    video.play();
  };

  const handleScreenStream = async () => {
    const stream = await getScreenStream();
    const video = videoRef.current;
    if (!video || !stream) return;
    video.srcObject = stream;
  };

  const handleCamera = () => {
    setCameraOn((prev) => !prev);
  };

  const handleMute = () => {
    setMuted((prev) => !prev);
    if (!mediaStream) return;
    mediaStream.getAudioTracks()[0].enabled = muted;
  };

  const handleMirrorMode = () => {
    setMirrorMode((prev) => !prev);
  };
  React.useEffect(() => {
    setIsVideoLoading(true);
    handleLocalMediaStream();
  }, [cameraOn]);

  const handleCanPlay = () => {
    setIsVideoLoading(false);
  };

  return (
    <>
      <Header />
      <Main>
        <VideoBox>
          <Video
            autoPlay
            playsInline
            ref={videoRef}
            onCanPlay={handleCanPlay}
            mirrorMode={mirrorMode}
            muted
          />
          {!cameraOn && (
            <VideoPlaceholder>
              <NoCameraMessage>카메라가 꺼져 있음</NoCameraMessage>
            </VideoPlaceholder>
          )}
          {isVideoLoading && cameraOn && (
            <VideoPlaceholder>
              <NoCameraMessage>카메라 켜지는중...</NoCameraMessage>
            </VideoPlaceholder>
          )}
          {muted && (
            <VideoPlaceholder>
              <MuteMessage>음소거 중입니다.</MuteMessage>
            </VideoPlaceholder>
          )}
        </VideoBox>
        <ToolBox>
          <ToolButton>
            <ToggleIconButton
              onClick={handleCamera}
              icons={[<BsCameraVideo />, <BsCameraVideoOff />]}
            />
          </ToolButton>
          <ToolButton>
            <ToggleIconButton
              onClick={handleMute}
              icons={[<BsMic />, <BsMicMute />]}
            />
          </ToolButton>
          <ToolButton>
            <ToggleIconButton
              onClick={handleMirrorMode}
              icons={[
                <BsSymmetryVertical />,
                <BsSymmetryVertical style={{ transform: "scaleX(-1)" }} />,
              ]}
            />
          </ToolButton>
          <ToolButton>
            <BsDisplay />
          </ToolButton>
          <ToolButton>
            <BsThreeDots />
          </ToolButton>
        </ToolBox>
        <AudioLevelBar>
          <LevelCanvas ref={canvasRef} width={400} height={8} />
        </AudioLevelBar>
      </Main>
    </>
  );
}

export default App;
