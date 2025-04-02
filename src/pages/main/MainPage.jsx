import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { MainBanner } from "../../components/home/MainBanner";
import { ItemFrame1 } from "../../components/home/ItemFrame1";
import { ItemFrame2 } from "../../components/home/ItemFrame2";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: auto;
`;

const Frame1 = styled.div`
  display: flex;
  width: 100%;
  height: auto;
`;

const Frame2 = styled.div`
  display: flex;
  width: 100%;
  height: auto;
  background-color: #f5f6fb;
  transition: opacity 1s ease;
`;

const Frame3 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 500px;
  border: solid 1px;
`;

export const MainPage = () => {
  const frame2Ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    if (frame2Ref.current) {
      observer.observe(frame2Ref.current);
    }

    return () => {
      if (frame2Ref.current) {
        observer.unobserve(frame2Ref.current);
      }
    };
  }, []);

  return (
    <Container>
      <MainBanner />
      <Frame1>
        <ItemFrame1 />
      </Frame1>

      <Frame2 
        ref={frame2Ref} 
        style={{ opacity: isVisible ? 1 : 0 }}
      >
        <ItemFrame2 isVisible={isVisible} />
      </Frame2>

      <Frame3>공유 컴포넌트</Frame3>
    </Container>
  );
};