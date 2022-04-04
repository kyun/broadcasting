import React from "react";
import { BroadcastManager } from "../core/BroadcastManager";
import { getLocalMediaStream } from "../utils/broadcast";

interface Props {
  cameraOn: boolean;
}

const useLocalDevice = ({ cameraOn }: Props) => {
  const manager = React.useMemo(() => new BroadcastManager(), []);

  const handleLocalMediaStream = async () => {
    //
    const { mediaStream } = manager;
    if (mediaStream) {
      manager.delete();
    } else {
      const _mediaStream = await getLocalMediaStream(
        {
          audioinput: 0,
          videoinput: 0,
        },
        cameraOn
      );
      manager.mediaStream = _mediaStream;
    }
  };

  React.useEffect(() => {
    handleLocalMediaStream();
  }, [cameraOn]);
};

export default useLocalDevice;
