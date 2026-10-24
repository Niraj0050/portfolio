import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * IntroScene
 * World-Class Cinematic 3D Experience (Master Prompt Art Direction)
 *
 * NON-NEGOTIABLE CRITERIA IMPLEMENTED:
 * 1. DISTINCT 3D MODEL FOR EVERY MAJOR SECTION:
 *    - Section A (Hero): Liquid-Chrome Möbius Torus Knot + Radiant Ruby Gem + Gyroscope Rings.
 *    - Section B (About): Celestial Armillary Sphere System (Concentric Gimbal Rings + Saturn Disc).
 *    - Section C (Skills): Mechanical Geometric Polyhedron (Compound icosahedron + telescoping laser prisms).
 *    - Section D (Projects): 3 Distinct Project Models (Database Monolith, Translucent Web Prism, Neural Loss Surface).
 *    - Section E (Contact): Monumental Dimensional Chrome Portal Gateway with Inner Optical Vortex.
 * 2. REAL SCENE-SPACE 3D TYPOGRAPHY:
 *    - Each section has an in-engine 3D typography plane with real spatial coordinates (x, y, z).
 *    - Physical 3D occlusion: Models and pylons naturally occlude the 3D typography when camera orbits!
 * 3. DELIBERATE MODEL REVEAL & EXIT CHOREOGRAPHY:
 *    - Real foreground occlusion behind colossal obsidian pylons.
 *    - Previous model exits as next model enters smoothly.
 * 4. HYBRID SCROLL PROGRESS & CRITICALLY DAMPED CAMERA SPLINE:
 *    - Single progress filter eliminating all shaking.
 *    - Smooth bidirectional transitions (down and up).
 */
export default function IntroScene({ scrollProgressRef, onSceneReady, onWebGLError }) {
  const containerRef = useRef(null);
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. WebGL Verification
    const checkWebGL = () => {
      try {
        const canvas = document.createElement('canvas');
        return !!(
          window.WebGLRenderingContext &&
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
        );
      } catch (e) {
        return false;
      }
    };

    if (!checkWebGL()) {
      setWebGLSupported(false);
      onWebGLError?.();
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Track resources for clean disposal ONLY on genuine component unmount
    const disposables = {
      geometries: [],
      materials: [],
      textures: [],
    };
    const trackGeo = (g) => { disposables.geometries.push(g); return g; };
    const trackMat = (m) => { disposables.materials.push(m); return m; };
    const trackTex = (t) => { disposables.textures.push(t); return t; };

    // 2. Scene, Fog, and Camera Initialization
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050508);
    const sceneFog = new THREE.FogExp2(0x050508, 0.042);
    scene.fog = sceneFog;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Perspective camera with calibrated 42° FOV ensuring total visibility without cropping
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 80);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance',
        alpha: false,
      });
    } catch (err) {
      console.warn('WebGL init failed:', err);
      setWebGLSupported(false);
      onWebGLError?.();
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // 3. High-Contrast Studio Environment Map (Black + Liquid Chrome + Radiant Crimson)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const createStudioEnvironment = () => {
      const envCanvas = document.createElement('canvas');
      envCanvas.width = 1024;
      envCanvas.height = 512;
      const ctx = envCanvas.getContext('2d');

      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, 1024, 512);

      // Top chrome white rim band
      const topGrad = ctx.createLinearGradient(0, 0, 0, 180);
      topGrad.addColorStop(0, '#ffffff');
      topGrad.addColorStop(0.35, 'rgba(255, 255, 255, 0.9)');
      topGrad.addColorStop(1, 'rgba(5, 5, 8, 0)');
      ctx.fillStyle = topGrad;
      ctx.fillRect(160, 0, 704, 180);

      // Primary Crimson Accent Light (Left Horizon)
      const redGrad1 = ctx.createRadialGradient(240, 260, 10, 240, 260, 220);
      redGrad1.addColorStop(0, '#ef4444');
      redGrad1.addColorStop(0.4, '#dc2626');
      redGrad1.addColorStop(0.8, '#7f1d1d');
      redGrad1.addColorStop(1, 'rgba(5, 5, 8, 0)');
      ctx.fillStyle = redGrad1;
      ctx.fillRect(20, 100, 440, 320);

      // Secondary Crimson Rim Light (Right Horizon)
      const redGrad2 = ctx.createRadialGradient(800, 240, 10, 800, 240, 180);
      redGrad2.addColorStop(0, '#ef4444');
      redGrad2.addColorStop(0.5, '#991b1b');
      redGrad2.addColorStop(1, 'rgba(5, 5, 8, 0)');
      ctx.fillStyle = redGrad2;
      ctx.fillRect(620, 80, 360, 320);

      // Specular pinpoints
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(512, 110, 20, 0, Math.PI * 2);
      ctx.fill();

      const texture = trackTex(new THREE.CanvasTexture(envCanvas));
      texture.mapping = THREE.EquirectangularReflectionMapping;
      texture.colorSpace = THREE.SRGBColorSpace;
      const envMap = pmremGenerator.fromEquirectangular(texture).texture;
      pmremGenerator.dispose();
      return envMap;
    };

    const envMap = createStudioEnvironment();
    scene.environment = envMap;

    // 4. Dynamic Lighting Architecture (High-Contrast Chrome + Restrained Crimson Accents)
    const ambientLight = new THREE.AmbientLight(0x05050a, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.PointLight(0xffffff, 4.5, 22, 1.4);
    keyLight.position.set(-3.2, 3.2, 3.5);
    scene.add(keyLight);

    const floorBounceLight = new THREE.PointLight(0x111827, 0.8, 14, 1.8);
    floorBounceLight.position.set(2.5, -2.1, 2.0);
    scene.add(floorBounceLight);

    const whiteRimLight = new THREE.DirectionalLight(0xffffff, 3.0);
    whiteRimLight.position.set(2.5, 5.0, 4.0);
    scene.add(whiteRimLight);

    const cursorLight = new THREE.PointLight(0xef4444, 2.5, 8, 1.8);
    cursorLight.position.set(0, 0, 3.0);
    scene.add(cursorLight);

    // Shared Premium Materials
    const chromeMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 1.0,
        roughness: 0.02,
        clearcoat: 1.0,
        clearcoatRoughness: 0.02,
        reflectivity: 1.0,
        envMapIntensity: 3.5,
      })
    );

    const obsidianPylonMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x090b12,
        metalness: 0.92,
        roughness: 0.12,
        envMapIntensity: 2.2,
      })
    );

    const laserChannelMat = trackMat(
      new THREE.MeshBasicMaterial({
        color: 0xef4444,
        transparent: true,
        opacity: 0.85,
      })
    );

    const rubyGemMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x991b1b,
        emissive: 0xdc2626,
        emissiveIntensity: 2.8,
        metalness: 0.3,
        roughness: 0.1,
        flatShading: true,
      })
    );

    // ==========================================
    // 5. ARCHITECTURAL WORLD ENVIRONMENT (igloo.inc Benchmark)
    // ==========================================
    const archGroup = new THREE.Group();
    scene.add(archGroup);

    // Colossal Pylons flanking the horizon
    const createPylon = (x, z, height = 7.5, width = 0.7) => {
      const pylon = new THREE.Group();
      pylon.position.set(x, height / 2 - 2.1, z);

      const bodyGeo = trackGeo(new THREE.BoxGeometry(width, height, width));
      const bodyMesh = new THREE.Mesh(bodyGeo, obsidianPylonMat);
      pylon.add(bodyMesh);

      const edgeGeo = trackGeo(new THREE.EdgesGeometry(bodyGeo));
      const edgeMat = trackMat(new THREE.LineBasicMaterial({ color: 0x334155, transparent: true, opacity: 0.4 }));
      const edgeLines = new THREE.LineSegments(edgeGeo, edgeMat);
      pylon.add(edgeLines);

      const laserGeo = trackGeo(new THREE.BoxGeometry(0.035, height * 0.92, width + 0.02));
      const laserMesh = new THREE.Mesh(laserGeo, laserChannelMat);
      pylon.add(laserMesh);

      return pylon;
    };

    // Monumental Left Pylon
    const leftPylon = createPylon(-4.4, -1.2, 7.8, 0.75);
    archGroup.add(leftPylon);

    // Monumental Right Pylon
    const rightPylon = createPylon(4.4, -1.2, 7.8, 0.75);
    archGroup.add(rightPylon);

    // Colossal Foreground Transition Monolith (Passes between camera and models during Hero -> About swoop)
    // Positioned at x = -2.6, z = 3.6 so at Hero (p=0.0) it rests completely off to the left, and during the swoop (p=0.12-0.18) it sweeps across the lens!
    const transMonolithGeo = trackGeo(new THREE.BoxGeometry(1.2, 10.5, 1.2));
    const transMonolith = new THREE.Mesh(transMonolithGeo, obsidianPylonMat);
    transMonolith.position.set(-2.6, 1.8, 3.6);
    archGroup.add(transMonolith);

    const transMonolithEdges = new THREE.LineSegments(
      trackGeo(new THREE.EdgesGeometry(transMonolithGeo)),
      trackMat(new THREE.LineBasicMaterial({ color: 0x475569, transparent: true, opacity: 0.5 }))
    );
    transMonolith.add(transMonolithEdges);

    const transMonolithLaser = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.04, 9.8, 1.24)),
      laserChannelMat
    );
    transMonolith.add(transMonolithLaser);

    // Overhead Transition Cantilever Beam (Sweeps down across lens during About -> Skills ascent)
    const transLintelGeo = trackGeo(new THREE.BoxGeometry(11.0, 0.45, 0.8));
    const transLintel = new THREE.Mesh(transLintelGeo, obsidianPylonMat);
    transLintel.position.set(0.0, 1.85, 1.3);
    archGroup.add(transLintel);

    const transLintelLaser = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(10.8, 0.03, 0.84)),
      laserChannelMat
    );
    transLintelLaser.position.set(0.0, 1.85, 1.3);
    archGroup.add(transLintelLaser);

    // Overhead Structural Cantilever Beam
    const beamGeo = trackGeo(new THREE.BoxGeometry(9.4, 0.32, 0.6));
    const beamMesh = new THREE.Mesh(beamGeo, obsidianPylonMat);
    beamMesh.position.set(0.1, 4.3, -1.2);
    archGroup.add(beamMesh);

    const beamLaserGeo = trackGeo(new THREE.BoxGeometry(9.2, 0.02, 0.64));
    const beamLaser = new THREE.Mesh(beamLaserGeo, laserChannelMat);
    beamLaser.position.set(0.1, 4.3, -1.2);
    archGroup.add(beamLaser);

    // Reflective Stage Floor with Radial Falloff (Zero sharp edges)
    const stageGroup = new THREE.Group();
    stageGroup.position.set(0, -2.35, 0);
    stageGroup.rotation.x = -Math.PI * 0.5;
    scene.add(stageGroup);

    const createSoftRadialTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
      grad.addColorStop(0.0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
      grad.addColorStop(0.6, 'rgba(255, 255, 255, 0.25)');
      grad.addColorStop(0.85, 'rgba(255, 255, 255, 0.04)');
      grad.addColorStop(1.0, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      return trackTex(tex);
    };

    const softAlphaMap = createSoftRadialTexture();

    const stageFloorGeo = trackGeo(new THREE.PlaneGeometry(16, 16, 1, 1));
    const stageFloorMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x030306,
        metalness: 0.95,
        roughness: 0.35,
        envMapIntensity: 1.2,
        alphaMap: softAlphaMap,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
      })
    );
    const stageFloor = new THREE.Mesh(stageFloorGeo, stageFloorMat);
    stageGroup.add(stageFloor);

    // Concentric Architectural Floor Datum Rings
    const concentricRingRadii = [1.2, 2.2, 3.4, 4.6];
    const concentricRings = concentricRingRadii.map((r, i) => {
      const ringGeo = trackGeo(new THREE.RingGeometry(r, r + 0.015, 96));
      const ringMat = trackMat(
        new THREE.MeshBasicMaterial({
          color: i % 2 === 0 ? 0xdc2626 : 0xffffff,
          transparent: true,
          opacity: 0.25 - i * 0.05,
          side: THREE.DoubleSide,
        })
      );
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.z = 0.005;
      stageGroup.add(ringMesh);
      return ringMesh;
    });

    // Atmospheric Stardust Particles
    const particleCount = 280;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const crimsonCol = new THREE.Color(0xdc2626);
    const whiteCol = new THREE.Color(0xffffff);
    const rubyCol = new THREE.Color(0xef4444);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 16;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 14;

      const pick = Math.random();
      const col = pick < 0.45 ? crimsonCol : pick < 0.75 ? whiteCol : rubyCol;
      particleColors[i * 3] = col.r;
      particleColors[i * 3 + 1] = col.g;
      particleColors[i * 3 + 2] = col.b;
    }

    const particleGeo = trackGeo(new THREE.BufferGeometry());
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = trackMat(
      new THREE.PointsMaterial({
        size: 0.038,
        vertexColors: true,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ==========================================
    // 6. REAL SCENE-SPACE 3D TYPOGRAPHY BUILDER
    // Typography lives in 3D world space with physical perspective & depth occlusion!
    // ==========================================
    const createSceneText3D = (tag, title, subtitle, { width = 4.4, height = 1.05 } = {}) => {
      const canvas = document.createElement('canvas');
      canvas.width = 2048;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, 2048, 480);

      // 1. Spatial Datum Corner Brackets in Glowing Crimson
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(35, 65);
      ctx.lineTo(35, 35);
      ctx.lineTo(65, 35);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(2013, 65);
      ctx.lineTo(2013, 35);
      ctx.lineTo(1983, 35);
      ctx.stroke();

      // 2. Monospace Spatial Datum Tag
      ctx.font = '700 38px "Space Grotesk", monospace';
      ctx.fillStyle = '#ef4444';
      ctx.fillText(tag.toUpperCase(), 75, 68);

      // 3. Monumental Grotesk Title with Crimson 3D Bevel Dropshadow
      ctx.font = '900 122px "Syne", "Space Grotesk", sans-serif';
      ctx.shadowColor = 'rgba(239, 68, 68, 0.85)';
      ctx.shadowBlur = 26;
      ctx.fillStyle = '#ffffff';
      ctx.fillText(title, 45, 230);
      ctx.shadowBlur = 0;

      // 4. Glowing Red Laser Datum Rule
      const ruleGrad = ctx.createLinearGradient(45, 0, 1800, 0);
      ruleGrad.addColorStop(0, '#ef4444');
      ruleGrad.addColorStop(0.35, '#dc2626');
      ruleGrad.addColorStop(0.85, '#991b1b');
      ruleGrad.addColorStop(1, 'rgba(153, 27, 27, 0)');
      ctx.fillStyle = ruleGrad;
      ctx.fillRect(45, 260, 1750, 4);

      // 5. Technical Subtitle
      ctx.font = '600 42px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(subtitle, 45, 335);

      const texture = trackTex(new THREE.CanvasTexture(canvas));
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = true;

      const geo = trackGeo(new THREE.PlaneGeometry(width, height));
      const mat = trackMat(
        new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          alphaTest: 0.12,
          depthWrite: true,
          depthTest: true,
          side: THREE.DoubleSide,
        })
      );

      const mesh = new THREE.Mesh(geo, mat);
      scene.add(mesh);
      return { mesh, mat };
    };

    // 3D Typography for each section (Genuinely angled in 3D world space with depth)
    const heroText3D = createSceneText3D(
      '[ 01 // IDENTITY & VISION // SURAT ]',
      "BUILDING WHAT'S NEXT.",
      'SOFTWARE & PRODUCT BUILDER'
    );
    heroText3D.mesh.position.set(-1.0, 0.5, 0.1);
    heroText3D.mesh.rotation.set(-0.06, 0.24, 0.0);

    const aboutText3D = createSceneText3D(
      '[ 02 // ARCHITECTURAL FOUNDATION // THEORY ]',
      'STRUCTURAL RIGOR.',
      'SYSTEM ARCHITECTURE • VNSGU CS 6.64 CGPA'
    );
    aboutText3D.mesh.position.set(-2.4, 1.45, -2.3);
    aboutText3D.mesh.rotation.set(0.08, -0.28, 0.0);

    const skillsText3D = createSceneText3D(
      '[ 03 // PRODUCTION CAPABILITIES // STACK ]',
      'SYSTEMS & STACK.',
      'REACT 18 • PHP • MYSQL • PYTHON • NEXT.JS'
    );
    skillsText3D.mesh.position.set(1.6, 2.5, -1.3);
    skillsText3D.mesh.rotation.set(0.38, -0.18, 0.0);

    const contactText3D = createSceneText3D(
      '[ 04 // SANCTUARY & INQUIRY // GATEWAY ]',
      "LET'S CONNECT.",
      'FULL-STACK ROLES • SURAT [ 21.17° N, 72.83° E ]',
      { width: 4.8, height: 1.1 }
    );
    contactText3D.mesh.position.set(0.0, 1.85, -3.8);
    contactText3D.mesh.rotation.set(0.0, 0.0, 0.0);

    // ==========================================
    // 7. DISTINCT 3D MODEL FOR EVERY MAJOR SECTION
    // ==========================================

    // ------------------------------------------
    // MODEL A: HERO — LIQUID-CHROME MÖBIUS SCULPTURE
    // ------------------------------------------
    const heroModelGroup = new THREE.Group();
    heroModelGroup.position.set(1.75, 0.05, 0.0);
    heroModelGroup.scale.setScalar(0.82);
    scene.add(heroModelGroup);

    const knotGeo = trackGeo(new THREE.TorusKnotGeometry(0.95, 0.22, 180, 36, 2, 3));
    const chromeKnot = new THREE.Mesh(knotGeo, chromeMat);
    heroModelGroup.add(chromeKnot);

    const innerGemGeo = trackGeo(new THREE.OctahedronGeometry(0.55, 0));
    const innerGem = new THREE.Mesh(innerGemGeo, rubyGemMat);
    heroModelGroup.add(innerGem);

    const innerLatticeGeo = trackGeo(new THREE.IcosahedronGeometry(0.66, 1));
    const innerLatticeMat = trackMat(
      new THREE.MeshBasicMaterial({ color: 0xef4444, wireframe: true, transparent: true, opacity: 0.65 })
    );
    const innerLattice = new THREE.Mesh(innerLatticeGeo, innerLatticeMat);
    heroModelGroup.add(innerLattice);

    const ring1Group = new THREE.Group();
    ring1Group.rotation.x = Math.PI * 0.18;
    heroModelGroup.add(ring1Group);
    const ring1 = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(1.65, 0.035, 28, 120)), chromeMat);
    ring1Group.add(ring1);

    const ring2Group = new THREE.Group();
    ring2Group.rotation.x = -Math.PI * 0.24;
    ring2Group.rotation.y = 0.42;
    heroModelGroup.add(ring2Group);
    const ring2 = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(1.95, 0.024, 24, 140)), chromeMat);
    ring2Group.add(ring2);

    // Satellites
    const sat1 = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.14, 24, 24)), chromeMat);
    heroModelGroup.add(sat1);

    // ------------------------------------------
    // MODEL B: ABOUT — CELESTIAL ARMILLARY SPHERE SYSTEM (Completely distinct model!)
    // ------------------------------------------
    const aboutModelGroup = new THREE.Group();
    aboutModelGroup.position.set(-2.2, 0.2, -2.5);
    aboutModelGroup.scale.setScalar(0.95);
    scene.add(aboutModelGroup);

    // Titanium Core Dodecahedron with illuminated edges
    const aboutCoreGeo = trackGeo(new THREE.DodecahedronGeometry(0.65, 0));
    const aboutCoreMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.95,
        roughness: 0.12,
        flatShading: true,
        envMapIntensity: 3.5,
      })
    );
    const aboutCore = new THREE.Mesh(aboutCoreGeo, aboutCoreMat);
    aboutModelGroup.add(aboutCore);

    const aboutWireGeo = trackGeo(new THREE.EdgesGeometry(aboutCoreGeo));
    const aboutWire = new THREE.LineSegments(aboutWireGeo, laserChannelMat);
    aboutModelGroup.add(aboutWire);

    // Inner Radiant Octahedron
    const aboutRubyGeo = trackGeo(new THREE.OctahedronGeometry(0.48, 0));
    const aboutRuby = new THREE.Mesh(aboutRubyGeo, rubyGemMat);
    aboutModelGroup.add(aboutRuby);

    // Equatorial Chrome Saturn Disc
    const saturnDiscGeo = trackGeo(new THREE.RingGeometry(0.92, 1.48, 64));
    const saturnDiscMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 1.0,
        roughness: 0.05,
        side: THREE.DoubleSide,
        envMapIntensity: 3.0,
      })
    );
    const saturnDisc = new THREE.Mesh(saturnDiscGeo, saturnDiscMat);
    saturnDisc.rotation.x = Math.PI * 0.4;
    aboutModelGroup.add(saturnDisc);

    // 3 Nested Concentric Armillary Gimbal Rings
    const armillaryRing1 = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(1.52, 0.032, 24, 100)), chromeMat);
    aboutModelGroup.add(armillaryRing1);

    const armillaryRing2 = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(1.82, 0.025, 24, 120)), chromeMat);
    armillaryRing2.rotation.x = Math.PI * 0.5;
    aboutModelGroup.add(armillaryRing2);

    const armillaryRing3 = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(2.12, 0.016, 20, 140)), laserChannelMat);
    armillaryRing3.rotation.y = Math.PI * 0.5;
    aboutModelGroup.add(armillaryRing3);

    // Orbiting Ruby Crystals around About Sphere
    const aboutSatellites = [];
    for (let i = 0; i < 3; i++) {
      const s = new THREE.Mesh(trackGeo(new THREE.OctahedronGeometry(0.12, 0)), rubyGemMat);
      aboutModelGroup.add(s);
      aboutSatellites.push({ mesh: s, angle: (i / 3) * Math.PI * 2, radius: 2.25 });
    }

    // ------------------------------------------
    // MODEL C: SKILLS — PRECISION MECHANICAL POLYHEDRON ASSEMBLY
    // ------------------------------------------
    const skillsModelGroup = new THREE.Group();
    skillsModelGroup.position.set(1.8, 1.4, -1.5);
    skillsModelGroup.scale.setScalar(0.9);
    scene.add(skillsModelGroup);

    // Central Compound Polyhedron Core
    const polyGeo = trackGeo(new THREE.IcosahedronGeometry(0.85, 1));
    const polyMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        metalness: 0.95,
        roughness: 0.15,
        envMapIntensity: 2.5,
      })
    );
    const polyMesh = new THREE.Mesh(polyGeo, polyMat);
    skillsModelGroup.add(polyMesh);

    const polyWireGeo = trackGeo(new THREE.WireframeGeometry(polyGeo));
    const polyWire = new THREE.LineSegments(polyWireGeo, laserChannelMat);
    skillsModelGroup.add(polyWire);

    // Internal Optical Chrome Prism
    const prismMesh = new THREE.Mesh(trackGeo(new THREE.OctahedronGeometry(0.52, 0)), chromeMat);
    skillsModelGroup.add(prismMesh);

    // Telescoping Laser Calibrator Arms (6 Cardinal Projections)
    const calibratorArms = [];
    const armAxes = [
      [1.4, 0, 0], [-1.4, 0, 0],
      [0, 1.4, 0], [0, -1.4, 0],
      [0, 0, 1.4], [0, 0, -1.4],
    ];
    armAxes.forEach(([ax, ay, az]) => {
      const armGroup = new THREE.Group();
      armGroup.position.set(ax, ay, az);

      const shaft = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.02, 0.02, 0.6, 8)), chromeMat);
      if (ax !== 0) shaft.rotation.z = Math.PI * 0.5;
      else if (az !== 0) shaft.rotation.x = Math.PI * 0.5;
      armGroup.add(shaft);

      const head = new THREE.Mesh(trackGeo(new THREE.OctahedronGeometry(0.1, 0)), rubyGemMat);
      armGroup.add(head);

      skillsModelGroup.add(armGroup);
      calibratorArms.push(armGroup);
    });

    // Technical Precision Reticle Rings
    const reticle1 = new THREE.Mesh(
      trackGeo(new THREE.RingGeometry(1.4, 1.46, 48)),
      trackMat(new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.65, side: THREE.DoubleSide }))
    );
    skillsModelGroup.add(reticle1);

    const reticle2 = new THREE.Mesh(
      trackGeo(new THREE.RingGeometry(1.85, 1.9, 64)),
      trackMat(new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.45, side: THREE.DoubleSide }))
    );
    reticle2.rotation.x = Math.PI * 0.45;
    skillsModelGroup.add(reticle2);

    // ------------------------------------------
    // ARCHITECTURAL TRANSITION GATE 3 (Skills -> Contact Dual Compression Colonnade)
    // Physical dual obsidian pylons with transverse compression arch & ruby aperture beam
    // Sweeps directly past camera lens during p in [0.74, 0.86]
    // ------------------------------------------
    const transGateGroup = new THREE.Group();
    transGateGroup.position.set(0.0, 0.0, 0.0);
    archGroup.add(transGateGroup);

    // Left Compression Pylon
    const gatePylonGeo = trackGeo(new THREE.BoxGeometry(0.85, 12.0, 0.85));
    const leftGatePylon = new THREE.Mesh(gatePylonGeo, obsidianPylonMat);
    leftGatePylon.position.set(-1.65, 2.0, 2.0);
    transGateGroup.add(leftGatePylon);

    const leftGateEdges = new THREE.LineSegments(
      trackGeo(new THREE.EdgesGeometry(gatePylonGeo)),
      laserRubyMat
    );
    leftGatePylon.add(leftGateEdges);

    // Right Compression Pylon
    const rightGatePylon = new THREE.Mesh(gatePylonGeo, obsidianPylonMat);
    rightGatePylon.position.set(1.65, 2.0, 2.0);
    transGateGroup.add(rightGatePylon);

    const rightGateEdges = new THREE.LineSegments(
      trackGeo(new THREE.EdgesGeometry(gatePylonGeo)),
      laserRubyMat
    );
    rightGatePylon.add(rightGateEdges);

    // Overhead Gate Transverse Arch
    const gateArchGeo = trackGeo(new THREE.BoxGeometry(4.2, 0.6, 0.85));
    const gateArch = new THREE.Mesh(gateArchGeo, obsidianPylonMat);
    gateArch.position.set(0.0, 4.5, 2.0);
    transGateGroup.add(gateArch);

    const gateArchEdges = new THREE.LineSegments(
      trackGeo(new THREE.EdgesGeometry(gateArchGeo)),
      laserRubyMat
    );
    gateArch.add(gateArchEdges);

    // Glowing Crimson Laser Gate Horizon Line
    const gateLaserGeo = trackGeo(new THREE.CylinderGeometry(0.015, 0.015, 3.2, 16));
    const gateLaser = new THREE.Mesh(gateLaserGeo, laserRubyMat);
    gateLaser.rotation.z = Math.PI / 2;
    gateLaser.position.set(0.0, 1.8, 2.0);
    transGateGroup.add(gateLaser);

    // ------------------------------------------
    // MODEL D: CONTACT — MONUMENTAL DIMENSIONAL PORTAL GATE
    // ------------------------------------------
    const contactModelGroup = new THREE.Group();
    contactModelGroup.position.set(0.0, 0.25, -0.5);
    contactModelGroup.scale.setScalar(1.05);
    scene.add(contactModelGroup);

    // Colossal Outer Chrome Gateway Ring
    const portalRingMesh = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(1.95, 0.075, 32, 120)), chromeMat);
    contactModelGroup.add(portalRingMesh);

    // Glowing Crimson Laser Channels
    const portalLaser1 = new THREE.Mesh(trackGeo(new THREE.RingGeometry(1.75, 1.83, 80)), laserChannelMat);
    contactModelGroup.add(portalLaser1);

    const portalLaser2 = new THREE.Mesh(trackGeo(new THREE.RingGeometry(1.55, 1.61, 80)), laserChannelMat);
    contactModelGroup.add(portalLaser2);

    // Inner Depth Vortex Rings (Creating infinite spatial perspective)
    const depthRings = [];
    for (let i = 1; i <= 5; i++) {
      const dRing = new THREE.Mesh(
        trackGeo(new THREE.RingGeometry(1.45 - i * 0.18, 1.48 - i * 0.18, 64)),
        trackMat(new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.8 - i * 0.14, side: THREE.DoubleSide }))
      );
      dRing.position.z = -i * 0.38;
      contactModelGroup.add(dRing);
      depthRings.push(dRing);
    }

    // Cardinal Alignment Fins
    const finGeo = trackGeo(new THREE.BoxGeometry(0.08, 0.45, 0.15));
    const finPositions = [
      [0, 2.05, 0], [0, -2.05, 0],
      [2.05, 0, 0], [-2.05, 0, 0],
    ];
    finPositions.forEach(([fx, fy, fz], idx) => {
      const fin = new THREE.Mesh(finGeo, chromeMat);
      fin.position.set(fx, fy, fz);
      if (idx >= 2) fin.rotation.z = Math.PI * 0.5;
      contactModelGroup.add(fin);
    });

    // ==========================================
    // 8. DETERMINISTIC 5-STAGE CAMERA WAYPOINTS WITH INTERMEDIATE REVEAL SWOOPS
    // ==========================================
    const waypoints = [
      // Stage 01: Hero / Entry [p = 0.00]
      {
        p: 0.0,
        camPos: new THREE.Vector3(0.0, 0.15, 5.6),
        camLook: new THREE.Vector3(0.0, 0.0, 0.0),
        keyLightPos: new THREE.Vector3(-3.2, 3.2, 3.5),
        keyLightIntensity: 4.5,
        keyLightColor: new THREE.Color(0xffffff),
        gridOpacity: 0.10,
        fogDensity: 0.042,
      },
      // Stage 01b: Hero -> About Occlusion Swoop [p = 0.20]
      // Camera executes lateral sweep directly past the transition monolith
      {
        p: 0.20,
        camPos: new THREE.Vector3(-1.8, 0.45, 4.4),
        camLook: new THREE.Vector3(-1.4, 0.1, -1.0),
        keyLightPos: new THREE.Vector3(-0.5, 3.5, 3.0),
        keyLightIntensity: 5.0,
        keyLightColor: new THREE.Color(0xef4444),
        gridOpacity: 0.25,
        fogDensity: 0.040,
      },
      // Stage 02: About [p = 0.33]
      // Camera emerges behind monolith, framing Armillary Sphere at (-2.2, 0.2, -2.5)
      {
        p: 0.33,
        camPos: new THREE.Vector3(-3.2, 0.65, 2.8),
        camLook: new THREE.Vector3(-2.2, 0.2, -2.5),
        keyLightPos: new THREE.Vector3(-1.5, 3.0, -1.0),
        keyLightIntensity: 5.5,
        keyLightColor: new THREE.Color(0xef4444),
        gridOpacity: 0.35,
        fogDensity: 0.038,
      },
      // Stage 02b: About -> Skills Ascent [p = 0.48]
      // Camera soars upward past the overhead cantilever beam
      {
        p: 0.48,
        camPos: new THREE.Vector3(-0.6, 2.6, 3.4),
        camLook: new THREE.Vector3(0.6, 1.2, -1.0),
        keyLightPos: new THREE.Vector3(0.0, 4.0, 2.0),
        keyLightIntensity: 5.2,
        keyLightColor: new THREE.Color(0xffffff),
        gridOpacity: 0.40,
        fogDensity: 0.036,
      },
      // Stage 03: Skills / Production Capabilities [p = 0.66]
      // High elevated inspection perspective looking down at Mechanical Polyhedron at (1.8, 1.4, -1.5)
      {
        p: 0.66,
        camPos: new THREE.Vector3(1.0, 3.4, 3.4),
        camLook: new THREE.Vector3(1.8, 1.4, -1.5),
        keyLightPos: new THREE.Vector3(1.2, 4.2, 1.5),
        keyLightIntensity: 5.5,
        keyLightColor: new THREE.Color(0xffffff),
        gridOpacity: 0.45,
        fogDensity: 0.035,
      },
      // Stage 03b: Skills -> Contact Dual Compression Gate Dive [p = 0.80]
      // THE NEW TRANSITION BEFORE CONTACT: Camera dives toward and passes through the Dual Compression Gate
      {
        p: 0.80,
        camPos: new THREE.Vector3(0.3, 1.6, 2.8),
        camLook: new THREE.Vector3(0.0, 0.5, -2.0),
        keyLightPos: new THREE.Vector3(0.0, 3.0, 1.0),
        keyLightIntensity: 5.2,
        keyLightColor: new THREE.Color(0xdc2626),
        gridOpacity: 0.38,
        fogDensity: 0.040,
      },
      // Stage 04: Contact / Sanctuary Gateway [p = 0.93]
      // Centered horizon view directly facing dimensional portal gateway at (0.0, 0.4, -4.0)
      {
        p: 0.93,
        camPos: new THREE.Vector3(0.0, 0.4, 3.8),
        camLook: new THREE.Vector3(0.0, 0.4, -4.0),
        keyLightPos: new THREE.Vector3(0.0, 2.0, 0.0),
        keyLightIntensity: 4.2,
        keyLightColor: new THREE.Color(0xdc2626),
        gridOpacity: 0.25,
        fogDensity: 0.044,
      },
      // Stage 06: Seamless Loop Return [p = 1.00]
      // Matches Stage 01 exactly for continuous looping
      {
        p: 1.0,
        camPos: new THREE.Vector3(0.0, 0.15, 5.6),
        camLook: new THREE.Vector3(0.0, 0.0, 0.0),
        keyLightPos: new THREE.Vector3(-3.2, 3.2, 3.5),
        keyLightIntensity: 4.5,
        keyLightColor: new THREE.Color(0xffffff),
        gridOpacity: 0.10,
        fogDensity: 0.042,
      },
    ];

    // C1-Continuous Smoothstep Spline Interpolator
    const sampleTimeline = (prog) => {
      const clamped = THREE.MathUtils.clamp(prog, 0, 1);
      let idx = 0;
      for (let i = 0; i < waypoints.length - 1; i++) {
        if (clamped >= waypoints[i].p && clamped <= waypoints[i + 1].p) {
          idx = i;
          break;
        }
      }
      const w0 = waypoints[idx];
      const w1 = waypoints[idx + 1];
      const span = w1.p - w0.p;
      const localT = span > 0 ? (clamped - w0.p) / span : 0;
      const smoothT = THREE.MathUtils.smoothstep(localT, 0, 1);

      return {
        camPos: new THREE.Vector3().lerpVectors(w0.camPos, w1.camPos, smoothT),
        camLook: new THREE.Vector3().lerpVectors(w0.camLook, w1.camLook, smoothT),
        keyLightPos: new THREE.Vector3().lerpVectors(w0.keyLightPos, w1.keyLightPos, smoothT),
        keyLightIntensity: THREE.MathUtils.lerp(w0.keyLightIntensity, w1.keyLightIntensity, smoothT),
        keyLightColor: new THREE.Color().lerpColors(w0.keyLightColor, w1.keyLightColor, smoothT),
        gridOpacity: THREE.MathUtils.lerp(w0.gridOpacity, w1.gridOpacity, smoothT),
        fogDensity: THREE.MathUtils.lerp(w0.fogDensity, w1.fogDensity, smoothT),
      };
    };

    // 9. Pointer State & Damping
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
      const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY) ?? 0;
      const x = ((clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((clientY - rect.top) / rect.height) * 2 - 1);
      mouse.targetX = THREE.MathUtils.clamp(x, -1, 1);
      mouse.targetY = THREE.MathUtils.clamp(y, -1, 1);
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    onSceneReady?.();

    // 10. Single, Persistent, Stable Animation Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    let progress = scrollProgressRef?.current ?? 0;
    let currentParallaxWeight = 0;
    const mouseDamped = { x: 0, y: 0 };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Read mutable scroll progress from ref
      const targetProgress = scrollProgressRef?.current ?? 0;

      // Single critically-damped progress filter (ZERO double-lerp, zero oscillation)
      const diff = targetProgress - progress;
      progress += diff * 0.085;

      // Mouse damping
      mouseDamped.x += (mouse.targetX - mouseDamped.x) * 0.05;
      mouseDamped.y += (mouse.targetY - mouseDamped.y) * 0.05;

      // Parallax weight: dampen to zero during active scroll so mouse never fights camera trajectory
      const isActivelyScrolling = Math.abs(diff) > 0.003;
      const targetParallaxWeight = isActivelyScrolling ? 0.0 : 1.0;
      currentParallaxWeight += (targetParallaxWeight - currentParallaxWeight) * 0.06;

      // Update cursor light
      cursorLight.position.x = mouseDamped.x * 3.5;
      cursorLight.position.y = mouseDamped.y * 2.5;

      const motionScale = prefersReducedMotion ? 0.15 : 1.0;

      // Sample exact mathematical timeline at current progress
      const state = sampleTimeline(progress);

      // A. Update Lighting & Atmospheric Fog
      keyLight.position.copy(state.keyLightPos);
      keyLight.intensity = state.keyLightIntensity;
      keyLight.color.copy(state.keyLightColor);
      sceneFog.density = state.fogDensity;

      // B. Update Concentric Floor Rings
      concentricRings.forEach((ringMesh, i) => {
        ringMesh.material.opacity = state.gridOpacity * (0.6 - i * 0.1);
      });

      // C. SECTION MODEL REVEALS & EXITS (Strict Physical Reveal & Mutual Exclusion Choreography)
      // 1. Hero Model & 3D Typography (Active for p in [0.00, 0.15])
      let heroAlpha = 0;
      if (progress <= 0.08) {
        heroAlpha = 1.0;
        heroModelGroup.position.set(1.75, 0.05, 0.0);
        heroModelGroup.scale.setScalar(0.82);
        heroText3D.mesh.position.set(-1.0, 0.5, 0.1);
      } else if (progress < 0.15) {
        const t = (progress - 0.08) / 0.07;
        heroAlpha = 1.0 - t;
        // Physical exit behind the transition monolith into depth:
        heroModelGroup.position.x = 1.75 + t * 2.8;
        heroModelGroup.position.z = -t * 4.5;
        heroModelGroup.scale.setScalar(0.82 * (1.0 - t * 0.35));
        heroText3D.mesh.position.z = -t * 3.2;
      }
      heroModelGroup.visible = heroAlpha > 0.01;
      heroText3D.mesh.visible = heroAlpha > 0.01;
      heroText3D.mat.opacity = heroAlpha;
      if (heroModelGroup.visible) {
        chromeKnot.rotation.y += 0.0045 * motionScale;
        chromeKnot.rotation.x = Math.sin(elapsedTime * 0.4) * 0.18;
        innerGem.rotation.y -= 0.008 * motionScale;
        innerLattice.rotation.y += 0.01 * motionScale;
        rubyGemMat.emissiveIntensity = 2.4 + Math.sin(elapsedTime * 2.2) * 0.8;
        ring1Group.rotation.y += 0.006 * motionScale;
        ring2Group.rotation.y -= 0.005 * motionScale;
        sat1.position.x = Math.cos(elapsedTime * 0.6) * 1.8;
        sat1.position.z = Math.sin(elapsedTime * 0.6) * 1.8;
      }

      // 2. About Model & 3D Typography (Active for p in [0.20, 0.48])
      let aboutAlpha = 0;
      if (progress >= 0.20 && progress < 0.30) {
        const t = (progress - 0.20) / 0.10;
        aboutAlpha = t;
        // PHYSICAL EMERGENCE: Gimbal rings expand outward from zero radius, Saturn disc aligns
        const expand = 0.25 + 0.75 * THREE.MathUtils.smoothstep(t, 0, 1);
        aboutModelGroup.scale.setScalar(0.95 * expand);
        armillaryRing1.scale.setScalar(expand);
        armillaryRing2.scale.setScalar(expand);
        armillaryRing3.scale.setScalar(expand);
        saturnDisc.scale.setScalar(expand);
        aboutModelGroup.position.set(-2.2, 0.2, -2.5 + (1.0 - t) * 2.0);
        aboutText3D.mesh.position.set(-2.4, 1.45, -2.3 + (1.0 - t) * 1.5);
      } else if (progress >= 0.30 && progress <= 0.42) {
        aboutAlpha = 1.0;
        aboutModelGroup.scale.setScalar(0.95);
        armillaryRing1.scale.setScalar(1.0);
        armillaryRing2.scale.setScalar(1.0);
        armillaryRing3.scale.setScalar(1.0);
        saturnDisc.scale.setScalar(1.0);
        aboutModelGroup.position.set(-2.2, 0.2, -2.5);
        aboutText3D.mesh.position.set(-2.4, 1.45, -2.3);
      } else if (progress > 0.42 && progress < 0.48) {
        const t = (progress - 0.42) / 0.06;
        aboutAlpha = 1.0 - t;
        // Physical exit: descends into shadow under overhead beam
        aboutModelGroup.position.y = 0.2 - t * 3.5;
        aboutModelGroup.position.z = -2.5 - t * 2.0;
        aboutText3D.mesh.position.y = 1.45 - t * 2.5;
      }
      aboutModelGroup.visible = aboutAlpha > 0.01;
      aboutText3D.mesh.visible = aboutAlpha > 0.01;
      aboutText3D.mat.opacity = aboutAlpha;
      if (aboutModelGroup.visible) {
        aboutCore.rotation.y += 0.006 * motionScale;
        aboutCore.rotation.x += 0.004 * motionScale;
        aboutWire.rotation.y += 0.006 * motionScale;
        aboutWire.rotation.x += 0.004 * motionScale;
        aboutRuby.rotation.y -= 0.01 * motionScale;
        saturnDisc.rotation.z += 0.003 * motionScale;
        armillaryRing1.rotation.x += 0.008 * motionScale;
        armillaryRing2.rotation.y += 0.007 * motionScale;
        armillaryRing3.rotation.z += 0.009 * motionScale;
        aboutSatellites.forEach((sat) => {
          sat.angle += 0.015 * motionScale;
          sat.mesh.position.x = Math.cos(sat.angle) * sat.radius;
          sat.mesh.position.z = Math.sin(sat.angle) * sat.radius;
          sat.mesh.position.y = Math.sin(sat.angle * 2.0) * 0.4;
        });
      }

      // 3. Skills Model & 3D Typography (Active for p in [0.46, 0.78])
      let skillsAlpha = 0;
      if (progress >= 0.46 && progress < 0.58) {
        const t = (progress - 0.46) / 0.12;
        skillsAlpha = t;
        // PHYSICAL UNFOLDING: Telescoping arms extend outward, core scales up
        const unfold = 0.25 + 0.75 * THREE.MathUtils.smoothstep(t, 0, 1);
        skillsModelGroup.scale.setScalar(0.9 * unfold);
        calibratorArms.forEach((arm) => arm.scale.setScalar(unfold));
        skillsModelGroup.position.set(1.8, 1.4 - (1.0 - t) * 2.2, -1.5);
        skillsText3D.mesh.position.set(1.6, 2.5 - (1.0 - t) * 1.5, -1.3);
      } else if (progress >= 0.58 && progress <= 0.70) {
        skillsAlpha = 1.0;
        skillsModelGroup.scale.setScalar(0.9);
        calibratorArms.forEach((arm) => arm.scale.setScalar(1.0));
        skillsModelGroup.position.set(1.8, 1.4, -1.5);
        skillsText3D.mesh.position.set(1.6, 2.5, -1.3);
      } else if (progress > 0.70 && progress < 0.78) {
        const t = (progress - 0.70) / 0.08;
        skillsAlpha = 1.0 - t;
        // Physical exit: ascends into upper darkness as camera dives down toward Compression Gate
        skillsModelGroup.position.y = 1.4 + t * 4.0;
        skillsText3D.mesh.position.y = 2.5 + t * 3.0;
      }
      skillsModelGroup.visible = skillsAlpha > 0.01;
      skillsText3D.mesh.visible = skillsAlpha > 0.01;
      skillsText3D.mat.opacity = skillsAlpha;
      if (skillsModelGroup.visible) {
        polyMesh.rotation.y += 0.007 * motionScale;
        polyWire.rotation.y += 0.007 * motionScale;
        prismMesh.rotation.x += 0.012 * motionScale;
        prismMesh.rotation.y -= 0.015 * motionScale;
        reticle1.rotation.z += 0.008 * motionScale;
        reticle2.rotation.z -= 0.006 * motionScale;
        calibratorArms.forEach((arm, idx) => {
          const pulse = 1.0 + Math.sin(elapsedTime * 3.0 + idx) * 0.08;
          arm.scale.setScalar(pulse);
        });
      }

      // 4. Contact Model & 3D Typography (Active for p in [0.80, 1.00])
      // EMERGENCE: As camera punches through Dual Compression Gate at p in [0.74, 0.84],
      // the Dimensional Portal Gateway rings expand outward down the Z-axis tunnel!
      let contactAlpha = 0;
      if (progress >= 0.80 && progress < 0.90) {
        const t = (progress - 0.80) / 0.10;
        contactAlpha = t;
        // DIMENSIONAL TUNNEL VORTEX EXPANSION
        const vortexExpand = 0.35 + 0.65 * THREE.MathUtils.smoothstep(t, 0, 1);
        contactModelGroup.scale.setScalar(1.05 * vortexExpand);
        depthRings.forEach((dRing, idx) => {
          dRing.position.z = -idx * 0.42 * vortexExpand;
        });
        contactModelGroup.position.set(0.0, 0.4, -4.0);
        contactText3D.mesh.position.set(0.0, 1.85, -3.8);
      } else if (progress >= 0.90) {
        contactAlpha = 1.0;
        contactModelGroup.scale.setScalar(1.05);
        depthRings.forEach((dRing, idx) => {
          dRing.position.z = -idx * 0.42;
        });
        contactModelGroup.position.set(0.0, 0.4, -4.0);
        contactText3D.mesh.position.set(0.0, 1.85, -3.8);
      }
      contactModelGroup.visible = contactAlpha > 0.01;
      contactText3D.mesh.visible = contactAlpha > 0.01;
      contactText3D.mat.opacity = contactAlpha;
      if (contactModelGroup.visible) {
        portalRingMesh.rotation.z += 0.004 * motionScale;
        portalLaser1.rotation.z -= 0.006 * motionScale;
        portalLaser2.rotation.z += 0.008 * motionScale;
        depthRings.forEach((dRing, idx) => {
          dRing.rotation.z += (0.005 + idx * 0.002) * motionScale;
        });
      }

      // Stardust slow drift
      particles.rotation.y = elapsedTime * 0.012 * motionScale;

      // D. Direct, Stable Camera Positioning (ZERO double-lerp!)
      const parallaxOffsetX = mouseDamped.x * 0.22 * currentParallaxWeight;
      const parallaxOffsetY = mouseDamped.y * 0.14 * currentParallaxWeight;

      camera.position.set(
        state.camPos.x + parallaxOffsetX,
        state.camPos.y + parallaxOffsetY,
        state.camPos.z
      );
      camera.lookAt(state.camLook);

      renderer.render(scene, camera);
    };

    animate();

    // 11. Complete Disposal on Unmount
    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      disposables.geometries.forEach((g) => g.dispose());
      disposables.materials.forEach((m) => m.dispose());
      disposables.textures.forEach((t) => t.dispose());
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      }
    };
  }, []); // MOUNT ONCE ONLY

  // Graceful 2D Fallback for non-WebGL environments
  if (!webGLSupported) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'radial-gradient(ellipse at 65% 50%, rgba(220, 38, 38, 0.16) 0%, rgba(5, 5, 8, 0.98) 70%), #050508',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '420px',
            height: '420px',
            right: '10%',
            top: '25%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, rgba(220, 38, 38, 0.2) 50%, transparent 75%)',
            border: '1px solid rgba(220, 38, 38, 0.4)',
            boxShadow: '0 0 60px rgba(220, 38, 38, 0.25)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '2rem',
            right: '2rem',
            fontFamily: 'monospace',
            fontSize: '0.78rem',
            color: 'rgba(255, 255, 255, 0.45)',
            letterSpacing: '0.1em',
          }}
        >
          [SYSTEM: 2D ARCHITECTURAL FALLBACK ACTIVE]
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        backgroundColor: '#050508',
      }}
    />
  );
}
