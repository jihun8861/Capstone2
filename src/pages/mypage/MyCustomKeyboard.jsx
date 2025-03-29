import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 20px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const Description = styled.p`
  color: #666;
  font-size: 16px;
`;

const MyCustomKeyboard = () => {
  return (
    <Container>
      <Title>나의 커스텀 키보드</Title>
      <Description>여기에 내가 만든 커스텀 키보드를 보여줄 예정</Description>
    </Container>
  );
};

export default MyCustomKeyboard;
