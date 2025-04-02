import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const Container = styled(motion.div)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 150px 0;
`;

const Frame = styled.div`
  width: 85%;
  height: 100%;
`;

const TitleFrame = styled(motion.div)`
  width: 30%;
  height: 200px;
  display: flex;
  flex-direction: column;
`;

const TitleMiniText = styled(motion.div)`
  font-size: 28px;
  font-weight: bold;
`;

const TitleText = styled(motion.div)`
  font-size: 82px;
  font-weight: bold;
  padding-top: 30px;
`;

const EssenceFrame = styled.div`
  width: 100%;
  height: 400px;
  margin-top: 150px;
  display: flex;
  justify-content: space-between;
`;

const EssenceList = styled(motion.li)`
  width: 30%;
  height: 100%;
  border-top: solid 1.5px;
  border-bottom: solid 1.5px;
  list-style-type: none;
  display: flex;
  align-items: center;
`;

const EssenceIn = styled.div`
  width: auto;
  height: 60%;
  display: flex;
  flex-direction: column;
`;

const EssenceTitle = styled.div`
  display: flex;
  position: relative;
`;

const EssenceText = styled.h2`
  padding-top: 50px;
`;

const EssenceContent = styled.p`
  padding-top: 18px;
  font-size: 20px;
  color: #222529;
`;

const EssenceItem = ({ title, minitext, content, content2, delay, isVisible }) => {
  return (
    <EssenceList
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ delay, duration: 0.8, ease: "easeOut" }}
    >
      <EssenceIn>
        <EssenceTitle>
          <h1
            style={{
              fontSize: "52px",
              position: "relative",
              display: "inline-block",
            }}
          >
            {title}
            <h6
              style={{
                position: "absolute",
                top: "0px",
                right: "-20px",
                fontSize: "24px",
                color: "#888888",
              }}
            >
              {minitext}
            </h6>
          </h1>
        </EssenceTitle>
        <EssenceText>{content}</EssenceText>
        <EssenceContent dangerouslySetInnerHTML={{ __html: content2 }} />
      </EssenceIn>
    </EssenceList>
  );
};

export const ItemFrame2 = ({ isVisible }) => {
  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Frame>
        <TitleFrame
          initial={{ opacity: 0, y: -20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <TitleMiniText>our spirit</TitleMiniText>
          <TitleText>our essence</TitleText>
        </TitleFrame>
        <EssenceFrame>
          <EssenceItem
            title="자유롭게"
            minitext="1"
            content="free"
            content2="키보드 디자인을 몰라도 <br /> 누구나 자유롭게"
            delay={0.2}
            isVisible={isVisible}
          />
          <EssenceItem
            title="창의적인"
            minitext="2"
            content="creative"
            content2="나만의 개성을 담아 <br /> 창의적으로 커스터마이징"
            delay={0.7}
            isVisible={isVisible}
          />
          <EssenceItem
            title="연결된"
            minitext="3"
            content="connected"
            content2="커뮤니티와 소통하며 <br /> 경험을 공유하는 공간"
            delay={1.2}
            isVisible={isVisible}
          />
        </EssenceFrame>
      </Frame>
    </Container>
  );
};