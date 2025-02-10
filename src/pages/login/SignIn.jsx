import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 1000px;
`

export const SignInPage = () => {
  return (
    <Container>
        <p>로그인 페이지입니다.</p>
    </Container>
  )
}