import React from "react";

const BoxTest = () => {
  return (
    <mesh position={[1, 0, 1]}>
      {/* <boxGeometry args={[2, 2, 2]} /> */}
      {/* <sphereGeometry/>  */}
      <octahedronGeometry />
      {/* <meshStandardMaterial /> */}
      {/* <meshNormalMaterial/> */}
      <meshBasicMaterial color={"green"} />
    </mesh>
  );
};

export default BoxTest;
