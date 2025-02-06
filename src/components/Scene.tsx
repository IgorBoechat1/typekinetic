import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import mirrorShader from '../shaders/mirrorShader';
import glassShader from '../shaders/glassShader';
import linesShader from '../shaders/linesShader';
import randomShader from '../shaders/randomShader';
import poserShader from '../shaders/poserShader';
import pavoiShader from '../shaders/pavoiShader';
import locoShader from '../shaders/locoShader';
import fragmentShader from '../shaders/fragmentShader';
import { standardFragmentShader } from '../shaders/standardShader';
import TextMesh from './TextMesh';

const textureFiles = {
  Mirror: mirrorShader,
  Glass: glassShader,
  Lines: linesShader,
  Random: randomShader,
  Poser: poserShader,
  Pavoi: pavoiShader,
  Loco: locoShader,
  Fragment: fragmentShader,
  Standard: standardFragmentShader,
};

const fontFiles = {
  Playfair: '/assets/Playfair.json',
  Monigue: '/assets/Monigue.json',
  Cocogoose: '/assets/Cocogoose.json',
  Bodoni: '/assets/Bodoni.json',
  AfterShok: '/assets/AfterShok.json',
  Batuphat: '/assets/Batuphat.json',
  Barrio: '/assets/Barrio.json',
  DinerFat: '/assets/DinerFat.json',
  LeagueGothic: '/assets/LeagueGothic.json',
  FancyPants: '/assets/FancyPants.json',
  db: '/assets/db.json',
  Seaside: '/assets/Seaside.json',
};

interface SceneProps {
  text: string;
  color: THREE.Color;
  displacementIntensity: number;
  scalingIntensity: number;
  rotationIntensity: number;
  waveIntensity: number;
  fragmentationIntensity: number;
  isMicActive: boolean;
  font: keyof typeof fontFiles;
  texture: keyof typeof textureFiles;
}

export default function Scene({
  text,
  color,
  displacementIntensity,
  scalingIntensity,
  rotationIntensity,
  waveIntensity,
  fragmentationIntensity,
  isMicActive,
  font,
  texture,
}: SceneProps) {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 50 }} style={{ height: '80vh' }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <TextMesh
        text={text}
        color={color}
        displacementIntensity={displacementIntensity}
        scalingIntensity={scalingIntensity}
        rotationIntensity={rotationIntensity}
        waveIntensity={waveIntensity}
        fragmentationIntensity={fragmentationIntensity}
        isMicActive={isMicActive}
        font={font}
        texture={texture}
      />
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        maxPolarAngle={Math.PI / 3}
        minPolarAngle={Math.PI / 2}
      />
    </Canvas>
  );
}