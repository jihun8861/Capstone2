import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background-color: #f8f9fa;
`;

const FormWrapper = styled.div`
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  width: 360px;
  text-align: center;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  font-size: 22px;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  margin-top: 15px;
  background-color: #005bac;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background-color: #004080;
  }
`;

const SocialLoginButton = styled.button`
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: background 0.3s ease;

  &.kakao {
    background-color: #fee500;
    color: #3c1e1e;
  }
  &.naver {
    background-color: #03c75a;
    color: white;
  }
  &.kakao:hover {
    background-color: #f7d700;
  }
  &.naver:hover {
    background-color: #029d47;
  }
`;

export const SignInPage = () => {
  return (
    <Container>
      <FormWrapper>
        <Title>로그인</Title>
        <Input type="text" placeholder="아이디" />
        <Input type="password" placeholder="비밀번호" />
        <Button type="submit">로그인</Button>
        <SocialLoginButton className="kakao">카카오 로그인</SocialLoginButton>
        <SocialLoginButton className="naver">네이버 로그인</SocialLoginButton>
      </FormWrapper>
    </Container>
  );
};
