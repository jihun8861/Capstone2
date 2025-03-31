import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuthStore } from "../../api/useAuthStore ";
import axios from "axios";

const Container = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 40px auto;
  padding: 0 20px;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  position: relative;

  &:after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 60px;
    height: 3px;
    background: #007bff;
    border-radius: 2px;
  }
`;

const Title = styled.h2`
  font-size: 28px;
  color: #2c3e50;
  font-weight: 700;
  margin: 0;
`;

const FormCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.07);
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
    transform: translateY(-3px);
  }
`;

const StyledContent = styled.div`
  padding: 40px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 30px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 20px;
  color: #2c3e50;
  margin: 0 0 25px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #edf2f7;
  position: relative;

  &:after {
    content: "";
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 40px;
    height: 3px;
    background: #007bff;
    border-radius: 2px;
  }
`;

const ProfileSection = styled.div``;

const PasswordSection = styled.div``;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 10px;
  color: #4a5568;
  font-size: 15px;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 15px;
  transition: all 0.3s;
  background-color: ${(props) =>
    props.disabled || props.readOnly ? "#f8fafc" : "white"};

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15);
  }

  &:hover:not(:disabled):not([readonly]) {
    border-color: #cbd5e0;
  }

  &::placeholder {
    color: #a0aec0;
  }
`;

const NicknameInputGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const HelpText = styled.p`
  font-size: 13px;
  color: #718096;
  margin-top: 6px;
  margin-left: 6px;
  font-style: italic;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
  border-top: 1px solid #edf2f7;
  padding-top: 25px;
  gap: 16px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ChangeButton = styled(Button)`
  background: #007bff;
  color: white;
  border: none;
  white-space: nowrap;
  padding: 0 24px;
  min-width: 100px;

  &:hover {
    background: #0069d9;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #90cdf4;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const CancelButton = styled(Button)`
  background: #f7fafc;
  color: #4a5568;
  border: 1px solid #e2e8f0;

  &:hover {
    background: #edf2f7;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SubmitButton = styled(Button)`
  background: #007bff;
  color: white;
  border: none;
  min-width: 160px;

  &:hover {
    background: #0069d9;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #90cdf4;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const Message = styled.div`
  padding: 16px;
  border-radius: 10px;
  margin-bottom: 24px;
  font-size: 15px;
  display: flex;
  align-items: center;

  &:before {
    content: "";
    margin-right: 12px;
    width: 24px;
    height: 24px;
    background-size: contain;
    background-repeat: no-repeat;
  }
`;

const SuccessMessage = styled(Message)`
  background-color: #e6fffa;
  color: #2c7a7b;
  border-left: 4px solid #38b2ac;

  &:before {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2338b2ac'%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z'/%3E%3C/svg%3E");
  }
`;

const ErrorMessage = styled(Message)`
  background-color: #fff5f5;
  color: #c53030;
  border-left: 4px solid #e53e3e;

  &:before {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e53e3e'%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'/%3E%3C/svg%3E");
  }
`;

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

  const handleNicknameChange = async () => {
    if (!formData.nickname.trim()) {
      setErrorMessage("닉네임을 입력해주세요.");
      return;
    }

    setLoading({ ...loading, nickname: true });
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.post(
        "https://port-0-edcustom-lxx6l4ha4fc09fa0.sel5.cloudtype.app/updatenickname",
        {
          email: formData.email,
          nickname: formData.nickname,
        }
      );

      if (response.data.status === "OK") {
        setUser({
          ...user,
          nickname: formData.nickname,
        });
        setSuccessMessage("닉네임이 성공적으로 변경되었습니다.");
      } else {
        setErrorMessage(response.data.message || "닉네임 변경에 실패했습니다.");
      }
    } catch (error) {
      console.error("닉네임 변경 오류:", error);
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage(
          "닉네임 변경 중 오류가 발생했습니다. 다시 시도해주세요."
        );
      }
    } finally {
      setLoading({ ...loading, nickname: false });
    }
  };

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
                <HelpText>
                  소셜로그인 사용자는 비밀번호를 변경하실 수 없습니다.
                </HelpText>
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
