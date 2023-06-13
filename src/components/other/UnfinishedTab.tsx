import { useState } from "react";
import styled from "styled-components";
import { FishStockingStatus } from "../../utils/constants";
import { FishStocking } from "../../utils/types";
const tabs = [
  { label: "Registracijos duomenys", route: FishStockingStatus.UPCOMING },
  { label: "Faktiniai duomenys", route: FishStockingStatus.ONGOING }
];

const UnfinishedTab = ({ fishStocking }: { fishStocking: FishStocking }) => {
  const [selectedTab, setSelectedTab] = useState(
    fishStocking?.status || FishStockingStatus.UPCOMING
  );

  return (
    <>
      <TabsContainer>
        {tabs.map((tab) => (
          <MenuButton
            key={tab.route}
            isSelected={tab.route === selectedTab}
            onClick={() => setSelectedTab(tab.route)}
          >
            {tab.label}
          </MenuButton>
        ))}
      </TabsContainer>
    </>
  );
};

const MenuButton = styled.div<{ isSelected: boolean }>`
  color: ${({ theme, isSelected }) =>
    isSelected ? "white" : theme.colors.primary};
  font-weight: 600;
  font-size: 1.4rem;
  cursor: pointer;
  position: relative;
  padding: 0 0 4px 0;
  background-color: ${({ theme, isSelected }) =>
    isSelected ? theme.colors.primary : "transparent"};
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

export default UnfinishedTab;
