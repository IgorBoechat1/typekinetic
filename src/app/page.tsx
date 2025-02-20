'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import * as THREE from 'three';
import 'tailwindcss/tailwind.css';
import Welcome from '../components/WelcomeScreen';
import { Input } from '@heroui/react';
import { Slider } from '@mui/material';
import Box from '@mui/material/Box';

const Scene = dynamic(() => import('../components/Scene'), { ssr: false });

const fontOptions = ['Playfair', 'Monigue', 'Cocogoose', 'Bodoni', 'AfterShok', 'DinerFat', 'db', 'FancyPants', 'Batuphat', 'Barrio', 'Seaside'] as const;
const textureOptions = ['Mirror', 'Glass', 'Lines', 'Fragment', 'Random', 'Standard', 'Poser', 'Pavoi', 'Loco'] as const;

type FontOption = typeof fontOptions[number];
type TextureOption = typeof textureOptions[number];

const ariaLabel = { 'aria-label': 'description' };

export default function Home() {
  const [showApp, setShowApp] = useState(false);

  const [text, setText] = useState('TYPE');
  const [color, setColor] = useState(new THREE.Color('#FFFFFF'));
  const [displacementIntensity, setDisplacementIntensity] = useState(1);
  const [scalingIntensity, setScalingIntensity] = useState(1);
  const [rotationIntensity, setRotationIntensity] = useState(1);
  const [waveIntensity, setWaveIntensity] = useState(1);
  const [fragmentationIntensity, setFragmentationIntensity] = useState(1);
  const [isMicActive, setIsMicActive] = useState(false);
  const [font, setFont] = useState<FontOption>('Bodoni');
  const [texture, setTexture] = useState<TextureOption>('Mirror');

  if (!showApp) {
    return <Welcome onStart={() => setShowApp(true)} />;
  }

  return (
    <section className="flex relative flex-col items-center justify-center min-h-screen bg-black text-white font-primary p-8">
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white font-primary p-8">
        <h1 className="text-8xl font-bold mb-8 border-3 border-white">Kinetic Text App</h1>

        <Box
          component="form"
          sx={{ '& > :not(style)': { m: 1 } }}
          noValidate
          autoComplete="off"
          className="mb-4 w-full max-w-md"
          display="flex"
          justifyContent="center"
        >
          <Input
            isReadOnly={false}
            className="max-w-xs"
            value={text}
            onChange={(e) => setText(e.target.value)}
            label="Text"
            type="text"
            variant="bordered"
          />
        </Box>

        <div className="flex gap-4 mb-4">
          <select
            className="select select-bordered select-lg w-full max-w-xs"
            value={font}
            onChange={(e) => setFont(e.target.value as FontOption)}
          >
            <option disabled selected>Choose Font</option>
            {fontOptions.map((fontOption) => (
              <option key={fontOption} value={fontOption}>
                {fontOption}
              </option>
            ))}
          </select>

          <select
            className="select select-bordered select-lg w-full max-w-xs"
            value={texture}
            onChange={(e) => setTexture(e.target.value as TextureOption)}
          >
            <option disabled selected>Choose Texture</option>
            {textureOptions.map((textureOption) => (
              <option key={textureOption} value={textureOption}>
                {textureOption}
              </option>
            ))}
          </select>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {[
            { label: 'Displacement Intensity', value: displacementIntensity, setter: setDisplacementIntensity },
            { label: 'Scaling Intensity', value: scalingIntensity, setter: setScalingIntensity },
            { label: 'Rotation Intensity', value: rotationIntensity, setter: setRotationIntensity },
            { label: 'Wave Intensity', value: waveIntensity, setter: setWaveIntensity },
            { label: 'Fragmentation Intensity', value: fragmentationIntensity, setter: setFragmentationIntensity },
          ].map(({ label, value, setter }) => (
            <div key={label} className="w-64">
              <label className="block mb-2 text-gray-400">{label} Intensity:</label>
              <Slider
                value={value}
                min={0}
                max={10}
                step={0.1}
                onChange={(e: Event, newValue: number | number[]) => setter(newValue as number)}
                aria-label={label}
                valueLabelDisplay="auto"
                sx={{ color: 'white' }}
              />
            </div>
          ))}
        </div>

        {/* Microphone Button */}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 bg-black p-2 rounded-xl border border-white">
          <button
            onClick={() => setIsMicActive(!isMicActive)}
            className={`w-12 h-12 flex items-center justify-center rounded-lg border border-white ${
              isMicActive ? 'bg-white text-black' : 'bg-black text-white'
            } hover:bg-white hover:text-black transition-colors`}
          >
            MICROPHONE
          </button>
        </div>

        {/* 3D Scene */}
        <div className="w-full h-[1500px] mt-8">
          <Scene
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
        </div>
      </div>
    </section>
  );
}