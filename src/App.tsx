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
import useStudioTools from "./hooks/useStudioTools";
import useInterval from "./hooks/useInterval";
import MyVideo from "./components/MyVideo";
import NoPermission from "./components/NoPermission";

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

const VideoBox = styled.div<{ isSpeaking: boolean }>`
  position: relative;
  display: flex;
  max-width: 1280px;
  width: 100%;
  max-height: 640px;
  background-color: #4b4b4b;
  border-radius: 5px;
  overflow: hidden;
  ${({ isSpeaking }) => {
    return isSpeaking && `border: 2px solid #feca00;`;
  }}
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
  const soundMeterRef = React.useRef<SoundMeter | null>(null);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [isVideoLoading, setIsVideoLoading] = React.useState(false);
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const { cameraOn, muted, mirrorMode, toggleStudioTools } = useStudioTools();

  useInterval(() => {
    if (soundMeterRef.current) {
      setIsSpeaking(soundMeterRef.current.slow > 0.02);
    }
  }, 1000);
  const handleSoundMeter = (stream: MediaStream) => {
    const soundMeter = new SoundMeter(new AudioContext());
    soundMeterRef.current = soundMeter;
    soundMeter.connectToSource(stream, (e: any) => {
      console.log(e);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const draw = () => {
        ctx.clearRect(0, 0, 400, 8);
        ctx.fillStyle = "#feca00";
        ctx.fillRect(0, 0, soundMeter.slow * 2000, 8);
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
    handleSoundMeter(stream as MediaStream);
    setMediaStream(stream);
    const video = videoRef.current;
    if (!video || !stream) return;
    video.srcObject = stream;
  };

  const handleScreenStream = async () => {
    const stream = await getScreenStream();
    const video = videoRef.current;
    if (!video || !stream) return;
    video.srcObject = stream;
  };

  React.useEffect(() => {
    if (!mediaStream) return;
    console.log("muted", muted);
    if (muted) {
      mediaStream.getAudioTracks()[0].enabled = muted;
    }
  }, [muted, mediaStream]);

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
        {/* <NoPermission /> */}
        <VideoBox isSpeaking={isSpeaking}>
          <MyVideo mediaStream={mediaStream} onCanPlay={handleCanPlay} />
          {/* <Video
            autoPlay
            playsInline
            ref={videoRef}
            onCanPlay={handleCanPlay}
            mirrorMode={mirrorMode}
            muted
          /> */}
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
              onClick={() => toggleStudioTools("cameraOn")}
              icons={[<BsCameraVideoOff />, <BsCameraVideo />]}
            />
          </ToolButton>
          <ToolButton>
            <ToggleIconButton
              onClick={() => toggleStudioTools("muted")}
              icons={[<BsMic />, <BsMicMute />]}
            />
          </ToolButton>
          <ToolButton>
            <ToggleIconButton
              onClick={() => toggleStudioTools("mirrorMode")}
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
