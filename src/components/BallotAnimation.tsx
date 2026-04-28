'use client';
import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';

function BallotBox(props: any) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group ref={meshRef} {...props} dispose={null}
           onPointerOver={() => setHover(true)}
           onPointerOut={() => setHover(false)}>
      
      {/* Box Base */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color={hovered ? '#1e40af' : '#2563eb'} opacity={0.9} transparent />
      </mesh>
      
      {/* Box Lid */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[2.2, 0.2, 2.2]} />
        <meshStandardMaterial color="#1e3a8a" />
      </mesh>

      {/* Ballot Slot */}
      <mesh position={[0, 0.61, 0]}>
        <boxGeometry args={[1.5, 0.05, 0.1]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Ballot paper dropping in */}
      <Float speed={hovered ? 4 : 2} rotationIntensity={0.1} floatIntensity={0.5}>
        <mesh position={[0, hovered ? 0.3 : 1.5, 0]} rotation={[0.2, 0, 0]}>
          <planeGeometry args={[1, 1.4]} />
          <meshStandardMaterial color="#ffffff" side={THREE.DoubleSide} />
        </mesh>
        {/* Fake text lines on ballot */}
        <mesh position={[0, hovered ? 0.3 : 1.5, 0.01]} rotation={[0.2, 0, 0]}>
          <planeGeometry args={[0.8, 0.1]} />
          <meshBasicMaterial color="#cbd5e1" />
        </mesh>
        <mesh position={[0, hovered ? 0.1 : 1.3, 0.01]} rotation={[0.2, 0, 0]}>
          <planeGeometry args={[0.6, 0.1]} />
          <meshBasicMaterial color="#cbd5e1" />
        </mesh>
      </Float>
    </group>
  );
}

export default function BallotAnimation() {
  return (
    <div className="w-full h-64 bg-slate-50 rounded-xl overflow-hidden border border-gray-100 mb-8 relative">
       <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-blue-800 shadow-sm border border-blue-100">
         Interactive 3D Demo
       </div>
       <Canvas camera={{ position: [0, 2, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <PresentationControls
          global
          rotation={[0, -Math.PI / 4, 0]}
          polar={[-0.4, 0.2]}
          azimuth={[-1, 0.75]}
        >
          <Float rotationIntensity={0.2} floatIntensity={0.5} floatingRange={[-0.1, 0.1]}>
             <BallotBox position={[0, 0, 0]} />
          </Float>
        </PresentationControls>
        {/* Adds nice environmental reflections */}
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
