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

const FavoriteProducts = () => {
  return (
    <Container>
      <Title>관심상품</Title>
      <Description>내가 관심 있는 상품 목록이 표시될 예정</Description>
    </Container>
  );
};

export default FavoriteProducts;
