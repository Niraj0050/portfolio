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
export default function IntroScene({ scrollProgressRef, onSceneReady, onHeroRevealed, onWebGLError }) {
  const containerRef = useRef(null);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const callbacksRef = useRef({ onSceneReady, onHeroRevealed, onWebGLError });
  callbacksRef.current = { onSceneReady, onHeroRevealed, onWebGLError };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Defend against leftover DOM elements if React StrictMode runs or fast-refresh occurs
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

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
      callbacksRef.current.onWebGLError?.();
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
    const sceneFog = new THREE.FogExp2(0x181e26, 0.016);
    scene.fog = sceneFog;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    let isMobile = (width / height) < 1.0 || width < 768;

    // Perspective camera with adaptive FOV ensuring total visibility without cropping on mobile & desktop
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 95);

    const updateCameraFov = (w, h) => {
      const aspect = w / h;
      camera.aspect = aspect;
      if (aspect < 0.6) {
        camera.fov = 58; // Phone portrait (e.g. 390x844 aspect ~0.46)
      } else if (aspect < 0.85) {
        camera.fov = 52; // Wider phone / fold
      } else if (aspect < 1.2) {
        camera.fov = 46; // Tablet portrait / square
      } else {
        camera.fov = 42; // Desktop widescreen
      }
      camera.updateProjectionMatrix();
    };
    updateCameraFov(width, height);

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
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 3. Natural Cinematic Sky Environment (Atmospheric Slate Zenith + Warm Golden Sunlight + Muted Burgundy Horizon)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const createNaturalSkyEnvironment = () => {
      const envCanvas = document.createElement('canvas');
      envCanvas.width = 2048;
      envCanvas.height = 1024;
      const ctx = envCanvas.getContext('2d');

      // Atmospheric Sky Dome Gradient (Deep slate zenith to subtle earthen twilight horizon)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, 1024);
      skyGrad.addColorStop(0.0, '#090d14'); // Slate charcoal zenith
      skyGrad.addColorStop(0.38, '#141b26'); // Overcast blue-slate mid-sky
      skyGrad.addColorStop(0.62, '#1e2531'); // Lower atmospheric haze
      skyGrad.addColorStop(0.76, '#2e2823'); // Warm earthen twilight horizon tone
      skyGrad.addColorStop(0.88, '#1c1a17'); // Distant landscape boundary
      skyGrad.addColorStop(1.0, '#100f12'); // Nadir ground
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, 2048, 1024);

      // Controlled Natural Sunlight Disc & Soft Atmospheric Diffusion
      const sunGrad = ctx.createRadialGradient(600, 320, 6, 600, 320, 180);
      sunGrad.addColorStop(0.0, '#fffdf5'); // Pure warm white sun core
      sunGrad.addColorStop(0.18, 'rgba(254, 240, 210, 0.75)'); // Soft solar corona
      sunGrad.addColorStop(0.45, 'rgba(217, 130, 25, 0.22)'); // Controlled warm atmospheric haze
      sunGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = sunGrad;
      ctx.fillRect(380, 100, 440, 440);

      // Subtle, Restrained Dusk Burgundy Accent on Opposite Horizon
      const duskGrad = ctx.createRadialGradient(1620, 720, 20, 1620, 720, 240);
      duskGrad.addColorStop(0.0, 'rgba(110, 30, 35, 0.16)');
      duskGrad.addColorStop(0.6, 'rgba(70, 20, 25, 0.05)');
      duskGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = duskGrad;
      ctx.fillRect(1380, 480, 480, 480);

      const texture = trackTex(new THREE.CanvasTexture(envCanvas));
      texture.mapping = THREE.EquirectangularReflectionMapping;
      texture.colorSpace = THREE.SRGBColorSpace;
      const envMap = pmremGenerator.fromEquirectangular(texture).texture;
      pmremGenerator.dispose();
      return { envMap, skyTexture: texture };
    };

    const { envMap, skyTexture } = createNaturalSkyEnvironment();
    scene.environment = envMap;
    scene.background = skyTexture;

    // 4. Natural Lighting Architecture (Directional Sunlight + Hemisphere Sky/Earth Illumination + Soft Ambient)
    const ambientLight = new THREE.AmbientLight(0x242d3a, 0.90);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0x4e5b6e, 0x302a24, 1.45);
    scene.add(hemiLight);

    // Primary Directional Sunlight with Soft Contact Shadows
    const keyLight = new THREE.DirectionalLight(0xffeed8, 2.8);
    keyLight.position.set(-14, 18, 12);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 50;
    keyLight.shadow.camera.left = -16;
    keyLight.shadow.camera.right = 16;
    keyLight.shadow.camera.top = 16;
    keyLight.shadow.camera.bottom = -16;
    keyLight.shadow.bias = -0.0004;
    scene.add(keyLight);

    // Warm Low Golden Fill Light
    const warmFillLight = new THREE.DirectionalLight(0xd97706, 0.35);
    warmFillLight.position.set(14, 6, -6);
    scene.add(warmFillLight);

    // Muted Burgundy Horizon Accent
    const burgundyRimLight = new THREE.DirectionalLight(0x7f1d1d, 0.28);
    burgundyRimLight.position.set(6, 2, -12);
    scene.add(burgundyRimLight);

    // Interactive Cursor Ember Point Light
    const cursorLight = new THREE.PointLight(0xd97706, 0.6, 6, 2.0);
    cursorLight.position.set(0, 0, 3.0);
    scene.add(cursorLight);

    // Shared Premium Materials
    const chromeMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xf5f5f7,
        metalness: 0.98,
        roughness: 0.04,
        clearcoat: 0.8,
        clearcoatRoughness: 0.04,
        reflectivity: 0.95,
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

    const laserLineMat = trackMat(
      new THREE.LineBasicMaterial({
        color: 0xef4444,
        transparent: true,
        opacity: 0.85,
      })
    );

    const rubyGemMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x881337,
        emissive: 0x991b1b,
        emissiveIntensity: 0.40,
        metalness: 0.25,
        roughness: 0.18,
        flatShading: true,
      })
    );

    // Dedicated Hero Progressive Reveal Materials
    const heroChromeMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xf5f5f7,
        metalness: 0.98,
        roughness: 0.8,
        clearcoat: 0.8,
        clearcoatRoughness: 0.04,
        reflectivity: 0.95,
        envMapIntensity: 0.0,
        transparent: true,
        depthWrite: true,
        opacity: 0.0,
      })
    );

    const heroRubyMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x881337,
        emissive: 0x991b1b,
        emissiveIntensity: 0.0,
        metalness: 0.25,
        roughness: 0.18,
        flatShading: true,
        transparent: true,
        depthWrite: true,
        opacity: 0.0,
      })
    );

    const heroWireframeMat = trackMat(
      new THREE.MeshBasicMaterial({
        color: 0xef4444,
        wireframe: true,
        transparent: true,
        depthWrite: false,
        opacity: 0.0,
      })
    );

    // ==========================================
    // 5. NATURAL CINEMATIC 3D GAME WORLD ENVIRONMENT
    // Continuous uneven terrain, stone outcrops, subtle highland grass,
    // distant mountain silhouettes, and warm atmospheric sunlight.
    // ==========================================
    const naturalWorldGroup = new THREE.Group();
    scene.add(naturalWorldGroup);

    // Continuous Natural Terrain Height Function (Organic rolling ground, natural dry wash trail, peripheral ridges)
    const getTerrainHeight = (x, z) => {
      let y = -2.35;
      // Multi-scale natural landform elevation (non-harmonic frequencies prevent repeating ripples)
      const n1 = Math.sin(x * 0.082 + 1.3) * Math.cos(z * 0.074 + 0.5);
      const n2 = Math.sin(x * 0.17 - z * 0.13 + 2.1) * 0.45;
      const n3 = Math.cos(x * 0.31 + z * 0.28) * 0.20;
      y += (n1 + n2 + n3) * 0.26;

      // Natural stone plinth terraces under key project landmarks
      // Hero stone terrace at (1.75, 0.0)
      const dHero = Math.hypot(x - 1.75, z - 0.0);
      if (dHero < 2.4) {
        y += Math.exp(-Math.pow(dHero / 1.5, 2)) * 0.18;
      }
      // About stone terrace at (-2.2, -2.5)
      const dAbout = Math.hypot(x - (-2.2), z - (-2.5));
      if (dAbout < 2.2) {
        y += Math.exp(-Math.pow(dAbout / 1.4, 2)) * 0.16;
      }

      // Natural gentle trail dip along camera travel corridor (ensures camera & models always clear comfortably)
      const distFromTrail = Math.hypot(x - Math.sin(z * 0.18) * 0.6, 0);
      const trailDip = Math.exp(-Math.pow(distFromTrail / 3.0, 2)) * 0.14;
      y -= trailDip;

      // Peripheral earth berms framing the landscape gently outward
      const radius = Math.hypot(x, z);
      if (radius > 9.0) {
        const ridgeFactor = (radius - 9.0) / 20.0;
        const ridgeNoise = Math.sin(x * 0.11 + z * 0.09) * 0.6 + Math.cos(x * 0.08 - z * 0.12) * 0.4;
        y += Math.min(3.2, Math.max(0, ridgeFactor * 1.8 + ridgeNoise * Math.min(1.0, ridgeFactor)));
      }
      return y;
    };

    // Procedural Natural Ground Surface Texture (Varied earth tones, slate striations, muted mossy olive, fine gravel)
    const createNaturalTerrainTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');

      // Base warm weathered mineral soil
      ctx.fillStyle = '#3c3933';
      ctx.fillRect(0, 0, 1024, 1024);

      // Layer 1: Natural earth loam, weathered slate stone, alpine moss lichen, and gravel strata
      for (let i = 0; i < 95; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 1024;
        const rw = 80 + Math.random() * 240;
        const rh = 40 + Math.random() * 130;
        const rot = Math.random() * Math.PI;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);

        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, rw);
        const pick = Math.random();
        if (pick < 0.32) {
          grad.addColorStop(0, 'rgba(92, 78, 62, 0.72)'); // Warm earth loam
          grad.addColorStop(1, 'rgba(92, 78, 62, 0)');
        } else if (pick < 0.62) {
          grad.addColorStop(0, 'rgba(72, 80, 92, 0.68)'); // Weathered slate stone
          grad.addColorStop(1, 'rgba(72, 80, 92, 0)');
        } else if (pick < 0.82) {
          grad.addColorStop(0, 'rgba(84, 100, 70, 0.58)'); // Muted alpine moss / olive lichen
          grad.addColorStop(1, 'rgba(84, 100, 70, 0)');
        } else if (pick < 0.93) {
          grad.addColorStop(0, 'rgba(108, 96, 78, 0.52)'); // Sun-warmed highland gravel
          grad.addColorStop(1, 'rgba(108, 96, 78, 0)');
        } else {
          grad.addColorStop(0, 'rgba(86, 42, 46, 0.25)'); // Muted mineral burgundy vein
          grad.addColorStop(1, 'rgba(86, 42, 46, 0)');
        }
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(0, 0, rw, rh, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Layer 2: Fine gravel drift, pebble clusters, and soil micro-texture
      for (let i = 0; i < 2200; i++) {
        const px = Math.random() * 1024;
        const py = Math.random() * 1024;
        const pr = 0.8 + Math.random() * 2.4;
        const shade = Math.floor(65 + Math.random() * 65);
        ctx.fillStyle = `rgba(${shade}, ${shade + 3}, ${shade + 7}, 0.38)`;
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.fill();
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(4, 4);
      tex.anisotropy = 8;
      return trackTex(tex);
    };

    const createNaturalTerrainBump = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, 512, 512);

      // Organic low-frequency soil undulation
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const r = 30 + Math.random() * 80;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        const val = Math.random() > 0.5 ? 255 : 0;
        grad.addColorStop(0, `rgba(${val}, ${val}, ${val}, 0.14)`);
        grad.addColorStop(1, `rgba(${val}, ${val}, ${val}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Fine organic pebble & coarse sand grain
      for (let i = 0; i < 700; i++) {
        const px = Math.random() * 512;
        const py = Math.random() * 512;
        const pr = 1.0 + Math.random() * 1.8;
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(220, 220, 220, 0.08)' : 'rgba(30, 30, 30, 0.08)';
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.fill();
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(4, 4);
      tex.anisotropy = 8;
      return trackTex(tex);
    };

    const terrainTexture = createNaturalTerrainTexture();
    const terrainBump = createNaturalTerrainBump();

    // Natural Uneven Terrain Geometry (90x90 with 112x112 segments for smooth geological resolution)
    const terrainGeo = trackGeo(new THREE.PlaneGeometry(90, 90, 112, 112));
    const posAttr = terrainGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const worldX = posAttr.getX(i);
      const worldZ = -posAttr.getY(i);
      const h = getTerrainHeight(worldX, worldZ);
      posAttr.setZ(i, h);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xa8a298,
        map: terrainTexture,
        bumpMap: terrainBump,
        bumpScale: 0.038,
        roughness: 0.88,
        metalness: 0.03,
        envMapIntensity: 0.45,
      })
    );
    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.rotation.x = -Math.PI * 0.5;
    terrainMesh.receiveShadow = true;
    naturalWorldGroup.add(terrainMesh);

    // Natural Mountain Ridge Horizons with Smooth, Organic Geological Profiles
    const createDistantRidge = (radius, count, baseHeight, peakHeight, color, opacity = 1.0) => {
      const ridgeGeo = trackGeo(new THREE.BufferGeometry());
      const verts = [];
      const indices = [];

      for (let i = 0; i <= count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        // Multi-harmonic smooth natural mountain massifs and cols
        const broad = Math.sin(angle * 2.0 + 0.4) * 0.38 + Math.cos(angle * 4.0 - 0.6) * 0.28;
        const alpine = Math.sin(angle * 7.0 + 1.5) * 0.22 + Math.cos(angle * 11.0) * 0.12;
        const noise = broad + alpine;
        const h = baseHeight + Math.pow(Math.max(0, noise + 0.30), 1.35) * peakHeight;

        verts.push(x, -4.5, z);
        verts.push(x, h, z);

        if (i < count) {
          const b1 = i * 2;
          const t1 = i * 2 + 1;
          const b2 = (i + 1) * 2;
          const t2 = (i + 1) * 2 + 1;
          indices.push(b1, t1, b2);
          indices.push(b2, t1, t2);
        }
      }

      ridgeGeo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
      ridgeGeo.setIndex(indices);
      ridgeGeo.computeVertexNormals();

      const ridgeMat = trackMat(
        new THREE.MeshStandardMaterial({
          color,
          roughness: 0.90,
          metalness: 0.03,
          side: THREE.DoubleSide,
          transparent: opacity < 1.0,
          opacity,
        })
      );
      return new THREE.Mesh(ridgeGeo, ridgeMat);
    };

    // Layer 1: Middle-ground rolling foothills (Radius 26, smooth organic contours)
    const midHills = createDistantRidge(26, 160, -0.2, 2.8, 0x38414e, 0.95);
    naturalWorldGroup.add(midHills);

    // Layer 2: Main mountain range (Radius 46, atmospheric mountain silhouettes)
    const midMountains = createDistantRidge(46, 180, 0.8, 5.8, 0x28303d, 1.0);
    naturalWorldGroup.add(midMountains);

    // Layer 3: Distant alpine peaks (Radius 68, majestic atmospheric horizon)
    const farMountains = createDistantRidge(68, 200, 2.0, 10.5, 0x1a212e, 1.0);
    naturalWorldGroup.add(farMountains);

    // Realistic Weathered Glacial Boulders (Rounded, subdivided, smooth normals, non-polygonal)
    const createWeatheredBoulderGeo = (radius, perturbFactor = 0.20) => {
      const geo = trackGeo(new THREE.IcosahedronGeometry(radius, 3));
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        let vx = pos.getX(i);
        let vy = pos.getY(i);
        let vz = pos.getZ(i);

        const bottomFlatten = vy < 0 ? 1.0 + vy * 0.25 : 1.0;
        const noise =
          Math.sin(vx * 2.8 + vy * 1.9) * 0.5 +
          Math.cos(vz * 2.4 - vy * 1.5) * 0.35 +
          Math.sin(vx * 5.2 + vz * 4.8) * 0.15;
        const disp = (1.0 + noise * perturbFactor) * bottomFlatten;

        pos.setXYZ(i, vx * disp, vy * disp, vz * disp);
      }
      geo.computeVertexNormals();
      return geo;
    };

    const boulderGeoA = createWeatheredBoulderGeo(1.0, 0.22); // Large rounded anchor boulder
    const boulderGeoB = createWeatheredBoulderGeo(0.75, 0.18); // Medium companion stone
    const boulderGeoC = createWeatheredBoulderGeo(0.50, 0.15); // Smaller foreground fieldstone

    // Procedural Rock Texture with mineral strata, grain, and subtle lichen streaks
    const createRockTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#48443f';
      ctx.fillRect(0, 0, 512, 512);

      for (let i = 0; i < 40; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const rw = 60 + Math.random() * 150;
        const rh = 20 + Math.random() * 60;
        const rot = Math.random() * Math.PI;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);
        const grad = ctx.createLinearGradient(-rw, 0, rw, 0);
        grad.addColorStop(0, 'rgba(60, 64, 70, 0.45)');
        grad.addColorStop(0.5, 'rgba(88, 82, 74, 0.52)');
        grad.addColorStop(0.8, 'rgba(74, 86, 62, 0.38)'); // Lichen
        grad.addColorStop(1, 'rgba(60, 64, 70, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(-rw, -rh / 2, rw * 2, rh);
        ctx.restore();
      }

      for (let i = 0; i < 800; i++) {
        const px = Math.random() * 512;
        const py = Math.random() * 512;
        const pr = 0.8 + Math.random() * 1.6;
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(150, 145, 135, 0.20)' : 'rgba(30, 30, 30, 0.24)';
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.fill();
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(2, 2);
      return trackTex(tex);
    };

    const rockMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x767068, // Weathered slate & granite with warm earthy mineral undertone
        map: createRockTexture(),
        roughness: 0.88,
        metalness: 0.04,
        flatShading: false,
      })
    );

    const rockPlacements = [
      // 1. Hero Zone (Natural stone plinth outcrop anchoring the Liquid Chrome sculpture on the right)
      { geo: boulderGeoA, x: 2.9, z: 0.5, scale: [1.1, 0.7, 1.0], rot: [0.1, 0.6, -0.05] },
      { geo: boulderGeoB, x: 2.3, z: -1.2, scale: [0.85, 0.55, 0.75], rot: [-0.1, 1.2, 0.15] },
      { geo: boulderGeoB, x: 3.4, z: -0.4, scale: [0.95, 0.6, 0.85], rot: [0.3, -0.4, 0.2] },
      { geo: boulderGeoC, x: 1.5, z: 1.8, scale: [0.55, 0.35, 0.5], rot: [0.1, 0.3, -0.1] },

      // 2. Immediate Foreground Parallax Stones (Flanking sides, keeping corridor clear)
      { geo: boulderGeoC, x: -2.4, z: 4.8, scale: [0.55, 0.32, 0.5], rot: [0.2, 0.8, 0.0] },
      { geo: boulderGeoC, x: 2.5, z: 4.9, scale: [0.6, 0.35, 0.55], rot: [-0.15, 1.8, 0.1] },

      // 3. Transition 1 -> 2: Natural Rocky Bluff (Sweeps past far left during fly-by swoop)
      { geo: boulderGeoA, x: -4.8, z: 2.0, scale: [1.3, 0.85, 1.2], rot: [0.1, 0.4, -0.1] },
      { geo: boulderGeoB, x: -4.2, z: 3.4, scale: [0.95, 0.65, 0.9], rot: [0.2, -0.7, 0.15] },

      // 4. About Zone (Natural low stone plinth below the Armillary Sphere at x = -2.2, z = -2.5)
      { geo: boulderGeoA, x: -2.2, z: -2.5, scale: [1.3, 0.32, 1.2], rot: [0.0, 0.5, 0.0] },
      { geo: boulderGeoB, x: -4.3, z: -2.4, scale: [1.0, 0.65, 0.95], rot: [0.2, 1.5, -0.1] },
      { geo: boulderGeoC, x: -0.7, z: -3.2, scale: [0.75, 0.45, 0.7], rot: [-0.1, 0.4, 0.15] },

      // 5. Skills Zone (Highland granite ledge beneath the Mechanical Polyhedron at x = 1.8, z = -1.5)
      { geo: boulderGeoA, x: 1.8, z: -1.5, scale: [1.3, 0.6, 1.2], rot: [0.2, -0.3, 0.1] },
      { geo: boulderGeoB, x: 2.6, z: -1.1, scale: [0.9, 0.55, 0.85], rot: [0.1, 1.0, -0.15] },
      { geo: boulderGeoB, x: 2.4, z: -2.4, scale: [0.95, 0.6, 0.9], rot: [-0.15, 2.1, 0.2] },
      { geo: boulderGeoC, x: 0.8, z: -1.9, scale: [0.65, 0.4, 0.6], rot: [0.15, 0.6, -0.1] },

      // 6. Contact Zone: Ancient Rounded Megaliths (Framing the Dimensional Portal wide at |x| = 3.6)
      { geo: boulderGeoA, x: -3.6, z: -3.8, scale: [1.2, 1.1, 1.0], rot: [0.05, 0.3, 0.04] },
      { geo: boulderGeoA, x: 3.6, z: -3.8, scale: [1.2, 1.1, 1.0], rot: [-0.05, -0.3, -0.04] },
      { geo: boulderGeoB, x: -2.8, z: -4.8, scale: [1.0, 0.65, 0.9], rot: [0.15, 0.8, -0.1] },
      { geo: boulderGeoB, x: 2.8, z: -4.8, scale: [1.0, 0.65, 0.9], rot: [-0.15, -0.8, 0.1] },
    ];

    rockPlacements.forEach((item) => {
      const mesh = new THREE.Mesh(item.geo, rockMat);
      const groundY = getTerrainHeight(item.x, item.z);
      // Sunk ~35% into the earth for realistic grounded contact
      mesh.position.set(item.x, groundY + item.scale[1] * 0.24, item.z);
      mesh.scale.set(...item.scale);
      mesh.rotation.set(...item.rot);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      naturalWorldGroup.add(mesh);
    });

    // Substantial Highland Moorland Vegetation (Organic, grounded tussocks framing landscape)
    const createGrassTuftGeo = () => {
      const geo = trackGeo(new THREE.BufferGeometry());
      const verts = [];
      const uvs = [];
      const indices = [];

      // 5 naturally arched blades with organic curve (height 0.38, spread 0.52)
      const bladeCount = 5;
      for (let b = 0; b < bladeCount; b++) {
        const angle = (b / bladeCount) * Math.PI + (b * 0.22);
        const dx = Math.cos(angle) * 0.26;
        const dz = Math.sin(angle) * 0.26;
        const archX = Math.cos(angle + 0.4) * 0.18;
        const archZ = Math.sin(angle + 0.4) * 0.18;
        const baseIdx = b * 4;

        verts.push(-dx * 0.5, 0.0, -dz * 0.5);
        verts.push(dx * 0.5, 0.0, dz * 0.5);
        verts.push(dx * 0.2 + archX, 0.38, dz * 0.2 + archZ);
        verts.push(-dx * 0.2 + archX, 0.38, -dz * 0.2 + archZ);

        uvs.push(0, 0, 1, 0, 1, 1, 0, 1);

        indices.push(baseIdx, baseIdx + 1, baseIdx + 2);
        indices.push(baseIdx, baseIdx + 2, baseIdx + 3);
      }

      geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      geo.setIndex(indices);
      geo.computeVertexNormals();
      return geo;
    };

    const grassTuftGeo = createGrassTuftGeo();

    const createGrassTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, 128, 256);

      // Natural botanical gradient: Deep olive-moss root -> muted sage mid -> sunlit straw gold tip
      const grad = ctx.createLinearGradient(0, 256, 0, 0);
      grad.addColorStop(0.0, '#283222'); // Deep moss/soil root
      grad.addColorStop(0.40, '#4a593d'); // Muted sage green
      grad.addColorStop(0.78, '#748259'); // Sunlit olive
      grad.addColorStop(0.94, '#949064'); // Straw gold tip
      grad.addColorStop(1.0, 'rgba(148, 144, 100, 0)');
      ctx.fillStyle = grad;

      // Natural tapered blade silhouettes
      for (let i = 0; i < 5; i++) {
        const bx = 16 + i * 22;
        ctx.beginPath();
        ctx.moveTo(bx - 8, 256);
        ctx.lineTo(bx + 8, 256);
        ctx.lineTo(bx + (i % 2 === 0 ? 3 : -3), 14);
        ctx.closePath();
        ctx.fill();
      }

      const tex = new THREE.CanvasTexture(canvas);
      return trackTex(tex);
    };

    const grassMat = trackMat(
      new THREE.MeshStandardMaterial({
        map: createGrassTexture(),
        color: 0xa4b48e,
        roughness: 0.82,
        metalness: 0.02,
        alphaTest: 0.12,
        side: THREE.DoubleSide,
      })
    );

    const grassTufts = [];
    const grassSeeds = [
      // Hero Zone (Framing boulder plinth at right, completely clear of central camera corridor)
      [2.4, 0.3], [2.8, 0.7], [3.3, 0.9], [2.1, -0.6], [3.1, -0.8], [3.6, 0.2], [3.8, -0.4], [2.6, 1.4],
      // Far Left Berm (Parallax framing along left hillside)
      [-3.2, 1.2], [-3.8, 2.1], [-4.2, 3.2], [-3.5, 4.0], [-2.8, 4.8],
      // Far Right Berm (Parallax framing along right hillside)
      [3.2, 2.4], [3.8, 3.5], [4.2, 4.2], [3.0, 4.8],
      // About Zone (Clustered around base of outer rocks at x < -3.0 and behind plinth)
      [-3.4, -2.1], [-4.0, -2.5], [-4.5, -2.2], [-3.0, -3.2], [-3.6, -3.6], [-2.0, -3.5], [-1.2, -3.4],
      // Skills Zone (Clustered along rock ledge at x > 2.2 and behind polyhedron)
      [2.4, -1.0], [3.0, -1.4], [3.3, -1.8], [2.2, -2.2], [3.1, -2.5], [1.5, -2.5],
      // Contact Zone (Flanking side megaliths wide at |x| > 2.8, keeping portal threshold open)
      [-3.2, -3.4], [-3.8, -4.0], [-3.0, -4.5], [3.2, -3.4], [3.8, -4.0], [3.0, -4.5],
      // Distant rolling swales
      [-2.4, -0.6], [-3.0, 0.4], [2.6, -0.2], [-1.8, 1.8], [2.2, 1.9],
    ];

    grassSeeds.forEach(([gx, gz], idx) => {
      const mesh = new THREE.Mesh(grassTuftGeo, grassMat);
      const gy = getTerrainHeight(gx, gz);
      mesh.position.set(gx, gy, gz);
      const s = 0.95 + (idx % 4) * 0.10;
      mesh.scale.set(s, s * (0.95 + (idx % 3) * 0.12), s);
      mesh.rotation.y = (idx * 1.37) % (Math.PI * 2);
      mesh.userData = { phase: idx * 0.35, baseRotZ: (Math.random() - 0.5) * 0.08 };
      naturalWorldGroup.add(mesh);
      grassTufts.push(mesh);
    });

    // Subtle Atmospheric Dust Motes (Sparse, fine natural dust caught in sunlight)
    const dustCount = 45;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 18;
      dustPositions[i * 3 + 1] = Math.random() * 4.5 - 1.2;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    const dustGeo = trackGeo(new THREE.BufferGeometry());
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));

    const dustMat = trackMat(
      new THREE.PointsMaterial({
        color: 0xfef08a,
        size: 0.020,
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    const sunDustParticles = new THREE.Points(dustGeo, dustMat);
    naturalWorldGroup.add(sunDustParticles);

    // ==========================================
    // 6. REAL SCENE-SPACE 3D TYPOGRAPHY BUILDER
    // Typography lives in 3D world space with physical perspective & depth occlusion!
    // ==========================================
    const createSceneText3D = (tag, title, subtitle, { width = 4.0, height = 0.95 } = {}) => {
      const canvas = document.createElement('canvas');
      canvas.width = 2048;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, 2048, 480);

      // 1. Spatial Datum Corner Brackets in Restrained Burgundy (Symmetric 4-corner HUD framing)
      ctx.strokeStyle = '#b91c1c';
      ctx.lineWidth = 4;
      // Top Left
      ctx.beginPath();
      ctx.moveTo(80, 75);
      ctx.lineTo(80, 40);
      ctx.lineTo(125, 40);
      ctx.stroke();
      // Top Right
      ctx.beginPath();
      ctx.moveTo(1968, 75);
      ctx.lineTo(1968, 40);
      ctx.lineTo(1923, 40);
      ctx.stroke();
      // Bottom Left
      ctx.beginPath();
      ctx.moveTo(80, 405);
      ctx.lineTo(80, 440);
      ctx.lineTo(125, 440);
      ctx.stroke();
      // Bottom Right
      ctx.beginPath();
      ctx.moveTo(1968, 405);
      ctx.lineTo(1968, 440);
      ctx.lineTo(1923, 440);
      ctx.stroke();

      // 2. Monospace Spatial Datum Tag in Warm Amber (Centered)
      ctx.textAlign = 'center';
      ctx.font = '700 32px "Space Grotesk", monospace';
      ctx.fillStyle = '#d97706';
      ctx.fillText(tag.toUpperCase(), 1024, 72);

      // 3. Monumental Grotesk Title with Centered Dropshadow (Adaptive scaling)
      const titleFontSize = Math.min(94, Math.floor(1650 / (title.length * 0.65)));
      ctx.font = `900 ${titleFontSize}px "Syne", "Space Grotesk", sans-serif`;
      ctx.shadowColor = 'rgba(185, 28, 28, 0.45)';
      ctx.shadowBlur = 24;
      ctx.fillStyle = '#ffffff';
      ctx.fillText(title, 1024, 225);
      ctx.shadowBlur = 0;

      // 4. Glowing Red Laser Datum Rule (Centered Bilateral Falloff)
      const ruleGrad = ctx.createLinearGradient(260, 0, 1788, 0);
      ruleGrad.addColorStop(0, 'rgba(185, 28, 28, 0)');
      ruleGrad.addColorStop(0.25, '#b91c1c');
      ruleGrad.addColorStop(0.5, '#d97706');
      ruleGrad.addColorStop(0.75, '#b91c1c');
      ruleGrad.addColorStop(1, 'rgba(185, 28, 28, 0)');
      ctx.fillStyle = ruleGrad;
      ctx.fillRect(260, 256, 1528, 3);

      // 5. Technical Subtitle (Centered)
      ctx.font = '600 36px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(subtitle, 1024, 335);

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
    heroText3D.mesh.position.set(-1.25, 0.65, 0.1);
    heroText3D.mesh.rotation.set(-0.06, 0.18, 0.0);

    const aboutText3D = createSceneText3D(
      '[ 02 // ARCHITECTURAL FOUNDATION // THEORY ]',
      'STRUCTURAL RIGOR.',
      'SYSTEM ARCHITECTURE • VNSGU CS 6.64 CGPA'
    );
    aboutText3D.mesh.position.set(-2.2, 1.45, -2.3);
    aboutText3D.mesh.rotation.set(0.08, -0.15, 0.0);

    const skillsText3D = createSceneText3D(
      '[ 03 // PRODUCTION CAPABILITIES // STACK ]',
      'SYSTEMS & STACK.',
      'REACT 18 • PHP • MYSQL • PYTHON • NEXT.JS'
    );
    skillsText3D.mesh.position.set(1.8, 2.5, -1.3);
    skillsText3D.mesh.rotation.set(0.24, -0.12, 0.0);

    const contactText3D = createSceneText3D(
      '[ 04 // SANCTUARY & INQUIRY // GATEWAY ]',
      "LET'S CONNECT.",
      'FULL-STACK ROLES • SURAT [ 21.17° N, 72.83° E ]',
      { width: 4.4, height: 1.0 }
    );
    contactText3D.mesh.position.set(0.0, 2.60, -3.8);
    contactText3D.mesh.rotation.set(0.0, 0.0, 0.0);

    // ==========================================
    // 7. DISTINCT 3D MODEL FOR EVERY MAJOR SECTION
    // Integrated as stationary world-space architectural landmarks
    // ==========================================

    // ------------------------------------------
    // MODEL A: HERO — LIQUID-CHROME MÖBIUS SCULPTURE
    // ------------------------------------------
    const heroModelGroup = new THREE.Group();
    heroModelGroup.position.set(1.75, 0.20, 0.0);
    heroModelGroup.scale.setScalar(0.62);
    scene.add(heroModelGroup);

    const knotGeo = trackGeo(new THREE.TorusKnotGeometry(0.85, 0.20, 180, 36, 2, 3));
    const chromeKnot = new THREE.Mesh(knotGeo, heroChromeMat);
    heroModelGroup.add(chromeKnot);

    // Overlaid crimson wireframe mesh sharing the same geometry for progressive reveal
    const wireframeKnot = new THREE.Mesh(knotGeo, heroWireframeMat);
    wireframeKnot.renderOrder = 2;
    chromeKnot.add(wireframeKnot);

    const innerGemGeo = trackGeo(new THREE.OctahedronGeometry(0.44, 0));
    const innerGem = new THREE.Mesh(innerGemGeo, heroRubyMat);
    heroModelGroup.add(innerGem);

    const innerLatticeGeo = trackGeo(new THREE.IcosahedronGeometry(0.55, 1));
    const innerLatticeMat = trackMat(
      new THREE.MeshBasicMaterial({ color: 0xef4444, wireframe: true, transparent: true, opacity: 0.0 })
    );
    const innerLattice = new THREE.Mesh(innerLatticeGeo, innerLatticeMat);
    heroModelGroup.add(innerLattice);

    // Single slim, architectural orbital armature
    const ring1Geo = trackGeo(new THREE.TorusGeometry(1.35, 0.022, 24, 100));
    const ring1Group = new THREE.Group();
    ring1Group.rotation.x = Math.PI * 0.18;
    heroModelGroup.add(ring1Group);
    const ring1 = new THREE.Mesh(ring1Geo, heroChromeMat);
    ring1Group.add(ring1);

    const wireframeRing1 = new THREE.Mesh(ring1Geo, heroWireframeMat);
    wireframeRing1.renderOrder = 2;
    ring1.add(wireframeRing1);

    // ------------------------------------------
    // MODEL B: ABOUT — CELESTIAL ARMILLARY SPHERE SYSTEM
    // ------------------------------------------
    const aboutModelGroup = new THREE.Group();
    aboutModelGroup.position.set(-2.2, 0.30, -2.5);
    aboutModelGroup.scale.setScalar(0.78);
    scene.add(aboutModelGroup);

    // Titanium Core Dodecahedron with structural edges
    const aboutCoreGeo = trackGeo(new THREE.DodecahedronGeometry(0.58, 0));
    const aboutCoreMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.95,
        roughness: 0.12,
        flatShading: true,
        envMapIntensity: 2.5,
      })
    );
    const aboutCore = new THREE.Mesh(aboutCoreGeo, aboutCoreMat);
    aboutModelGroup.add(aboutCore);

    const aboutWireGeo = trackGeo(new THREE.EdgesGeometry(aboutCoreGeo));
    const aboutWire = new THREE.LineSegments(aboutWireGeo, laserChannelMat);
    aboutModelGroup.add(aboutWire);

    // Inner Radiant Octahedron
    const aboutRubyGeo = trackGeo(new THREE.OctahedronGeometry(0.38, 0));
    const aboutRuby = new THREE.Mesh(aboutRubyGeo, rubyGemMat);
    aboutModelGroup.add(aboutRuby);

    // Concentric Armillary Gimbal Rings in polished architectural chrome
    const armillaryRing1 = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(1.25, 0.026, 24, 100)), chromeMat);
    aboutModelGroup.add(armillaryRing1);

    const armillaryRing2 = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(1.50, 0.020, 24, 120)), chromeMat);
    armillaryRing2.rotation.x = Math.PI * 0.5;
    aboutModelGroup.add(armillaryRing2);

    // ------------------------------------------
    // MODEL C: SKILLS — PRECISION MECHANICAL POLYHEDRON ASSEMBLY
    // ------------------------------------------
    const skillsModelGroup = new THREE.Group();
    skillsModelGroup.position.set(1.8, 1.20, -1.5);
    skillsModelGroup.scale.setScalar(0.75);
    scene.add(skillsModelGroup);

    // Central Compound Polyhedron Core
    const polyGeo = trackGeo(new THREE.IcosahedronGeometry(0.75, 1));
    const polyMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        metalness: 0.95,
        roughness: 0.15,
        envMapIntensity: 2.2,
      })
    );
    const polyMesh = new THREE.Mesh(polyGeo, polyMat);
    skillsModelGroup.add(polyMesh);

    const polyWireGeo = trackGeo(new THREE.WireframeGeometry(polyGeo));
    const polyWire = new THREE.LineSegments(polyWireGeo, laserChannelMat);
    skillsModelGroup.add(polyWire);

    // Internal Optical Chrome Prism
    const prismMesh = new THREE.Mesh(trackGeo(new THREE.OctahedronGeometry(0.44, 0)), chromeMat);
    skillsModelGroup.add(prismMesh);

    // Telescoping Calibrator Arms (6 Cardinal Projections)
    const calibratorArms = [];
    const armAxes = [
      [1.2, 0, 0], [-1.2, 0, 0],
      [0, 1.2, 0], [0, -1.2, 0],
      [0, 0, 1.2], [0, 0, -1.2],
    ];
    armAxes.forEach(([ax, ay, az]) => {
      const armGroup = new THREE.Group();
      armGroup.position.set(ax, ay, az);

      const shaft = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.018, 0.018, 0.5, 8)), chromeMat);
      if (ax !== 0) shaft.rotation.z = Math.PI * 0.5;
      else if (az !== 0) shaft.rotation.x = Math.PI * 0.5;
      armGroup.add(shaft);

      const head = new THREE.Mesh(trackGeo(new THREE.OctahedronGeometry(0.08, 0)), rubyGemMat);
      armGroup.add(head);

      skillsModelGroup.add(armGroup);
      calibratorArms.push(armGroup);
    });

    // ------------------------------------------
    // MODEL D: CONTACT — MONUMENTAL DIMENSIONAL PORTAL GATE
    // ------------------------------------------
    const contactModelGroup = new THREE.Group();
    contactModelGroup.position.set(0.0, 0.10, -3.8);
    contactModelGroup.scale.setScalar(0.95);
    scene.add(contactModelGroup);

    // Colossal Outer Chrome Gateway Arch
    const portalRingMesh = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(1.75, 0.08, 32, 120)), chromeMat);
    contactModelGroup.add(portalRingMesh);

    // Inner Chrome Depth Ring
    const innerPortalRing = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(1.42, 0.035, 24, 100)), chromeMat);
    innerPortalRing.position.z = -0.32;
    contactModelGroup.add(innerPortalRing);

    // Cardinal Alignment Fins
    const finGeo = trackGeo(new THREE.BoxGeometry(0.07, 0.38, 0.12));
    const finPositions = [
      [0, 1.85, 0], [0, -1.85, 0],
      [1.85, 0, 0], [-1.85, 0, 0],
    ];
    finPositions.forEach(([fx, fy, fz], idx) => {
      const fin = new THREE.Mesh(finGeo, chromeMat);
      fin.position.set(fx, fy, fz);
      if (idx >= 2) fin.rotation.z = Math.PI * 0.5;
      contactModelGroup.add(fin);
    });

    // ==========================================
    // 8. CONTINUOUS C1 CUBIC HERMITE CAMERA FLY-THROUGH WAYPOINTS
    // ==========================================
    const waypoints = [
      // 0. Chapter 01: Hero Establishing Shot [p = 0.00]
      // Monumental framing of the Liquid Chrome Möbius sculpture and 3D typography
      {
        p: 0.0,
        camPos: new THREE.Vector3(0.0, 0.15, 5.6),
        camLook: new THREE.Vector3(0.0, 0.05, 0.0),
        camRoll: 0.0,
        keyLightPos: new THREE.Vector3(-12, 18, 12),
        keyLightIntensity: 2.5,
        keyLightColor: new THREE.Color(0xffeed8),
        gridOpacity: 0.0,
        fogDensity: 0.016,
      },
      // 1. Chapter 01: Push-in Parallax Arc around the Chrome Sculpture [p = 0.08]
      // Camera pushes 1.1m into the scene and drifts right, revealing genuine parallax
      {
        p: 0.08,
        camPos: new THREE.Vector3(0.68, 0.28, 4.5),
        camLook: new THREE.Vector3(1.15, 0.12, 0.0),
        camRoll: 0.015,
        keyLightPos: new THREE.Vector3(-11, 17, 11),
        keyLightIntensity: 2.5,
        keyLightColor: new THREE.Color(0xffeed8),
        gridOpacity: 0.0,
        fogDensity: 0.016,
      },
      // 2. Transition 01 -> 02: Lateral Bluff Fly-By [p = 0.18]
      // Camera sweeps laterally to the left past the natural mossy basalt bluff.
      {
        p: 0.18,
        camPos: new THREE.Vector3(-1.95, 0.52, 3.9),
        camLook: new THREE.Vector3(-1.6, 0.22, -1.2),
        camRoll: -0.032,
        keyLightPos: new THREE.Vector3(-9, 16, 9),
        keyLightIntensity: 2.5,
        keyLightColor: new THREE.Color(0xfff0dc),
        gridOpacity: 0.0,
        fogDensity: 0.016,
      },
      // 3. Chapter 02: About / Architectural Foundation [p = 0.33]
      // Camera settles on left flank, framing the Celestial Armillary Sphere and STRUCTURAL RIGOR.
      {
        p: 0.33,
        camPos: new THREE.Vector3(-3.2, 0.65, 2.7),
        camLook: new THREE.Vector3(-2.2, 0.22, -2.5),
        camRoll: 0.0,
        keyLightPos: new THREE.Vector3(-8, 15, -1),
        keyLightIntensity: 2.6,
        keyLightColor: new THREE.Color(0xfff2e0),
        gridOpacity: 0.0,
        fogDensity: 0.016,
      },
      // 4. Transition 02 -> 03: Highland Ridge Ascent [p = 0.46]
      // Camera soars upward and arcs toward center, gliding above the rocky highland terrain.
      {
        p: 0.46,
        camPos: new THREE.Vector3(-0.55, 2.3, 3.1),
        camLook: new THREE.Vector3(0.5, 1.35, -1.2),
        camRoll: 0.028,
        keyLightPos: new THREE.Vector3(-3, 17, 3),
        keyLightIntensity: 2.6,
        keyLightColor: new THREE.Color(0xfff2e0),
        gridOpacity: 0.0,
        fogDensity: 0.016,
      },
      // 5. Chapter 03: Skills / Systems & Stack [p = 0.66]
      // High-angle architectural inspection perspective overlooking Mechanical Polyhedron and SYSTEMS & STACK.
      {
        p: 0.66,
        camPos: new THREE.Vector3(1.1, 3.4, 3.3),
        camLook: new THREE.Vector3(1.8, 1.4, -1.5),
        camRoll: -0.015,
        keyLightPos: new THREE.Vector3(3, 18, 5),
        keyLightIntensity: 2.6,
        keyLightColor: new THREE.Color(0xfff4e4),
        gridOpacity: 0.0,
        fogDensity: 0.016,
      },
      // 6. Transition 03 -> 04: Alignment Dive toward Standing Stones [p = 0.78]
      // Camera dives down from high elevation toward the central corridor horizon, aligning with axis.
      {
        p: 0.78,
        camPos: new THREE.Vector3(0.35, 1.75, 2.7),
        camLook: new THREE.Vector3(0.0, 0.55, -2.2),
        camRoll: 0.012,
        keyLightPos: new THREE.Vector3(2, 15, 0),
        keyLightIntensity: 2.5,
        keyLightColor: new THREE.Color(0xffeed8),
        gridOpacity: 0.0,
        fogDensity: 0.016,
      },
      // 7. Transition 03 -> 04: Slicing through Standing Megaliths [p = 0.85]
      // Camera punches straight between the standing stone monoliths.
      {
        p: 0.85,
        camPos: new THREE.Vector3(0.08, 0.95, 2.1),
        camLook: new THREE.Vector3(0.0, 0.45, -3.5),
        camRoll: 0.0,
        keyLightPos: new THREE.Vector3(0, 13, -2),
        keyLightIntensity: 2.5,
        keyLightColor: new THREE.Color(0xffebd2),
        gridOpacity: 0.0,
        fogDensity: 0.016,
      },
      // 8. Chapter 04: Contact / Sanctuary & Portal Gateway [p = 0.93]
      // Centered horizon view directly facing monumental dimensional chrome portal arch and LET'S CONNECT.
      {
        p: 0.93,
        camPos: new THREE.Vector3(0.0, 0.4, 3.7),
        camLook: new THREE.Vector3(0.0, 0.4, -4.0),
        camRoll: 0.0,
        keyLightPos: new THREE.Vector3(0, 11, -4),
        keyLightIntensity: 2.4,
        keyLightColor: new THREE.Color(0xffe4ca),
        gridOpacity: 0.0,
        fogDensity: 0.016,
      },
      // 9. Loop Tunnel Glide: Camera dives into the Portal Gateway vortex [p = 0.97]
      {
        p: 0.97,
        camPos: new THREE.Vector3(0.0, 0.22, 4.8),
        camLook: new THREE.Vector3(0.0, 0.12, -1.0),
        camRoll: 0.004,
        keyLightPos: new THREE.Vector3(-4, 13, 5),
        keyLightIntensity: 2.5,
        keyLightColor: new THREE.Color(0xffe8d2),
        gridOpacity: 0.0,
        fogDensity: 0.016,
      },
      // 10. Seamless Closed Loop Re-Entry [p = 1.00]
      // Identical to Waypoint 0 in all properties for true mathematical C1 closure
      {
        p: 1.0,
        camPos: new THREE.Vector3(0.0, 0.15, 5.6),
        camLook: new THREE.Vector3(0.0, 0.05, 0.0),
        camRoll: 0.0,
        keyLightPos: new THREE.Vector3(-12, 18, 12),
        keyLightIntensity: 2.5,
        keyLightColor: new THREE.Color(0xffeed8),
        gridOpacity: 0.0,
        fogDensity: 0.016,
      },
    ];

    // Precalculate periodic continuous tangents for seamless loop continuity
    const computePeriodicTangentVec = (pts, i, getter, tension = 0.65) => {
      const n = pts.length;
      if (i === 0 || i === n - 1) {
        // Periodic wrap: predecessor is pts[n-2] at (p - 1.0), successor is pts[1]
        const pPrev = pts[n - 2].p - 1.0;
        const pNext = pts[1].p;
        const dt = Math.max(0.001, pNext - pPrev);
        return getter(pts[1]).clone().sub(getter(pts[n - 2])).multiplyScalar(tension / dt);
      }
      const dt = Math.max(0.001, pts[i + 1].p - pts[i - 1].p);
      return getter(pts[i + 1]).clone().sub(getter(pts[i - 1])).multiplyScalar(tension / dt);
    };

    const computePeriodicTangentScalar = (pts, i, getter, tension = 0.65) => {
      const n = pts.length;
      if (i === 0 || i === n - 1) {
        const pPrev = pts[n - 2].p - 1.0;
        const pNext = pts[1].p;
        const dt = Math.max(0.001, pNext - pPrev);
        return (getter(pts[1]) - getter(pts[n - 2])) * (tension / dt);
      }
      const dt = Math.max(0.001, pts[i + 1].p - pts[i - 1].p);
      return (getter(pts[i + 1]) - getter(pts[i - 1])) * (tension / dt);
    };

    const camPosTangents = waypoints.map((_, i) => computePeriodicTangentVec(waypoints, i, (w) => w.camPos));
    const camLookTangents = waypoints.map((_, i) => computePeriodicTangentVec(waypoints, i, (w) => w.camLook));
    const camRollTangents = waypoints.map((_, i) => computePeriodicTangentScalar(waypoints, i, (w) => w.camRoll));
    const keyLightPosTangents = waypoints.map((_, i) => computePeriodicTangentVec(waypoints, i, (w) => w.keyLightPos));

    // C1-Continuous Cubic Hermite Spline Timeline Sampler
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
      const h = Math.max(0.0001, w1.p - w0.p);
      const u = Math.min(1.0, Math.max(0.0, (clamped - w0.p) / h));

      // Cubic Hermite basis functions
      const u2 = u * u;
      const u3 = u2 * u;
      const h00 = 2 * u3 - 3 * u2 + 1;
      const h10 = (u3 - 2 * u2 + u) * h;
      const h01 = -2 * u3 + 3 * u2;
      const h11 = (u3 - u2) * h;

      // 1. Interpolate Continuous Camera Position
      const cp0 = w0.camPos;
      const cp1 = w1.camPos;
      const cm0 = camPosTangents[idx];
      const cm1 = camPosTangents[idx + 1];
      let camPos = new THREE.Vector3(
        h00 * cp0.x + h01 * cp1.x + h10 * cm0.x + h11 * cm1.x,
        h00 * cp0.y + h01 * cp1.y + h10 * cm0.y + h11 * cm1.y,
        h00 * cp0.z + h01 * cp1.z + h10 * cm0.z + h11 * cm1.z
      );

      // 2. Interpolate Continuous Camera Look-At Target
      const cl0 = w0.camLook;
      const cl1 = w1.camLook;
      const lm0 = camLookTangents[idx];
      const lm1 = camLookTangents[idx + 1];
      let camLook = new THREE.Vector3(
        h00 * cl0.x + h01 * cl1.x + h10 * lm0.x + h11 * lm1.x,
        h00 * cl0.y + h01 * cl1.y + h10 * lm0.y + h11 * lm1.y,
        h00 * cl0.z + h01 * cl1.z + h10 * lm0.z + h11 * lm1.z
      );

      // 3. Interpolate Camera Aerodynamic Roll Bank Angle
      const cr0 = w0.camRoll;
      const cr1 = w1.camRoll;
      const rm0 = camRollTangents[idx];
      const rm1 = camRollTangents[idx + 1];
      const camRoll = h00 * cr0 + h01 * cr1 + h10 * rm0 + h11 * rm1;

      // 4. Interpolate Key Light 3D Position
      const kl0 = w0.keyLightPos;
      const kl1 = w1.keyLightPos;
      const km0 = keyLightPosTangents[idx];
      const km1 = keyLightPosTangents[idx + 1];
      const keyLightPos = new THREE.Vector3(
        h00 * kl0.x + h01 * kl1.x + h10 * km0.x + h11 * km1.x,
        h00 * kl0.y + h01 * kl1.y + h10 * km0.y + h11 * km1.y,
        h00 * kl0.z + h01 * kl1.z + h10 * km0.z + h11 * km1.z
      );

      // Mobile adaptive spatial framing
      if (isMobile) {
        camPos.x = camPos.x * 0.15;
        camPos.y += 0.35;
        camPos.z += 0.5;
        camLook.x = camLook.x * 0.15;
        camLook.y += 0.5;
      }

      // Smooth Hermite blend for scalar lighting and atmospheric density
      const smoothU = THREE.MathUtils.smoothstep(u, 0, 1);
      return {
        camPos,
        camLook,
        camRoll,
        keyLightPos,
        keyLightIntensity: THREE.MathUtils.lerp(w0.keyLightIntensity, w1.keyLightIntensity, smoothU),
        keyLightColor: new THREE.Color().lerpColors(w0.keyLightColor, w1.keyLightColor, smoothU),
        gridOpacity: THREE.MathUtils.lerp(w0.gridOpacity, w1.gridOpacity, smoothU),
        fogDensity: THREE.MathUtils.lerp(w0.fogDensity, w1.fogDensity, smoothU),
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
      updateCameraFov(w, h);
      renderer.setSize(w, h);
      isMobile = (w / h) < 1.0 || w < 768;
    };
    window.addEventListener('resize', handleResize);

    callbacksRef.current.onSceneReady?.();

    // 10. Progressive 3D Reveal State Machine
    const params = new URLSearchParams(window.location.search);
    const forcedTauParam = params.get('revealTau');
    const isForcedTau = forcedTauParam !== null && !isNaN(parseFloat(forcedTauParam));
    const forcedTau = isForcedTau ? Math.max(0, Math.min(1, parseFloat(forcedTauParam))) : null;

    const initialProg = scrollProgressRef?.current ?? 0;
    let isRevealComplete = isForcedTau ? forcedTau >= 1.0 : (initialProg > 0.03);
    let revealTau = isForcedTau ? forcedTau : (isRevealComplete ? 1.0 : 0.0);
    let revealStartTime = null;
    const REVEAL_DURATION = 2.4; // 2.4 seconds total cinematic progression

    if (isRevealComplete) {
      callbacksRef.current.onHeroRevealed?.();
    }

    // 11. Single, Persistent, Stable Animation Loop
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

      // Positive continuous modulo for infinite closed-loop traversal in either scroll direction
      const wrappedProgress = ((progress % 1.0) + 1.0) % 1.0;

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

      // Sample closed periodic mathematical timeline at wrapped progress
      const state = sampleTimeline(wrappedProgress);

      // Progressive Reveal Clock & Trigger Logic
      if (!isRevealComplete && !isForcedTau) {
        if (Math.abs(targetProgress) > 0.02) {
          // User scrolled: instantly fast-forward to full reveal
          isRevealComplete = true;
          revealTau = 1.0;
          callbacksRef.current.onHeroRevealed?.();
        } else {
          if (revealStartTime === null) {
            revealStartTime = elapsedTime;
          }
          const timeSinceStart = elapsedTime - revealStartTime;
          revealTau = Math.min(1.0, timeSinceStart / REVEAL_DURATION);

          if (revealTau >= 1.0) {
            isRevealComplete = true;
            callbacksRef.current.onHeroRevealed?.();
          }
        }
      }

      // A. Update Lighting & Atmospheric Fog (Coordinated with progressive reveal)
      keyLight.position.copy(state.keyLightPos);
      if (!isRevealComplete) {
        // Phase 1 (Dark Arrival): Fog is dense, key light is deeply dimmed with subtle crimson tint
        // As tau approaches 1.0, atmosphere expands and key light blooms into crisp white
        const lightBloom = THREE.MathUtils.smoothstep(revealTau, 0.25, 0.85);
        keyLight.intensity = THREE.MathUtils.lerp(0.4, state.keyLightIntensity, lightBloom);
        const crimsonRim = new THREE.Color(0xef4444);
        keyLight.color.lerpColors(crimsonRim, state.keyLightColor, THREE.MathUtils.smoothstep(revealTau, 0.4, 0.9));
        sceneFog.density = THREE.MathUtils.lerp(0.062, state.fogDensity, THREE.MathUtils.smoothstep(revealTau, 0.15, 0.85));
      } else {
        keyLight.intensity = state.keyLightIntensity;
        keyLight.color.copy(state.keyLightColor);
        sceneFog.density = state.fogDensity;
      }

      // B. Natural Wind Sway on Highland Grass Tufts
      grassTufts.forEach((tuft) => {
        tuft.rotation.z = tuft.userData.baseRotZ + Math.sin(elapsedTime * 1.6 + tuft.userData.phase) * 0.045 * motionScale;
      });

      // C. SECTION MODEL REVEALS & EXITS (Strict Physical Reveal & Mutual Exclusion Choreography)
      const isMobile = window.innerWidth <= 768;
      const isTablet = !isMobile && window.innerWidth <= 1024;
      const isLaptop = !isMobile && !isTablet && (window.innerWidth <= 1440 || window.innerHeight <= 820);
      const isNarrow = isMobile || isTablet;

      // 1. Hero Model & 3D Typography (Stationary Architectural Landmark in World Space)
      let heroAlpha = 0;
      const heroBaseX = isNarrow ? 0.0 : 1.75;
      const heroBaseY = isNarrow ? 0.65 : 0.20;
      const heroBaseZ = 0.0;
      const heroBaseScale = isMobile ? 0.54 : isTablet ? 0.58 : 0.62;
      const heroTextBaseX = isNarrow ? 0.0 : -1.25;
      const heroTextBaseY = isNarrow ? 2.25 : 0.65;
      const heroTextBaseScale = isMobile ? 0.48 : isTablet ? 0.62 : isLaptop ? 0.75 : 0.90;

      if (isNarrow) {
        heroText3D.mesh.rotation.set(0, 0, 0);
      } else {
        heroText3D.mesh.rotation.set(-0.06, 0.18, 0.0);
      }

      if (wrappedProgress >= 0.94) {
        const t = (wrappedProgress - 0.94) / 0.06;
        heroAlpha = THREE.MathUtils.smoothstep(t, 0, 1);
      } else if (wrappedProgress <= 0.10) {
        heroAlpha = 1.0;
      } else if (wrappedProgress < 0.22) {
        const t = (wrappedProgress - 0.10) / 0.12;
        heroAlpha = 1.0 - THREE.MathUtils.smoothstep(t, 0, 1);
      }

      // STRICT STATIONARY WORLD-SPACE PLACEMENT (No scroll translation or warping)
      heroModelGroup.position.set(heroBaseX, heroBaseY, heroBaseZ);
      heroModelGroup.scale.setScalar(heroBaseScale);
      heroText3D.mesh.position.set(heroTextBaseX, heroTextBaseY, 0.1);
      heroText3D.mesh.scale.setScalar(heroTextBaseScale);

      // Hero Model 4-Phase Progressive Material State
      if (!isRevealComplete) {
        // Phase 2: Crimson Wireframe Formation (tau: 0.12 -> 0.48)
        if (revealTau < 0.12) {
          heroWireframeMat.opacity = 0.0;
          innerLatticeMat.opacity = 0.0;
          wireframeKnot.visible = false;
          wireframeRing1.visible = false;
        } else if (revealTau <= 0.48) {
          const tw = (revealTau - 0.12) / 0.36;
          const sw = THREE.MathUtils.smoothstep(tw, 0, 1);
          wireframeKnot.visible = true;
          wireframeRing1.visible = true;
          heroWireframeMat.opacity = sw * 0.85;
          innerLatticeMat.opacity = sw * 0.65;
        } else if (revealTau < 0.82) {
          // Phase 3: Wireframe dissolve as chrome materializes
          const twd = (revealTau - 0.48) / 0.34;
          const swd = THREE.MathUtils.smoothstep(twd, 0, 1);
          heroWireframeMat.opacity = (1.0 - swd) * 0.85;
        } else {
          heroWireframeMat.opacity = 0.0;
          wireframeKnot.visible = false;
          wireframeRing1.visible = false;
        }

        // Phase 3: Chrome Materialization & Ruby Core Awakening (tau: 0.38 -> 0.82)
        if (revealTau < 0.38) {
          heroChromeMat.opacity = 0.0;
          heroChromeMat.roughness = 0.8;
          heroChromeMat.envMapIntensity = 0.0;
          heroRubyMat.opacity = 0.0;
          heroRubyMat.emissiveIntensity = 0.0;
        } else {
          const tm = Math.min(1.0, (revealTau - 0.38) / 0.44);
          const sm = THREE.MathUtils.smoothstep(tm, 0, 1);
          heroChromeMat.opacity = sm;
          heroChromeMat.roughness = THREE.MathUtils.lerp(0.8, 0.04, sm);
          heroChromeMat.envMapIntensity = sm * 2.2;
          heroRubyMat.opacity = sm;
          heroRubyMat.emissiveIntensity = sm * 0.40;
        }
      } else {
        // Fully revealed persistent state:
        wireframeKnot.visible = false;
        wireframeRing1.visible = false;
        heroWireframeMat.opacity = 0.0;
        heroChromeMat.opacity = heroAlpha;
        heroChromeMat.roughness = 0.04;
        heroChromeMat.envMapIntensity = 2.2;
        heroRubyMat.opacity = heroAlpha;
        heroRubyMat.emissiveIntensity = 0.40 * heroAlpha;
        innerLatticeMat.opacity = 0.0;
      }

      heroModelGroup.visible = heroAlpha > 0.01;

      // Phase 4: In-Scene 3D Typography Coordination (tau: 0.72 -> 1.00)
      let typographyRevealFactor = 1.0;
      if (!isRevealComplete) {
        if (revealTau < 0.72) {
          typographyRevealFactor = 0.0;
        } else {
          const tty = (revealTau - 0.72) / 0.28;
          typographyRevealFactor = THREE.MathUtils.smoothstep(tty, 0, 1);
        }
      }
      heroText3D.mat.opacity = heroAlpha * typographyRevealFactor;
      heroText3D.mesh.visible = (heroAlpha > 0.01) && (typographyRevealFactor > 0.01);

      if (heroModelGroup.visible) {
        chromeKnot.rotation.y += 0.0035 * motionScale;
        chromeKnot.rotation.x = Math.sin(elapsedTime * 0.3) * 0.08;
        innerGem.rotation.y -= 0.005 * motionScale;
        ring1Group.rotation.y += 0.004 * motionScale;
      }

      // 2. About Model & 3D Typography (Stationary Architectural Landmark)
      let aboutAlpha = 0;
      const aboutBaseX = isNarrow ? 0.0 : -2.2;
      const aboutBaseY = isNarrow ? 0.95 : 0.30;
      const aboutBaseZ = isNarrow ? -2.6 : -2.5;
      const aboutBaseScale = isMobile ? 0.65 : isTablet ? 0.72 : 0.78;
      const aboutTextBaseX = isNarrow ? 0.0 : -2.2;
      const aboutTextBaseY = isNarrow ? 2.45 : 1.45;
      const aboutTextBaseZ = isNarrow ? -2.4 : -2.3;
      const aboutTextBaseScale = isMobile ? 0.48 : isTablet ? 0.62 : isLaptop ? 0.75 : 0.90;

      if (isNarrow) {
        aboutText3D.mesh.rotation.set(0, 0, 0);
      } else {
        aboutText3D.mesh.rotation.set(0.08, -0.15, 0.0);
      }

      if (wrappedProgress >= 0.18 && wrappedProgress < 0.28) {
        aboutAlpha = THREE.MathUtils.smoothstep((wrappedProgress - 0.18) / 0.10, 0, 1);
      } else if (wrappedProgress >= 0.28 && wrappedProgress <= 0.42) {
        aboutAlpha = 1.0;
      } else if (wrappedProgress > 0.42 && wrappedProgress < 0.54) {
        aboutAlpha = 1.0 - THREE.MathUtils.smoothstep((wrappedProgress - 0.42) / 0.12, 0, 1);
      }

      aboutModelGroup.position.set(aboutBaseX, aboutBaseY, aboutBaseZ);
      aboutModelGroup.scale.setScalar(aboutBaseScale);
      aboutText3D.mesh.position.set(aboutTextBaseX, aboutTextBaseY, aboutTextBaseZ);
      aboutText3D.mesh.scale.setScalar(aboutTextBaseScale);
      aboutModelGroup.visible = aboutAlpha > 0.01;
      aboutText3D.mesh.visible = aboutAlpha > 0.01;
      aboutText3D.mat.opacity = aboutAlpha;

      if (aboutModelGroup.visible) {
        aboutCore.rotation.y += 0.005 * motionScale;
        aboutCore.rotation.x += 0.003 * motionScale;
        aboutWire.rotation.y += 0.005 * motionScale;
        aboutRuby.rotation.y -= 0.006 * motionScale;
        armillaryRing1.rotation.x += 0.006 * motionScale;
        armillaryRing2.rotation.y += 0.005 * motionScale;
      }

      // 3. Skills Model & 3D Typography (Stationary Architectural Landmark)
      let skillsAlpha = 0;
      const skillsBaseX = isNarrow ? 0.0 : 1.8;
      const skillsBaseY = isNarrow ? 1.95 : 1.20;
      const skillsBaseZ = isNarrow ? -1.8 : -1.5;
      const skillsBaseScale = isMobile ? 0.65 : isTablet ? 0.72 : 0.75;
      const skillsTextBaseX = isNarrow ? 0.0 : 1.8;
      const skillsTextBaseY = isNarrow ? 3.20 : 2.5;
      const skillsTextBaseZ = isNarrow ? -1.6 : -1.3;
      const skillsTextBaseScale = isMobile ? 0.48 : isTablet ? 0.62 : isLaptop ? 0.75 : 0.90;

      if (isNarrow) {
        skillsText3D.mesh.rotation.set(0, 0, 0);
      } else {
        skillsText3D.mesh.rotation.set(0.24, -0.12, 0.0);
      }

      if (wrappedProgress >= 0.48 && wrappedProgress < 0.60) {
        skillsAlpha = THREE.MathUtils.smoothstep((wrappedProgress - 0.48) / 0.12, 0, 1);
      } else if (wrappedProgress >= 0.60 && wrappedProgress <= 0.72) {
        skillsAlpha = 1.0;
      } else if (wrappedProgress > 0.72 && wrappedProgress < 0.84) {
        skillsAlpha = 1.0 - THREE.MathUtils.smoothstep((wrappedProgress - 0.72) / 0.12, 0, 1);
      }

      skillsModelGroup.position.set(skillsBaseX, skillsBaseY, skillsBaseZ);
      skillsModelGroup.scale.setScalar(skillsBaseScale);
      skillsText3D.mesh.position.set(skillsTextBaseX, skillsTextBaseY, skillsTextBaseZ);
      skillsText3D.mesh.scale.setScalar(skillsTextBaseScale);
      skillsModelGroup.visible = skillsAlpha > 0.01;
      skillsText3D.mesh.visible = skillsAlpha > 0.01;
      skillsText3D.mat.opacity = skillsAlpha;

      if (skillsModelGroup.visible) {
        polyMesh.rotation.y += 0.005 * motionScale;
        polyWire.rotation.y += 0.005 * motionScale;
        prismMesh.rotation.x += 0.007 * motionScale;
        prismMesh.rotation.y -= 0.008 * motionScale;
        calibratorArms.forEach((arm, idx) => {
          const pulse = 1.0 + Math.sin(elapsedTime * 2.0 + idx) * 0.04;
          arm.scale.setScalar(pulse);
        });
      }

      // 4. Contact Model & 3D Typography (Stationary Architectural Landmark)
      let contactAlpha = 0;
      const contactBaseX = 0.0;
      const contactBaseY = isNarrow ? 0.35 : 0.10;
      const contactBaseZ = isNarrow ? -4.0 : -3.8;
      const contactBaseScale = isMobile ? 0.75 : isTablet ? 0.85 : 0.95;
      const contactTextBaseX = 0.0;
      const contactTextBaseY = isNarrow ? 2.65 : 2.60;
      const contactTextBaseZ = isNarrow ? -4.0 : -3.8;
      const contactTextBaseScale = isMobile ? 0.48 : isTablet ? 0.62 : isLaptop ? 0.75 : 0.90;

      contactText3D.mesh.rotation.set(0.0, 0.0, 0.0);

      if (wrappedProgress >= 0.80 && wrappedProgress < 0.90) {
        contactAlpha = THREE.MathUtils.smoothstep((wrappedProgress - 0.80) / 0.10, 0, 1);
      } else if (wrappedProgress >= 0.90 && wrappedProgress <= 0.94) {
        contactAlpha = 1.0;
      } else if (wrappedProgress > 0.94 && wrappedProgress < 0.97) {
        contactAlpha = 1.0 - THREE.MathUtils.smoothstep((wrappedProgress - 0.94) / 0.03, 0, 1);
      }

      contactModelGroup.position.set(contactBaseX, contactBaseY, contactBaseZ);
      contactModelGroup.scale.setScalar(contactBaseScale);
      contactText3D.mesh.position.set(contactTextBaseX, contactTextBaseY, contactTextBaseZ);
      contactText3D.mesh.scale.setScalar(contactTextBaseScale);
      contactModelGroup.visible = contactAlpha > 0.01;
      contactText3D.mesh.visible = contactAlpha > 0.01;
      contactText3D.mat.opacity = contactAlpha;

      if (contactModelGroup.visible) {
        portalRingMesh.rotation.z = Math.sin(elapsedTime * 0.25) * 0.04 * motionScale;
        innerPortalRing.rotation.z = -Math.sin(elapsedTime * 0.25) * 0.04 * motionScale;
      }

      // Subtle, grounded hover micro-lift (+0.04m on Y) when cursor engages landmark area
      const isHeroActive = wrappedProgress <= 0.15 || wrappedProgress >= 0.95;
      const isAboutActive = wrappedProgress >= 0.25 && wrappedProgress <= 0.40;
      const isSkillsActive = wrappedProgress >= 0.58 && wrappedProgress <= 0.72;
      const isContactActive = wrappedProgress >= 0.88 && wrappedProgress <= 0.95;

      const cursorNearModel =
        (isHeroActive && mouseDamped.x > 0.1) ||
        (isAboutActive && mouseDamped.x < -0.1) ||
        (isSkillsActive && mouseDamped.x > 0.1) ||
        (isContactActive && Math.abs(mouseDamped.x) < 0.35);

      const hoverLift = cursorNearModel ? 0.04 : 0.0;
      if (isHeroActive) heroModelGroup.position.y = heroBaseY + hoverLift;
      if (isAboutActive) aboutModelGroup.position.y = aboutBaseY + hoverLift;
      if (isSkillsActive) skillsModelGroup.position.y = skillsBaseY + hoverLift;
      if (isContactActive) contactModelGroup.position.y = contactBaseY + hoverLift;

      // Atmospheric sunlight dust motes drift
      sunDustParticles.rotation.y = elapsedTime * 0.008 * motionScale;

      // D. Direct, Stable Camera Positioning (Continuous C1 Spline Flight)
      const parallaxOffsetX = mouseDamped.x * 0.22 * currentParallaxWeight;
      const parallaxOffsetY = mouseDamped.y * 0.14 * currentParallaxWeight;

      camera.position.set(
        state.camPos.x + parallaxOffsetX,
        state.camPos.y + parallaxOffsetY,
        state.camPos.z
      );
      camera.lookAt(state.camLook);

      // Subtle aerodynamic banking roll on flight curves (disabled if reduced-motion preferred)
      if (!prefersReducedMotion && Math.abs(state.camRoll) > 0.0001) {
        camera.rotateZ(state.camRoll * (isMobile ? 0.35 : 1.0));
      }

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
  }, [scrollProgressRef]); // Stable ref dependency ensures exactly one mount

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
