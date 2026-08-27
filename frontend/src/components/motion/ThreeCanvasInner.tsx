import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { ModelType } from './Scene3D';

interface InnerProps {
  modelType: ModelType;
  autoRotate: boolean;
  intensity: number;
}

function ArchitecturalMesh({ modelType, autoRotate }: { modelType: ModelType; autoRotate: boolean }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (autoRotate && meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group ref={meshRef}>
      {modelType === 'house-silhouette' && (
        <group>
          {/* Main House Body */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[2.2, 1.4, 1.8]} />
            <meshStandardMaterial color="#c25e2e" wireframe={false} roughness={0.3} metalness={0.1} />
          </mesh>
          {/* Roof Structure */}
          <mesh position={[0, 1.1, 0]} rotation={[0, Math.PI / 4, 0]}>
            <coneGeometry args={[1.9, 0.9, 4]} />
            <meshStandardMaterial color="#632c1b" roughness={0.4} />
          </mesh>
          {/* Base Foundation */}
          <mesh position={[0, -0.8, 0]}>
            <boxGeometry args={[2.6, 0.2, 2.2]} />
            <meshStandardMaterial color="#e2ded7" roughness={0.8} />
          </mesh>
        </group>
      )}

      {modelType === 'blueprint' && (
        <group>
          {/* Wireframe Architectural Blueprint Grid */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[2.4, 2.0, 2.4]} />
            <meshStandardMaterial color="#60a5fa" wireframe={true} />
          </mesh>
          <mesh position={[0, 0.5, 0]}>
            <octahedronGeometry args={[1.2]} />
            <meshStandardMaterial color="#3b82f6" wireframe={true} />
          </mesh>
        </group>
      )}

      {modelType === 'abstract-structure' && (
        <group>
          {/* Abstract Structural Pillars */}
          {[-0.8, 0, 0.8].map((x, i) => (
            <mesh key={i} position={[x, i * 0.2, 0]}>
              <cylinderGeometry args={[0.25, 0.25, 1.8 + i * 0.4, 12]} />
              <meshStandardMaterial color={i === 1 ? '#c25e2e' : '#e2ded7'} roughness={0.2} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}

export default function ThreeCanvasInner({ modelType, autoRotate, intensity }: InnerProps) {
  return (
    <Canvas camera={{ position: [0, 2, 4], fov: 50 }} className="w-full h-full">
      <ambientLight intensity={0.5 * intensity} />
      <directionalLight position={[5, 8, 5]} intensity={1.2 * intensity} castShadow />
      <directionalLight position={[-5, -2, -5]} intensity={0.3 * intensity} />
      <ArchitecturalMesh modelType={modelType} autoRotate={autoRotate} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate={autoRotate} autoRotateSpeed={2} />
    </Canvas>
  );
}
