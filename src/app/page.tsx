'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import * as THREE from 'three';
import 'tailwindcss/tailwind.css';
import Welcome from '../components/WelcomeScreen';

const Scene = dynamic(() => import('../components/Scene'), { ssr: false });

const fontOptions = ['Playfair', 'Monigue', 'Cocogoose', 'Bodoni', 'AfterShok', 'DinerFat', 'db', 'FancyPants', 'Batuphat', 'Barrio', 'Seaside'] as const;
const textureOptions = ['Mirror', 'Glass', 'Lines', 'Fragment', 'Random'] as const;

type FontOption = typeof fontOptions[number];
type TextureOption = typeof textureOptions[number];

export default function Home() {
  const [showApp, setShowApp] = useState(false);

  // Kinetic Text State
  const [text, setText] = useState('KINETIC TYPE');
  const [color, setColor] = useState(new THREE.Color('#FFFFFF'));
  const [stretchIntensity, setStretchIntensity] = useState(1);
  const [waveIntensity, setWaveIntensity] = useState(1);
  const [liquifyIntensity, setLiquifyIntensity] = useState(1);
  const [displacementIntensity, setDisplacementIntensity] = useState(1);
  const [isMicActive, setIsMicActive] = useState(false);
  const [font, setFont] = useState<FontOption>('Bodoni');
  const [texture, setTexture] = useState<TextureOption>('Mirror');

  if (!showApp) {
    return <Welcome onStart={() => setShowApp(true)} />;
  }

  return (
    <section className="flex relative flex-col items-center justify-center min-h-screen bg-black text-white font-primary p-8">
    <div className="flex items-center justify-center min-h-screen bg-black text-white font-primary p-8">
      <h1 className="text-8xl justify-center border-3 border-white font-bold mb-8">Kinetic Text App</h1>

      <div className="mb-4 w-full max-w-md">
        <label className="block mb-2 bg-transparent text-gray-400">Enter Text:</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border border-white p-2 w-full bg-transparent text-white rounded-md"
        />
      </div>

      <div className="flex gap-4 mb-4">
        <select
          value={font}
          onChange={(e) => setFont(e.target.value as FontOption)}
          className="border border-white p-2 bg-black text-white rounded-md"
        >
          {fontOptions.map((fontOption) => (
            <option key={fontOption} value={fontOption}>
              {fontOption}
            </option>
          ))}
        </select>

        <select
          value={texture}
          onChange={(e) => setTexture(e.target.value as TextureOption)}
          className="border border-white p-2 bg-black text-white rounded-md"
        >
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
          { label: 'Stretch Intensity', value: stretchIntensity, setter: setStretchIntensity },
          { label: 'Wave Intensity', value: waveIntensity, setter: setWaveIntensity },
          { label: 'Liquify Intensity', value: liquifyIntensity, setter: setLiquifyIntensity },
          { label: 'Displacement Intensity', value: displacementIntensity, setter: setDisplacementIntensity },
        ].map(({ label, value, setter }) => (
          <div key={label}>
            <label className="block mb-2 text-gray-400">{label}:</label>
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={value}
              onChange={(e) => setter(parseFloat(e.target.value))}
              className="w-full cursor-pointer"
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
          🎤
        </button>
      </div>

      {/* 3D Scene */}
      <div className="w-full h-[1500px] mt-8">
        <Scene
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
      </div>
    </div>
      </section>
   
  );
}
