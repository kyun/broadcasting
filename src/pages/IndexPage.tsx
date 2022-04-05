import React from 'react';
import { BsCameraVideo, BsGear, BsMic } from 'react-icons/bs';
import styled from 'styled-components';
import DeviceInfoPopup from '../components/DeviceInfoPopup';
import Header from '../components/Header';
import { BroadcastManager } from '../core/BroadcastManager';
import { getLocalMediaStream } from '../utils/broadcast';


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
    return isSpeaking && `border: 3px solid #feca00;`;
  }}
`;

const VideoPlaceholder = styled.video<{ showBg?: boolean }>`
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

const ToolbarPlaceholder = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  // width: 100%;
  // max-width: 1280px;
  height: 56px;
  background: rgba(0,0,0,0.7);
  border-radius: 5px;
`;
const ToolbarButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  height: 56px;
  width: 56px;
  // background-color: #696969;
  color: white;
  font-size: 20px;
  &:hover{
    background-color: rgba(255,255,255,0.1);
  }
`;
const IndexPage: React.FC<any> = () => {
  const videoRef = React.useRef<any>(null);
  const [deviceInput, setDeviceInput] = React.useState({ audioinput: 0, videoinput: 2 });
  const [showDeviceInfo, setShowDeviceInfo] = React.useState(false);

  const handleDeviceInput = (label: string, index:number) => {
    setDeviceInput((prev) => {
      return {
        ...prev,
        [label]: index,
      }
    })
  }
  const handleLocalMediaStream = async () => {
    const stream = await getLocalMediaStream(
      deviceInput,
      true
    );
    const bm = new BroadcastManager();
    bm.mediaStream = stream;
    videoRef.current.srcObject = stream;
  }
  React.useEffect(() => {
    handleLocalMediaStream();
  }, [deviceInput]);
  return <>
    <Header />
    <Main>
      <VideoBox isSpeaking><VideoPlaceholder ref={videoRef} autoPlay muted /></VideoBox>


    </Main>
  </>
}

export default IndexPage