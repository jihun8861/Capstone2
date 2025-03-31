import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%);
  padding: 20px;
`;

const FormCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(109, 140, 255, 0.15);
  padding: 40px;
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 40px;
  font-size: 36px;
  font-weight: 700;
  color: #333;
  position: relative;

  &:after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background: #6d8cff;
    border-radius: 2px;
  }
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const InputLabel = styled.label`
  font-size: 15px;
  font-weight: 600;
  color: #444;
  margin-bottom: 8px;
`;

const Input = styled.input`
  height: 50px;
  padding: 12px 16px;
  font-size: 16px;
  border: 1px solid #dce1e8;
  border-radius: 8px;
  transition: all 0.2s ease;
  background-color: #f8fafc;

  &:focus {
    outline: none;
    border-color: #6d8cff;
    box-shadow: 0 0 0 3px rgba(109, 140, 255, 0.2);
    background-color: white;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  height: 55px;
  background: #6d8cff;
  color: white;
  font-size: 18px;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.3s ease;

  &:hover {
    background: #5a75e6;
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(109, 140, 255, 0.3);
  }

  &:active {
    transform: translateY(-1px);
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;
  color: #999;
  font-size: 14px;

  &:before,
  &:after {
    content: "";
    flex-grow: 1;
    background: #eee;
    height: 1px;
    margin: 0 10px;
  }
`;

const SocialLoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
`;

const KakaoButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  height: 50px;
  background-color: #fee500;
  color: #3a1d1d;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0 20px;

  &:hover {
    background-color: #f6d800;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  &:before {
    content: "";
    display: inline-block;
    width: 24px;
    height: 24px;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 22' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M12 0C5.37 0 0 4.34 0 9.69C0 13.13 2.19 16.21 5.5 17.86C5.3 18.39 4.66 20.46 4.5 20.97C4.33 21.53 4.73 21.53 4.96 21.38C5.15 21.25 7.85 19.5 9.06 18.7C10.02 18.86 11 18.94 12 18.94C18.63 18.94 24 14.6 24 9.25C24 4.15 18.88 0 12 0Z' fill='%233A1D1D'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
  }
`;

const HelpText = styled.p`
  font-size: 12px;
  color: #777;
  margin-top: 4px;
`;

const SignUpLink = styled.div`
  margin-top: 25px;
  font-size: 15px;
  color: #666;
  text-align: center;

  a {
    font-weight: 600;
    color: #6d8cff;
    text-decoration: none;
    margin-left: 5px;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const SignInPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const REST_API_KEY = `9b8440c52cc5a7dd32647c76aade83d3`;
  const REDIRECT_URI = `http://localhost:5173/KakaoRedirect`;
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  const handleKakaoLogin = () => {
    localStorage.setItem("redirectTo", window.location.pathname);
    window.location.href = KAKAO_AUTH_URL;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://port-0-edcustom-lxx6l4ha4fc09fa0.sel5.cloudtype.app/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            Accept: "application/json;charset=UTF-8",
          },
          //withCredentials: true,
        }
      );

      if (response.data.status === "OK" && response.data.data.token) {
        localStorage.setItem("token", response.data.data.token);
        window.location.href = "/";
      } else {
        alert("로그인 실패: 서버 응답이 올바르지 않습니다.");
      }
    } catch (error) {
      if (error.response) {
        console.log("data: ", error.response.data.data);
        console.log("status: ", error.response.data.status);
        console.log("headers: ", error.response.data.headers);

        if (error.response.status === 400) {
          alert("아이디 또는 비밀번호가 틀렸습니다.");
        } else {
          alert("로그인 중 문제가 발생했습니다. 다시 시도해주세요.");
        }
      } else if (error.request) {
        console.log("request: ", error.request);
        alert("서버 응답이 없습니다. 네트워크 상태를 확인해주세요.");
      } else {
        console.log("Error", error.message);
        alert("예기치 못한 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <FormCard>
        <Title>로그인</Title>
        <Form onSubmit={handleLogin}>
          <InputBox>
            <InputLabel>아이디</InputLabel>
            <Input
              type="text"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </InputBox>

          <InputBox>
            <InputLabel>비밀번호</InputLabel>
            <Input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </InputBox>

          <LoginButton type="submit" disabled={isLoading}>
            {isLoading ? "로그인 중..." : "로그인"}
          </LoginButton>
        </Form>

        <Divider>또는</Divider>

        <SocialLoginWrapper>
          <KakaoButton type="button" onClick={handleKakaoLogin}>
            카카오로 로그인
          </KakaoButton>
        </SocialLoginWrapper>
        <HelpText>
          카카오 계정으로 로그인하신 후, 마이페이지에서 닉네임을 설정해주세요.
        </HelpText>

        <SignUpLink>
          아직 회원이 아니신가요?<a href="/signup">회원가입</a>
        </SignUpLink>
      </FormCard>
    </Container>
  );
};
