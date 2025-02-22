import styled from "styled-components";
import { Header } from "./Header";
import { Footer } from "./Footer";

const Container = styled.div`
  width: 100%;
  height: auto;  
`;

const Main = styled.div`
  width: 100%;
  height: 100%;
  padding-top: 110px; // 헤더 높이만큼 padding 값 줌.
`;

const Layout = ({ mainContent }) => {
  return (
    <Container>
      <Header/>
      <Main>{mainContent}</Main>
      <Footer />
    </Container>
  );
};

export default Layout;