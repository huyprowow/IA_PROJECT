import React from "react";

const Light = () => {
  return (
    <group>
      {/* <ambientLight intensity={-0.45} /> */}
      <ambientLight intensity={0.4} />
      <directionalLight intensity={0.55} position={[5, 5, 2]} />
      <pointLight castShadow intensity={0.3} position={[3, 3, 3]} />
      {/* <spotLight castShadow intensity={0.5} position={[100, 100, 100]} /> */}
    </group>
  );
};

export default Light;
