import * as THREE from "three";
import { Grid } from "@react-three/drei";

const Ground = () => {
  const color = new THREE.Color(0.5, 0.5, 10);
  return (
    <Grid
      renderOrder={-1}
      infiniteGrid
      // cellSize={0.6}
      // cellThickness={0.6}
      // sectionSize={3.3}
      // sectionThickness={1.5}
      sectionColor={color}
      fadeDistance={30}
      receiveShadow
      castShadow
    />
  );
};

export default Ground;
