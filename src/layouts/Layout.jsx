import styled from "styled-components";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ScrollToTop } from "./ScrollToTop";

const Container = styled.div`
  width: 100%;
  height: auto;
`;

const Main = styled.div`
  width: 100%;
  height: 100%;
`;

const Layout = ({ mainContent }) => {
  return (
    <Container>
      <Header />
      <Main>{mainContent}</Main>
      <Footer />
      <ScrollToTop/>
    </Container>
  );
};

export default Layout;
