import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 93vh;
  background-image: url("/images/banner.jpg");
  background-size: 100% 100%;
`;

export const MainBanner = () => {
  return <Container />;
};
