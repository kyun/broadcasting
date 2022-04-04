import React from "react";

const useStudioTools = () => {
  const [cameraOn, setCameraOn] = React.useState(false);
  const [muted, setMuted] = React.useState(false);
  const [mirrorMode, setMirrorMode] = React.useState(false);

  const toggleStudioTools = (name: string) => {
    if (name === "cameraOn") {
      setCameraOn((prev) => !prev);
    }
    if (name === "muted") {
      setMuted((prev) => !prev);
    }
    if (name === "mirrorMode") {
      setMirrorMode((prev) => !prev);
    }
  };
  return {
    cameraOn,
    muted,
    mirrorMode,
    toggleStudioTools,
  };
};

export default useStudioTools;
