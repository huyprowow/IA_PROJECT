import { Canvas } from '@react-three/fiber'
import React, { Suspense } from 'react'
import Load from '../../Component/Load/Load'
import Light from '../../Object/Light/Light'
import { Sky } from '@react-three/drei'
import Player from '../../Object/Player/Player'
import Ground from '../../Object/Ground/Ground'

const Page3D = () => {
  return (
    <div id="canvas-container">
      <Canvas
        camera={{
          position: [0, 1, 3],
        }}
      >
        <Suspense fallback={<Load />}>
          <group>
            <Light />
            <Sky sunPosition={[10, 1000, 1000]} />
            <Player />
            <Ground />
          </group>
        </Suspense>
      </Canvas>
    </div>
  )
}

export default Page3D