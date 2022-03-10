import React from 'react';
import styled from 'styled-components';
import './App.css';
import Header from './components/Header';
import { getLocalMediaStream } from "./utils/broadcast";

const Base = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const VideoWrapper = styled.div`
  width: 1280px;
  height: 640px;
  background-color: #444;
  border-radius: 7px;
`;

function App() {

  return (
    <>
      <Header />
    </>
  );
}

export default App;
