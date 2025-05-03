import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useAuthStore } from "../../api/useAuthStore";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 30px 20px;
`;

const Title = styled.h2`
  margin-bottom: 10px;
  font-size: 24px;
  text-align: center;
`;

const Description = styled.p`
  color: #666;
  font-size: 14px;
  margin-bottom: 20px;
  text-align: center;
  max-width: 700px;
`;

const HorizontalScrollContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  padding: 10px 0;
  -webkit-overflow-scrolling: touch;

  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const KeyboardRow = styled.div`
  display: flex;
  gap: 20px;
  padding: 10px 5px;
  min-width: max-content;
`;

const KeyboardCard = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  position: relative;
  background-color: white;
  min-width: 250px;
  width: 250px;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
`;

const KeyboardImage = styled.div`
  width: 100%;
  height: 150px;
  background-color: #f5f5f5;
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
  padding: 15px;
  background-color: white;
`;

const KeyboardTitle = styled.h3`
  margin: 0 0 5px 0;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const KeyboardMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  font-size: 12px;
  color: #777;
`;

const KeyboardOwner = styled.span``;

const KeyboardDate = styled.span``;

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
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }

  &.liked {
    background-color: rgba(255, 0, 0, 0.7);
  }
`;

const LikeIcon = ({ isLiked }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill={isLiked ? "red" : "none"}
    stroke={isLiked ? "white" : "white"}
    strokeWidth="1"
    style={{ marginRight: "4px" }}
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
  width: 100%;
`;

const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #fff0f0;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  text-align: center;
`;

const ShowMoreButton = styled.button`
  display: none; /* 수평 스크롤에서는 '더보기' 버튼이 필요 없음 */
`;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
};

export const ItemFrame3 = () => {
  const [keyboards, setKeyboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedItems, setLikedItems] = useState({});
  const [likeLoading, setLikeLoading] = useState({});

  const { user } = useAuthStore();

  useEffect(() => {
    fetchSharedKeyboards();
  }, []);

  const fetchSharedKeyboards = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://port-0-edcustom-lxx6l4ha4fc09fa0.sel5.cloudtype.app/shareditems/find"
      );

      if (
        response.data &&
        response.data.status === "OK" &&
        response.data.data
      ) {
        setKeyboards(response.data.data);
      } else {
        throw new Error(
          response.data.message || "데이터를 불러오는데 실패했습니다."
        );
      }
    } catch (err) {
      setError(err.message);
      console.error("공유된 키보드를 불러오는데 실패했습니다:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (keyboardId) => {
    if (!user || !user.id) {
      alert("좋아요를 누르려면 로그인이 필요합니다.");
      return;
    }

    if (likeLoading[keyboardId]) return;

    try {
      setLikeLoading((prev) => ({ ...prev, [keyboardId]: true }));

      const likeData = {
        memberId: user.id,
        sharedItemId: keyboardId,
      };

      const response = await axios.post(
        "https://port-0-edcustom-lxx6l4ha4fc09fa0.sel5.cloudtype.app/like",
        likeData,
        {
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
          },
        }
      );

      if (response.data && response.data.status === "OK") {
        setLikedItems((prev) => ({
          ...prev,
          [keyboardId]: !prev[keyboardId],
        }));

        setKeyboards((prev) =>
          prev.map((keyboard) =>
            keyboard.id === keyboardId
              ? {
                  ...keyboard,
                  likes: likedItems[keyboardId]
                    ? Math.max(0, keyboard.likes - 1)
                    : keyboard.likes + 1,
                }
              : keyboard
          )
        );

        console.log(
          `키보드 ${keyboardId}에 좋아요 ${
            likedItems[keyboardId] ? "취소" : "추가"
          } 성공!`
        );
      } else {
        throw new Error(
          response.data?.message || "좋아요 처리 중 오류가 발생했습니다."
        );
      }
    } catch (err) {
      console.error("좋아요 처리 중 오류:", err);
      alert("좋아요 처리 중 오류가 발생했습니다.");
    } finally {
      setLikeLoading((prev) => ({ ...prev, [keyboardId]: false }));
    }
  };

  if (loading) {
    return (
      <Container>
        <Title>사용자 공유 키보드</Title>
        <Description>
          다른 사용자들이 공유한 키보드 디자인을 확인해보세요.
        </Description>
        <LoadingState>
          <h3>키보드 목록을 불러오는 중입니다...</h3>
        </LoadingState>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Title>사용자 공유 키보드</Title>
        <Description>
          다른 사용자들이 공유한 키보드 디자인을 확인해보세요.
        </Description>
        <ErrorState>
          <h3>오류가 발생했습니다.</h3>
          <p>{error}</p>
        </ErrorState>
      </Container>
    );
  }

  return (
    <Container>
      <Title>사용자 공유 키보드</Title>
      <Description>
        다른 사용자들이 공유한 키보드 디자인을 확인하고 영감을 얻어보세요.
      </Description>

      <HorizontalScrollContainer>
        <KeyboardRow>
          {keyboards.map((keyboard) => (
            <KeyboardCard key={keyboard.id}>
              <LikesBadge
                className={likedItems[keyboard.id] ? "liked" : ""}
                onClick={() => handleLike(keyboard.id)}
              >
                <LikeIcon isLiked={likedItems[keyboard.id]} />
                {likeLoading[keyboard.id] ? "..." : keyboard.likes}
              </LikesBadge>
              <KeyboardImage image={keyboard.imageUrl}>
                {!keyboard.imageUrl && (
                  <KeyboardImagePlaceholder>
                    키보드 이미지
                  </KeyboardImagePlaceholder>
                )}
              </KeyboardImage>
              <KeyboardInfo>
                <KeyboardTitle>
                  {keyboard.title || `키보드 #${keyboard.id}`}
                </KeyboardTitle>
                <KeyboardMeta>
                  <KeyboardOwner>제작: {keyboard.sharedBy}</KeyboardOwner>
                  <KeyboardDate>{formatDate(keyboard.createdAt)}</KeyboardDate>
                </KeyboardMeta>
              </KeyboardInfo>
            </KeyboardCard>
          ))}
        </KeyboardRow>
      </HorizontalScrollContainer>
    </Container>
  );
};

export default ItemFrame3;
