import { find, map } from 'lodash';
import styled from 'styled-components';
import { device } from '../../styles/index';
import { useSignatureUsers } from '../../utils/hooks';

const SignatureList = ({ data, municipalityId }: any) => {
  const signatureUsers: { id: string; name: string; users: string[] }[] =
    useSignatureUsers(municipalityId);
  return (
    <>
      {map(data, (item: any, index: number) => {
        if (item) {
          return (
            <SignatureRow key={index}>
              <Column>
                <InfoLabel>
                  {find(
                    signatureUsers,
                    (signatureUser: any) => signatureUser.id === item.organization,
                  )?.name || ''}
                </InfoLabel>
                <SubRow>
                  <InfoValue>{item?.signedBy}</InfoValue>
                  <Sign src={item.signature} />
                </SubRow>
              </Column>
            </SignatureRow>
          );
        }
      })}
    </>
  );
};

const Column = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 16px 0 0 0;
  padding-right: 16px;
  @media ${device.mobileL} {
    margin-bottom: 10px;
  }
`;

const InfoLabel = styled.span`
  font: 1.4rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary + '8A'};
`;

const InfoValue = styled.span`
  text-align: left;
  font: 1.6rem;
  padding-right: 16px;
`;

const SignatureRow = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0 0 10px 0;
  @media ${device.mobileL} {
    flex-direction: column;
  }
`;

const Sign = styled.img`
  max-height: 40px;
`;

const SubRow = styled.div`
  min-width: 200px;
  display: flex;
  align-items: center;
`;

export default SignatureList;
