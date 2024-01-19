import { useMediaQuery } from '@material-ui/core';
import { useLocation, useNavigate } from 'react-router';
import styled, { css } from 'styled-components';
import { device } from '../../styles';
import { useFilteredRoutes } from '../../utils/hooks';
import { slugs } from '../../utils/routes';
import { buttonsTitles } from '../../utils/texts';
import Button, { ButtonColors } from '../buttons/Button';
import SimpleSelect from '../fields/SimpleSelect';
import UserSwitchMenu from './ProfileDropdown';

const NavBar = () => {
  const isMobile = useMediaQuery(device.mobileL);
  const navigate = useNavigate();
  const location = useLocation();
  const routes = useFilteredRoutes();
  const locationSlug = location?.pathname?.split('/')[1];

  return (
    <>
      <Header>
        <Logo onClick={() => navigate('/')} src="/logo.svg" />
        <HeaderLeft>
          <StyledButton
            variant={ButtonColors.SECONDARY}
            onClick={() => navigate(slugs.newFishStockings)}
            height={40}
            padding="0"
            disabled={false}
          >
            {buttonsTitles.new}
          </StyledButton>

          {!isMobile ? (
            routes.map((tab, index) => {
              const slugRoot = tab.slug?.split('/')[1];

              return (
                <MenuButton
                  key={`${tab.title}-${index}`}
                  isSelected={locationSlug?.includes(slugRoot)}
                  onClick={() => navigate(tab.slug)}
                >
                  {tab.title}
                </MenuButton>
              );
            })
          ) : (
            <SimpleSelect
              options={routes}
              getOptionLabel={(option: any) => option?.title}
              onChange={(option: any) => navigate(option?.slug)}
              iconRight="menu"
            />
          )}

          <UserSwitchMenu />
        </HeaderLeft>
      </Header>
    </>
  );
};

const MenuButton = styled.div<{ isSelected: boolean }>`
  font-size: 1.6rem;
  color: #121926;
  width: 100%;
  white-space: nowrap;
  cursor: pointer;
  position: relative;
  ${({ isSelected: current }) =>
    current &&
    css`
      &::after {
        content: ' ';
        position: absolute;
        background-color: ${({ theme }) => theme.colors.secondary};
        bottom: -10px;
        right: 0;
        width: 100%;
        height: 5px;
      }
    `}
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const StyledButton = styled(Button)`
  @media ${device.mobileL} {
    width: 120px;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

const Logo = styled.img`
  cursor: pointer;
  height: 32px;
`;

export default NavBar;
