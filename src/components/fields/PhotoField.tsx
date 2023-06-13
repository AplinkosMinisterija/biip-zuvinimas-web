import { useState } from "react";
import styled from "styled-components";
import { device } from "../../styles";
import { FileProps } from "../../utils/types";
import Icon from "../other/Icon";
import LoaderComponent from "../other/LoaderComponent";

export interface PhotoFieldProps {
  photo: FileProps | File | any;
  handleDelete?: (id: string, index: number) => void;
  onImageClick?: () => void;
  disabled?: boolean;
  index: number;
  isOpen?: boolean;
  height?: number;
  getSrc: (photo: any) => string;
}

const PhotoField = ({
  handleDelete,
  disabled = false,
  index,
  photo,
  height = 100,
  isOpen,
  getSrc,
  onImageClick
}: PhotoFieldProps) => {
  const [loading, setLoading] = useState(true);

  const isMain = photo.main;

  const handleDeleteClickClick = (e: any) => {
    e.stopPropagation();
    if (!handleDelete) return;

    handleDelete(photo.id, index);
  };

  return (
    <ImageContainer
      main={isMain}
      isOpen={!!isOpen}
      onClick={onImageClick}
      key={`photo-${index}`}
    >
      {!isOpen && !disabled && !loading && (
        <StyledCloseIconContainer onClick={handleDeleteClickClick}>
          <StyledCloseIcon name="close" />
        </StyledCloseIconContainer>
      )}
      <StyledImg
        isOpen={!!isOpen}
        height={height}
        display={!loading}
        disabled={disabled}
        key={index}
        src={getSrc(photo)}
        onLoad={() => setLoading(false)}
      />
      {isMain && (
        <>
          <MainPhotoBackground />
          <MainPhotoText>Pagrindinė nuotrauka</MainPhotoText>
        </>
      )}
      {loading && (
        <ImageLayer>
          <LoaderComponent />
        </ImageLayer>
      )}
    </ImageContainer>
  );
};

const ImageLayer = styled.div`
  transition: 0.5s ease;
  opacity: 1;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledCloseIcon = styled(Icon)`
  font-size: 2.4rem;
  color: ${({ theme }) => theme.colors.danger};
`;
const StyledCloseIconContainer = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
  opacity: 0;
  display: none;
  cursor: pointer;
  z-index: 10;
`;

const MainPhotoBackground = styled.div`
  position: absolute;
  bottom: 0;
  height: 19px;
  background-color: #000000;
  border-radius: 0px 0px 2px 2px;
  opacity: 0.49;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MainPhotoText = styled.div`
  font-size: 1rem;
  color: #ffffff;
  position: absolute;
  bottom: 2px;
  left: 7px;
`;

export const StyledImg = styled.img<{
  height: number;
  disabled: boolean;
  display: boolean;
  isOpen: boolean;
}>`
  width: fit-content;
  height: ${({ height }) => `${height}px`};
  object-fit: cover;
  border-radius: 4px;
  cursor: ${({ isOpen }) => (isOpen ? "block" : "pointer")};
  opacity: 1;
  display: ${({ display }) => (display ? "block" : "none")};
  max-width: 100%;
  transition: 0.5s ease;
  backface-visibility: hidden;
  max-width: 100%;

  ${({ isOpen }) =>
    isOpen &&
    `@media ${device.mobileL} {
    height: 100%;
    width: 100%;
  }
  `}
`;

const ImageContainer = styled.div<{
  isOpen: boolean;
  main: boolean;
}>`
  position: relative;
  height: 100%;
  min-width: 100px;
  min-height: 100px;
  border-radius: 4px;
  border: ${({ main }) => (main ? "2px solid #FEBC1D" : "none")};

  ${({ isOpen }) =>
    !isOpen &&
    `
   &:hover ${StyledCloseIconContainer} {
    opacity: 1;
    display:block;
  }
  `}
`;

export default PhotoField;
