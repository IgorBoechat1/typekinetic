'use client';
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import vertexShader from '../shaders/vertexShader';
import fragmentShader from '../shaders/fragmentShader';
import mirrorShader from '../shaders/mirrorShader';
import glassShader from '../shaders/glassShader';
import linesShader from '../shaders/linesShader';
import randomShader from '../shaders/randomShader';


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
  Fragment: fragmentShader,
};

interface TextProps {
  text: string;
  color: THREE.Color;
  stretchIntensity: number;
  waveIntensity: number;
  liquifyIntensity: number;
  displacementIntensity: number;
  isMicActive: boolean;
  font: keyof typeof fontFiles;
 
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function TextMesh({ text, color, stretchIntensity, waveIntensity, liquifyIntensity, displacementIntensity, isMicActive, font }: TextProps) {
  const groupRef = useRef<THREE.Group>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const clock = new THREE.Clock();
  const { size, mouse, camera } = useThree();
  const raycaster = useRef(new THREE.Raycaster());

  useEffect(() => {
    const loader = new FontLoader();
    loader.load(fontFiles[font], (font) => {
      if (groupRef.current) {
        groupRef.current.clear(); // Clear previous characters

        text.split('').forEach((char, index) => {
          const geometry = new TextGeometry(char, {
            font: font,
            size: 3,
            height: 1,
            curveSegments: 128, // Increase curve segments for smoother curves
            bevelEnabled: true,
            bevelThickness: 0.2, // Increase bevel thickness for more roundness
            bevelSize: 0.2, // Increase bevel size for more roundness
            bevelOffset: 0,
            bevelSegments: 36, // Increase bevel segments for smoother bevels
          });

          const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
              u_time: { value: 0 },
              u_resolution: { value: new THREE.Vector2(size.width, size.height) },
              u_color: { value: color },
              u_lightPosition: { value: new THREE.Vector3(20, 10, 10) },
              u_viewPosition: { value: camera.position },
              u_soundData: { value: 0 }, // Add sound data uniform
            },
            side: THREE.DoubleSide,
          });

          const mesh = new THREE.Mesh(geometry, material);
          mesh.castShadow = true; // Enable casting shadows
          mesh.receiveShadow = true; // Enable receiving shadows
          mesh.position.x = index * 3; // Adjust spacing between characters

          if (groupRef.current) {
            groupRef.current.add(mesh);
          }
        });

        groupRef.current.position.set(-text.length * 2, 2, -2); // Center the text group
      }
    });

    // Set up audio context and analyser
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // Get microphone input
    if (isMicActive) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        analyserRef.current = analyser;
        dataArrayRef.current = dataArray;
      }).catch((err) => {
        console.error('Error accessing microphone:', err);
      });
    }

    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [text, color, stretchIntensity, waveIntensity, liquifyIntensity, displacementIntensity, isMicActive, font, size]);

  useFrame(() => {
    if (groupRef.current) {
      if (isMicActive && analyserRef.current && dataArrayRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        const avgFrequency = dataArrayRef.current.reduce((a, b) => a + b, 0) / dataArrayRef.current.length;
        const t = avgFrequency / 256;
        const easedT = easeInOutCubic(t);
        const stretch = 1 + easedT * stretchIntensity;
        const wave = Math.sin(clock.getElapsedTime() * waveIntensity) * 0.05; // Smoother wave effect
        const liquify = Math.sin(clock.getElapsedTime() * liquifyIntensity) * 0.05; // Smoother liquify effect
        const displacement = Math.sin(clock.getElapsedTime() * displacementIntensity) * 0.025; // Further reduced intensity for smoother effect

        groupRef.current.children.forEach((child, index) => {
          const mesh = child as THREE.Mesh;
          mesh.scale.set(1, stretch, 1);
          mesh.position.y = wave;
          const material = mesh.material as THREE.ShaderMaterial;
          if (material.uniforms) {
            material.uniforms.u_time.value = clock.getElapsedTime();
            material.uniforms.u_soundData.value = t; // Update sound data uniform
          }

          // Apply sound-reactive displacement effect to individual characters
          const time = clock.getElapsedTime();
          const frequency = dataArrayRef.current![index % dataArrayRef.current!.length] / 256;
          const offset = displacement * frequency * Math.sin(time * 2 + index * 0.5); // Smoother displacement
          mesh.position.y += isNaN(offset) ? 0 : offset; // Ensure no NaN values
        });
      } else {
        // Make the text mesh reactive to the cursor
        raycaster.current.setFromCamera(mouse, camera);
        const intersects = raycaster.current.intersectObjects(groupRef.current.children);

        if (intersects.length > 0) {
          const stretch = 1 + Math.sin(clock.getElapsedTime() * stretchIntensity) * 0.05;
          const wave = Math.sin(clock.getElapsedTime() * waveIntensity) * 0.05;
          const liquify = Math.sin(clock.getElapsedTime() * liquifyIntensity) * 0.05;
          const displacement = Math.sin(clock.getElapsedTime() * displacementIntensity) * 0.025;

          groupRef.current.children.forEach((child) => {
            const mesh = child as THREE.Mesh;
            mesh.scale.set(1, stretch, 1);
            mesh.position.y = wave;
            const material = mesh.material as THREE.ShaderMaterial;
            if (material.uniforms) {
              material.uniforms.u_time.value = clock.getElapsedTime();
            }
          });
        } else {
          // Reset the effects when not hovering
          groupRef.current.children.forEach((child) => {
            const mesh = child as THREE.Mesh;
            mesh.scale.set(1, 1, 1);
            mesh.position.y = 0;
          });
        }
      }
    }
  });

  return <group ref={groupRef} />;
}

export default TextMesh;