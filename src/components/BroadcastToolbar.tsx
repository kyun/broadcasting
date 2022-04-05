import React from "react";
import {
  BsCameraVideo,
  BsCameraVideoOff,
  BsDisplay,
  BsGear,
  BsMic,
  BsMicMute,
  BsSymmetryVertical,
} from "react-icons/bs";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { boradcastState } from "../recoil/broadcastAtom";
import DeviceInfoPopup from "./DeviceInfoPopup";

const ToolbarPlaceholder = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  // width: 100%;
  // max-width: 1280px;
  height: 56px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 5px;
`;
const ToolbarButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  height: 56px;
  width: 56px;
  background-color: transparent;
  cursor: pointer;
  border: none;
  color: white;
  font-size: 20px;
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const StopSharingButton = styled.button`
  height: 56px;
  border-radius: 5px;
  background-color: #feca00;
  border: none;
  font-size: 16px;
  color: black;
  padding: 0 16px;
  cursor: pointer;
`;
const BroadcastToolbar: React.FC<any> = () => {
  const [
    { cameraOn, muted, deviceInput, screenMode, mirrorMode },
    setBroadcastState,
  ] = useRecoilState(boradcastState);
  const [showDeviceInfo, setShowDeviceInfo] = React.useState(false);
  const toggleCamera = () => {
    setBroadcastState((prev) => {
      return {
        ...prev,
        cameraOn: !prev.cameraOn,
      };
    });
  };
  const toggleMute = () => {
    setBroadcastState((prev) => {
      return {
        ...prev,
        muted: !prev.muted,
      };
    });
  };
  const toggleScreenMode = () => {
    setBroadcastState((prev) => {
      return {
        ...prev,
        screenMode: !prev.screenMode,
      };
    });
  };
  const toggleMirrorMode = () => {
    setBroadcastState((prev) => {
      return {
        ...prev,
        mirrorMode: !prev.mirrorMode,
      };
    });
  };

  const handleDeviceInput = (label: string, index: number) => {
    setBroadcastState((prev) => {
      return {
        ...prev,
        deviceInput: {
          ...prev.deviceInput,
          [label]: index,
        },
      };
    });
  };

  if (screenMode) {
    return (
      <ToolbarPlaceholder>
        <StopSharingButton onClick={toggleScreenMode}>
          Stop Sharing display
        </StopSharingButton>
      </ToolbarPlaceholder>
    );
  }
  return (
    <ToolbarPlaceholder>
      <ToolbarButton onClick={toggleCamera}>
        {cameraOn ? <BsCameraVideo /> : <BsCameraVideoOff />}
      </ToolbarButton>
      <ToolbarButton onClick={toggleMute}>
        {muted ? <BsMicMute /> : <BsMic />}
      </ToolbarButton>
      <ToolbarButton onClick={toggleMirrorMode}>
        {mirrorMode ? (
          <BsSymmetryVertical />
        ) : (
          <BsSymmetryVertical style={{ transform: "scaleX(-1)" }} />
        )}
      </ToolbarButton>
      <ToolbarButton onClick={toggleScreenMode}>
        <BsDisplay />
      </ToolbarButton>
      <ToolbarButton onClick={() => setShowDeviceInfo((prev) => !prev)}>
        <BsGear />
      </ToolbarButton>

      {showDeviceInfo && (
        <DeviceInfoPopup value={deviceInput} onClick={handleDeviceInput} />
      )}
    </ToolbarPlaceholder>
  );
};

export default BroadcastToolbar;
