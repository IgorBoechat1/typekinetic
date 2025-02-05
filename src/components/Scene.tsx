import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import TextMesh from '@/components/TextMesh';
import mirrorShader from '../shaders/mirrorShader';
import glassShader from '../shaders/glassShader';
import linesShader from '../shaders/linesShader';
import randomShader from '../shaders/randomShader';
import fragmentShader from '@/shaders/fragmentShader';

const fontFiles = {
  Playfair: '/assets/Playfair.json',
  Monigue: '/assets/Monigue.json',
  Cocogoose: '/assets/Cocogoose.json',
  Bodoni: '/assets/Bodoni.json',
};

const textureShaders = {
  Mirror: mirrorShader,
  Glass: glassShader,
  Lines: linesShader,
  Random: randomShader,
  Fragment: fragmentShader,
};

interface SceneProps {
  text: string;
  color: THREE.Color;
  stretchIntensity: number;
  waveIntensity: number;
  liquifyIntensity: number;
  displacementIntensity: number;
  isMicActive: boolean;
  font: keyof typeof fontFiles;
  texture: keyof typeof textureShaders;
}

export default function Scene({
  text,
  color,
  stretchIntensity,
  waveIntensity,
  liquifyIntensity,
  displacementIntensity,
  isMicActive,
  font,
  texture,
}: SceneProps) {
  return (
    <Canvas style={{ height: '100vh' }}> {/* Increased canvas height */}
      <ambientLight intensity={1.5} />
      <pointLight position={[20, 10, 10]} intensity={2.5} />
      <TextMesh
        text={text}
        color={color}
        stretchIntensity={stretchIntensity}
        waveIntensity={waveIntensity}
        liquifyIntensity={liquifyIntensity}
        displacementIntensity={displacementIntensity}
        isMicActive={isMicActive}
        font={font}
        texture={texture}
      />
      <OrbitControls
        // Adjust the maximum and minimum polar angles to allow flipping
        maxPolarAngle={Math.PI} // Allow full rotation vertically
        minPolarAngle={0} // Allow full rotation vertically
        // Adjust the maximum and minimum azimuth angles to limit horizontal rotation
        maxAzimuthAngle={Math.PI / 2} // Limit horizontal rotation to 90 degrees
        minAzimuthAngle={-Math.PI / 2} // Limit horizontal rotation to -90 degrees
        enableZoom={true} // Enable zooming
        maxDistance={20} // Maximum zoom-out distance
        minDistance={2} // Minimum zoom-in distance
      />
    </Canvas>
  );
}