import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

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
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 450px;
  margin-top: -300px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  font-size: 50px;
  font-weight: bold;
  color: #222;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px;
  margin: 15px 0;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 17px;
`;

const Button = styled.button`
  width: 100%;
  padding: 16px;
  margin-top: 20px;
  background-color: #004aad;
  color: white;
  font-size: 18px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s ease;

  &:hover {
    background-color: #003580;
  }
`;

const SocialLoginWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 25px;
`;

const SocialLoginButton = styled.button`
  width: 100%;
  padding: 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
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
  font-size: 15px;
  color: #555;
  text-align: center;

  a {
    font-weight: bold;
    color: #004aad;
    text-decoration: none;
  }
`;

export const SignInPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const REST_API_KEY = `9b8440c52cc5a7dd32647c76aade83d3`;
  const REDIRECT_URI = `http://localhost:5173/KakaoRedirect`;
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  const handleKakaoLogin = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post(
        "https://port-0-edcustom-lxx6l4ha4fc09fa0.sel5.cloudtype.app/login",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            Accept: "application/json;charset=UTF-8",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200 && response.data.token) {
        localStorage.setItem("token", response.data.token);
        window.location.href = "/";
        console.log("token: ", response.data.token);
      } else {
        alert("로그인 실패: 서버 응답이 올바르지 않습니다.");
      }
    } catch (error) {
      if (error.response) {
        console.log("data: ", error.response.data);
        console.log("status: ", error.response.status);
        console.log("headers: ", error.response.headers);
      } else if (error.request) {
        console.log("request: ", error.request);
      } else {
        console.log("Error", error.message);
      }
      console.log("error.config: ", error.config);
    }
  };

  return (
    <Container>
      <FormWrapper>
        <Title>로그인</Title>
        <Input
          type="text"
          placeholder="아이디"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" onClick={handleLogin}>
          로그인
        </Button>

        <SocialLoginWrapper>
          <SocialLoginButton onClick={handleKakaoLogin} className="kakao">
            카카오 로그인
          </SocialLoginButton>
        </SocialLoginWrapper>

        <SignUpLink>
          아직 회원이 아니신가요? <a href="/signup">회원가입</a>
        </SignUpLink>
      </FormWrapper>
    </Container>
  );
};
