import React from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import BroadcastToolbar from "../components/BroadcastToolbar";
import Header from "../components/Header";
import useInterval from "../hooks/useInterval";
import { boradcastState } from "../recoil/broadcastAtom";
import { getLocalMediaStream, getScreenStream } from "../utils/broadcast";
import SoundMeter from "../utils/soundMeter";

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  border: 4px solid #000;
  padding: 16px;
  height: 100vh;
  box-sizing: border-box;
`;
const VideoBox = styled.div<{ isSpeaking: boolean }>`
  position: relative;
  display: flex;
  max-width: 1280px;
  width: 100%;
  height: 640px;
  max-height: 640px;
  background-color: #4b4b4b;
  border-radius: 5px;
  overflow: hidden;
  ${({ isSpeaking }) => {
    return `border: 3px solid ${isSpeaking ? "#feca00" : "transparent"};`;
  }}
`;

const VideoPlaceholder = styled.video<{
  showBg?: boolean;
  mirrorMode?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: ${({ mirrorMode }) => (mirrorMode ? "scaleX(-1);" : "scaleX(1):")};
  background-color: ${({ showBg }) =>
    showBg ? "rgba(0,0,0,0.4);" : "transparent"};
`;

const NoCamera = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  font-size: 28px;
  color: white;
`;
const NoMic = styled.div`
  position: absolute;
  z-index: 3;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  padding: 16px;
  border-radius: 5px;
  margin: auto;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 16px;
`;

const IndexPage: React.FC<any> = () => {
  const videoRef = React.useRef<any>(null);
  const soundMeterRef = React.useRef<SoundMeter | null>(null);
  const [showSpeaking, setShowSpeaking] = React.useState(false);
  const [
    {
      deviceInput,
      cameraOn,
      mediaStream,
      screenMode,
      screenStream,
      mirrorMode,
      muted,
    },
    setBroadcastState,
  ] = useRecoilState(boradcastState);
  useInterval(() => {
    if (soundMeterRef.current && !muted) {
      console.log(soundMeterRef.current.slow);
      setShowSpeaking(soundMeterRef.current.slow > 0.04);
    }
  }, 1000);
  const handleSoundMeter = () => {
    if (!mediaStream) return;
    const soundMeter = new SoundMeter(new AudioContext());
    soundMeterRef.current = soundMeter;
    soundMeter.connectToSource(mediaStream, (e: any) => {
      console.log(e);
    });
  };
  const handleLocalMediaStream = async () => {
    if (mediaStream && !cameraOn) {
      const videoTrack = mediaStream.getVideoTracks();
      videoTrack.forEach((t) => {
        t.enabled = false;
        t.stop();
      });
    }
    const stream = await getLocalMediaStream(deviceInput, cameraOn);
    setBroadcastState((prev) => {
      return {
        ...prev,
        mediaStream: stream,
      };
    });
    videoRef.current.srcObject = stream;
  };

  const handleScreenStream = async () => {
    const stream = await getScreenStream();
    if (!stream) {
      setBroadcastState((prev) => {
        return {
          ...prev,
          screenMode: !prev.screenMode,
        };
      });
      return;
    }
    setBroadcastState((prev) => {
      return {
        ...prev,
        screenStream: stream,
      };
    });
    videoRef.current.srcObject = stream;
  };
  React.useEffect(() => {
    handleLocalMediaStream();
  }, [deviceInput, cameraOn]);

  React.useEffect(() => {
    handleSoundMeter();
  }, [mediaStream]);

  React.useEffect(() => {
    if (screenMode) {
      handleScreenStream();
    } else if (!screenMode && screenStream) {
      screenStream.getVideoTracks().forEach((t) => {
        t.stop();
      });
      videoRef.current.srcObject = mediaStream;
    }
  }, [screenMode]);

  React.useEffect(() => {
    if (muted) {
      setShowSpeaking(false);
    }
  }, [muted]);

  return (
    <>
      <Header />
      <Main>
        <VideoBox isSpeaking={showSpeaking}>
          {!cameraOn && (
            <NoCamera>
              <span>카메라가 꺼져 있음</span>
            </NoCamera>
          )}
          {muted && (
            <NoMic>
              <span>마이크가 꺼져 있음</span>
            </NoMic>
          )}
          <VideoPlaceholder
            ref={videoRef}
            autoPlay
            muted
            mirrorMode={mirrorMode}
          />
        </VideoBox>
        <BroadcastToolbar />
      </Main>
    </>
  );
};

export default IndexPage;
