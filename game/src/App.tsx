import { Sky } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import "./App.css";
import Load from "./Component/Load/Load";
import BoxTest from "./Object/Box/BoxTest";
import Ground from "./Object/Ground/Ground";
import Light from "./Object/Light/Light";
import Player from "./Object/Player/Player";
import Split from "react-split";
import { useNavigate } from "react-router-dom";

const App = () => {
  const [mode, setMode] = useState("");
  const navigate = useNavigate();
  const changeMode = (mode: string) => {
    setMode(mode);
  };
  return (
    <Split
      sizes={mode === "XR" ? [25, 75] : mode === "3D" ? [75, 25] : [50, 50]}
      minSize={100}
      expandToMin={false}
      gutterSize={10}
      gutterAlign="center"
      snapOffset={30}
      dragInterval={1}
      direction="horizontal"
      cursor="col-resize"
      className="h-screen w-screen flex "
    >
      <div
        className="w-1/2 h-full flex flex-col justify-center items-center bg-black transition-all duration-500"
        onMouseEnter={() => changeMode("3D")}
      >
        <button
          className="h-10 px-5 text-white transition-colors duration-150 border border-white rounded-lg focus:shadow-outline hover:bg-white hover:text-black"
          onClick={() => {
            navigate("/3d");
          }}
        >
          3D
        </button>
      </div>
      <div
        className="w-1/2 h-full flex flex-col justify-center items-center transition-all duration-500"
        onMouseEnter={() => changeMode("XR")}
      >
        <button
          className="h-10 px-5 text-black transition-colors duration-150 border border-black rounded-lg focus:shadow-outline hover:bg-black hover:text-white"
          onClick={() => {
            navigate("/xr");
          }}
        >
          XR
        </button>
      </div>
    </Split>
  );
};

export default App;
