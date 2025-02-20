import styled from "styled-components";

const Container = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 20vh;
  background-color: #2c2c2c;
  color: #ffffff;
  font-size: 0.9rem;
  text-align: center;
`;

const Links = styled.div`
  margin-bottom: 0.5rem;
  
  a {
    color: #bbbbbb;
    text-decoration: none;
    margin: 0 10px;
    font-size: 0.85rem;
    
    &:hover {
      color: #ffffff;
      text-decoration: underline;
    }
  }
`;

export const Footer = () => {
  return (
    <Container>
      <Links>
        <a href="/about">About</a> | <a href="/contact">Contact</a> | <a href="/terms">Terms</a>
      </Links>
      <div>© 2025 Capstone Design. All rights reserved.</div>
    </Container>
  );
};