import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useAuthStore } from "../../api/useAuthStore";
import { useNavigate } from 'react-router-dom';
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
  background-position: 60% center; /* center에서 left center로 변경 */
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
  font-weight: 600;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const KeyboardDate = styled.div`
  font-size: 12px;
  color: #888;
`;

const KeyboardDetails = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 5px;
  line-height: 1.4;
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

  &.shared {
    background-color: rgba(76, 175, 80, 0.8);
    cursor: default;
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

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const MyCustomKeyboard = () => {
  const [myKeyboards, setMyKeyboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    success: true,
  });
  const [sharingKeyboardId, setSharingKeyboardId] = useState(null);

  const { user } = useAuthStore();
  const userEmail = user?.email || "";

  const getKeyboardTitle = (keyboard) => {
    if (
      keyboard.title &&
      keyboard.title.trim() !== "" &&
      keyboard.title !== "string"
    ) {
      return keyboard.title;
    }
    if (keyboard.keyboardtype && keyboard.keyboardtype !== "string") {
      return keyboard.keyboardtype;
    }
    return "커스텀 키보드";
  };

  const isKeyboardMatching = (myKeyboard, sharedKeyboard) => {
    const titleMatch = getKeyboardTitle(myKeyboard) === sharedKeyboard.title;
    const bareboneMatch =
      (myKeyboard.barebonecolor || "#FFFFFF") === sharedKeyboard.barebonecolor;
    const keyboardTypeMatch =
      (myKeyboard.keyboardtype || "custom") === sharedKeyboard.keyboardtype;
    const switchMatch =
      (myKeyboard.switchcolor || "#FFFFFF") === sharedKeyboard.switchcolor;

    let keycapMatch = true;
    if (myKeyboard.keycapcolor && Array.isArray(myKeyboard.keycapcolor)) {
      const myKeycapColors = myKeyboard.keycapcolor;
      const sharedKeycapColors =
        sharedKeyboard.keycapcolor?.keyColors ||
        sharedKeyboard.keycapcolor ||
        {};

      const myCustomKeycaps = {};
      myKeycapColors.forEach((color, index) => {
        if (color && color !== "#FFFFFF" && color.toUpperCase() !== "#FFFFFF") {
          myCustomKeycaps[`keycap${index + 1}`] = color;
        }
      });

      const myCustomCount = Object.keys(myCustomKeycaps).length;
      const sharedCustomCount = Object.keys(sharedKeycapColors).length;

      if (myCustomCount !== sharedCustomCount) {
        keycapMatch = false;
      } else {
        for (const [key, color] of Object.entries(myCustomKeycaps)) {
          if (sharedKeycapColors[key] !== color) {
            keycapMatch = false;
            break;
          }
        }
      }
    }

    return (
      titleMatch &&
      bareboneMatch &&
      keyboardTypeMatch &&
      switchMatch &&
      keycapMatch
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!userEmail) {
        setLoading(false);
        setError("로그인이 필요합니다.");
        return;
      }

      try {
        setLoading(true);

        const myKeyboardsResponse = await axios.post(
          "https://port-0-edcustom-lxx6l4ha4fc09fa0.sel5.cloudtype.app/items/find",
          { email: userEmail },
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
            },
          }
        );

        const sharedKeyboardsResponse = await axios.get(
          "https://port-0-edcustom-lxx6l4ha4fc09fa0.sel5.cloudtype.app/shareditems/find",
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
            },
          }
        );

        if (
          myKeyboardsResponse.data &&
          myKeyboardsResponse.data.status === "OK" &&
          Array.isArray(myKeyboardsResponse.data.data)
        ) {
          const myKeyboardsData = myKeyboardsResponse.data.data;

          let sharedKeyboardsData = [];
          if (
            sharedKeyboardsResponse.data &&
            sharedKeyboardsResponse.data.status === "OK" &&
            Array.isArray(sharedKeyboardsResponse.data.data)
          ) {
            sharedKeyboardsData = sharedKeyboardsResponse.data.data;
          }

          const keyboardsWithShareStatus = myKeyboardsData.map((keyboard) => {
            const isAlreadyShared = sharedKeyboardsData.some(
              (sharedKeyboard) =>
                sharedKeyboard.sharedBy === userEmail &&
                isKeyboardMatching(keyboard, sharedKeyboard)
            );

            return {
              ...keyboard,
              isShared: isAlreadyShared,
            };
          });

          setMyKeyboards(keyboardsWithShareStatus);
        } else {
          throw new Error("내 키보드 목록 응답 형식이 올바르지 않습니다");
        }
      } catch (err) {
        console.error("데이터 불러오기 오류:", err);
        setError(
          err.response?.data?.message || "데이터를 불러오는데 실패했습니다"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

    if (keyboard.isShared) {
      showToast("이미 공유된 키보드입니다.", true);
      return;
    }

    setSharingKeyboardId(keyboard.id);
    showToast("키보드 공유 중...", true);

    try {
      const formData = new FormData();

      const keyboardTitle = getKeyboardTitle(keyboard);

      console.log("=== 키캡 색상 처리 시작 ===");
      console.log("원본 keyboard.keycapcolor:", keyboard.keycapcolor);
      console.log("keycapcolor 타입:", typeof keyboard.keycapcolor);
      console.log(
        "keycapcolor가 배열인가?",
        Array.isArray(keyboard.keycapcolor)
      );

      let keycapColorObj = {};

      if (keyboard.keycapcolor) {
        if (
          typeof keyboard.keycapcolor === "object" &&
          !Array.isArray(keyboard.keycapcolor)
        ) {
          console.log("객체 형태로 처리합니다");

          let keycapData = keyboard.keycapcolor;
          if (keyboard.keycapcolor.keyColors) {
            console.log("keyColors 중첩 구조 발견, keyColors 사용");
            keycapData = keyboard.keycapcolor.keyColors;
          }

          console.log("처리할 keycapData:", keycapData);

          Object.entries(keycapData).forEach(([key, color]) => {
            console.log(`원본 키: "${key}", 원본 색상: "${color}"`);

            if (color && typeof color === "string" && color.trim() !== "") {
              const trimmedColor = color.trim();
              console.log(`트림된 색상: "${trimmedColor}"`);

              if (trimmedColor !== "string") {
                keycapColorObj[key] = trimmedColor;
                console.log(`저장된 키캡: "${key}" = "${trimmedColor}"`);
              } else {
                console.log(`유효하지 않은 색상 제외: "${color}"`);
              }
            } else {
              console.log(`빈 색상 제외: ${color} (타입: ${typeof color})`);
            }
          });
        } else if (Array.isArray(keyboard.keycapcolor)) {
          console.log("배열 형태로 처리합니다");

          keyboard.keycapcolor.forEach((color, index) => {
            console.log(`인덱스 ${index}: "${color}"`);

            if (color && typeof color === "string" && color.trim() !== "") {
              const trimmedColor = color.trim();
              if (trimmedColor !== "string") {
                keycapColorObj[`keycap${index + 1}`] = trimmedColor;
                console.log(
                  `저장된 키캡: keycap${index + 1} = "${trimmedColor}"`
                );
              }
            }
          });
        } else if (typeof keyboard.keycapcolor === "string") {
          try {
            const parsedKeycapColor = JSON.parse(keyboard.keycapcolor);
            console.log("JSON 문자열을 파싱했습니다:", parsedKeycapColor);

            if (typeof parsedKeycapColor === "object") {
              Object.entries(parsedKeycapColor).forEach(([key, color]) => {
                if (color && typeof color === "string" && color.trim() !== "") {
                  const trimmedColor = color.trim();
                  if (trimmedColor !== "string") {
                    keycapColorObj[key] = trimmedColor;
                    console.log(
                      `JSON에서 저장된 키캡: "${key}" = "${trimmedColor}"`
                    );
                  }
                }
              });
            }
          } catch (error) {
            console.log("JSON 파싱 실패, 문자열 그대로 사용");
          }
        }
      }

      console.log("최종 keycapColorObj:", keycapColorObj);
      console.log("변환된 키캡 개수:", Object.keys(keycapColorObj).length);
      console.log("=== 키캡 색상 처리 완료 ===");

      const jsonData = {
        email: userEmail,
        title: keyboardTitle,
        barebonecolor: keyboard.barebonecolor || "#FFFFFF",
        keyboardtype: keyboard.keyboardtype || "custom",
        keycapcolor: keycapColorObj,
        switchcolor: keyboard.switchcolor || "#FFFFFF",
        imageUrl: keyboard.imageUrl || null,
      };

      console.log("전송할 JSON 데이터:", jsonData);
      console.log(
        "keycapcolor 상세:",
        JSON.stringify(jsonData.keycapcolor, null, 2)
      );

      formData.append(
        "DTO",
        new Blob([JSON.stringify(jsonData)], {
          type: "application/json",
        })
      );

      const result = await shareItem(formData);

      if (result.success) {
        setMyKeyboards((prev) =>
          prev.map((item) =>
            item.id === keyboard.id ? { ...item, isShared: true } : item
          )
        );

        showToast(`"${keyboardTitle}"이(가) 성공적으로 공유되었습니다!`, true);
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

  const formatKeyboardDetails = (keyboard) => {
    const details = [];

    if (
      keyboard.barebonecolor &&
      keyboard.barebonecolor !== "string" &&
      keyboard.barebonecolor !== "#FFFFFF"
    ) {
      details.push(`바디: ${keyboard.barebonecolor}`);
    }

    if (
      keyboard.keycapcolor &&
      Array.isArray(keyboard.keycapcolor) &&
      keyboard.keycapcolor.length > 0
    ) {
      const customKeycapCount = keyboard.keycapcolor.filter(
        (color) =>
          color && color !== "#FFFFFF" && color.toUpperCase() !== "#FFFFFF"
      ).length;

      if (customKeycapCount > 0) {
        details.push(`커스텀 키캡: ${customKeycapCount}개`);
      }
    }

    if (
      keyboard.switchcolor &&
      keyboard.switchcolor !== "string" &&
      keyboard.switchcolor !== "#FFFFFF"
    ) {
      details.push(`스위치: ${keyboard.switchcolor}`);
    }

    if (keyboard.keyboardtype && keyboard.keyboardtype !== "string") {
      details.push(`타입: ${keyboard.keyboardtype}`);
    }

    return details.length > 0 ? details.join(" • ") : "커스텀 설정";
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

  const hasKeyboards = myKeyboards.length > 0;

  return (
    <Container>
      <Title>나의 커스텀 키보드</Title>
      <Description>
        내가 만든 커스텀 키보드 목록입니다. 공유 버튼을 클릭하여 다른 사용자와
        키보드를 공유할 수 있습니다.
      </Description>

      {hasKeyboards ? (
        <VerticalScroll>
          <KeyboardGrid>
            {myKeyboards.map((keyboard, index) => (
              <KeyboardCard key={keyboard.id || index}>
                <ShareBadge
                  onClick={(e) => handleShare(keyboard, e)}
                  className={
                    sharingKeyboardId === keyboard.id
                      ? "sharing"
                      : keyboard.isShared
                      ? "shared"
                      : ""
                  }
                >
                  <FiShare2 size={14} />
                  {sharingKeyboardId === keyboard.id
                    ? "공유 중..."
                    : keyboard.isShared
                    ? "공유됨"
                    : "공유"}
                </ShareBadge>

                <KeyboardImage image={keyboard.imageUrl}>
                  {!keyboard.imageUrl && (
                    <KeyboardImagePlaceholder>
                      키보드 이미지
                    </KeyboardImagePlaceholder>
                  )}
                </KeyboardImage>
                <KeyboardInfo>
                  <KeyboardName title={getKeyboardTitle(keyboard)}>
                    {getKeyboardTitle(keyboard)}
                  </KeyboardName>
                  <KeyboardDate>
                    생성일: {formatDate(keyboard.createdAt)}
                  </KeyboardDate>
                  <KeyboardDetails>
                    {formatKeyboardDetails(keyboard.email)}
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
