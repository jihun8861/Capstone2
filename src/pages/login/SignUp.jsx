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
`;

const TitleText = styled.h2`
  text-align: center;
  margin-bottom: 100px;
  font-size: 36px;
  margin-top: -150px;
`;

const Form = styled.div`
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Label = styled.label`
  margin-top: 10px;
  font-size: 15px;
  font-weight: bold;
`;

const InputBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Input = styled.input`
  height: 50px;
  padding: 12px;
  font-size: 18px;
  border: 1px solid #ccc;
  border-radius: 8px;
  &:focus {
    outline: none;
    border-color: #6d8cff;
  }
`;

const ErrorText = styled.span`
  color: red;
  font-size: 14px;
  margin-top: 5px;
`;

const SignUpBtn = styled.button`
  width: 100%;
  height: 55px;
  background: #6d8cff;
  color: white;
  font-size: 18px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;
  &:hover {
    background: white;
    color: #6d8cff;
    border: 2px solid #6d8cff;
  }
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

export const SignUpPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isFormValid =
    name &&
    email &&
    password &&
    confirmPassword &&
    !errors.email &&
    !errors.password;

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

  const handleSignUp = async () => {
    if (!isFormValid) return;

    try {
      await axios.post(
        "https://port-0-edcustom-lxx6l4ha4fc09fa0.sel5.cloudtype.app/register",
        { name, email, password }
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
      <TitleText>회원가입</TitleText>
      <Form>
        <InputBox>
          <Label>이름</Label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </InputBox>
        <InputBox>
          <Label>이메일</Label>
          <Input type="email" value={email} onChange={handleEmailChange} />
          {errors.email && <ErrorText>{errors.email}</ErrorText>}
        </InputBox>
        <InputBox>
          <Label>비밀번호</Label>
          <Input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </InputBox>
        <InputBox>
          <Label>비밀번호 확인</Label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
          {errors.password && <ErrorText>{errors.password}</ErrorText>}
        </InputBox>
        <SignUpBtn onClick={handleSignUp} disabled={!isFormValid}>
          회원가입
        </SignUpBtn>
      </Form>
    </Container>
  );
};
