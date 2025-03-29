import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuthStore } from "../../api/useAuthStore ";
import axios from "axios";

const UserEdit = () => {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState({
    nickname: false,
    password: false,
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    email: "",
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        nickname: user.nickname || "",
        email: user.email || "",
        currentPassword: "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrorMessage("");
    setSuccessMessage("");
  };

  // 닉네임 변경
  const handleNicknameChange = async () => {
    if (!formData.nickname.trim()) {
      setErrorMessage("닉네임을 입력해주세요.");
      return;
    }

    setLoading({ ...loading, nickname: true });
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // 닉네임 변경 API가 준비되면 여기에 실제 API 호출 코드를 추가
      // 지금은 성공메시지만 띄움

      setUser({
        ...user,
        nickname: formData.nickname,
      });

      setSuccessMessage("닉네임이 성공적으로 변경되었습니다.");
    } catch (error) {
      console.error("닉네임 변경 오류:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "닉네임 변경 중 오류가 발생했습니다. 다시 시도해주세요."
      );
    } finally {
      setLoading({ ...loading, nickname: false });
    }
  };
  // 비밀번호 변경
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!formData.currentPassword) {
      setErrorMessage("현재 비밀번호를 입력해주세요.");
      return;
    }

    if (!formData.password) {
      setErrorMessage("새 비밀번호를 입력해주세요.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading({ ...loading, password: true });
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const passwordResponse = await axios.patch(
        "https://port-0-edcustom-lxx6l4ha4fc09fa0.sel5.cloudtype.app/changepassword",
        {
          email: formData.email,
          currentPassword: formData.currentPassword,
          newPassword: formData.password,
        }
      );

      if (passwordResponse.data.status === "OK") {
        setSuccessMessage("비밀번호가 성공적으로 변경되었습니다.");
        setFormData({
          ...formData,
          currentPassword: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        setErrorMessage("비밀번호 변경에 실패했습니다.");
      }
    } catch (error) {
      console.error("비밀번호 변경 오류:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "비밀번호 변경 중 오류가 발생했습니다. 다시 시도해주세요."
      );
    } finally {
      setLoading({ ...loading, password: false });
    }
  };

  const resetForm = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        nickname: user.nickname || "",
        email: user.email || "",
        currentPassword: "",
        password: "",
        confirmPassword: "",
      });
    }
    setErrorMessage("");
    setSuccessMessage("");
  };

  return (
    <Container>
      <PageHeader>
        <Title>회원 정보 수정</Title>
      </PageHeader>

      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

      <FormCard>
        <StyledContent>
          <ProfileSection>
            <SectionTitle>기본 정보</SectionTitle>

            <FormGroup>
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                readOnly
              />
              <HelpText>이름은 변경할 수 없습니다</HelpText>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled
              />
              <HelpText>이메일은 변경할 수 없습니다</HelpText>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="nickname">닉네임</Label>
              <NicknameInputGroup>
                <Input
                  id="nickname"
                  type="text"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                  placeholder="닉네임을 입력하세요"
                />
                <ChangeButton
                  type="button"
                  onClick={handleNicknameChange}
                  disabled={loading.nickname}
                >
                  {loading.nickname ? "변경 중..." : "변경"}
                </ChangeButton>
              </NicknameInputGroup>
            </FormGroup>
          </ProfileSection>

          <PasswordSection>
            <SectionTitle>비밀번호 변경</SectionTitle>
            <form onSubmit={handlePasswordChange}>
              <FormGroup>
                <Label htmlFor="currentPassword">현재 비밀번호</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="현재 비밀번호"
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="password">새 비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="새 비밀번호"
                />
                <HelpText>8자 이상의 영문, 숫자, 특수문자 조합</HelpText>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="비밀번호 확인"
                />
              </FormGroup>

              <ButtonGroup>
                <CancelButton type="button" onClick={resetForm}>
                  취소
                </CancelButton>
                <SubmitButton type="submit" disabled={loading.password}>
                  {loading.password ? "변경 중..." : "비밀번호 변경"}
                </SubmitButton>
              </ButtonGroup>
            </form>
          </PasswordSection>
        </StyledContent>
      </FormCard>
    </Container>
  );
};

export default UserEdit;

const Container = styled.div`
  width: 100%;
  max-width: 800px;
  margin-top: -50px;
  margin-left: auto;
  margin-right: auto;
  padding: 20px;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  font-size: 24px;
  color: #333;
  font-weight: 600;
  margin: 0;
`;

const FormCard = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const StyledContent = styled.div`
  padding: 30px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  color: #333;
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
`;

const ProfileSection = styled.div``;

const PasswordSection = styled.div``;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border 0.2s;
  background-color: ${(props) =>
    props.disabled || props.readOnly ? "#f5f5f5" : "white"};

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.15);
  }
`;

const NicknameInputGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const HelpText = styled.p`
  font-size: 12px;
  color: #777;
  margin-top: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
  border-top: 1px solid #eee;
  padding-top: 20px;
  gap: 12px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
`;

const ChangeButton = styled(Button)`
  background: #007bff;
  color: white;
  border: none;
  white-space: nowrap;
  padding: 0 20px;

  &:hover {
    background: #0069d9;
  }

  &:disabled {
    background: #99c5ff;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background: #f2f2f2;
  color: #666;
  border: none;

  &:hover {
    background: #e5e5e5;
  }
`;

const SubmitButton = styled(Button)`
  background: #007bff;
  color: white;
  border: none;

  &:hover {
    background: #0069d9;
  }

  &:disabled {
    background: #99c5ff;
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled.div`
  background-color: #e6f7eb;
  color: #2e7d32;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 14px;
`;

const ErrorMessage = styled.div`
  background-color: #fdeeee;
  color: #d32f2f;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 14px;
`;
