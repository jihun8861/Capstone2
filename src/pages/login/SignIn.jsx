import styled from "styled-components";
import colors from "../../color/colors"; // 기존 프로젝트 색상과 통합

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
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 380px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
  color: #222;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px;
  margin: 8px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  margin-top: 15px;
  background-color: #004aad; /* 기존 오렌지 -> 네이비 */
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s ease;

  &:hover {
    background-color: #003580;
  }
`;

const SocialLoginWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 10px;
`;

const SocialLoginButton = styled.button`
  width: 48%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  gap: 10px;
  transition: background 0.3s ease;

  &.kakao {
    background-color: #fee500;
    color: #3c1e1e;
  }
  &.kakao:hover {
    background-color: #f7d700;
  }

  &.naver {
    background-color: #03c75a;
    color: white;
  }
  &.naver:hover {
    background-color: #029b47;
  }
`;

const SignUpLink = styled.div`
  margin-top: 15px;
  font-size: 14px;
  color: #555;
  text-align: center;

  a {
    font-weight: bold;
    color: #004aad;
    text-decoration: none;
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

        <SocialLoginWrapper>
          <SocialLoginButton className="kakao">카카오 로그인</SocialLoginButton>
          <SocialLoginButton className="naver">네이버 로그인</SocialLoginButton>
        </SocialLoginWrapper>

        <SignUpLink>
          아직 회원이 아니신가요? <a href="/signup">회원가입</a>
        </SignUpLink>
      </FormWrapper>
    </Container>
  );
};
