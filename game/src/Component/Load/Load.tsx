import { Html, useProgress } from "@react-three/drei";
import "./Load.css";
const Load = () => {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>;
};
export default Load;
