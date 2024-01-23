import React from 'react';
import styled from 'styled-components';

export interface AvatarProps {
  name: string;
  surname: string;
  className?: string;
  style?: React.CSSProperties;
  active?: boolean;
  icon?: any;
}

const Avatar = ({
  name = ' ',
  surname = ' ',
  className,
  style = {},
  active,
  icon,
}: AvatarProps) => {
  const initials = `${name[0]?.toUpperCase() || ''} ${surname[0]?.toUpperCase() || ''}`;
  return (
    <Container active={active} className={className}>
      <InnerContainer style={style}>{icon ? icon : initials}</InnerContainer>
    </Container>
  );
};

const Container = styled.div<{ active?: boolean }>`
  border: ${({ active, theme }) => (active ? ` 2px solid ${theme.colors.secondary}` : 'none')};
  border-radius: 50%;
  height: 49px;
  width: 49px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InnerContainer = styled.div<{ color?: string }>`
  cursor: pointer;
  height: 40px;
  width: 40px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.primary};

  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default Avatar;
