import React from "react";
import styled from "styled-components";
import { getLocalDevices } from "../utils/broadcast";

const Base = styled.div`
  position: absolute;
  width: 240px;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 5px;
  padding: 8px 0;
  bottom: calc(100% + 8px);
  left: calc(100% - 54px);
`;
const Label = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: bold;
  padding: 8px 16px;
`;
const DeviceList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;
const ListItem = styled.li<{ selected?: boolean }>`
  margin: 0;
  padding: 0;
  padding: 8px 16px;
  font-size: 13px;
  cursor: pointer;
  background-color: ${({ selected }) => (selected ? "#feca00" : "transparent")};
  &:hover {
    background-color: #feca00;
  }
`;
interface Props {
  onClick: (l: string, i: number) => void;
  value: any;
}

const DeviceInfoPopup: React.FC<Props> = ({ value, onClick }) => {
  const [deviceInfo, setDeviceInfo] = React.useState<any>({});
  const handleLocalDevice = async () => {
    const devices = await getLocalDevices();
    setDeviceInfo(devices);
  };
  React.useEffect(() => {
    handleLocalDevice();
  }, []);

  return (
    <Base>
      <Label>Audio</Label>
      <DeviceList>
        {deviceInfo.audioinput?.map((item: any, index: number) => {
          return (
            <ListItem
              onClick={() => onClick("audioinput", index)}
              key={item.devcieId}
              selected={value.audioinput === index}
            >
              {item.label}
            </ListItem>
          );
        })}
      </DeviceList>
      <hr />
      <Label>Video</Label>
      <DeviceList>
        {deviceInfo.videoinput?.map((item: any, index: number) => {
          return (
            <ListItem
              onClick={() => onClick("videoinput", index)}
              key={item.devcieId}
              selected={value.videoinput === index}
            >
              {" "}
              {item.label}
            </ListItem>
          );
        })}
      </DeviceList>
    </Base>
  );
};

export default DeviceInfoPopup;
