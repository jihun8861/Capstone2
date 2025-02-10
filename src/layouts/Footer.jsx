import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 10vh;
  position: relative;
  bottom: 0;
  background-color: white;
  border: solid 1px;
`

export const Footer = () => {
  return (
    <Container>
      푸터입니다.
    </Container>
  )
}