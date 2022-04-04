import React from "react";
import styled from "styled-components";

const Video = styled.video`
  width: 100%;
  height: 100%;
`;

interface Props {
  //
  mediaStream: MediaStream | null;
  onCanPlay?: () => void;
}

const MyVideo: React.FC<Props> = ({ mediaStream, onCanPlay }) => {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  const [isVideoLoading, setIsVideoLoading] = React.useState(false);

  const handleMediaStream = () => {
    console.log("handleMS", mediaStream);
    const video = videoRef.current;
    if (!video || !mediaStream) return;
    video.srcObject = mediaStream;
  };

  const handleCanPlay = () => {
    //
    setIsVideoLoading(false);
  };

  React.useEffect(() => {
    handleMediaStream();
  }, [mediaStream]);

  return (
    <Video onCanPlay={onCanPlay} ref={videoRef} playsInline autoPlay muted />
  );
};

export default MyVideo;
