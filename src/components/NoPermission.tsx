import React from "react";
import styled from "styled-components";
import { BsFillCameraVideoOffFill } from "react-icons/bs";

const Base = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  font-size: 48px;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const Message = styled.p`
  font-size: 24px;
  color: whitel;
  padding: 0 32px;
`;
const NoPermission: React.FC = () => {
  return (
    <Base>
      <BsFillCameraVideoOffFill />
      <Message>
        스트리밍을 시작하려면 카메라와 마이크에 대한 액세스를 허용하세요.
      </Message>
    </Base>
  );
};

export default NoPermission;
