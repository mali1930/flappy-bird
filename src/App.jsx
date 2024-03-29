import React, { useEffect, useState } from "react";
import styled from "styled-components";
// import { bird } from "./assets/flappy-bird.png";
// import { background } from "./assets/fb-game-background.png";

const BIRD_SIZE = 30;
const GAME_WIDTH = 600;
const GAME_HEIGHT = 608;
const GRAVITY = 6;
const JUMP_HEIGHT = 100;
const OBSTACLE_WIDTH = 40;
const OBSTACLE_GAP = 200;

const App = () => {
  const [birdPosition, setBirdPosition] = useState(250);
  const [gameHasStarted, setGameHasStarted] = useState(false);
  const [obstacleHeight, setObstacleHeight] = useState(200);
  const [obstacleLeft, setObstacleLeft] = useState(GAME_WIDTH - OBSTACLE_WIDTH);
  const [score, setScore] = useState(0);

  const bottomObstacleHeight = GAME_HEIGHT - OBSTACLE_GAP - obstacleHeight;

  useEffect(() => {
    let timeId;
    if (gameHasStarted) {
      timeId = setInterval(() => {
        setBirdPosition((birdPosition) =>
          birdPosition < 580 ? birdPosition + GRAVITY : birdPosition
        );
      }, 24);
    }
    return () => {
      clearInterval(timeId);
    };
  }, [gameHasStarted]);

  useEffect(() => {
    let obstacleId;
    if (gameHasStarted && obstacleLeft >= -OBSTACLE_WIDTH) {
      obstacleId = setInterval(() => {
        setObstacleLeft((obstacleLeft) => obstacleLeft - 4);
      }, 24);
      return () => {
        clearInterval(obstacleId);
      };
    } else if(gameHasStarted) {
      setObstacleLeft(GAME_WIDTH - OBSTACLE_WIDTH);
      setObstacleHeight(
        Math.floor(Math.random() * (GAME_HEIGHT - OBSTACLE_GAP))
      );
      setScore((score) => score + 1);
    } else {
      setObstacleLeft(GAME_WIDTH - OBSTACLE_WIDTH);
      setObstacleHeight(
        Math.floor(Math.random() * (GAME_HEIGHT - OBSTACLE_GAP))
      );
    }
  }, [gameHasStarted, obstacleLeft]);

  useEffect(() => {
    const collidedWithTopObstacle = birdPosition < obstacleHeight;
    const collidedWithBottomObstacle =
      birdPosition >= GAME_HEIGHT - bottomObstacleHeight;
    if (
      obstacleLeft <= OBSTACLE_WIDTH &&
      (collidedWithTopObstacle || collidedWithBottomObstacle)
    ) {
      setGameHasStarted(false);
    }
  }, [birdPosition, obstacleHeight, bottomObstacleHeight, obstacleLeft]);

  const handleClick = () => {
    let newBirdPosition = birdPosition - JUMP_HEIGHT;
    if (!gameHasStarted) {
      setGameHasStarted(true);
      setScore(0);
      setBirdPosition(250);
    } else if (newBirdPosition < 0) {
      setBirdPosition(0);
    } else {
      setBirdPosition(newBirdPosition);
    }
  };
  return (
    <Div onClick={handleClick}>
      <GameBox height={GAME_HEIGHT} width={GAME_WIDTH}>
        <Obstacle
          top={0}
          width={OBSTACLE_WIDTH}
          height={obstacleHeight}
          left={obstacleLeft}
        />
        <Obstacle
          top={GAME_HEIGHT - (obstacleHeight + bottomObstacleHeight)}
          width={OBSTACLE_WIDTH}
          height={bottomObstacleHeight}
          left={obstacleLeft}
        />

        <Bird size={BIRD_SIZE} top={birdPosition} />
      </GameBox>
      <span>{score}</span>
    </Div>
  );
};

export default App;

const Bird = styled.div`
  position: absolute;
  background-image: url(${"/assets/flappy-bird.png"});
  background-size: contain;
  background-repeat: no-repeat;
  height: ${(props) => props.size}px;
  width: ${(props) => props.size}px;
  top: ${(props) => props.top}px;
`;

const Div = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  & span {
    color: white;
    font-size: 24px;
    position: absolute;
  }
`;

const GameBox = styled.div`
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;

  background-image: url(${"/assets/fb-game-background.png"});
  background-size: cover;
  background-repeat: no-repeat;
  cursor: pointer;
  overflow: hidden;
`;
const Obstacle = styled.div`
  position: relative;
  top: ${(props) => props.top}px;
  background-color: green;
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  left: ${(props) => props.left}px;
`;
