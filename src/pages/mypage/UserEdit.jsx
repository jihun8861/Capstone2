import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuthStore } from "../../api/useAuthStore ";
import axios from "axios";

const UserEdit = () => {
  const { user, setUser } = useAuthStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await axios.post(
        "https://example.com/api/update-user", // 백엔드 API 주소가 완성되면 변경 필요
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }
      );

      if (response.data.success) {
        alert("회원 정보가 성공적으로 수정되었습니다.");
        setUser({ name: formData.name, email: formData.email }); // 상태 업데이트
      } else {
        alert("회원 정보 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("회원 정보 수정 오류:", error);
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <Container>
      <Title>회원 정보 수정</Title>
      <Form onSubmit={handleSubmit}>
        <Label>이름</Label>
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <Label>이메일</Label>
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <Label>비밀번호</Label>
        <Input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="새 비밀번호를 입력하세요"
        />

        <Label>비밀번호 확인</Label>
        <Input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="비밀번호를 다시 입력하세요"
        />

        <Button type="submit">수정하기</Button>
      </Form>
    </Container>
  );
};

export default UserEdit;

const Container = styled.div`
  max-width: 600px;
  width: 100%;
  margin: 50px auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: bold;
  margin-top: 10px;
`;

const Input = styled.input`
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

const Button = styled.button`
  margin-top: 20px;
  padding: 10px;
  background: #007bff;
  color: white;
  font-size: 18px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: #0056b3;
  }
`;
