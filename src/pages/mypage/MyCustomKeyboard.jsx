import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useAuthStore } from "../../api/useAuthStore";
import axios from "axios";
import { shareItem } from "../../api/shareItem";
import { FiShare2 } from "react-icons/fi";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 20px;
  height: 80vh;
  overflow: hidden;
  margin-top: -30px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const Description = styled.p`
  color: #666;
  font-size: 16px;
  margin-bottom: 20px;
`;

const VerticalScroll = styled.div`
  width: 100%;
  max-width: 1200px;
  max-height: calc(100vh - 220px);
  overflow-y: auto;
  padding-right: 15px;
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }
`;

const KeyboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  width: 100%;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 992px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (min-width: 1400px) {
    grid-template-columns: repeat(5, 1fr);
  }
`;

const KeyboardCard = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  position: relative;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  }
`;

const KeyboardImage = styled.div`
  width: 100%;
  height: 180px;
  background-color: #f0f0f0;
  background-image: ${(props) =>
    props.image ? `url(${props.image})` : "none"};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const KeyboardImagePlaceholder = styled.div`
  color: #999;
  font-size: 14px;
`;

const KeyboardInfo = styled.div`
  padding: 12px;
  background-color: white;
`;

const KeyboardName = styled.h3`
  margin: 0 0 5px 0;
  font-size: 16px;
`;

const KeyboardDate = styled.div`
  font-size: 12px;
  color: #888;
`;

const KeyboardDetails = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 5px;
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background-color: #f9f9f9;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  text-align: center;
  margin-top: 180px;
`;

const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background-color: #fff0f0;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  text-align: center;
  margin-top: 180px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background-color: #f9f9f9;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  text-align: center;
  margin-top: 180px;
`;

const LikesBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: 20px;
  padding: 5px 10px;
  font-size: 12px;
  display: flex;
  align-items: center;
  z-index: 5;
`;

const ShareBadge = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: 20px;
  padding: 5px 10px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 5px;
  z-index: 5;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  &.sharing {
    background-color: rgba(76, 175, 80, 0.8);
    pointer-events: none;
  }
`;

const Toast = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${(props) => (props.success ? "#4caf50" : "#f44336")};
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  opacity: ${(props) => (props.show ? 1 : 0)};
  visibility: ${(props) => (props.show ? "visible" : "hidden")};
  transition: opacity 0.3s, visibility 0.3s, transform 0.3s;
  font-weight: 500;
  max-width: 80%;
  text-align: center;
  transform: ${(props) =>
    props.show
      ? "translateX(-50%) translateY(0)"
      : "translateX(-50%) translateY(20px)"};
  display: flex;
  align-items: center;
  gap: 8px;

  &:before {
    content: ${(props) => (props.success ? "'✓'" : "'ⓘ'")};
    font-weight: bold;
    font-size: 16px;
  }
`;

const LikeIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="red"
    stroke="white"
    strokeWidth="1"
    style={{ marginRight: "4px" }}
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const MyCustomKeyboard = () => {
  const [keyboards, setKeyboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    success: true,
  });
  const [sharingKeyboardId, setSharingKeyboardId] = useState(null);

  const { user } = useAuthStore();
  const userEmail = user?.email || "";

  useEffect(() => {
    const fetchKeyboards = async () => {
      if (!userEmail) {
        setLoading(false);
        setError("로그인이 필요합니다.");
        return;
      }

      try {
        setLoading(true);
        const response = await axios.post(
          "https://port-0-edcustom-lxx6l4ha4fc09fa0.sel5.cloudtype.app/items/find",
          { email: userEmail },
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
            },
          }
        );

        if (
          response.data &&
          response.data.status === "OK" &&
          Array.isArray(response.data.data)
        ) {
          const myKeyboards = response.data.data;

          const keyboardIds = myKeyboards.map((keyboard) => keyboard.id);

          if (keyboardIds.length > 0) {
            try {
              const likesResponse = await axios.post(
                "https://port-0-edcustom-lxx6l4ha4fc09fa0.sel5.cloudtype.app/checkliked",
                { ids: keyboardIds },
                {
                  headers: {
                    "Content-Type": "application/json;charset=UTF-8",
                  },
                }
              );

              if (
                likesResponse.data &&
                likesResponse.data.status === "OK" &&
                Array.isArray(likesResponse.data.data)
              ) {
                const likesMap = {};
                likesResponse.data.data.forEach((likeInfo) => {
                  if (likeInfo.id) {
                    likesMap[likeInfo.id] = likeInfo.likes || 0;
                  }
                });

                const updatedKeyboards = myKeyboards.map((keyboard) => ({
                  ...keyboard,
                  likes: likesMap[keyboard.id] || keyboard.likes || 0,
                }));

                setKeyboards(updatedKeyboards);
              } else {
                setKeyboards(myKeyboards);
              }
            } catch (likesErr) {
              console.error("좋아요 정보 가져오기 오류:", likesErr);
              setKeyboards(myKeyboards);
            }
          } else {
            setKeyboards(myKeyboards);
          }
        } else {
          throw new Error("응답 형식이 올바르지 않습니다");
        }
      } catch (err) {
        console.error("키보드 목록 불러오기 오류:", err);
        setError(
          err.response?.data?.message || "데이터를 불러오는데 실패했습니다"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchKeyboards();
  }, [userEmail]);

  const toastTimerRef = useRef(null);

  const showToast = (message, success = true) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    if (toast.show) {
      setToast({ show: false, message: "", success });
      setTimeout(() => {
        setToast({ show: true, message, success });
      }, 100);
    } else {
      setToast({ show: true, message, success });
    }

    toastTimerRef.current = setTimeout(() => {
      setToast((prevToast) => ({ ...prevToast, show: false }));
    }, 3000);
  };

  const handleShare = async (keyboard, e) => {
    e.stopPropagation();

    if (!userEmail) {
      showToast("로그인이 필요합니다.", false);
      return;
    }

    if (sharingKeyboardId === keyboard.id) {
      return;
    }

    setSharingKeyboardId(keyboard.id);
    showToast("키보드 공유 중...", true);

    try {
      const formData = new FormData();

      const keyboardName = getKeyboardName(
        keyboard,
        keyboards.indexOf(keyboard)
      );

      const jsonData = {
        email: userEmail,
        title: keyboardName,
        barebonecolor: keyboard.barebonecolor || "string",
        keyboardtype: keyboard.keyboardtype || "string",
        keycapcolor: keyboard.keycapcolor || "string",
        design: keyboard.design || "string",
        switchcolor: keyboard.switchcolor || "string",
        imageUrl: keyboard.imageUrl || "string",
      };

      console.log("공유할 키보드 데이터:", keyboard);
      console.log("FormData에 추가할 JSON:", jsonData);

      formData.append(
        "DTO",
        new Blob([JSON.stringify(jsonData)], {
          type: "application/json",
        })
      );

      if (keyboard.imageUrl) {
        try {
          const imageResponse = await fetch(keyboard.imageUrl);
          const imageBlob = await imageResponse.blob();

          const fileName = `shared_keyboard_${new Date().getTime()}.png`;
          const file = new File([imageBlob], fileName, { type: "image/png" });

          formData.append("file", file);
        } catch (imageError) {
          console.error("이미지 처리 오류:", imageError);
          showToast(
            "이미지 처리 중 오류가 발생했으나, 공유를 계속합니다.",
            false
          );
        }
      }

      const result = await shareItem(formData);
      console.log("API 응답:", result);

      if (result.success) {
        showToast(`${keyboardName}이(가) 성공적으로 공유되었습니다!`, true);
      } else {
        throw new Error(result.message || "공유 중 오류가 발생했습니다.");
      }
    } catch (err) {
      console.error("키보드 공유 오류:", err);
      showToast(err.message || "공유 중 오류가 발생했습니다.", false);
    } finally {
      setSharingKeyboardId(null);
    }
  };

  const getKeyboardName = (keyboard, index) => {
    return keyboard.keyboardtype && keyboard.keyboardtype !== "string"
      ? keyboard.keyboardtype
      : `커스텀 키보드 ${index + 1}`;
  };

  if (!userEmail) {
    return (
      <Container>
        <Title>나의 커스텀 키보드</Title>
        <ErrorState>
          <h3>로그인이 필요합니다</h3>
          <p>키보드 목록을 보려면 로그인해 주세요.</p>
        </ErrorState>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container>
        <Title>나의 커스텀 키보드</Title>
        <LoadingState>
          <h3>키보드 목록을 불러오는 중입니다...</h3>
        </LoadingState>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Title>나의 커스텀 키보드</Title>
        <ErrorState>
          <h3>오류가 발생했습니다</h3>
          <p>{error}</p>
        </ErrorState>
      </Container>
    );
  }

  const hasKeyboards = keyboards.length > 0;

  return (
    <Container>
      <Title>나의 커스텀 키보드</Title>
      <Description>내가 만든 커스텀 키보드 목록입니다.</Description>

      {hasKeyboards ? (
        <VerticalScroll>
          <KeyboardGrid>
            {keyboards.map((keyboard, index) => (
              <KeyboardCard key={keyboard.id}>
                <LikesBadge>
                  <LikeIcon /> {keyboard.likes || 0}
                </LikesBadge>

                <ShareBadge
                  onClick={(e) => handleShare(keyboard, e)}
                  className={sharingKeyboardId === keyboard.id ? "sharing" : ""}
                >
                  <FiShare2 size={14} />
                  {sharingKeyboardId === keyboard.id ? "공유 중..." : "공유"}
                </ShareBadge>

                <KeyboardImage image={keyboard.imageUrl}>
                  {!keyboard.imageUrl && (
                    <KeyboardImagePlaceholder>
                      키보드 이미지
                    </KeyboardImagePlaceholder>
                  )}
                </KeyboardImage>
                <KeyboardInfo>
                  <KeyboardName>
                    {getKeyboardName(keyboard, index)}
                  </KeyboardName>
                  <KeyboardDate>
                    생성일: {formatDate(keyboard.createdAt)}
                  </KeyboardDate>
                  <KeyboardDetails>
                    {keyboard.barebonecolor !== "string" &&
                      `바디: ${keyboard.barebonecolor} • `}
                    {keyboard.keycapcolor !== "string" &&
                      `키캡: ${keyboard.keycapcolor} • `}
                    {keyboard.switchcolor !== "string" &&
                      `스위치: ${keyboard.switchcolor}`}
                  </KeyboardDetails>
                </KeyboardInfo>
              </KeyboardCard>
            ))}
          </KeyboardGrid>
        </VerticalScroll>
      ) : (
        <EmptyState>
          <h3>아직 만든 커스텀 키보드가 없습니다.</h3>
          <p>새로운 키보드 설정을 만들어 보세요!</p>
        </EmptyState>
      )}

      <Toast show={toast.show} success={toast.success}>
        {toast.message}
      </Toast>
    </Container>
  );
};

export default MyCustomKeyboard;
