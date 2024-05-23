import { useState } from 'react';
import styled from 'styled-components';
import Cookies from 'universal-cookie';
import { FishStockingStatus } from '../../utils/constants';
import { FishStocking } from '../../utils/types';
import Registration from './Registration';
import Review from './Review';
const tabs = [
  { label: 'Registracijos duomenys', route: FishStockingStatus.UPCOMING },
  { label: 'Faktiniai duomenys', route: FishStockingStatus.ONGOING },
];
const cookies = new Cookies();

const Unfinished = ({ fishStocking }: { fishStocking: FishStocking }) => {
  const [selectedTab, setSelectedTab] = useState(
    fishStocking?.status || FishStockingStatus.UPCOMING,
  );

  const renderTabs = (
    <TabsContainer>
      {tabs.map((tab) => (
        <MenuButton
          key={tab.route}
          $isSelected={tab.route === selectedTab}
          onClick={() => setSelectedTab(tab.route)}
        >
          {tab.label}
        </MenuButton>
      ))}
    </TabsContainer>
  );

  if (selectedTab === FishStockingStatus.ONGOING)
    return (
      <Review
        disabled={fishStocking?.status !== FishStockingStatus.ONGOING}
        renderTabs={renderTabs}
        fishStocking={fishStocking!}
      />
    );

  console.log;

  return (
    <Registration
      disabled={
        fishStocking?.status !== FishStockingStatus.UPCOMING ||
        fishStocking.stockingCustomer?.id === cookies.get('profileId')
      }
      renderTabs={renderTabs}
      fishStocking={fishStocking}
    />
  );
};

const MenuButton = styled.div<{ $isSelected: boolean }>`
  color: ${({ theme, $isSelected }) => ($isSelected ? 'white' : theme.colors.primary)};
  font-size: 1.4rem;
  cursor: pointer;
  position: relative;
  padding: 0 0 4px 0;
  background-color: ${({ theme, $isSelected }) =>
    $isSelected ? theme.colors.primary : 'transparent'};
  padding: 8px 16px;
  border-radius: 24px;
  text-align: center;
  justify-content: center;
`;

const TabsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 24px;
`;

export default Unfinished;
