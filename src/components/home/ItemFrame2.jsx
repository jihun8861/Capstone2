import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: left;
  padding: 100px 20px;
  max-width: 1000px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 40px;
  font-weight: 700;
  color: #222;
  margin-bottom: 16px;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeIn 1s ease-in-out forwards;

  @keyframes fadeIn {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: #555;
  line-height: 1.6;
  max-width: 800px;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeIn 1s ease-in-out forwards;
  animation-delay: 0.3s;
`;

const ImageWrapper = styled.div`
  width: 100%;
  max-width: 600px;
  height: 350px;
  margin-top: 30px;
  border: 3px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeIn 1s ease-in-out forwards;
  animation-delay: 0.6s;
`;

const ImageText = styled.span`
  font-size: 16px;
  color: #888;
`;

export const ItemFrame2 = () => {
  return (
    <Container>
      <Title>🎨 나만의 커스텀 키보드를 만들어보세요!</Title>
      <Subtitle>
        원하는 키 스위치, 키캡, 레이아웃까지!  
        당신만의 개성을 담아 제작할 수 있는 커스텀 키보드 플랫폼을 경험해보세요.
      </Subtitle>
      <ImageWrapper>
        <ImageText>이미지가 들어갈 공간</ImageText>
      </ImageWrapper>
    </Container>
  );
};

