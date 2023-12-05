import { useMediaQuery } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import { FishStocking } from '../../utils/types';

interface FishStockingTableProps {
  fishStocking: FishStocking;
}

const FishStockingTable = ({ fishStocking }: FishStockingTableProps) => {
  const isMobile = useMediaQuery('(max-width:350px)');
  return (
    <Table>
      <MobileTable>
        {isMobile ? (
          fishStocking?.batches.map(() => {
            return (
              <ThTr>
                <Th>ŽUVŲ RŪŠIS</Th>
                <Th>PLANUOTA</Th>
                <Th>ĮŽUVINTA</Th>
                <Th>TIKRINTA</Th>
              </ThTr>
            );
          })
        ) : (
          <ThTr>
            <Th>ŽUVŲ RŪŠIS</Th>
            <Th>PLANUOTA</Th>
            <Th>ĮŽUVINTA</Th>
            <Th>TIKRINTA</Th>
          </ThTr>
        )}
        {fishStocking?.batches.map((batch: any, index: any) => (
          <React.Fragment key={batch.id}>
            <TdTr>
              <Td>
                <div>{batch.fishType?.label}</div>

                <InnerTd>{batch.fishAge?.label}</InnerTd>
              </Td>
              <Td>
                {batch.amount || batch.amount === 0
                  ? batch.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                  : '-'}
              </Td>
              <Td>
                {batch.reviewAmount || batch.reviewAmount === 0
                  ? batch.reviewAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                  : '-'}
              </Td>
              <Td>
                {batch.reportedAmount || batch.reportedAmount === 0
                  ? batch.reportedAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                  : '-'}
              </Td>
            </TdTr>
            {index !== fishStocking.batches.length - 1 && <Hr />}
          </React.Fragment>
        ))}
      </MobileTable>
    </Table>
  );
};

const Th = styled.div`
  font-weight: 600;
  font-size: 1.2rem;
  line-height: 17px;
  color: #121a558a;
  flex: 1;
  text-align: end;
  @media (max-width: 350px) {
    font-size: 1.6rem;
    line-height: 22px;
    text-align: start;
  }
`;

const Td = styled.div`
  font-size: 1.6rem;
  line-height: 22px;
  letter-spacing: 0px;
  color: #121a55;
  flex: 1;
  text-align: end;
  display: flex;
  flex-direction: column;
`;
const InnerTd = styled.div`
  display: inline-block;
  width: 100%;
  color: #565656;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 2.4rem;
`;

const Hr = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.border};
`;

const Table = styled.div`
  width: 100%;
  margin: 50px 0;
`;

const MobileTable = styled.div`
  @media (max-width: 350px) {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
`;

const ThTr = styled.div`
  margin-bottom: 27px;
  display: flex;
  justify-content: space-between;
  > * {
    &:first-child {
      text-align: start;
    }
  }
  @media (max-width: 350px) {
    flex-direction: column;
    margin-bottom: 0px;
  }
`;

const TdTr = styled.div`
  text-transform: capitalize;
  margin: 13px 0;
  display: flex;
  justify-content: space-between;
  > * {
    &:first-child {
      text-align: start;
    }
  }
  @media (max-width: 350px) {
    flex-direction: column;
    margin: 0px 0;
    > * {
      &:first-child {
        text-align: end;
      }
    }
  }
`;

export default FishStockingTable;
