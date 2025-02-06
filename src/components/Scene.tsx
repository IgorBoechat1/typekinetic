import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import mirrorShader from '@/shaders/mirrorShader';
import glassShader from '@/shaders/glassShader';
import linesShader from '@/shaders/linesShader';
import randomShader from '@/shaders/randomShader';
import TextMesh from '@/components/TextMesh';

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

const textureFiles = {
  Mirror: mirrorShader,
  Glass: glassShader,
  Lines: linesShader,
  Random: randomShader,
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
  texture: keyof typeof textureFiles;
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
    <Canvas style={{ height: '100vh' }} shadows> {/* Enable shadows */}
      <ambientLight intensity={3.5} />
      
      <spotLight
        position={[20, 10, 10]}
        intensity={15.5}
        angle={1}
        penumbra={2.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      
      <TextMesh
        text={text}
        color={color}
        stretchIntensity={stretchIntensity}
        waveIntensity={waveIntensity}
        liquifyIntensity={liquifyIntensity}
        displacementIntensity={displacementIntensity}
        isMicActive={isMicActive}
        font={font}
        
      />
      
      <OrbitControls
        maxPolarAngle={Math.PI}
        minPolarAngle={0}
        maxAzimuthAngle={Math.PI / 2}
        minAzimuthAngle={-Math.PI / 2}
        enableZoom={true}
        maxDistance={20}
        minDistance={2}
      />
    </Canvas>
  );
}