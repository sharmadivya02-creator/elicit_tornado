import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export type AstronautTheme = 'neon_grid' | 'nebula' | 'hologram' | 'retro' | 'floating' | 'terminal';

interface PixelAstronautHero3DProps {
  className?: string;
  theme?: AstronautTheme;
  modelUrl?: string;
}

/**
 * A GLB-powered 3D hero model with a procedural fallback.
 * - Click + drag anywhere on it to spin the whole astronaut with momentum!
 * - Idles with a gentle float + slow auto-rotate when left alone.
 * - Supports 6 fully immersive 3D scene modes: Neon Grid, Nebula, Hologram, Retro, Floating, Terminal.
 */
export const PixelAstronautHero3D: React.FC<PixelAstronautHero3DProps> = ({ 
  className = '',
  theme = 'neon_grid',
  modelUrl = '/models/retro-robot-3d-model.glb'
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [modelStatus, setModelStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const isDraggingRef = useRef(false);

  // Sync theme changes to the ThreeJS animation loop
  const activeThemeRef = useRef<AstronautTheme>(theme);
  useEffect(() => {
    activeThemeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    setModelStatus('loading');

    // ---------- Core scene setup ----------
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.05, 8.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      // Set size and let ThreeJS update canvas CSS width/height automatically
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);

    // ---------- Lighting Setup (lerps colors dynamically by theme) ----------
    scene.add(new THREE.AmbientLight(0x8888aa, 0.65));

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
    keyLight.position.set(2.5, 3, 4);
    scene.add(keyLight);

    const cyanRim = new THREE.PointLight(0x00f0ff, 6, 12);
    cyanRim.position.set(-2.5, 1, 2);
    scene.add(cyanRim);

    const purpleFill = new THREE.PointLight(0xa855f7, 4.5, 12);
    purpleFill.position.set(2, -1.5, -2);
    scene.add(purpleFill);

    const topGlow = new THREE.PointLight(0xfacc15, 2, 8);
    topGlow.position.set(0, 3, 1.5);
    scene.add(topGlow);

    // ---------- Materials ----------
    const suitWhite = new THREE.MeshStandardMaterial({ color: 0xf5f6fa, roughness: 0.55, metalness: 0.08 });
    const suitShadow = new THREE.MeshStandardMaterial({ color: 0xd7dae2, roughness: 0.6, metalness: 0.08 });
    const trimOrange = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.4, metalness: 0.2 });
    const trimGold = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.35, metalness: 0.35, emissive: 0x5a3d00, emissiveIntensity: 0.3 });
    const blueAccent = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.45, metalness: 0.25 });
    const darkJoint = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.3 });
    const visorMat = new THREE.MeshPhysicalMaterial({
      color: 0x05070f,
      roughness: 0.12,
      metalness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      envMapIntensity: 1.2,
    });
    const visorGlint = new THREE.MeshBasicMaterial({ color: 0x9fe9ff, transparent: true, opacity: 0.55 });

    // ---------- Astronaut Assembly ----------
    const astronaut = new THREE.Group();
    astronaut.visible = false;
    scene.add(astronaut);

    const modelRoot = new THREE.Group();
    modelRoot.visible = false;
    scene.add(modelRoot);

    const body = new THREE.Group();
    astronaut.add(body);

    // Backpack (jetpack)
    const backpack = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.45, 0.63), suitShadow);
    backpack.position.set(0, -0.15, -0.68);
    body.add(backpack);
    const backpackStripe = new THREE.Mesh(new THREE.BoxGeometry(1.12, 0.2, 0.02), trimOrange);
    backpackStripe.position.set(0, 0.2, -0.4);
    body.add(backpackStripe);

    // Dynamic ACM label printed on the back of the backpack (Enlarged with double resolution)
    const acmCanvas = document.createElement('canvas');
    acmCanvas.width = 512;
    acmCanvas.height = 256;
    const acmCtx = acmCanvas.getContext('2d');
    if (acmCtx) {
      acmCtx.clearRect(0, 0, 512, 256);
      
      // Glowing text shadow (cyan)
      acmCtx.shadowColor = '#00f0ff';
      acmCtx.shadowBlur = 24;
      
      acmCtx.fillStyle = '#00f0ff';
      acmCtx.font = '900 165px "Courier New", Courier, monospace';
      acmCtx.textAlign = 'center';
      acmCtx.textBaseline = 'middle';
      acmCtx.fillText('ACM', 256, 128);
      
      // Cybernetic frame border (orange)
      acmCtx.shadowColor = '#f97316';
      acmCtx.shadowBlur = 16;
      acmCtx.strokeStyle = '#f97316';
      acmCtx.lineWidth = 14;
      acmCtx.strokeRect(16, 16, 480, 224);
    }
    const acmTexture = new THREE.CanvasTexture(acmCanvas);
    acmTexture.colorSpace = THREE.SRGBColorSpace;
    const acmMat = new THREE.MeshBasicMaterial({
      map: acmTexture,
      transparent: true,
      side: THREE.DoubleSide
    });
    const acmLabel = new THREE.Mesh(new THREE.PlaneGeometry(0.98, 0.49), acmMat);
    // Positioned slightly behind the backpack's rear surface (z = -0.68 - 0.63/2 = -0.995) to prevent z-fighting
    acmLabel.position.set(0, -0.15, -1.00);
    acmLabel.rotation.y = Math.PI; // Face the back
    body.add(acmLabel);

    // Torso (capsule-ish: cylinder + spheres to cap it)
    const torso = new THREE.Group();
    body.add(torso);
    const torsoCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.62, 1.15, 24), suitWhite);
    torso.add(torsoCyl);
    const torsoTop = new THREE.Mesh(new THREE.SphereGeometry(0.72, 24, 16), suitWhite);
    torsoTop.position.y = 0.575;
    torsoTop.scale.set(1, 0.55, 1);
    torso.add(torsoTop);
    const torsoBottom = new THREE.Mesh(new THREE.SphereGeometry(0.62, 24, 16), suitWhite);
    torsoBottom.position.y = -0.575;
    torsoBottom.scale.set(1, 0.55, 1);
    torso.add(torsoBottom);

    // Chest control panel
    const panel = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.42, 0.06), darkJoint);
    panel.position.set(0, 0.05, 0.7);
    torso.add(panel);
    const panelScreen = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.26, 0.02), blueAccent);
    panelScreen.position.set(0, 0.07, 0.735);
    torso.add(panelScreen);
    const panelButton = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.03, 12), trimGold);
    panelButton.rotation.x = Math.PI / 2;
    panelButton.position.set(0, -0.12, 0.735);
    torso.add(panelButton);

    // Neck ring
    const neckRing = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.14, 20), suitShadow);
    neckRing.position.y = 0.68;
    torso.add(neckRing);
    const neckGold = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.03, 8, 20), trimGold);
    neckGold.rotation.x = Math.PI / 2;
    neckGold.position.y = 0.74;
    torso.add(neckGold);

    // Arms + legs builder helper
    const makeLimb = (upperLen: number, lowerLen: number, radius: number) => {
      const limb = new THREE.Group();
      const upper = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 0.92, upperLen, 14), suitWhite);
      upper.position.y = -upperLen / 2;
      limb.add(upper);
      const joint = new THREE.Mesh(new THREE.SphereGeometry(radius * 0.95, 14, 12), suitShadow);
      joint.position.y = -upperLen;
      limb.add(joint);
      const lower = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.9, radius * 0.8, lowerLen, 14), suitShadow);
      lower.position.y = -upperLen - lowerLen / 2;
      limb.add(lower);
      return { limb, endY: -upperLen - lowerLen };
    };

    // Arms
    const leftArmData = makeLimb(0.62, 0.5, 0.24);
    leftArmData.limb.position.set(-0.85, 0.42, 0.05);
    leftArmData.limb.rotation.z = 0.25;
    body.add(leftArmData.limb);
    const leftGlove = new THREE.Mesh(new THREE.SphereGeometry(0.22, 14, 12), blueAccent);
    leftGlove.position.set(-1.02, 0.42 + leftArmData.endY - 0.05, 0.15);
    body.add(leftGlove);

    const rightArmData = makeLimb(0.62, 0.5, 0.24);
    rightArmData.limb.position.set(0.85, 0.42, 0.05);
    rightArmData.limb.rotation.z = -0.25;
    body.add(rightArmData.limb);
    const rightGlove = new THREE.Mesh(new THREE.SphereGeometry(0.22, 14, 12), blueAccent);
    rightGlove.position.set(1.02, 0.42 + rightArmData.endY - 0.05, 0.15);
    body.add(rightGlove);

    // Shoulder gold trim
    [-0.72, 0.72].forEach((x) => {
      const shoulder = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.04, 8, 16), trimGold);
      shoulder.position.set(x, 0.68, 0.05);
      shoulder.rotation.y = Math.PI / 2;
      body.add(shoulder);
    });

    // Legs
    const leftLegData = makeLimb(0.55, 0.5, 0.3);
    leftLegData.limb.position.set(-0.33, -0.68, 0);
    body.add(leftLegData.limb);
    const leftBoot = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.26, 0.62), blueAccent);
    leftBoot.position.set(-0.33, -0.68 + leftLegData.endY - 0.05, 0.1);
    body.add(leftBoot);

    const rightLegData = makeLimb(0.55, 0.5, 0.3);
    rightLegData.limb.position.set(0.33, -0.68, 0);
    body.add(rightLegData.limb);
    const rightBoot = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.26, 0.62), blueAccent);
    rightBoot.position.set(0.33, -0.68 + rightLegData.endY - 0.05, 0.1);
    body.add(rightBoot);

    // ---------- Head (separate group so it can track cursor independently) ----------
    const head = new THREE.Group();
    head.position.set(0, 1.28, 0);
    astronaut.add(head);

    const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.72, 32, 24), suitWhite);
    head.add(helmet);

    const helmetRimGold = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.045, 10, 28), trimGold);
    helmetRimGold.position.z = 0.4;
    head.add(helmetRimGold);

    const visor = new THREE.Mesh(new THREE.SphereGeometry(0.52, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.62), visorMat);
    visor.position.set(0, 0.02, 0.28);
    visor.rotation.x = -0.25;
    head.add(visor);

    // Glossy highlights on the visor
    const glint = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 10), visorGlint);
    glint.position.set(-0.18, 0.16, 0.66);
    head.add(glint);
    const glint2 = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), visorGlint);
    glint2.position.set(0.05, 0.24, 0.68);
    head.add(glint2);

    // Ear pieces
    [-0.66, 0.66].forEach((x) => {
      const ear = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.1, 16), blueAccent);
      ear.rotation.z = Math.PI / 2;
      ear.position.set(x, 0, 0.05);
      head.add(ear);
      const earCore = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.11, 12), new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0ea5e9, emissiveIntensity: 0.6 }));
      earCore.rotation.z = Math.PI / 2;
      earCore.position.set(x > 0 ? x + 0.005 : x - 0.005, 0, 0.05);
      head.add(earCore);
    });

    // Antenna
    const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.35, 8), darkJoint);
    antenna.position.set(0.35, 0.65, -0.1);
    antenna.rotation.z = -0.3;
    head.add(antenna);
    const antennaTip = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 0.8 }));
    antennaTip.position.set(0.48, 0.8, -0.13);
    head.add(antennaTip);

    // Base contact shadow
    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(1.05, 32),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35 })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -1.85;
    scene.add(shadow);

    astronaut.scale.setScalar(1.0);
    astronaut.position.y = -0.9;

    let isDisposed = false;

    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        if (isDisposed) return;

        const model = gltf.scene;
        model.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.castShadow = true;
            obj.receiveShadow = true;
          }
        });

        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);
        model.position.sub(center);

        const maxAxis = Math.max(size.x, size.y, size.z) || 1;
        model.scale.setScalar(5.3 / maxAxis);

        modelRoot.add(model);
        modelRoot.position.set(0, -0.9, 0);
        modelRoot.rotation.y = 0.3;
        modelRoot.visible = true;
        setModelStatus('ready');
      },
      undefined,
      (error) => {
        console.error('Failed to load GLB hero model:', error);
        if (isDisposed) return;
        astronaut.visible = true;
        setModelStatus('error');
      }
    );


    // ==========================================
    // ---------- SCENERY ENVIRONMENTS ----------
    // ==========================================

    // --- Theme 1 Scenery: Neon Grid Arena ---
    const neonGridGroup = new THREE.Group();
    scene.add(neonGridGroup);

    const platformRing1 = new THREE.Mesh(
      new THREE.RingGeometry(0.82, 0.86, 48),
      new THREE.MeshBasicMaterial({ color: 0xa855f7, side: THREE.DoubleSide, transparent: true, opacity: 0.55 })
    );
    platformRing1.rotation.x = Math.PI / 2;
    platformRing1.position.y = -1.83;
    neonGridGroup.add(platformRing1);

    const platformRing2 = new THREE.Mesh(
      new THREE.RingGeometry(0.62, 0.65, 48),
      new THREE.MeshBasicMaterial({ color: 0x06b6d4, side: THREE.DoubleSide, transparent: true, opacity: 0.45 })
    );
    platformRing2.rotation.x = Math.PI / 2;
    platformRing2.position.y = -1.83;
    neonGridGroup.add(platformRing2);

    const floorGrid = new THREE.GridHelper(10, 16, 0x8b5cf6, 0x06b6d4);
    floorGrid.position.y = -1.84;
    neonGridGroup.add(floorGrid);


    // --- Theme 2 Scenery: Deep Space Nebula ---
    const nebulaGroup = new THREE.Group();
    scene.add(nebulaGroup);

    const lunarGeom = new THREE.DodecahedronGeometry(1.6, 2);
    const lPos = lunarGeom.attributes.position;
    for (let i = 0; i < lPos.count; i++) {
      lPos.setX(i, lPos.getX(i) * (1.1 + (Math.random() - 0.5) * 0.15));
      lPos.setY(i, lPos.getY(i) * 0.24 - 1.95); // Flattened base mound
      lPos.setZ(i, lPos.getZ(i) * (1.1 + (Math.random() - 0.5) * 0.15));
    }
    lunarGeom.computeVertexNormals();
    const lunarMesh = new THREE.Mesh(
      lunarGeom,
      new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.95, metalness: 0.1, flatShading: true })
    );
    nebulaGroup.add(lunarMesh);

    const starFieldGeom = new THREE.BufferGeometry();
    const starCount = 300;
    const starCoords = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starCoords[i] = (Math.random() - 0.5) * 16;
      starCoords[i + 1] = (Math.random() - 0.5) * 12 + 1.0;
      starCoords[i + 2] = (Math.random() - 0.5) * 10 - 3.0;
    }
    starFieldGeom.setAttribute('position', new THREE.BufferAttribute(starCoords, 3));
    const starField = new THREE.Points(
      starFieldGeom,
      new THREE.PointsMaterial({ color: 0xffffff, size: 0.045, transparent: true, opacity: 0.85 })
    );
    nebulaGroup.add(starField);


    // --- Theme 3 Scenery: Holographic Platform ---
    const hologramGroup = new THREE.Group();
    scene.add(hologramGroup);

    for (let r = 0.5; r <= 1.15; r += 0.32) {
      const holoRing = new THREE.Mesh(
        new THREE.RingGeometry(r - 0.015, r + 0.015, 32),
        new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.6, side: THREE.DoubleSide })
      );
      holoRing.rotation.x = Math.PI / 2;
      holoRing.position.y = -1.83;
      hologramGroup.add(holoRing);
    }

    const holoBeamsGroup = new THREE.Group();
    const beamCount = 35;
    for (let i = 0; i < beamCount; i++) {
      const bHeight = Math.random() * 1.5 + 0.5;
      const beamMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.003, 0.003, bHeight, 4),
        new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: Math.random() * 0.4 + 0.08 })
      );
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 0.72 + 0.12;
      beamMesh.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 2.5 - 0.5,
        Math.sin(angle) * radius
      );
      beamMesh.userData = { speedY: Math.random() * 0.45 + 0.15, height: bHeight };
      holoBeamsGroup.add(beamMesh);
    }
    hologramGroup.add(holoBeamsGroup);


    // --- Theme 4 Scenery: Retro Wireframe ---
    const retroGroup = new THREE.Group();
    scene.add(retroGroup);

    const wireframeGridGeom = new THREE.PlaneGeometry(12, 10, 24, 20);
    const wCoords = wireframeGridGeom.attributes.position;
    for (let i = 0; i < wCoords.count; i++) {
      const wx = wCoords.getX(i);
      const distCenter = Math.abs(wx);
      let wz = 0;
      if (distCenter > 0.9) {
        wz = (distCenter - 0.9) * 0.85 + Math.sin(wx * 1.5) * 0.35;
      }
      wCoords.setZ(i, wz);
    }
    wireframeGridGeom.computeVertexNormals();
    const mountainGridMesh = new THREE.Mesh(
      wireframeGridGeom,
      new THREE.MeshBasicMaterial({ color: 0xd946ef, wireframe: true, transparent: true, opacity: 0.22 })
    );
    mountainGridMesh.rotation.x = -Math.PI / 2;
    mountainGridMesh.position.set(0, -1.84, -1.5);
    retroGroup.add(mountainGridMesh);


    // --- Theme 5 Scenery: Floating In Space ---
    const floatingGroup = new THREE.Group();
    scene.add(floatingGroup);

    const asteroids = new THREE.Group();
    const asteroidQty = 12;
    for (let i = 0; i < asteroidQty; i++) {
      const astSize = Math.random() * 0.14 + 0.05;
      const astGeom = new THREE.DodecahedronGeometry(astSize, 1);
      const astPos = astGeom.attributes.position;
      for (let j = 0; j < astPos.count; j++) {
        astPos.setX(j, astPos.getX(j) * (1 + (Math.random() - 0.5) * 0.28));
        astPos.setY(j, astPos.getY(j) * (1 + (Math.random() - 0.5) * 0.28));
        astPos.setZ(j, astPos.getZ(j) * (1 + (Math.random() - 0.5) * 0.28));
      }
      astGeom.computeVertexNormals();
      const astMesh = new THREE.Mesh(
        astGeom,
        new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9, metalness: 0.12, flatShading: true })
      );

      const theta = Math.random() * Math.PI * 2;
      const rad = Math.random() * 1.55 + 1.25;
      astMesh.position.set(
        Math.cos(theta) * rad,
        (Math.random() - 0.5) * 3.2,
        (Math.random() - 0.5) * 2.2 - 0.4
      );

      astMesh.userData = {
        rotX: (Math.random() - 0.5) * 0.65,
        rotY: (Math.random() - 0.5) * 0.65,
        bobSpeed: Math.random() * 0.6 + 0.35,
        bobAmt: Math.random() * 0.12 + 0.04,
        startY: astMesh.position.y,
      };
      asteroids.add(astMesh);
    }
    floatingGroup.add(asteroids);


    // --- Theme 6 Scenery: Terminal HUD ---
    const terminalGroup = new THREE.Group();
    scene.add(terminalGroup);

    const terminalPlatform = new THREE.Group();
    terminalPlatform.position.y = -1.85;

    for (let i = 1; i <= 3; i++) {
      const hudR = i * 0.44;
      const hudRingMesh = new THREE.Mesh(
        new THREE.RingGeometry(hudR - 0.012, hudR + 0.012, 32),
        new THREE.MeshBasicMaterial({ color: 0x22c55e, transparent: true, opacity: 0.48, side: THREE.DoubleSide })
      );
      hudRingMesh.rotation.x = Math.PI / 2;
      terminalPlatform.add(hudRingMesh);
    }

    const radarSweepMesh = new THREE.Mesh(
      new THREE.RingGeometry(0.01, 1.35, 32, 1, 0, Math.PI * 0.22),
      new THREE.MeshBasicMaterial({ color: 0x22c55e, transparent: true, opacity: 0.16, side: THREE.DoubleSide })
    );
    radarSweepMesh.rotation.x = Math.PI / 2;
    terminalPlatform.add(radarSweepMesh);
    terminalGroup.add(terminalPlatform);


    // ---------- Interaction and Physics Configurations ----------
    const state = {
      pointerX: 0,
      pointerY: 0,
      hasPointer: false,
      lastX: 0,
      lastY: 0,
      velX: 0,
      velY: 0,
      spinY: 0.3, // proud 3/4 standing default yaw
      tiltX: -0.04, // slight forward pitch
      idleTimer: 0,
      headYawTarget: 0,
      headPitchTarget: 0,
      headYaw: 0,
      headPitch: 0,
    };

    const dom = renderer.domElement;
    dom.style.touchAction = 'none';
    dom.style.cursor = 'grab';

    const onPointerMove = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      state.pointerX = nx;
      state.pointerY = ny;
      state.hasPointer = true;
      state.idleTimer = 0;

      if (isDraggingRef.current) {
        const dx = e.clientX - state.lastX;
        const dy = e.clientY - state.lastY;
        
        state.spinY += dx * 0.012;
        state.tiltX = THREE.MathUtils.clamp(state.tiltX + dy * 0.004, -0.35, 0.35);
        
        state.velX = dx * 0.012;
        state.velY = dy * 0.004;
        
        state.lastX = e.clientX;
        state.lastY = e.clientY;
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true;
      setIsDragging(true);
      state.lastX = e.clientX;
      state.lastY = e.clientY;
      state.velX = 0;
      state.velY = 0;
      dom.style.cursor = 'grabbing';
      dom.setPointerCapture(e.pointerId);
    };

    const endDrag = (e: PointerEvent) => {
      isDraggingRef.current = false;
      setIsDragging(false);
      dom.style.cursor = 'grab';
      try { dom.releasePointerCapture(e.pointerId); } catch { /* noop */ }
    };

    const onPointerLeave = () => {
      state.hasPointer = false;
    };

    dom.addEventListener('pointermove', onPointerMove);
    dom.addEventListener('pointerdown', onPointerDown);
    dom.addEventListener('pointerup', endDrag);
    dom.addEventListener('pointercancel', endDrag);
    dom.addEventListener('pointerleave', onPointerLeave);


    // Lighting configurations interpolated smoothly between environments
    const lightConfigs = {
      neon_grid: {
        keyColor: 0xffffff, keyInt: 1.6,
        rimColor: 0x00f0ff, rimInt: 6.0,
        fillColor: 0xa855f7, fillInt: 4.5,
      },
      nebula: {
        keyColor: 0xfecdd3, keyInt: 2.0,
        rimColor: 0x8b5cf6, rimInt: 8.0,
        fillColor: 0xec4899, fillInt: 6.0,
      },
      hologram: {
        keyColor: 0xe0f2fe, keyInt: 1.6,
        rimColor: 0x06b6d4, rimInt: 10.0,
        fillColor: 0x3b82f6, fillInt: 7.0,
      },
      retro: {
        keyColor: 0xffedd5, keyInt: 2.0,
        rimColor: 0xec4899, rimInt: 9.0,
        fillColor: 0x6366f1, fillInt: 6.0,
      },
      floating: {
        keyColor: 0xf8fafc, keyInt: 1.8,
        rimColor: 0x0284c7, rimInt: 5.5,
        fillColor: 0x475569, fillInt: 3.5,
      },
      terminal: {
        keyColor: 0xf0fdf4, keyInt: 1.6,
        rimColor: 0x22c55e, rimInt: 10.0,
        fillColor: 0x15803d, fillInt: 5.0,
      },
    };


    // ---------- Animation Loop ----------
    const clock = new THREE.Clock();
    let raf = 0;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.getElapsedTime();

      const activeTheme = activeThemeRef.current;

      // Toggle scenery nodes based on activeTheme
      neonGridGroup.visible = (activeTheme === 'neon_grid');
      nebulaGroup.visible = (activeTheme === 'nebula');
      hologramGroup.visible = (activeTheme === 'hologram');
      retroGroup.visible = (activeTheme === 'retro');
      floatingGroup.visible = (activeTheme === 'floating');
      terminalGroup.visible = (activeTheme === 'terminal');

      // --- Morph Lighting smoothly ---
      const activeL = lightConfigs[activeTheme] || lightConfigs.neon_grid;
      const targetKeyColor = new THREE.Color(activeL.keyColor);
      const targetRimColor = new THREE.Color(activeL.rimColor);
      const targetFillColor = new THREE.Color(activeL.fillColor);

      keyLight.color.lerp(targetKeyColor, 0.08);
      cyanRim.color.lerp(targetRimColor, 0.08);
      purpleFill.color.lerp(targetFillColor, 0.08);

      keyLight.intensity += (activeL.keyInt - keyLight.intensity) * 0.08;
      cyanRim.intensity += (activeL.rimInt - cyanRim.intensity) * 0.08;
      purpleFill.intensity += (activeL.fillInt - purpleFill.intensity) * 0.08;

      // --- Elastic Floating Physics ---
      if (activeTheme === 'floating') {
        const subject = modelRoot.visible ? modelRoot : astronaut;
        subject.position.y = -1.8 + Math.sin(t * 0.8) * 0.12;
        subject.rotation.z = Math.sin(t * 0.6) * 0.05; // zero-g roll drift
      } else {
        const subject = modelRoot.visible ? modelRoot : astronaut;
        subject.position.y = -1.8 + Math.sin(t * 1.1) * 0.05;
        subject.rotation.z = 0;
      }

      // --- Head tracking ---
      if (state.hasPointer && !isDraggingRef.current) {
        state.headYawTarget = THREE.MathUtils.clamp(state.pointerX * 0.5, -0.45, 0.45);
        state.headPitchTarget = THREE.MathUtils.clamp(-state.pointerY * 0.3, -0.25, 0.3);
      } else if (!state.hasPointer) {
        state.headYawTarget = Math.sin(t * 0.35) * 0.15;
        state.headPitchTarget = Math.sin(t * 0.5) * 0.05;
      }
      state.headYaw += (state.headYawTarget - state.headYaw) * Math.min(dt * 6, 1);
      state.headPitch += (state.headPitchTarget - state.headPitch) * Math.min(dt * 6, 1);
      
      head.rotation.y = state.headYaw;
      head.rotation.x = state.headPitch;

      // --- Drag rotation & Momentum decaying ---
      if (!isDraggingRef.current) {
        state.idleTimer += dt;
        state.velX *= 0.94;
        state.velY *= 0.94;
        
        state.spinY += state.velX;
        state.tiltX += state.velY;
        
        if (state.idleTimer > 1.8) {
          if (activeTheme === 'floating') {
            state.spinY += dt * 0.08; // Slower drifting spin
            state.tiltX += (Math.sin(t * 0.5) * 0.04 - state.tiltX) * Math.min(dt * 1.5, 1);
          } else {
            state.spinY += dt * 0.18; // Standard elegant orbit
            state.tiltX += (-0.04 - state.tiltX) * Math.min(dt * 2, 1);
          }
        }
      }

      const subject = modelRoot.visible ? modelRoot : astronaut;
      subject.rotation.y = state.spinY;
      subject.rotation.x = state.tiltX;

      // --- Environmental update cycles ---
      const pulseScalar = 1 + Math.sin(t * 1.1) * 0.02;
      shadow.scale.setScalar(pulseScalar);

      if (activeTheme === 'neon_grid') {
        platformRing1.scale.setScalar(pulseScalar);
        platformRing2.scale.setScalar(pulseScalar);
      }

      if (activeTheme === 'hologram') {
        holoBeamsGroup.children.forEach((beam) => {
          beam.position.y += beam.userData.speedY * dt;
          if (beam.position.y > 1.2) {
            beam.position.y = -1.84 - beam.userData.height / 2;
          }
        });
      }

      if (activeTheme === 'floating') {
        asteroids.children.forEach((ast) => {
          ast.rotation.x += ast.userData.rotX * dt;
          ast.rotation.y += ast.userData.rotY * dt;
          ast.position.y = ast.userData.startY + Math.sin(t * ast.userData.bobSpeed) * ast.userData.bobAmt;
        });
      }

      if (activeTheme === 'terminal') {
        radarSweepMesh.rotation.z -= dt * 1.35;
      }

      renderer.render(scene, camera);
    };
    animate();

    // ---------- Cleanup ----------
    return () => {
      isDisposed = true;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      dom.removeEventListener('pointermove', onPointerMove);
      dom.removeEventListener('pointerdown', onPointerDown);
      dom.removeEventListener('pointerup', endDrag);
      dom.removeEventListener('pointercancel', endDrag);
      dom.removeEventListener('pointerleave', onPointerLeave);

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });

      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [modelUrl]);

  return (
    <div
      ref={mountRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative cursor-grab active:cursor-grabbing select-none transition-transform duration-500 overflow-visible ${className}`}
      style={{ touchAction: 'none' }}
      aria-label="Interactive 3D hero model - drag to spin"
      role="img"
    >
      {/* Dynamic Cyber Label Indicator */}
      <div
        className={`absolute bottom-[-16px] left-1/2 -translate-x-1/2 bg-black/95 border border-purple-500/40 text-[9px] font-mono tracking-[0.2em] font-black px-4 py-1.5 rounded-md shadow-2xl uppercase text-purple-400 select-none pointer-events-none transition-all duration-300 z-30 ${
          isHovered
            ? 'opacity-100 scale-100 translate-y-[-2px] border-purple-400/80 shadow-[0_0_20px_rgba(168,85,247,0.4)]'
            : 'opacity-65 scale-95 translate-y-0'
        }`}
      >
        {modelStatus === 'loading'
          ? '• MODEL LOADING •'
          : modelStatus === 'error'
            ? '• MODEL FALLBACK •'
            : isDragging
              ? '• ORBIT ACTIVE •'
              : '• DRAG TO SPIN •'}
      </div>
    </div>
  );
};

export default PixelAstronautHero3D;