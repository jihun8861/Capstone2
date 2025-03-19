import styled from "styled-components";
import { useParams } from "react-router-dom";
import colors from "../../color/colors";
import { ColorSelect } from "../../color/ColorSelect";
import { ThreeDModel } from "../../components/model/ThreeDModel";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 80px;
  height: 100vh;
  background-color: #f8f9fa;
`;

const HeaderLine = styled.div`
  width: 100%;
  height: 12px;
  background-color: black;
`;

const HeaderFrame = styled.div`
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-bottom: solid 1px #ddd;
  justify-content: space-between;
  background-color: white;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.05);
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
`;

const CustomImage = styled.img`
  width: 130px;
  height: 32px;
  padding-right: 10px;
  border-right: solid 1px #e1e1e1;
`;

const Title = styled.p`
  font-size: 19px;
  margin-left: 10px;
  color: #333;
  font-weight: bold;
`;

const RightSection = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: ${colors.babyblue};
    color: white;
    transform: scale(1.05);
  }
`;

const CustomFrame = styled.div`
  position: relative;
  width: 100%;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e9ecef;
`;

const SelectFrame = styled.div`
  position: absolute;
  top: 50%;
  left: 5%;
  transform: translateY(-50%);
  width: 280px;
  height: 340px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: none;
`;

export const CustomPage = () => {
  const { size } = useParams();
  const selectedSize = size ? `${size}%` : "Custom Keyboard";

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
        <SelectFrame>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#333",cursor:"pointer" }}>
            스위치
          </p>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#333",cursor:"pointer" }}>
            키캡
          </p>
        </SelectFrame>
        <ThreeDModel />
      </CustomFrame>

      <ColorSelect />
    </Container>
  );
};
