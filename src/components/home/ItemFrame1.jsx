import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 70px;
  position: relative;
`;

const ImageContainer = styled.div`
  width: 800px;
  height: 700px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ImageFrame = styled.img`
  width: 100%;
  height: 100%;
`;

const Content = styled.div`
  padding-left: 50px;
  display: flex;
  flex-direction: column;
`;

const TextBox = styled.div`
  position: absolute;
  top: 20%;
  left: 100%;
  width: 50%;
  height: auto;
`;

const Title = styled.p`
  font-size: 40px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Description = styled.p`
  font-size: 16px;
  color: #8d8d8d;
  margin-bottom: 30px;
  line-height: 1.8;
`;

const RightFrame = styled.div`
  display: flex;
  position: absolute;
  left: 840px;
  gap: 40px;
`;

const KeyboardFrame = styled.div`
  width: 280px;
  height: 250px;
  border: 1px solid #ddd;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  background-color: #f9f9f9;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e0e0e0;
  }
`;

export const ItemFrame1 = () => {
  const navigate = useNavigate();

  const handleClick = (size) => {
    navigate("/custompage", { state: { selectedSize: size } });
  };

  return (
    <Container>
      <ImageContainer>
        <ImageFrame src="/images/itemframe2.png" />
      </ImageContainer>
      <Content>
        <TextBox>
          <Title>Capstone Design II</Title>
          <Description>
            다양한 키 배열과 디자인을 선택하여,  <br/>
            3D를 통해 자신만의 키보드를 만들어 보세요.
          </Description>
        </TextBox>
        <RightFrame>
          <KeyboardFrame onClick={() => handleClick("60%")}>60%</KeyboardFrame>
          <KeyboardFrame onClick={() => handleClick("80%")}>80%</KeyboardFrame>
          <KeyboardFrame onClick={() => handleClick("100%")}>
            100%
          </KeyboardFrame>
        </RightFrame>
      </Content>
    </Container>
  );
};