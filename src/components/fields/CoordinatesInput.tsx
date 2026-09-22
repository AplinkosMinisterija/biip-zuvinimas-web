import { TextField } from '@aplinkosministerija/design-system';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { device } from '../../styles';
import { geomToLks94, isInsideLithuania, lks94ToGeom } from '../../utils/functions';
import { inputLabels, validationTexts } from '../../utils/texts';
import { GeomFeatureCollection } from '../../utils/types';

export interface CoordinatesInputProps {
  geom?: GeomFeatureCollection;
  onChange: (geom: GeomFeatureCollection) => void;
  disabled?: boolean;
}

const toInput = (value?: number) => (typeof value === 'number' ? String(Math.round(value)) : '');

const onlyDigits = (value: string) => value.replace(/\D/g, '');

const CoordinatesInput = ({ geom, onChange, disabled }: CoordinatesInputProps) => {
  const fromGeom = geomToLks94(geom);
  const [x, setX] = useState(toInput(fromGeom.x));
  const [y, setY] = useState(toInput(fromGeom.y));

  // picking a point on the map fills the fields
  useEffect(() => {
    const next = geomToLks94(geom);
    setX(toInput(next.x));
    setY(toInput(next.y));
  }, [geom]);

  const handleChange = (rawX: string, rawY: string) => {
    const nextX = onlyDigits(rawX);
    const nextY = onlyDigits(rawY);
    setX(nextX);
    setY(nextY);
    const parsedX = Number(nextX);
    const parsedY = Number(nextY);
    if (!nextX || !nextY || !isInsideLithuania(parsedX, parsedY)) return;
    onChange(lks94ToGeom(parsedX, parsedY));
  };

  const isIncomplete = !x || !y;
  const error =
    isIncomplete || isInsideLithuania(Number(x), Number(y))
      ? undefined
      : validationTexts.coordinatesOutsideLithuania;

  return (
    <Row>
      <TextField
        label={inputLabels.coordinateX}
        name="coordinateX"
        value={x}
        disabled={disabled}
        onChange={(value: string) => handleChange(value, y)}
      />
      <TextField
        label={inputLabels.coordinateY}
        name="coordinateY"
        value={y}
        disabled={disabled}
        error={error}
        onChange={(value: string) => handleChange(x, value)}
      />
    </Row>
  );
};

const Row = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr 1fr;
  @media ${device.mobileL} {
    grid-template-columns: 1fr;
  }
`;

export default CoordinatesInput;
