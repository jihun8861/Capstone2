import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 110px;
  position: fixed;
  top: 0;
  z-index: 100;
  background-color: white;
  border: solid 1px;
`

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: solid 1px;
`

export const Header = () => {
  const navigate = useNavigate();

const onClickLogo = () => {
  navigate("/");
}

  return (
    <Container>
      <Logo onClick={onClickLogo}>홈</Logo>
      <p>헤더입니다.</p>
      <p>테스트용</p>
    </Container>
  )
}