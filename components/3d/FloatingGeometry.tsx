"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Mesh } from "three";

function FloatingGeometries() {
  const mesh1Ref = useRef<Mesh>(null);
  const mesh2Ref = useRef<Mesh>(null);
  const mesh3Ref = useRef<Mesh>(null);
  useFrame(() => {
    if (mesh1Ref.current) {
      mesh1Ref.current.rotation.x += 0.004;
      mesh1Ref.current.rotation.y += 0.006;
      mesh1Ref.current.position.y += Math.sin(Date.now() * 0.0005) * 0.01;
    }
    if (mesh2Ref.current) {
      mesh2Ref.current.rotation.y -= 0.005;
      mesh2Ref.current.rotation.z += 0.003;
      mesh2Ref.current.position.x += Math.cos(Date.now() * 0.0004) * 0.01;
    }
    if (mesh3Ref.current) {
      mesh3Ref.current.rotation.x -= 0.003;
      mesh3Ref.current.rotation.y += 0.007;
      mesh3Ref.current.position.z += Math.sin(Date.now() * 0.0006) * 0.01;
    }
  });

  return (
    <>
      {/* Rotating Tetrahedron */}
      <mesh ref={mesh1Ref} position={[-3, 0, 0]}>
        <tetrahedronGeometry args={[1.5, 0]} />
        <meshPhongMaterial
          color="#00d9ff"
          emissive="#00a3cc"
          wireframe={false}
          shininess={100}
        />
      </mesh>

      {/* Orbiting Octahedron */}
      <mesh ref={mesh2Ref} position={[3, 1, -2]}>
        <octahedronGeometry args={[1.2, 0]} />
        <meshPhongMaterial
          color="#7c3aed"
          emissive="#6d28d9"
          wireframe={false}
          shininess={80}
        />
      </mesh>

      {/* Dodecahedron */}
      <mesh ref={mesh3Ref} position={[0, -2, -1]}>
        <dodecahedronGeometry args={[1.3, 0]} />
        <meshPhongMaterial
          color="#06b6d4"
          emissive="#0891b2"
          wireframe={false}
          shininess={90}
        />
      </mesh>

      {/* Lights */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00d9ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#7c3aed" />
    </>
  );
}

export default function FloatingGeometry() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg" />
    );
  }

  return (
    <Canvas
      className="w-full h-full rounded-lg"
      camera={{ position: [0, 0, 8], fov: 50 }}
    >
      <FloatingGeometries />
    </Canvas>
  );
}
