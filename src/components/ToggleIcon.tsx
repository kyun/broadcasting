import React from 'react';
import styled from 'styled-components';

const Base = styled.span`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

interface Props {
  onClick?: () => void;
  icons: Array<React.ReactNode>;
}
const ToggleIcon: React.FC<Props> = ({ onClick, icons }) => {
  const [isActive, setIsActive] = React.useState(false);


  const handleToggle = React.useCallback(() => {
    setIsActive(prev => !prev);
  }, []);
  const handleClick = () => {
    handleToggle();
    onClick?.();
  }
  return <Base onClick={handleClick}>
    {isActive ? icons[0] : icons[1]}
  </Base>;
}

export default ToggleIcon;