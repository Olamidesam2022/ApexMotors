"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const MODEL_PATH = "/models/apex-sports-car.glb";
const BODY_PAINT = "#97101a";
const WHEEL_NAMES = ["FL_WHEEL", "FR_WHEEL", "RL_WHEEL", "RR_WHEEL"];

function getMaterials(material) {
  return Array.isArray(material) ? material : [material];
}

function Seat({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.19, 0]} castShadow>
        <boxGeometry args={[0.29, 0.13, 0.34]} />
        <meshStandardMaterial color="#d9d1c6" roughness={0.78} />
      </mesh>
      <mesh position={[-0.075, 0.39, -0.035]} rotation={[0, 0, -0.12]} castShadow>
        <boxGeometry args={[0.12, 0.37, 0.31]} />
        <meshStandardMaterial color="#e1d9cf" roughness={0.78} />
      </mesh>
      <mesh position={[-0.11, 0.62, -0.035]}>
        <boxGeometry args={[0.15, 0.12, 0.23]} />
        <meshStandardMaterial color="#e1d9cf" roughness={0.78} />
      </mesh>
    </group>
  );
}

function Vehicle({ progress, onReady }) {
  const root = useRef();
  const doors = useRef([]);
  const details = useRef({});
  const { scene } = useGLTF(MODEL_PATH);
  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse(object => {
      if (!object.isMesh) return;
      const materials = getMaterials(object.material).map(material => {
        const clone = material.clone();
        if (clone.name === "Body_paint") {
          clone.color.set(BODY_PAINT);
          clone.metalness = 0.62;
          clone.roughness = 0.25;
        } else if (clone.name === "Glass") {
          clone.color.set("#111719");
          clone.metalness = 0.48;
          clone.roughness = 0.16;
        } else if (clone.name === "Emission.001") {
          clone.emissive?.set("#ffe1a5");
          clone.emissiveIntensity = 0.25;
        }
        return clone;
      });
      object.material = Array.isArray(object.material) ? materials : materials[0];
      object.castShadow = true;
      object.receiveShadow = true;
    });
    return clone;
  }, [scene]);
  const parts = useMemo(() => {
    const meshes = [];
    model.traverse(object => {
      if (object.isMesh) meshes.push(object);
    });

    const findPart = (name, required = true) => {
      const mesh = meshes.find(item => item.name.includes(name));
      if (!mesh && required) {
        const available = meshes.map(item => item.name).join(", ");
        throw new Error(`The Mazda model is missing the ${name} mesh. Available meshes: ${available}`);
      }
      return mesh;
    };

    return {
      body: findPart("Plane013"),
      bumper: findPart("Rear_bumper"),
      headlights: findPart("Headlights", false),
      chassisModel: findPart("Bottom"),
      logos: findPart("Logos", false),
      wheels: WHEEL_NAMES.map(name => findPart(name)),
      exhaustModel: findPart("Exhaust")
    };
  }, [model]);
  const basePositions = useMemo(() => {
    const movableParts = [
      parts.body,
      parts.bumper,
      parts.headlights,
      parts.chassisModel,
      parts.logos,
      parts.exhaustModel,
      ...parts.wheels
    ];

    return new Map(
      movableParts
        .filter(Boolean)
        .map(part => [part, part.position.clone()])
    );
  }, [parts]);
  const headlightMaterials = useMemo(() => {
    if (!parts.headlights) return [];
    return getMaterials(parts.headlights.material).filter(material => material.emissive);
  }, [parts]);
  const doorGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.4, 0.2);
    shape.lineTo(-0.36, 0.66);
    shape.lineTo(0.3, 0.67);
    shape.lineTo(0.38, 0.27);
    shape.quadraticCurveTo(0, 0.18, -0.4, 0.2);
    return new THREE.ShapeGeometry(shape);
  }, []);

  useEffect(() => {
    onReady(true);
  }, [onReady]);

  useEffect(() => {
    return () => {
      doorGeometry.dispose();
      model.traverse(object => {
        if (!object.isMesh) return;
        getMaterials(object.material).forEach(material => material.dispose());
      });
    };
  }, [doorGeometry, model]);

  useFrame(state => {
    const scrollProgress = progress.current;
    const separation = scrollProgress < 0.4
      ? scrollProgress / 0.4
      : scrollProgress > 0.75
        ? 1 - (scrollProgress - 0.75) / 0.25
        : 1;
    const easedSeparation = separation * separation * (3 - 2 * separation);
    const spinProgress = scrollProgress > 0.75 ? (scrollProgress - 0.75) / 0.25 : 0;
    const headlightProgress = scrollProgress > 0.75
      ? Math.min(1, (scrollProgress - 0.75) / 0.08)
      : 0;

    headlightMaterials.forEach(material => {
      material.emissiveIntensity = 0.08 + headlightProgress * 3.5;
    });

    if (root.current) {
      root.current.position.set(0, -0.18 + Math.sin(state.clock.elapsedTime * 0.5) * 0.018, 0);
      root.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.16) * 0.018 + spinProgress * Math.PI * 2;
      root.current.scale.setScalar(1.12);
    }

    const movePart = (part, yOffset, xOffset = 0, zOffset = 0) => {
      if (!part) return;
      const base = basePositions.get(part);
      part.position.set(
        base.x + xOffset * easedSeparation,
        base.y + yOffset * easedSeparation,
        base.z + zOffset * easedSeparation
      );
    };

    movePart(parts.body, 0.52);
    movePart(parts.bumper, 0.52);
    movePart(parts.headlights, 0.52);
    movePart(parts.logos, 0.52);
    movePart(parts.chassisModel, -0.72);
    movePart(parts.exhaustModel, -1.12);
    parts.wheels.forEach((wheel, index) => {
      const side = index % 2 === 0 ? 1 : -1;
      const front = index < 2;
      movePart(wheel, -0.58, side * 0.48, front ? 0.16 : -0.12);
    });

    doors.current.forEach((door, index) => {
      if (!door) return;
      const side = index === 0 ? 1 : -1;
      door.position.set(side * (0.86 + easedSeparation * 0.62), easedSeparation * 0.2, 0.03);
      door.rotation.y = side * Math.PI / 2;
      door.rotation.z = side * easedSeparation * 0.12;
    });

    details.current.engine.position.y = 0.34 - easedSeparation * 0.72;
    details.current.interior.position.y = 0.36 - easedSeparation * 0.42;
    details.current.chassis.position.y = 0.12 - easedSeparation * 0.95;
    details.current.suspension.position.y = 0.19 - easedSeparation * 1.08;
    details.current.exhaust.position.y = 0.12 - easedSeparation * 1.25;
  });

  return (
    <group ref={root}>
      <primitive object={model} dispose={null} />
      {[-1, 1].map((side, index) => (
        <group
          key={side}
          ref={element => {
            doors.current[index] = element;
          }}
        >
          <mesh geometry={doorGeometry} position={[0, 0, 0.03]}>
            <meshStandardMaterial
              color={BODY_PAINT}
              metalness={0.62}
              roughness={0.25}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[side * 0.01, 0.56, 0.08]}>
            <boxGeometry args={[0.025, 0.025, 0.1]} />
            <meshStandardMaterial color="#c9c2b8" metalness={0.8} roughness={0.22} />
          </mesh>
        </group>
      ))}

      <group
        ref={element => {
          details.current.interior = element;
        }}
        position={[0, 0.36, 0]}
      >
        <Seat position={[-0.36, 0, 0.38]} />
        <Seat position={[0.36, 0, 0.38]} />
        <Seat position={[-0.36, 0, -0.42]} />
        <Seat position={[0.36, 0, -0.42]} />
        <mesh position={[0, 0.52, 0]}>
          <boxGeometry args={[0.55, 0.14, 0.35]} />
          <meshStandardMaterial color="#272624" roughness={0.58} />
        </mesh>
        <mesh position={[0, 0.64, 0.07]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.13, 0.018, 8, 20]} />
          <meshStandardMaterial color="#a49f95" metalness={0.8} roughness={0.25} />
        </mesh>
      </group>

      <group
        ref={element => {
          details.current.engine = element;
        }}
        position={[0, 0.34, 0.97]}
      >
        <mesh castShadow>
          <boxGeometry args={[0.62, 0.36, 0.58]} />
          <meshStandardMaterial color="#6b6d68" metalness={0.72} roughness={0.36} />
        </mesh>
        <mesh position={[0, 0.21, 0]}>
          <boxGeometry args={[0.42, 0.09, 0.4]} />
          <meshStandardMaterial color="#bd2028" metalness={0.55} roughness={0.32} />
        </mesh>
        {[-1, 1].map(side => (
          <group key={side} position={[side * 0.22, 0.1, 0]}>
            <mesh>
              <boxGeometry args={[0.18, 0.19, 0.46]} />
              <meshStandardMaterial color="#a5a39d" metalness={0.75} roughness={0.38} />
            </mesh>
            {[-0.13, 0, 0.13].map(z => (
              <mesh key={z} position={[0, 0.13, z]}>
                <cylinderGeometry args={[0.025, 0.025, 0.2, 8]} />
                <meshStandardMaterial color="#474945" metalness={0.7} roughness={0.36} />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      <group
        ref={element => {
          details.current.chassis = element;
        }}
        position={[0, 0.12, 0]}
      >
        {[-0.5, 0.5].map(x => (
          <mesh key={x} position={[x, 0, -0.05]}>
            <boxGeometry args={[0.08, 0.09, 3]} />
            <meshStandardMaterial color="#777872" metalness={0.78} roughness={0.4} />
          </mesh>
        ))}
        {[-1.08, 0, 1.02].map(z => (
          <mesh key={z} position={[0, 0, z]}>
            <boxGeometry args={[1.08, 0.09, 0.08]} />
            <meshStandardMaterial color="#62645f" metalness={0.75} roughness={0.42} />
          </mesh>
        ))}
      </group>

      <group
        ref={element => {
          details.current.suspension = element;
        }}
        position={[0, 0.19, 0]}
      >
        {[-1, 1].map(side =>
          [-1.18, 1.18].map(z => (
            <group key={`${side}-${z}`} position={[side * 0.55, 0, z]}>
              <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.09, 0.09, 0.13, 12]} />
                <meshStandardMaterial color="#a5a39d" metalness={0.8} roughness={0.32} />
              </mesh>
              <mesh position={[side * 0.09, -0.07, 0]} rotation={[0, 0, side * 0.55]}>
                <cylinderGeometry args={[0.02, 0.02, 0.28, 8]} />
                <meshStandardMaterial color="#c1bdb4" metalness={0.8} roughness={0.34} />
              </mesh>
            </group>
          ))
        )}
      </group>

      <group
        ref={element => {
          details.current.exhaust = element;
        }}
        position={[0, 0.12, 0]}
      >
        {[-0.2, 0.2].map(x => {
          const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(x, 0, 1.1),
            new THREE.Vector3(x, 0, 0.35),
            new THREE.Vector3(x * 0.7, 0.02, -0.55),
            new THREE.Vector3(x, 0.08, -1.62)
          ]);

          return (
            <group key={x}>
              <mesh>
                <tubeGeometry args={[curve, 20, 0.026, 8, false]} />
                <meshStandardMaterial color="#a6a39b" metalness={0.82} roughness={0.35} />
              </mesh>
              <mesh position={[x, 0.08, -1.65]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.06, 0.06, 0.12, 12]} />
                <meshStandardMaterial color="#c6c0b6" metalness={0.85} roughness={0.25} />
              </mesh>
            </group>
          );
        })}
      </group>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.045, 0]}>
        <planeGeometry args={[9, 7]} />
        <meshBasicMaterial color="#0b0b0b" transparent opacity={0.24} />
      </mesh>
    </group>
  );
}

export default function CarScene({ progress, onReady }) {
  return <Canvas
    camera={{ position: [2.8, 2, 5.8], fov: 32 }}
    dpr={[1, 1.5]}
    gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
    onCreated={({ gl }) => {
      gl.setClearColor("#0b0b0b", 0);
    }}
  >
    <ambientLight intensity={0.7} />
    <directionalLight position={[4, 7, 6]} intensity={2.1} castShadow shadow-mapSize={[1024, 1024]} />
    <directionalLight position={[-5, 4, -4]} intensity={1.1} color="#ce3935" />
    <Vehicle progress={progress} onReady={onReady} />
    <ContactShadows position={[0, -0.04, 0]} opacity={0.4} scale={8} blur={2.4} far={2} />
    <Environment preset="city" />
  </Canvas>;
}

useGLTF.preload(MODEL_PATH);
