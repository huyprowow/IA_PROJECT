import React, { useEffect, useState } from "react";

export const useKeyboardConTrol = () => {
  const [move, setMove] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    attack: false,
  });
  const keys = {
    KeyA: "left",
    KeyD: "right",
    KeyW: "forward",
    KeyS: "backward",
    Space: "jump",
    KeyK: "attack",
  };
  const changeKeyToMove = (key: string) => keys[key as keyof IKeys];
  const handleKeyDown = (e: KeyboardEvent) => {
    console.log("keyDown", e.code);
    if (!changeKeyToMove(e.code)) return;
    setMove((prevMove) => ({
      ...prevMove,
      [changeKeyToMove(e.code)]: true,
    }));
  };
  const handleKeyUp = (e: KeyboardEvent) => {
    console.log("keyUp", e.code);
    if (!changeKeyToMove(e.code)) return;
    setMove((prevMove) => ({
      ...prevMove,
      [changeKeyToMove(e.code)]: false,
    }));
  };
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);
  return move;
};
