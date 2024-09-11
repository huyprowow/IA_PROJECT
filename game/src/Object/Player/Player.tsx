import { MMDLoader } from "three/examples/jsm/loaders/MMDLoader";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { LinkModel } from "../../assets/assetsPath";
import { OrbitControls, useAnimations, useFBX } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useRef, useEffect } from "react";
import { Group } from "three";
import { useLoadAllAnimationFbx } from "../../Hook/useLoadAllAnimationFbx";
import { useKeyboardConTrol } from "../../Hook/useKeyboardConTrol";
import * as THREE from "three";
import * as PLAYER_CONST from "../../constant/Player";

let walkDirection = new THREE.Vector3();
let rotateAngle = new THREE.Vector3(0, 1, 0);
let rotateQuaternion = new THREE.Quaternion();
let cameraTarget = new THREE.Vector3();
const Player = () => {
  // const playerModel = useLoader(MMDLoader, LinkModel.IA);
  const playerModel = useFBX(LinkModel.PLAYER.model.girl);
  const playerRef = useRef<Group>(null!);
  const actionMap = useLoadAllAnimationFbx(playerModel);
  const currentAction = useRef<string>("");
  const { forward, backward, left, right, jump, attack } = useKeyboardConTrol();
  // const { actions, mixer, clips, names, ref } = useAnimations(playerModel.animations);
  console.log(playerModel);
  // console.log(playerAnimation);
  const controlRef = useRef<OrbitControlsImpl>(null!);
  const camera = useThree((state) => state.camera);
  useEffect(() => {
    let nextAction = "";
    if (forward || backward || left || right) {
      nextAction = "walk";
    } else if (attack) {
      nextAction = "mmaKick";
    } else {
      nextAction = "idle";
    }
    if (nextAction !== currentAction.current) {
      actionMap.get(currentAction.current)?.fadeOut(PLAYER_CONST.FADE_DURATION);
      actionMap
        .get(nextAction)
        ?.reset()
        .fadeIn(PLAYER_CONST.FADE_DURATION)
        .play();
      currentAction.current = nextAction;
    }
  }, [forward, backward, left, right, jump, attack]);
  //tinh toan huong bu cua nhan vat
  /*               w
        pi/4   0(offset) -pi/4
  (a)  pi/2                     -pi/2 (d)
        3pi/4      pi    -3pi/4
                  s                  */
  const directionOffset = ({
    forward,
    left,
    right,
    backward,
  }: {
    forward: Boolean;
    left: Boolean;
    right: Boolean;
    backward: Boolean;
  }) => {
    let directionOffset = 0;
    if (forward) {
      if (left) {
        directionOffset = Math.PI / 4; //w+a
      } else if (right) {
        directionOffset = -Math.PI / 4; //w+d
      }
    } else if (backward) {
      if (left) {
        directionOffset = (3 * Math.PI) / 4; //s+a
      } else if (right) {
        directionOffset = (-3 * Math.PI) / 4; //s+d
      } else {
        directionOffset = Math.PI; //s
      }
    } else if (left) {
      directionOffset = Math.PI / 2; //a
    } else if (right) {
      directionOffset = -Math.PI / 2; //d
    }
    return directionOffset;
  };

  const targetCamera = (walkDirection: THREE.Vector3) => {
    cameraTarget.copy(walkDirection).add(playerRef.current.position);
    //move camera
    camera.lookAt(cameraTarget);
    //update target
    if (controlRef.current) {
      controlRef.current.target.copy(cameraTarget);
    }
  };
  // const targetCamera2 = (moveX: number, moveZ: number) => {
  //   camera.position.x += moveX;
  //   camera.position.z += moveZ;

  //   cameraTarget.x = playerRef.current.position.x;
  //   cameraTarget.y = playerRef.current.position.y + 1;
  //   cameraTarget.z = playerRef.current.position.z;
  //   if (controlRef.current) {
  //     controlRef.current.target = cameraTarget;
  //   }
  // };

  useFrame((state, delta) => {
    if (currentAction.current === "walk") {
      //goc xoay cua nhan vat
      /*
      \agleY/
       \   /
        char
        /
    camera
       */
      let angleYCameraDirection = Math.atan2(
        camera.position.x - playerRef.current.position.x,
        camera.position.z - playerRef.current.position.z
      );
      const newDirectionOffset = directionOffset({
        forward,
        left,
        right,
        backward,
      });
      //dat goc xoay
      rotateQuaternion.setFromAxisAngle(
        rotateAngle,
        angleYCameraDirection + newDirectionOffset
      );
      console.log("🚀 ~ file: Player.tsx:132 ~ useFrame ~ rotateQuaternion:", rotateQuaternion)
      //xoay model
      playerModel.quaternion.rotateTowards(rotateQuaternion, 0.2);
      // xoay camera
      camera.getWorldDirection(walkDirection);
      walkDirection.y = 0;
      walkDirection.normalize();
      walkDirection.applyAxisAngle(rotateAngle, newDirectionOffset); //quay theo truc y 1 goc offset
      //di chuyen model,
      // console.log("before", walkDirection);
      walkDirection.multiplyScalar(PLAYER_CONST.WALK_VELOCITY * delta); //nhan gia toc
      // console.log(
      //   "current",
      //   playerRef.current.position,
      //   "gaint",
      //   walkDirection
      // );
      playerRef.current.position.add(walkDirection); //di chuyen
      targetCamera(walkDirection);

      //camera bỏ trục y vì néu k nó sẽ di chuyển lên xuống :v
      // const moveX = walkDirection.x * PLAYER_CONST.WALK_VELOCITY * delta; //nhan gia toc
      // const moveZ = walkDirection.z * PLAYER_CONST.WALK_VELOCITY * delta; //nhan gia toc
      // playerRef.current.position.x += moveX; //di chuyen
      // playerRef.current.position.z += moveZ; //di chuyen
      // targetCamera2(moveX, moveZ);
    }
  });

  return (
    <>
      <OrbitControls ref={controlRef} />
      <primitive object={new THREE.AxesHelper(10)} />
      <primitive
        ref={playerRef}
        position={[0, 0, 0]}
        object={playerModel}
        scale={0.01}
        castShadow
        receiveShadow
      />
    </>
  );
};

export default Player;
