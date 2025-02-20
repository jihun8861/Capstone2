import styled from "styled-components";

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
  border: 2px solid #ddd;
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
`

const Title = styled.p`
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Description = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
`;

const RightFrames = styled.div`
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
`;

export const ItemFrame2 = () => {
  return (
    <Container>
      <ImageContainer />
      <Content>
        <TextBox>
        <Title>Capstone Design</Title>
        <Description>나만의 커스텀 키보드를 만들어보세요!</Description>
        </TextBox>
        <RightFrames>
          <KeyboardFrame>60%</KeyboardFrame>
          <KeyboardFrame>80%</KeyboardFrame>
          <KeyboardFrame>100%</KeyboardFrame>
        </RightFrames>
      </Content>
    </Container>
  );
};
