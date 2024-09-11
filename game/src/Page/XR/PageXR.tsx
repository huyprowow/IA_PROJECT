import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { ARButton, Controllers, Hands, VRButton, XR } from "@react-three/xr";
import * as THREE from "three";
import React, { Suspense, useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import "@tensorflow/tfjs-backend-webgl";
import { useVideoDevicesStore } from "../../store/video";
import { useConstraintsStore } from "../../store/constraint";
import { notificationCustom } from "../../Component/Notification/notificationCustom";
import { useAudioDevicesStore } from "../../store/audio";
import { useShareOptionsStore } from "../../store/shareOption";
import { useInfoShareStore } from "../../store/infoShare";
import { Select } from "antd";
import { OrbitControls, useFBX } from "@react-three/drei";
import { LinkModel } from "../../assets/assetsPath";
import { MMDLoader } from "three/examples/jsm/loaders/MMDLoader";
import Light from "../../Object/Light/Light";
import Load from "../../Component/Load/Load";

const { Option } = Select;

const fingerJoints: {
  [key: string]: number[];
} = {
  thumb: [0, 1, 2, 3, 4],
  indexFinger: [0, 5, 6, 7, 8],
  middleFinger: [0, 9, 10, 11, 12],
  ringFinger: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20],
};

const PageXR = () => {
  const position = new THREE.Vector3(0, 0, -10);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerRef = useRef<THREE.Group>(null!);

  const [start, setStart] = useState(false);
  const audioDevices = useAudioDevicesStore((state) => state.audioDevices);
  const setAudioDevices = useAudioDevicesStore(
    (state) => state.setAudioDevices
  );
  const videoDevices = useVideoDevicesStore((state) => state.videoDevices);
  const setVideoDevices = useVideoDevicesStore(
    (state) => state.setVideoDevices
  );
  const constraints = useConstraintsStore((state) => state.constraints);
  const setConstraints = useConstraintsStore((state) => state.setConstraints);
  const shareOptions = useShareOptionsStore((state) => state.shareOptions);
  const setShareOptions = useShareOptionsStore(
    (state) => state.setShareOptions
  );
  const infoShare = useInfoShareStore((state) => state.infoShare);
  const setInfoShare = useInfoShareStore((state) => state.setInfoShare);
  let videoRef = useRef<HTMLVideoElement>(null);
  let vdShareRef = useRef<any>(null);
  const playerModel = useLoader(MMDLoader, LinkModel.PLAYER.model.IA);
  const [playerPosition, setPlayerPosition] = useState(
    new THREE.Vector3(0, 0, 0)
  );
  const [handPosition, setHandPosition] = useState<any>([]);
  useEffect(() => {
    loadHandDetectModel();
    getUserPermision();
  }, []);

  //camera
  const getUserPermision = async () => {
    try {
      await navigator.mediaDevices.getUserMedia(constraints);
      getDeviceSelection();
      onPlayStream();
    } catch (error: any) {
      console.log(error);
      notificationCustom({
        type: "error",
        message: "Error",
        description: "You must permision camera and micro to use feature",
      });
      return null;
    }
  };
  const getDeviceSelection = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(
      (device) => device.kind === "videoinput"
    );

    const audioDevices = devices.filter(
      (device) => device.kind === "audioinput"
    );
    await setAudioDevices(audioDevices);
    await setVideoDevices(videoDevices);
    console.log(devices);
  };
  const onPlayStream = async () => {
    if (
      "mediaDevices" in navigator &&
      navigator.mediaDevices.getUserMedia !== undefined
    ) {
      console.log("getUserMedia", videoDevices[0].deviceId);
      const updateConstraints = {
        video: {
          ...constraints.video,
          deviceId: {
            exact: videoDevices[0].deviceId,
          },
        },
        audio: {
          ...constraints.audio,
        },
      };
      console.log(constraints);
      await setConstraints(updateConstraints);
      startStream(updateConstraints);
    } else {
      alert("cannot find media devices");
    }
  };
  const startStream = async (constraints: any) => {
    console.log("startStream", constraints);
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleStream(stream);
  };
  const handleStream = (stream: any) => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      console.log({ stream: stream.getVideoTracks()[0] });
      setStart(true);
    }
  };
  const handleChangeCamera = async (deviceId: any) => {
    console.log(videoDevices.find((device) => device.deviceId === deviceId));
    // console.log(videoDevices[0]===videoDevices.find((device) => device.deviceId === deviceId));
    const updateConstraints = {
      video: {
        ...constraints.video,
        deviceId: {
          exact: videoDevices.find((device) => device.deviceId === deviceId)
            ?.deviceId,
        },
      },
      audio: {
        ...constraints.audio,
      },
    };

    await setConstraints(updateConstraints);
    startStream(updateConstraints);
    console.log("change camera", updateConstraints);

    console.log(videoRef.current);
  };

  //model
  const loadHandDetectModel = async () => {
    console.log("loadHandDetectModel");
    const net = await handpose.load();
    if (net) {
      setInterval(() => {
        startDetect(net);
      }, 100);
    }
  };
  const startDetect = async (model: any) => {
    console.log("startDetect");
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const videoWidth = videoRef.current.videoWidth;
      const videoHeight = videoRef.current.videoHeight;
      videoRef.current.width = videoWidth;
      videoRef.current.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;
      console.log({ model });
      if (model) {
        const hand = await model.estimateHands(video);
        await setHandPosition(hand);
        console.log({ hand });
        drawHand(hand, canvasRef.current, canvasRef.current.getContext("2d"));
      }
    }
    // requestAnimationFrame(() => startDetect());
  };
  const drawHand = (hand: any, canvas: any, ctx: any) => {
    console.log("drawHand");
    console.log({ canvas, ctx });

    ctx.clearRect(0, 0, canvas.width as number, canvas.height as number);

    if (hand.length > 0) {
      hand.forEach((hand: any) => {
        //draw hand skeleton
        const landmarks = hand.landmarks;
        //loop through fingers and draw
        for (let i = 0; i < Object.keys(fingerJoints).length; i++) {
          let finger: string = Object.keys(fingerJoints)[i];
          for (let j = 0; j < fingerJoints[finger].length - 1; j++) {
            const firstJointIndex = fingerJoints[finger][j];
            const secondJointIndex = fingerJoints[finger][j + 1];

            ctx.beginPath();
            ctx.moveTo(
              landmarks[firstJointIndex][0],
              landmarks[firstJointIndex][1]
            );
            ctx.lineTo(
              landmarks[secondJointIndex][0],
              landmarks[secondJointIndex][1]
            );
            ctx.strokeStyle = "plum" as string;
            ctx.lineWidth = 4;
            ctx.stroke();
          }
        }

        //draw hand bounding
        for (let i = 0; i < landmarks.length - 1; i++) {
          const x1 = landmarks[i][0];
          const y1 = landmarks[i][1];
          const x2 = landmarks[i + 1][0];
          const y2 = landmarks[i + 1][1];
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = "blue" as string;
          ctx.lineWidth = 4;
          ctx.stroke();
        }

        //draw hand points
        for (let i = 0; i < landmarks.length; i++) {
          const x = landmarks[i][0];
          const y = landmarks[i][1];
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, 3 * Math.PI);
          ctx.fillStyle = "red" as string;
          ctx.fill();
        }

        //draw hand bounding box
        const boundingBox = hand.boundingBox;
        ctx.beginPath();
        ctx.rect(
          boundingBox.topLeft[0],
          boundingBox.topLeft[1],
          boundingBox.bottomRight[0] - boundingBox.topLeft[0],
          boundingBox.bottomRight[1] - boundingBox.topLeft[1]
        );
        ctx.strokeStyle = "gold" as string;
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.closePath();
        // anh xa tu 3d=>2d roi moi set vi tri  cho model
        // const x = boundingBox.bottomRight[0];
        // const y = boundingBox.bottomRight[1];
        // const z = landmarks[0][2];
        // const x2d = (x / canvas.width) * 2 - 1;
        // const y2d = -(y / canvas.height) * 2 + 1;
        // const z2d = z * 0.1;
        // console.log({ x, y, z, x2d, y2d, z2d });
        // setPlayerPosition(new THREE.Vector3(x2d, y2d, z2d));

        const x = landmarks[0][0];
        const y = landmarks[0][1];
        const z = landmarks[0][2];
        const x2d = (x / canvas.width) * 2 - 1;
        const y2d = -(y / canvas.height) * 2 + 1;
        const z2d = z * 0.1;
        console.log({ x, y, z, x2d, y2d, z2d });
        setPlayerPosition(new THREE.Vector3(x2d, y2d, z2d));
      });
    }
  };
  loadHandDetectModel();

  return (
    <>
      <video
        autoPlay
        ref={videoRef}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      ></video>
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      ></canvas>
      <Select
        placeholder="Select Camera"
        style={{
          width: 200,
          position: "absolute",
          top: 0,
          right: 0,
          zIndex: 100,
        }}
        onChange={handleChangeCamera}
      >
        {videoDevices.map((device) => {
          return (
            <Option key={device.deviceId} value={device.deviceId}>
              {device.label}
            </Option>
          );
        })}
      </Select>
      <ARButton />
      <Canvas>
        <XR referenceSpace="local-floor">
          <Controllers />
          {/* <Hands /> */}
          <mesh position={position}>
            <boxGeometry />
            <meshBasicMaterial color="blue" />
          </mesh>

          <OrbitControls/>

          <Suspense fallback={<Load />}>
          {handPosition && handPosition.length > 0 ? (
            <group>
              <Light />
              <primitive
                ref={playerRef}
                position={playerPosition}
                object={playerModel}
                scale={0.1}
                castShadow
                receiveShadow
              />
            </group>
          ) : null}
          </Suspense>
        </XR>
      </Canvas>
    </>
  );
};

export default PageXR;
