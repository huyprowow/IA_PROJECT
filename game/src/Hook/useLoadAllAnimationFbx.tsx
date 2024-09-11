import { useAnimations } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { Group } from "three/src/Three";
import { LinkModel } from "../assets/assetsPath";
import * as THREE from "three";

export const useLoadAllAnimationFbx = (playerModel: Group) => {
  const actionMap = new Map();
  const loadAnimation = () => {
    const animationLinks: ILinkActionModel = LinkModel.PLAYER.animation;
    let an;
    for (const link in animationLinks) {
      if (Object.prototype.hasOwnProperty.call(animationLinks, link)) {
        const key: keyof typeof animationLinks =
          link as keyof typeof animationLinks;
        const fbxTemp = useLoader(FBXLoader, animationLinks[key]);
        const { mixer, clips, ref } = useAnimations(
          fbxTemp.animations,
          fbxTemp
        );
        
        let playerAnimation: any = useAnimations(
          playerModel.animations,
          playerModel
          );
          const action = playerAnimation.mixer.clipAction(clips[0], playerModel);
          // action.setLoop(THREE.LoopOnce);
          // action.clampWhenFinished = true;
          // action.enable = true;
          actionMap.set(key, action);
        }
      }
    };
  loadAnimation();
  return actionMap;
};
