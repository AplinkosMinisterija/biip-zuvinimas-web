import styled from "styled-components";
import { device } from "../../styles";

interface InfoColumnProps {
  label: string;
  value?: string;
  reverse?: boolean;
}

const InfoColumn = ({ label, value, reverse = false }: InfoColumnProps) => {
  return (
    <Column>
      <InfoLabel reverse={reverse}>{label}</InfoLabel>
      <InfoValue reverse={reverse}>{value}</InfoValue>
    </Column>
  );
};

const Column = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 16px 0;
  padding-right: 16px;
  @media ${device.mobileL} {
    margin-bottom: 10px;
  }
`;

const InfoLabel = styled.span<{ reverse: boolean }>`
  font: ${({ reverse }) => (reverse ? "1.6rem" : "1.4rem")};
  font-weight: 600;
  color: ${({ theme, reverse }) =>
    reverse ? theme.colors.primary : theme.colors.primary + "8A"};
`;

const InfoValue = styled.span<{ reverse: boolean }>`
  text-align: left;
  font: 1.6rem;
  font-weight: ${({ reverse }) => (reverse ? "normal" : "600")};
  color: ${({ theme }) => theme.colors.primary};
`;

export default InfoColumn;
