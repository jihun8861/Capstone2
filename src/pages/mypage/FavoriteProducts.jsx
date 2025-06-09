import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuthStore } from "../../api/useAuthStore";
import axios from "axios";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 20px;
  height: 80vh;
  overflow: hidden;
  margin-top: -70px;
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
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  width: 100%;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
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
const KeyboardCreater = styled.div`
  font-size: 12px;
  color: #888;
  margin-top: 5px;
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

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
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
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 0, 0, 0.7);
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
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
};

const FavoriteProducts = () => {
  const [keyboards, setKeyboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuthStore();
  const userId = user?.id;

  const fetchLikedKeyboards = async () => {
    try {
      setLoading(true);

      if (!userId) {
        setError("로그인이 필요합니다");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "https://port-0-edcustom-lxx6l4ha4fc09fa0.sel5.cloudtype.app/checkliked",
        { memberid: userId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
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
      setError("좋아요를 누른 키보드가 없습니다. 관심 상품을 등록해 주세요!");
      console.error("좋아요한 키보드를 불러오는데 실패했습니다:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikedKeyboards();
  }, [userId]);

  const handleUnlike = async (keyboardId) => {
    try {
      if (!userId) {
        setError("로그인이 필요합니다");
        return;
      }

      const response = await axios.post(
        "https://port-0-edcustom-lxx6l4ha4fc09fa0.sel5.cloudtype.app/like",
        {
          memberid: userId,
          shareditemid: keyboardId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.status === "OK") {
        setKeyboards(
          keyboards.filter((keyboard) => keyboard.id !== keyboardId)
        );
      } else {
        throw new Error(response.data.message || "좋아요 취소에 실패했습니다.");
      }
    } catch (err) {
      console.error("좋아요 취소에 실패했습니다:", err);
      alert("좋아요 취소에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  if (!userId) {
    return (
      <Container>
        <Title>관심 상품</Title>
        <Description>좋아요를 누른 키보드 목록입니다.</Description>
        <ErrorState>
          <h3>로그인이 필요합니다</h3>
          <p>관심 상품 목록을 보려면 로그인해 주세요.</p>
        </ErrorState>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container>
        <Title>관심 상품</Title>
        <Description>좋아요를 누른 키보드 목록입니다.</Description>
        <LoadingState>
          <h3>데이터를 불러오는 중입니다...</h3>
        </LoadingState>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Title>관심 상품</Title>
        <Description>좋아요를 누른 키보드 목록입니다.</Description>
        <ErrorState>
          <h3>{error}</h3>
        </ErrorState>
      </Container>
    );
  }

  const hasKeyboards = keyboards.length > 0;

  return (
    <Container>
      <Title>관심 상품</Title>
      <Description>좋아요를 누른 키보드 목록입니다.</Description>

      {hasKeyboards ? (
        <VerticalScroll>
          <KeyboardGrid>
            {keyboards.map((keyboard) => (
              <KeyboardCard key={keyboard.id}>
                <LikesBadge
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnlike(keyboard.id);
                  }}
                >
                  <LikeIcon /> {keyboard.likes}
                </LikesBadge>
                <KeyboardImage image={keyboard.imageUrl}>
                  {!keyboard.imageUrl && (
                    <KeyboardImagePlaceholder>
                      키보드 이미지
                    </KeyboardImagePlaceholder>
                  )}
                </KeyboardImage>
                <KeyboardInfo>
                  <KeyboardName>{keyboard.title}</KeyboardName>
                  <KeyboardDate>
                    생성일: {formatDate(keyboard.createdAt)}
                  </KeyboardDate>
                  <KeyboardCreater>제작자: {keyboard.email}</KeyboardCreater>
                </KeyboardInfo>
              </KeyboardCard>
            ))}
          </KeyboardGrid>
        </VerticalScroll>
      ) : (
        <EmptyState>
          <h3>아직 좋아요를 누른 키보드가 없습니다.</h3>
          <p>관심있는 키보드에 좋아요를 누르세요!</p>
        </EmptyState>
      )}
    </Container>
  );
};

export default FavoriteProducts;
