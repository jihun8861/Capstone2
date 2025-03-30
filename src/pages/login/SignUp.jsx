import React, { useState } from "react";
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
  max-width: 600px;
`;

const TitleText = styled.h2`
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

const Form = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Label = styled.label`
  font-size: 15px;
  font-weight: 600;
  color: #444;
  margin-bottom: 5px;
  display: block;
`;

const InputBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 5px;
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

const NicknameContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const NicknameInput = styled(Input)`
  flex: 1;
`;

const CheckButton = styled.button`
  height: 50px;
  background: #6d8cff;
  color: white;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  padding: 0 20px;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    background: #5a75e6;
    transform: translateY(-2px);
  }

  &:disabled {
    background: #b4c0e4;
    cursor: not-allowed;
    transform: none;
  }
`;

const SuccessText = styled.span`
  color: #34d399;
  font-size: 14px;
  margin-top: 5px;
  display: flex;
  align-items: center;

  &::before {
    content: "✓";
    margin-right: 5px;
    font-weight: bold;
  }
`;

const ErrorText = styled.span`
  color: #ef4444;
  font-size: 14px;
  margin-top: 5px;
  display: flex;
  align-items: center;

  &::before {
    content: "✕";
    margin-right: 5px;
    font-weight: bold;
  }
`;

const SignUpBtn = styled.button`
  width: 100%;
  height: 55px;
  background: #6d8cff;
  color: white;
  font-size: 18px;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 20px;
  transition: all 0.3s ease;

  &:hover {
    background: #5a75e6;
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(109, 140, 255, 0.3);
  }

  &:active {
    transform: translateY(-1px);
  }

  &:disabled {
    background: #b4c0e4;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const SignInLink = styled.p`
  text-align: center;
  margin-top: 20px;
  font-size: 15px;
  color: #666;

  a {
    color: #6d8cff;
    font-weight: 600;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const SignUpPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    nickname: "",
  });
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isFormValid =
    name &&
    email &&
    nickname &&
    password &&
    confirmPassword &&
    nicknameChecked &&
    !errors.email &&
    !errors.password &&
    !errors.nickname;

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (!validateEmail(value)) {
      setErrors((prev) => ({
        ...prev,
        email: "올바른 이메일 형식이 아닙니다.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (confirmPassword && e.target.value !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        password: "비밀번호가 일치하지 않습니다.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (password !== e.target.value) {
      setErrors((prev) => ({
        ...prev,
        password: "비밀번호가 일치하지 않습니다.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
    // 닉네임이 변경되면 확인 상태 초기화
    setNicknameChecked(false);
    setErrors((prev) => ({ ...prev, nickname: "" }));
  };

  const checkNicknameDuplicate = async () => {
    if (!nickname) {
      setErrors((prev) => ({
        ...prev,
        nickname: "닉네임을 입력해주세요.",
      }));
      return;
    }

    setIsCheckingNickname(true);

    try {
      // 닉네임 중복 확인 API 호출 (POST 방식)
      const response = await axios.post(
        "https://port-0-edcustom-lxx6l4ha4fc09fa0.sel5.cloudtype.app/alreadyusingnickname",
        { nickname: nickname },
        {
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
          },
        }
      );

      // false를 받으면 사용 가능한 닉네임
      if (response.data === false) {
        setNicknameChecked(true);
        setErrors((prev) => ({ ...prev, nickname: "" }));
      } else {
        // true를 받으면 중복된 닉네임
        setNicknameChecked(false);
        setErrors((prev) => ({
          ...prev,
          nickname: "이미 사용 중인 닉네임입니다.",
        }));
      }
    } catch (error) {
      console.error("닉네임 중복 확인 중 오류 발생:", error);
      setNicknameChecked(false);
      setErrors((prev) => ({
        ...prev,
        nickname: "중복 확인 중 오류가 발생했습니다.",
      }));
    } finally {
      setIsCheckingNickname(false);
    }
  };

  const handleSignUp = async () => {
    if (!isFormValid) return;

    try {
      await axios.post(
        "https://port-0-edcustom-lxx6l4ha4fc09fa0.sel5.cloudtype.app/register",
        { name, email, password, nickname }
      );
      alert("회원가입이 완료되었습니다.");
      navigate("/signin");
    } catch (error) {
      alert("회원가입 중 오류가 발생했습니다.");
      console.error(error);
    }
  };

  return (
    <Container>
      <FormCard>
        <TitleText>회원가입</TitleText>
        <Form>
          <InputBox>
            <Label>이름</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
            />
          </InputBox>

          <InputBox>
            <Label>닉네임</Label>
            <NicknameContainer>
              <NicknameInput
                type="text"
                value={nickname}
                onChange={handleNicknameChange}
                placeholder="사용할 닉네임을 입력하세요"
              />
              <CheckButton
                onClick={checkNicknameDuplicate}
                disabled={!nickname || isCheckingNickname}
              >
                {isCheckingNickname ? "확인 중..." : "중복 확인"}
              </CheckButton>
            </NicknameContainer>
            {errors.nickname && <ErrorText>{errors.nickname}</ErrorText>}
            {nicknameChecked && (
              <SuccessText>사용 가능한 닉네임입니다.</SuccessText>
            )}
          </InputBox>

          <InputBox>
            <Label>이메일</Label>
            <Input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="이메일 주소를 입력하세요"
            />
            {errors.email && <ErrorText>{errors.email}</ErrorText>}
          </InputBox>

          <InputBox>
            <Label>비밀번호</Label>
            <Input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="비밀번호를 입력하세요"
            />
          </InputBox>

          <InputBox>
            <Label>비밀번호 확인</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="비밀번호를 다시 입력하세요"
            />
            {errors.password && <ErrorText>{errors.password}</ErrorText>}
          </InputBox>

          <SignUpBtn onClick={handleSignUp} disabled={!isFormValid}>
            회원가입
          </SignUpBtn>

          <SignInLink>
            이미 계정이 있으신가요? <a href="/signin">로그인</a>
          </SignInLink>
        </Form>
      </FormCard>
    </Container>
  );
};
