import React from 'react';
import { BsCameraVideo, BsCameraVideoOff, BsGear, BsMic } from 'react-icons/bs';
import styled from "styled-components";
import { getLocalDevices } from '../utils/broadcast';
import DeviceInfoPopup from './DeviceInfoPopup';
import ToggleIcon from './ToggleIcon';


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
const BroadcastToolbar: React.FC<any> = () => {
  

  return       <ToolbarPlaceholder>
        <ToolbarButton>
          <BsCameraVideo />
        </ToolbarButton>
        <ToolbarButton>
          <BsMic />
        </ToolbarButton>
        <ToolbarButton>
          <BsGear />
        </ToolbarButton>
        {true && <DeviceInfoPopup value={deviceInput} onClick={handleDeviceInput}/>}
      </ToolbarPlaceholder>
}

export default BroadcastToolbar