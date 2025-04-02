import styled from "styled-components";
import colors from "../../color/colors";
import { useLocation } from "react-router-dom";
import { ColorSelect } from "../../color/ColorSelect";
import { ThreeDModel } from "../../components/model/ThreeDModel";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 80px;
  height: 100vh;
`;

const HeaderLine = styled.div`
  width: 100%;
  height: 10px;
  background-color: black;
`;

const HeaderFrame = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-bottom: solid 1px #e1e1e1;
  justify-content: space-between;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
`;

const CustomImage = styled.img`
  width: 125px;
  height: 32px;
  padding-right: 5px;
  border-right: solid 1px #e1e1e1;
`;

const Title = styled.p`
  font-size: 19px;
  padding-left: 5px;
  color: #666666;
  font-weight: bold;
`;

const RightSection = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${colors.babyblue};
    color: white;
  }
`;

const CustomFrame = styled.div`
  width: 100%;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f1f2ed;
`;

export const CustomPage = () => {
  const location = useLocation();
  const selectedSize = location.state?.selectedSize || "Custom Keyboard";

  return (
    <Container>
      <HeaderLine />
      <HeaderFrame>
        <LeftSection>
          <CustomImage src="/images/custom.png" alt="Custom Keyboard" />
          <Title>{selectedSize}</Title> 
        </LeftSection>
        <RightSection>
          <Button>다시 시작하기</Button>
          <Button>공유하기</Button>
          <Button>저장하기</Button>
        </RightSection>
      </HeaderFrame>

      <CustomFrame>
        <ThreeDModel/>
      </CustomFrame>
        
      <ColorSelect />
    </Container>
  );
};

