import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface FloatingMeshProps {
  geometry: THREE.BufferGeometry;
  color: string;
  position: [number, number, number];
  scale?: number;
  rotationSpeed?: number;
}

// 3D Glassmorphic Shape Component
function FloatingShape({
  geometry,
  color,
  position,
  scale = 1,
  rotationSpeed = 0.5,
}: FloatingMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.position.y =
        position[1] + Math.sin(t * 0.5 + position[0]) * 0.8;
      meshRef.current.rotation.x = t * 0.1 * rotationSpeed;
      meshRef.current.rotation.y = t * 0.15 * rotationSpeed;
    }
    if (wireframeRef.current) {
      wireframeRef.current.position.y =
        position[1] + Math.sin(t * 0.5 + position[0]) * 0.8;
      wireframeRef.current.rotation.x = t * 0.1 * rotationSpeed;
      wireframeRef.current.rotation.y = t * 0.15 * rotationSpeed;
    }
  });

  return (
    <>
      <mesh
        ref={meshRef}
        position={position}
        scale={scale}
        castShadow
        receiveShadow
      >
        <primitive object={geometry} attach="geometry" />
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={0.3}
          roughness={0.2}
          metalness={0.1}
          transmission={0.65}
          thickness={2.0}
          ior={1.45}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={wireframeRef} position={position} scale={scale * 1.02}>
        <primitive object={geometry} attach="geometry" />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.1} />
      </mesh>
    </>
  );
}

// Secondary Atmospheric Cosmic Dust Layer
function SecondaryDust({ count = 500 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 65;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 125 - 35; // Cover vertical height
      pos[i * 3 + 2] = (Math.random() - 0.5) * 35;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = -t * 0.006; // Slow reverse spinning drift
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        color="#8888aa"
        transparent
        opacity={0.25}
        depthWrite={false}
      />
    </points>
  );
}

// Technical grid helper in 3D background space
function TechnicalGrid() {
  const gridRef = useRef<THREE.GridHelper>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (gridRef.current) {
      gridRef.current.rotation.y = t * 0.015;
      gridRef.current.position.y = -35 + Math.sin(t * 0.15) * 1.0;
    }
  });

  return (
    <gridHelper
      ref={gridRef}
      args={[55, 22, "#4640DE", "#8888aa"]}
      position={[0, -35, -9]}
      rotation={[Math.PI / 4, 0, 0]}
    >
      <lineBasicMaterial attach="material" transparent opacity={0.07} />
    </gridHelper>
  );
}

// High-fidelity connected constellation network (dots & dynamic lines)
function NetworkField({ count = 135 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const [lineColor, setLineColor] = useState("#e0e0e8");

  // Track light/dark themes to colorize constellation lines dynamically
  useEffect(() => {
    const updateThemeColor = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setLineColor(isDark ? "#2a2b35" : "#e2e2e9");
    };
    updateThemeColor();
    const observer = new MutationObserver(updateThemeColor);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // Pre-generate a white radial gradient texture mask to create round glowing node dots
  const glowTexture = useMemo(() => {
    const size = 64;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d");
    if (ctx) {
      const grd = ctx.createRadialGradient(
        size / 2,
        size / 2,
        0,
        size / 2,
        size / 2,
        size / 2,
      );
      grd.addColorStop(0, "rgba(255, 255, 255, 1)");
      grd.addColorStop(0.35, "rgba(255, 255, 255, 0.65)");
      grd.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, size, size);
    }
    const texture = new THREE.CanvasTexture(c);
    return texture;
  }, []);

  // Generate stable coordinates, colors, velocities, and line segment buffers
  const [
    basePositions,
    positions,
    colors,
    nodeData,
    maxLines,
    linePositions,
    baseColors,
  ] = useMemo(() => {
    const basePos = new Float32Array(count * 3);
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const baseCols = new Float32Array(count * 3);
    const data = [];

    // Distribute nodes vertically to span the scroll height (Y: +20 down to -100)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const radius = 6 + Math.random() * 26;

      basePos[i * 3] = radius * Math.cos(theta);
      basePos[i * 3 + 1] = (Math.random() - 0.5) * 115 - 35; // centered around -35
      basePos[i * 3 + 2] = (Math.random() - 0.5) * 20;

      pos[i * 3] = basePos[i * 3];
      pos[i * 3 + 1] = basePos[i * 3 + 1];
      pos[i * 3 + 2] = basePos[i * 3 + 2];

      // Staggered node drift values
      data.push({
        speed: 0.15 + Math.random() * 0.25,
        offset: Math.random() * Math.PI * 2,
      });

      // Color coding (Teals & Indigos)
      const isTeal = Math.random() > 0.65;
      baseCols[i * 3] = isTeal ? 0.07 : 0.27; // R
      baseCols[i * 3 + 1] = isTeal ? 0.65 : 0.25; // G
      baseCols[i * 3 + 2] = isTeal ? 0.58 : 0.87; // B

      cols[i * 3] = baseCols[i * 3];
      cols[i * 3 + 1] = baseCols[i * 3 + 1];
      cols[i * 3 + 2] = baseCols[i * 3 + 2];
    }

    // Pre-allocate buffer for connecting lines
    const maxLineSegs = 750;
    const linePos = new Float32Array(maxLineSegs * 2 * 3); // 2 vertices per line, 3 coords each

    return [basePos, pos, cols, data, maxLineSegs, linePos, baseCols];
  }, [count]);

  // Clean up canvas textures on unmount
  useEffect(() => {
    return () => {
      glowTexture.dispose();
    };
  }, [glowTexture]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const pointsGeo = pointsRef.current?.geometry;
    const linesGeo = linesRef.current?.geometry;

    if (!pointsGeo || !linesGeo) return;

    const pos = pointsGeo.attributes.position.array as Float32Array;
    const cols = pointsGeo.attributes.color.array as Float32Array;
    const linePos = linesGeo.attributes.position.array as Float32Array;

    // 1. Update node coordinate drifts
    for (let i = 0; i < count; i++) {
      const bx = basePositions[i * 3];
      const by = basePositions[i * 3 + 1];
      const bz = basePositions[i * 3 + 2];
      const speed = nodeData[i].speed;
      const offset = nodeData[i].offset;

      pos[i * 3] = bx + Math.sin(t * speed + offset) * 1.5;
      pos[i * 3 + 1] = by + Math.cos(t * speed * 0.8 + offset) * 1.5;
      pos[i * 3 + 2] = bz + Math.sin(t * speed * 1.2 + offset) * 1.2;
    }
    pointsGeo.attributes.position.needsUpdate = true;

    // 2. Perform distance-checks and connect lines dynamically
    let lineCount = 0;
    const maxDistance = 18;
    const maxDistanceSq = maxDistance * maxDistance;

    // Reset node connection counts for this frame to track active connections
    const connectionCounts = new Uint8Array(count);

    for (let i = 0; i < count; i++) {
      const xi = pos[i * 3];
      const yi = pos[i * 3 + 1];
      const zi = pos[i * 3 + 2];

      for (let j = i + 1; j < count; j++) {
        const xj = pos[j * 3];
        const yj = pos[j * 3 + 1];
        const zj = pos[j * 3 + 2];

        // Optimized bounding box check to bypass costly square-root calls
        if (
          Math.abs(xi - xj) < maxDistance &&
          Math.abs(yi - yj) < maxDistance &&
          Math.abs(zi - zj) < maxDistance
        ) {
          const distSq = (xi - xj) ** 2 + (yi - yj) ** 2 + (zi - zj) ** 2;
          if (distSq < maxDistanceSq) {
            connectionCounts[i]++;
            connectionCounts[j]++;

            // Vertex A
            linePos[lineCount * 6] = xi;
            linePos[lineCount * 6 + 1] = yi;
            linePos[lineCount * 6 + 2] = zi;
            // Vertex B
            linePos[lineCount * 6 + 3] = xj;
            linePos[lineCount * 6 + 4] = yj;
            linePos[lineCount * 6 + 5] = zj;

            lineCount++;
            if (lineCount >= maxLines) break;
          }
        }
      }
      if (lineCount >= maxLines) break;
    }

    // 3. Update node colors dynamically to animate blinking connection pulse lights
    for (let i = 0; i < count; i++) {
      const bx = baseColors[i * 3];
      const by = baseColors[i * 3 + 1];
      const bz = baseColors[i * 3 + 2];

      if (connectionCounts[i] > 0) {
        // Connected: Blinking high-speed electrical pulse logic (oscillating between base color and pure white)
        const pulseFactor = 0.5 + 0.5 * Math.sin(t * 14 + i * 3);
        cols[i * 3] = bx + (1.0 - bx) * pulseFactor * 0.9;
        cols[i * 3 + 1] = by + (1.0 - by) * pulseFactor * 0.9;
        cols[i * 3 + 2] = bz + (1.0 - bz) * pulseFactor * 0.9;
      } else {
        // Disconnected: Dim down base color
        cols[i * 3] = bx * 0.35;
        cols[i * 3 + 1] = by * 0.35;
        cols[i * 3 + 2] = bz * 0.35;
      }
    }

    pointsGeo.attributes.color.needsUpdate = true;
    linesGeo.attributes.position.needsUpdate = true;
    linesGeo.setDrawRange(0, lineCount * 2);
  });

  return (
    <>
      {/* Node Dots Mesh */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.72}
          vertexColors
          transparent
          opacity={0.85}
          map={glowTexture}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Network Lines Mesh */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={lineColor}
          transparent
          opacity={0.4}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </>
  );
}

// Camera flight controller matching scroll percentage
function CameraController() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 3;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 3;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(() => {
    const scrollHeight =
      document.documentElement.scrollHeight - window.innerHeight || 1;
    const scrollPercent = window.scrollY / scrollHeight;

    // Camera Y tracks sections (down to Y = -90 at contact)
    const targetCamY = -scrollPercent * 90;

    // Camera depth oscillation
    const targetCamZ = 16 + Math.sin(scrollPercent * Math.PI) * 4;

    camera.position.x += (mouse.current.x - camera.position.x) * 0.05;
    camera.position.y += (targetCamY - camera.position.y) * 0.05;
    camera.position.z += (targetCamZ - camera.position.z) * 0.05;

    camera.lookAt(0, camera.position.y - 2, -5);
  });

  return null;
}

export function Background3D() {
  const torusGeo = useMemo(
    () => new THREE.TorusGeometry(3.2, 0.9, 16, 100),
    [],
  );
  const octaGeo = useMemo(() => new THREE.OctahedronGeometry(3.6, 0), []);
  const icoGeo = useMemo(() => new THREE.IcosahedronGeometry(3.5, 1), []);
  const knotGeo = useMemo(
    () => new THREE.TorusKnotGeometry(2.4, 0.8, 120, 16),
    [],
  );
  const sphereGeo = useMemo(() => new THREE.SphereGeometry(3.2, 32, 32), []);

  useEffect(() => {
    return () => {
      torusGeo.dispose();
      octaGeo.dispose();
      icoGeo.dispose();
      knotGeo.dispose();
      sphereGeo.dispose();
    };
  }, [torusGeo, octaGeo, icoGeo, knotGeo, sphereGeo]);

  return (
    <div className="fixed inset-0 -z-50 w-full h-full pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 16], fov: 60 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
      >
        {/* Lights */}
        <ambientLight intensity={0.4} />
        <pointLight position={[8, 10, 5]} intensity={1.5} color="#4640DE" />
        <pointLight position={[-8, -25, 5]} intensity={1.8} color="#12A594" />
        <pointLight position={[6, -55, 6]} intensity={1.6} color="#4640DE" />
        <pointLight position={[-6, -85, 4]} intensity={2.0} color="#12A594" />

        {/* Dynamic Connected constellation nodes web (with blinking connections) */}
        <NetworkField count={135} />

        {/* Secondary Cosmic Dust (extra visual details) */}
        <SecondaryDust count={550} />

        {/* Floating grid helper */}
        <TechnicalGrid />

        {/* Floating 3D Geometries spaced along scroll levels */}
        <FloatingShape
          geometry={torusGeo}
          color="#4640DE"
          position={[6, 3, -4]}
          scale={0.9}
        />
        <FloatingShape
          geometry={octaGeo}
          color="#12A594"
          position={[-6, -20, -3]}
          scale={1.0}
        />
        <FloatingShape
          geometry={icoGeo}
          color="#4640DE"
          position={[6.5, -42, -4]}
          scale={0.9}
        />
        <FloatingShape
          geometry={knotGeo}
          color="#12A594"
          position={[-7, -65, -5]}
          scale={0.8}
        />
        <FloatingShape
          geometry={sphereGeo}
          color="#4640DE"
          position={[5.5, -88, -3]}
          scale={0.85}
        />

        {/* Camera Fly Controller */}
        <CameraController />
      </Canvas>
    </div>
  );
}
