import styled from 'styled-components';
import { device } from '../../styles';

interface InfoColumnProps {
  label: string;
  value?: string;
  reverse?: boolean;
}

const InfoColumn = ({ label, value, reverse = false }: InfoColumnProps) => {
  const safeValue = value ? neutralizeDateLikeText(value) : '';

  return (
    <Column>
      <InfoLabel reverse={reverse}>{label}</InfoLabel>
      <InfoValue reverse={reverse}>{safeValue}</InfoValue>
    </Column>
  );
};

function neutralizeDateLikeText(text: string): string {
  return text
    .replace(/(\d{4})([-/])(\d{2})([-/])(\d{2})/, '$1\u200B$2\u200B$3\u200B$4\u200B$5')
    .replace(/(\d{2})\.(\d{2})\.(\d{4})/, '$1.\u200B$2.\u200B$3')
    .replace(/@/g, '\u200B@\u200B');
}

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
  font: ${({ reverse }) => (reverse ? '1.6rem' : '1.4rem')};
  font-weight: 600;
  color: ${({ theme, reverse }) => (reverse ? theme.colors.primary : theme.colors.primary + '8A')};
`;

const InfoValue = styled.span<{ reverse: boolean }>`
  text-align: left;
  font: 1.6rem;
  font-weight: ${({ reverse }) => (reverse ? 'normal' : '600')};
  color: ${({ theme }) => theme.colors.primary};
  white-space: pre-wrap;
  user-select: text;

  -webkit-touch-callout: none;
  -webkit-user-select: text;
  -webkit-text-size-adjust: none;
  -webkit-user-modify: read-only !important;
  word-break: break-word;
`;

export default InfoColumn;
