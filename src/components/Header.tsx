import React from 'react';
import styled from 'styled-components';


const Base = styled.header`
  //
  width: 100vw;
  padding: 16px 0;
  display: flex;
  justify-content: center;
  background-color: #18181B;
  font-family: 'Raleway', sans-serif;
  color: #feca00;
`;
const Title = styled.h1`

  font-size: 8rem;
  color: #feca00;
  text-align: center;
  margin: 0;
  text-transform: uppercase;
  font-weight: 900;
  font-size: 40px;

`


const Header: React.FC = () => {

  return <Base>
    <Title>Pseudo Studio</Title>
  </Base>
}

export default Header;