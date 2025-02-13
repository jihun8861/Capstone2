import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import colors from "../../color/colors";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 1000px;
  background-color: ${colors.babyblue};
`;

export const MainPage = () => {
  const naviagte = useNavigate();

  const onClickLoginButton = () => {
    naviagte("/signin");
  };

  return (
    <Container>
      <p>메인페이지입니다.</p>
      <button onClick={onClickLoginButton}>로그인 페이지</button>
    </Container>
  );
};
