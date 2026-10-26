import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * High-End Cinematic 3D Experience (Redesigned)
 * 5 Unique Realms // 5 Unique Interactive 3D Sculptures // Wireframe Zoom Arrival
 * Built with Three.js WebGL and web3d-integration-patterns
 */
export default function IntroScene({
  scrollProgressRef,
  onHeroRevealed,
  onSceneReady,
  onWebGLError,
  onObjectInteract,
  onObjectClick,
  onObjectClickOutside,
}) {
  const containerRef = useRef(null);
  const [webGLSupported, setWebGLSupported] = useState(true);

  const callbacksRef = useRef({
    onHeroRevealed,
    onSceneReady,
    onWebGLError,
    onObjectInteract,
    onObjectClick,
    onObjectClickOutside,
  });
  useEffect(() => {
    callbacksRef.current = {
      onHeroRevealed,
      onSceneReady,
      onWebGLError,
      onObjectInteract,
      onObjectClick,
      onObjectClickOutside,
    };
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    const checkWebGL = () => {
      try {
        const testCanvas = document.createElement('canvas');
        return Boolean(
          window.WebGLRenderingContext &&
            (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl'))
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

    // Resource tracking for leak-free disposal
    const disposables = {
      geometries: [],
      materials: [],
      textures: [],
    };
    const trackGeo = (g) => { disposables.geometries.push(g); return g; };
    const trackMat = (m) => { disposables.materials.push(m); return m; };
    const trackTex = (t) => { disposables.textures.push(t); return t; };

    // ==========================================
    // 1. SCENE, CAMERA, & RENDERER INITIALIZATION
    // ==========================================
    const scene = new THREE.Scene();
    const sceneFog = new THREE.FogExp2(0x0c0f17, 0.022);
    scene.fog = sceneFog;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);

    const updateCameraFov = (w, h) => {
      const aspect = w / h;
      camera.aspect = aspect;
      if (aspect < 0.6) {
        camera.fov = 58; // Phone portrait
      } else if (aspect < 0.85) {
        camera.fov = 52; // Tall phone / fold
      } else if (aspect < 1.2) {
        camera.fov = 48; // Tablet portrait
      } else {
        camera.fov = 44; // Desktop widescreen
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
      callbacksRef.current.onWebGLError?.();
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // ==========================================
    // 2. LUMINOUS HDRI-STYLE ENVIRONMENT MAP
    // High-contrast radiant horizon so chrome shines like liquid mirror
    // ==========================================
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const createRadiantEnvironment = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 2048;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');

      // Sky dome gradient (Deep midnight zenith down to horizon at y = 512)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, 1024);
      skyGrad.addColorStop(0.0, '#060913'); // Deep midnight indigo zenith
      skyGrad.addColorStop(0.35, '#121b2d'); // Overcast twilight blue
      skyGrad.addColorStop(0.48, '#24324c'); // Upper horizon atmosphere
      skyGrad.addColorStop(0.50, '#eab308'); // Golden-amber sunset line at exact horizon
      skyGrad.addColorStop(0.52, '#f97316'); // Warm peach/orange sunset band
      skyGrad.addColorStop(0.55, '#dc2626'); // Deep ruby-crimson glow
      skyGrad.addColorStop(0.65, '#1c1917'); // Dark ground reflection
      skyGrad.addColorStop(1.0, '#0a0908'); // Dark nadir
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, 2048, 1024);

      // Radiant Sun core & atmospheric corona
      const sunGrad = ctx.createRadialGradient(720, 500, 4, 720, 500, 260);
      sunGrad.addColorStop(0.0, '#ffffff');
      sunGrad.addColorStop(0.15, 'rgba(254, 240, 138, 0.95)');
      sunGrad.addColorStop(0.45, 'rgba(249, 115, 22, 0.40)');
      sunGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = sunGrad;
      ctx.fillRect(400, 240, 640, 520);

      // Star-field speckles in upper sky
      for (let i = 0; i < 400; i++) {
        const sx = Math.random() * 2048;
        const sy = Math.random() * 450;
        const sr = Math.random() * 1.5;
        ctx.fillStyle = `rgba(255, 255, 255, ${0.2 + Math.random() * 0.7})`;
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
      }

      const tex = trackTex(new THREE.CanvasTexture(canvas));
      tex.mapping = THREE.EquirectangularReflectionMapping;
      tex.colorSpace = THREE.SRGBColorSpace;
      const envMap = pmremGenerator.fromEquirectangular(tex).texture;
      pmremGenerator.dispose();
      return { envMap, skyTexture: tex };
    };

    const { envMap, skyTexture } = createRadiantEnvironment();
    scene.environment = envMap;
    scene.background = skyTexture;

    // ==========================================
    // 3. DYNAMIC MULTI-REALM LIGHTING
    // ==========================================
    const ambientLight = new THREE.AmbientLight(0x18202c, 0.85);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0x475569, 0x1c1917, 1.4);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffeed8, 3.0);
    keyLight.position.set(-10, 15, 10);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0004;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 40;
    keyLight.shadow.camera.left = -12;
    keyLight.shadow.camera.right = 12;
    keyLight.shadow.camera.top = 12;
    keyLight.shadow.camera.bottom = -12;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xf59e0b, 0.6);
    fillLight.position.set(12, 6, -6);
    scene.add(fillLight);

    // ==========================================
    // 4. ELEGANT CYBERNETIC PERSPECTIVE FLOOR GRID
    // Clean, sleek, high-end 3D floor with luminous perspective grid
    // ==========================================
    const createPerspectiveFloorTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#0a0d14';
      ctx.fillRect(0, 0, 1024, 1024);

      // Fine grid lines
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.28)';
      ctx.lineWidth = 1.5;
      const step = 64;
      for (let i = 0; i <= 1024; i += step) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 1024);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(1024, i);
        ctx.stroke();
      }

      // Intersection energy crosshairs
      for (let x = 0; x <= 1024; x += step) {
        for (let y = 0; y <= 1024; y += step) {
          ctx.fillStyle = 'rgba(239, 68, 68, 0.65)';
          ctx.beginPath();
          ctx.arc(x, y, 2.0, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(8, 8);
      tex.anisotropy = 8;
      return trackTex(tex);
    };

    const floorGeo = trackGeo(new THREE.PlaneGeometry(80, 80));
    const floorMat = trackMat(
      new THREE.MeshStandardMaterial({
        map: createPerspectiveFloorTexture(),
        color: 0x242832,
        roughness: 0.65,
        metalness: 0.45,
        transparent: true,
        opacity: 0.88,
      })
    );
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI * 0.5;
    floorMesh.position.y = -1.6;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Elegant horizon ring
    const horizonRingGeo = trackGeo(new THREE.RingGeometry(24, 24.2, 120));
    const horizonRingMat = trackMat(
      new THREE.MeshBasicMaterial({
        color: 0xef4444,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide,
      })
    );
    const horizonRing = new THREE.Mesh(horizonRingGeo, horizonRingMat);
    horizonRing.rotation.x = -Math.PI * 0.5;
    horizonRing.position.y = -1.58;
    scene.add(horizonRing);

    // ==========================================
    // 5. SHARED ULTRA-PREMIUM PBR MATERIALS
    // ==========================================
    // Liquid Mirror Chrome
    const liquidChromeMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.99,
        roughness: 0.02,
        clearcoat: 1.0,
        clearcoatRoughness: 0.02,
        reflectivity: 1.0,
        envMapIntensity: 2.8,
      })
    );

    // Incandescent Faceted Ruby Core
    const glowingRubyMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xff1744,
        emissive: 0xe11d48,
        emissiveIntensity: 1.6,
        roughness: 0.12,
        metalness: 0.1,
        transmission: 0.65,
        ior: 1.76,
        transparent: true,
        opacity: 0.95,
      })
    );

    // Dark Titanium Core
    const titaniumMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        metalness: 0.95,
        roughness: 0.18,
        envMapIntensity: 2.2,
      })
    );

    // Glowing Laser Wireframe Material
    const laserWireMat = trackMat(
      new THREE.MeshBasicMaterial({
        color: 0xef4444,
        wireframe: true,
        transparent: true,
        opacity: 0.85,
      })
    );

    // Shared Crystal Materials for Centers
    const sapphireGlassMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0x0284c7,
        emissive: 0x0369a1,
        emissiveIntensity: 0.9,
        roughness: 0.1,
        metalness: 0.15,
        transmission: 0.82,
        ior: 1.65,
        transparent: true,
        opacity: 0.90,
      })
    );

    const amberGlassMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xf59e0b,
        emissive: 0xb45309,
        emissiveIntensity: 0.9,
        roughness: 0.1,
        metalness: 0.15,
        transmission: 0.82,
        ior: 1.65,
        transparent: true,
        opacity: 0.90,
      })
    );

    const emeraldGlassMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0x10b981,
        emissive: 0x047857,
        emissiveIntensity: 0.9,
        roughness: 0.1,
        metalness: 0.15,
        transmission: 0.82,
        ior: 1.65,
        transparent: true,
        opacity: 0.90,
      })
    );

    // ==========================================
    // 6. THE 5 DISTINCT 3D INTERACTIVE OBJECTS
    // ==========================================

    // ------------------------------------------
    // OBJECT 1: HERO — LIQUID CHROME MÖBIUS MONOLITH WITH PULSING RUBY HEART
    // ------------------------------------------
    const heroGroup = new THREE.Group();
    heroGroup.position.set(0.0, 0.15, 0.0);
    scene.add(heroGroup);

    const knotGeo = trackGeo(new THREE.TorusKnotGeometry(0.95, 0.22, 180, 36, 2, 3));
    const heroChromeMesh = new THREE.Mesh(knotGeo, liquidChromeMat);
    heroChromeMesh.castShadow = true;
    heroGroup.add(heroChromeMesh);

    // Wireframe overlay for arrival reveal
    const heroWireMesh = new THREE.Mesh(knotGeo, laserWireMat);
    heroChromeMesh.add(heroWireMesh);

    // Incandescent Ruby Core
    const rubyGeo = trackGeo(new THREE.OctahedronGeometry(0.48, 0));
    const heroRubyMesh = new THREE.Mesh(rubyGeo, glowingRubyMat);
    heroGroup.add(heroRubyMesh);

    // Dedicated internal Ruby point light bathing chrome loops in red radiance
    const rubyCoreLight = new THREE.PointLight(0xff1e46, 3.2, 4.0, 1.8);
    heroRubyMesh.add(rubyCoreLight);

    // Orbital architectural chrome ring
    const ring1Geo = trackGeo(new THREE.TorusGeometry(1.48, 0.022, 24, 120));
    const heroOrbitalRing = new THREE.Mesh(ring1Geo, liquidChromeMat);
    heroOrbitalRing.rotation.x = Math.PI * 0.22;
    heroGroup.add(heroOrbitalRing);

    // ------------------------------------------
    // OBJECT 2: ABOUT — CELESTIAL ARMILLARY GYROSCOPE SYSTEM
    // ------------------------------------------
    const aboutGroup = new THREE.Group();
    aboutGroup.position.set(-3.5, 0.25, -3.5);
    scene.add(aboutGroup);

    const dodecaGeo = trackGeo(new THREE.DodecahedronGeometry(0.68, 0));
    const aboutCore = new THREE.Mesh(dodecaGeo, sapphireGlassMat);
    aboutCore.castShadow = true;
    aboutGroup.add(aboutCore);

    const aboutCoreWire = new THREE.LineSegments(
      trackGeo(new THREE.EdgesGeometry(dodecaGeo)),
      trackMat(new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.95 }))
    );
    aboutCore.add(aboutCoreWire);

    // Glowing sapphire jewel light
    const aboutJewelLight = new THREE.PointLight(0x38bdf8, 3.2, 5.0, 1.6);
    aboutGroup.add(aboutJewelLight);

    // Inner chrome faceted core
    const aboutJewel = new THREE.Mesh(trackGeo(new THREE.OctahedronGeometry(0.36, 0)), liquidChromeMat);
    aboutGroup.add(aboutJewel);

    // Triple concentric chrome gimbal rings
    const gimbal1 = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(1.35, 0.026, 24, 100)), liquidChromeMat);
    aboutGroup.add(gimbal1);

    const gimbal2 = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(1.65, 0.024, 24, 120)), liquidChromeMat);
    gimbal2.rotation.x = Math.PI * 0.5;
    aboutGroup.add(gimbal2);

    const gimbal3 = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(1.95, 0.020, 24, 140)), liquidChromeMat);
    gimbal3.rotation.y = Math.PI * 0.5;
    aboutGroup.add(gimbal3);

    // ------------------------------------------
    // OBJECT 3: SKILLS — QUANTUM POLYHEDRON ASSEMBLY
    // ------------------------------------------
    const skillsGroup = new THREE.Group();
    skillsGroup.position.set(3.6, 1.15, -3.2);
    scene.add(skillsGroup);

    const icosaGeo = trackGeo(new THREE.IcosahedronGeometry(0.78, 1));
    const skillsCore = new THREE.Mesh(icosaGeo, amberGlassMat);
    skillsCore.castShadow = true;
    skillsGroup.add(skillsCore);

    const skillsWire = new THREE.LineSegments(
      trackGeo(new THREE.WireframeGeometry(icosaGeo)),
      trackMat(new THREE.LineBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.95 }))
    );
    skillsCore.add(skillsWire);

    // Optical chrome prism inside with internal amber light
    const skillsPrism = new THREE.Mesh(trackGeo(new THREE.OctahedronGeometry(0.45, 0)), liquidChromeMat);
    skillsGroup.add(skillsPrism);

    const skillsCoreLight = new THREE.PointLight(0xf59e0b, 3.0, 5.0, 1.6);
    skillsGroup.add(skillsCoreLight);

    // 6 Cardinal telescoping calibrator arms with ruby alignment prisms
    const calibratorArms = [];
    const axes = [
      [1.3, 0, 0], [-1.3, 0, 0],
      [0, 1.3, 0], [0, -1.3, 0],
      [0, 0, 1.3], [0, 0, -1.3]
    ];
    axes.forEach(([ax, ay, az]) => {
      const arm = new THREE.Group();
      arm.position.set(ax, ay, az);
      const rod = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.02, 0.02, 0.55, 8)), liquidChromeMat);
      if (ax !== 0) rod.rotation.z = Math.PI * 0.5;
      else if (az !== 0) rod.rotation.x = Math.PI * 0.5;
      arm.add(rod);
      const tip = new THREE.Mesh(trackGeo(new THREE.OctahedronGeometry(0.10, 0)), glowingRubyMat);
      arm.add(tip);
      skillsGroup.add(arm);
      calibratorArms.push(arm);
    });

    // ------------------------------------------
    // OBJECT 4: PROJECTS — CYBERNETIC DATA VAULT & ORBITING ARTIFACTS
    // ------------------------------------------
    const projectsGroup = new THREE.Group();
    projectsGroup.position.set(0.0, 0.15, -7.5);
    scene.add(projectsGroup);

    // Sleek Hexagonal Holo-Vault Pedestal (compact height to keep landscape open)
    const pillarGeo = trackGeo(new THREE.CylinderGeometry(0.48, 0.58, 0.85, 6));
    const pillarMesh = new THREE.Mesh(pillarGeo, titaniumMat);
    pillarMesh.castShadow = true;
    projectsGroup.add(pillarMesh);

    const pillarWire = new THREE.LineSegments(
      trackGeo(new THREE.EdgesGeometry(pillarGeo)),
      trackMat(new THREE.LineBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.95 }))
    );
    pillarMesh.add(pillarWire);

    // Emerald Vault Core Beacon
    const vaultCoreLight = new THREE.PointLight(0x10b981, 3.5, 6.0, 1.6);
    vaultCoreLight.position.set(0, 0.52, 0);
    projectsGroup.add(vaultCoreLight);

    const vaultCoreGem = new THREE.Mesh(
      trackGeo(new THREE.OctahedronGeometry(0.24, 0)),
      emeraldGlassMat
    );
    vaultCoreGem.position.set(0, 0.52, 0);
    projectsGroup.add(vaultCoreGem);

    // 3 Orbiting High-Value Project Crystals
    const projectShards = [
      { geo: new THREE.OctahedronGeometry(0.30, 0), mat: sapphireGlassMat, label: 'Student Record' },
      { geo: new THREE.DodecahedronGeometry(0.26, 0), mat: amberGlassMat, label: 'Personal Portfolio' },
      { geo: new THREE.ConeGeometry(0.28, 0.58, 6), mat: emeraldGlassMat, label: 'Commercial Web' }
    ];
    const shardMeshes = [];
    projectShards.forEach((item, idx) => {
      const mesh = new THREE.Mesh(trackGeo(item.geo), item.mat);
      projectsGroup.add(mesh);
      shardMeshes.push({ mesh, baseAngle: (idx * Math.PI * 2) / 3, radius: 1.45 });
    });

    // ------------------------------------------
    // OBJECT 5: CONTACT — MONUMENTAL DIMENSIONAL GATEWAY SINGULARITY
    // ------------------------------------------
    const contactGroup = new THREE.Group();
    contactGroup.position.set(0.0, 0.20, -12.5);
    scene.add(contactGroup);

    // Monumental outer chrome arch
    const outerArchGeo = trackGeo(new THREE.TorusGeometry(2.0, 0.085, 32, 140));
    const outerArchMesh = new THREE.Mesh(outerArchGeo, liquidChromeMat);
    outerArchMesh.castShadow = true;
    contactGroup.add(outerArchMesh);

    // Inner counter-rotating chrome depth ring
    const innerArchGeo = trackGeo(new THREE.TorusGeometry(1.62, 0.045, 24, 120));
    const innerArchMesh = new THREE.Mesh(innerArchGeo, liquidChromeMat);
    innerArchMesh.position.z = -0.35;
    contactGroup.add(innerArchMesh);

    // 4 Cardinal alignment fins
    const finGeo = trackGeo(new THREE.BoxGeometry(0.08, 0.45, 0.15));
    const finPositions = [
      [0, 2.15, 0], [0, -2.15, 0],
      [2.15, 0, 0], [-2.15, 0, 0]
    ];
    finPositions.forEach(([fx, fy, fz], idx) => {
      const fin = new THREE.Mesh(finGeo, liquidChromeMat);
      fin.position.set(fx, fy, fz);
      if (idx >= 2) fin.rotation.z = Math.PI * 0.5;
      contactGroup.add(fin);
    });

    // Dimensional Accretion Vortex Disk
    const accretionGeo = trackGeo(new THREE.RingGeometry(0.40, 1.25, 64));
    const accretionMat = trackMat(
      new THREE.MeshBasicMaterial({
        color: 0xff1744,
        transparent: true,
        opacity: 0.65,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      })
    );
    const accretionMesh = new THREE.Mesh(accretionGeo, accretionMat);
    accretionMesh.position.z = -0.4;
    contactGroup.add(accretionMesh);

    // Event Horizon Singularity Orb
    const singularityGeo = trackGeo(new THREE.SphereGeometry(0.38, 32, 24));
    const singularityMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xff0033,
        emissive: 0xff1744,
        emissiveIntensity: 2.2,
        roughness: 0.1,
        metalness: 0.2,
        transmission: 0.5,
        transparent: true,
        opacity: 0.95,
      })
    );
    const beaconMesh = new THREE.Mesh(singularityGeo, singularityMat);
    beaconMesh.position.z = -0.45;
    contactGroup.add(beaconMesh);

    const beaconLight = new THREE.PointLight(0xff1744, 5.0, 12.0, 1.4);
    beaconLight.position.z = -0.3;
    contactGroup.add(beaconLight);

    // ==========================================
    // 7. ATMOSPHERIC PARTICLES & DUST MOTES
    // ==========================================
    const particleCount = 120;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 24;
      particlePositions[i * 3 + 1] = Math.random() * 5.5 - 1.2;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 26 - 4;
    }
    const particleGeo = trackGeo(new THREE.BufferGeometry());
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = trackMat(
      new THREE.PointsMaterial({
        color: 0xfef08a,
        size: 0.024,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    const atmosphereParticles = new THREE.Points(particleGeo, particleMat);
    scene.add(atmosphereParticles);

    // ==========================================
    // 8. C1 CUBIC HERMITE CAMERA SPLINE (5 CHAPTERS + 5 TRANSITIONS)
    // ==========================================
    const waypoints = [
      // 0. Chapter 01: Hero Monolith [p = 0.00] — Solar Dawn & Crimson Obsidian
      {
        p: 0.0,
        camPos: new THREE.Vector3(0.0, 0.25, 4.6),
        camLook: new THREE.Vector3(0.0, 0.15, 0.0),
        camRoll: 0.0,
        keyColor: new THREE.Color(0xffeed8),
        keyIntensity: 3.2,
        fogColor: new THREE.Color(0x0c0f17),
        fogDensity: 0.020,
        groundColor: new THREE.Color(0x281a20),
        ringColor: new THREE.Color(0xef4444),
      },
      // 1. Transition 01 -> 02: Swoop into Celestial Canyon [p = 0.10]
      {
        p: 0.10,
        camPos: new THREE.Vector3(-1.8, 0.42, 2.6),
        camLook: new THREE.Vector3(-3.0, 0.28, -1.8),
        camRoll: -0.028,
        keyColor: new THREE.Color(0xbae6fd),
        keyIntensity: 2.8,
        fogColor: new THREE.Color(0x090e1c),
        fogDensity: 0.022,
        groundColor: new THREE.Color(0x131e2b),
        ringColor: new THREE.Color(0x60a5fa),
      },
      // 2. Chapter 02: About / Celestial Observatory [p = 0.20] — Starlight Sapphire & Cobalt Cosmos
      {
        p: 0.20,
        camPos: new THREE.Vector3(-2.2, 0.45, -0.9),
        camLook: new THREE.Vector3(-3.5, 0.25, -3.5),
        camRoll: 0.0,
        keyColor: new THREE.Color(0x93c5fd),
        keyIntensity: 3.0,
        fogColor: new THREE.Color(0x050b18),
        fogDensity: 0.020,
        groundColor: new THREE.Color(0x0c1b33),
        ringColor: new THREE.Color(0x38bdf8),
      },
      // 3. Transition 02 -> 03: Ascend Ridge to Quantum Forge [p = 0.30]
      {
        p: 0.30,
        camPos: new THREE.Vector3(0.8, 2.0, 0.6),
        camLook: new THREE.Vector3(2.6, 1.4, -2.0),
        camRoll: 0.025,
        keyColor: new THREE.Color(0xfef08a),
        keyIntensity: 2.9,
        fogColor: new THREE.Color(0x12141a),
        fogDensity: 0.022,
        groundColor: new THREE.Color(0x201c10),
        ringColor: new THREE.Color(0xfbbf24),
      },
      // 4. Chapter 03: Skills / Quantum Assembly [p = 0.40] — Amber Core & Cybernetic Grid
      {
        p: 0.40,
        camPos: new THREE.Vector3(2.2, 1.35, -0.7),
        camLook: new THREE.Vector3(3.6, 1.15, -3.2),
        camRoll: 0.0,
        keyColor: new THREE.Color(0xf59e0b),
        keyIntensity: 3.2,
        fogColor: new THREE.Color(0x13171e),
        fogDensity: 0.020,
        groundColor: new THREE.Color(0x261d08),
        ringColor: new THREE.Color(0xf59e0b),
      },
      // 5. Transition 03 -> 04: Dive to Architectural Vault [p = 0.50]
      {
        p: 0.50,
        camPos: new THREE.Vector3(0.9, 1.0, -2.5),
        camLook: new THREE.Vector3(0.0, 0.45, -5.6),
        camRoll: -0.020,
        keyColor: new THREE.Color(0xa7f3d0),
        keyIntensity: 2.8,
        fogColor: new THREE.Color(0x064e3b),
        fogDensity: 0.022,
        groundColor: new THREE.Color(0x0a221a),
        ringColor: new THREE.Color(0x34d399),
      },
      // 6. Chapter 04: Projects / Cybernetic Monolith [p = 0.60] — Emerald Vault & Matrix Horizon
      {
        p: 0.60,
        camPos: new THREE.Vector3(0.0, 0.45, -4.0),
        camLook: new THREE.Vector3(0.0, 0.20, -7.5),
        camRoll: 0.0,
        keyColor: new THREE.Color(0x34d399),
        keyIntensity: 3.0,
        fogColor: new THREE.Color(0x052016),
        fogDensity: 0.018,
        groundColor: new THREE.Color(0x08261c),
        ringColor: new THREE.Color(0x10b981),
      },
      // 7. Transition 04 -> 05: Acceleration to Horizon Portal [p = 0.70]
      {
        p: 0.70,
        camPos: new THREE.Vector3(0.0, 0.40, -6.2),
        camLook: new THREE.Vector3(0.0, 0.25, -10.5),
        camRoll: 0.015,
        keyColor: new THREE.Color(0xfca5a5),
        keyIntensity: 3.0,
        fogColor: new THREE.Color(0x1c0b12),
        fogDensity: 0.022,
        groundColor: new THREE.Color(0x24101b),
        ringColor: new THREE.Color(0xf43f5e),
      },
      // 8. Chapter 05: Contact / Dimensional Gateway [p = 0.80] — Supernova Rose & Event Horizon
      {
        p: 0.80,
        camPos: new THREE.Vector3(0.0, 0.35, -8.4),
        camLook: new THREE.Vector3(0.0, 0.20, -12.5),
        camRoll: 0.0,
        keyColor: new THREE.Color(0xf43f5e),
        keyIntensity: 3.4,
        fogColor: new THREE.Color(0x220710),
        fogDensity: 0.019,
        groundColor: new THREE.Color(0x2b0c16),
        ringColor: new THREE.Color(0xff1744),
      },
      // 9. Loop Handshake: Portal Penetration & Re-entry [p = 0.92]
      {
        p: 0.92,
        camPos: new THREE.Vector3(0.0, 0.30, -11.2),
        camLook: new THREE.Vector3(0.0, 0.20, -16.0),
        camRoll: 0.0,
        keyColor: new THREE.Color(0xffeed8),
        keyIntensity: 3.0,
        fogColor: new THREE.Color(0x0c0f17),
        fogDensity: 0.020,
        groundColor: new THREE.Color(0x281a20),
        ringColor: new THREE.Color(0xef4444),
      },
    ];

    // Compute periodic tangents
    const N = waypoints.length;
    for (let i = 0; i < N; i++) {
      const prev = waypoints[(i - 1 + N) % N];
      const next = waypoints[(i + 1) % N];
      let dt = next.p - prev.p;
      if (dt <= 0) dt += 1.0;
      waypoints[i].mPos = next.camPos.clone().sub(prev.camPos).multiplyScalar(1 / dt);
      waypoints[i].mLook = next.camLook.clone().sub(prev.camLook).multiplyScalar(1 / dt);
    }

    const sampleTimeline = (u) => {
      let i0 = 0;
      for (let i = 0; i < N; i++) {
        const pA = waypoints[i].p;
        const pB = (i === N - 1) ? waypoints[0].p + 1.0 : waypoints[i + 1].p;
        if (u >= pA && u <= pB) {
          i0 = i;
          break;
        }
      }
      const i1 = (i0 + 1) % N;
      const w0 = waypoints[i0];
      const w1 = waypoints[i1];

      let dt = w1.p - w0.p;
      if (dt <= 0) dt += 1.0;
      const t = Math.max(0, Math.min(1, (u - w0.p) / dt));

      const h00 = (2 * t - 3) * t * t + 1;
      const h10 = (t - 2) * t * t + t;
      const h01 = (3 - 2 * t) * t * t;
      const h11 = (t - 1) * t * t;

      const camPos = new THREE.Vector3()
        .addScaledVector(w0.camPos, h00)
        .addScaledVector(w0.mPos, h10 * dt)
        .addScaledVector(w1.camPos, h01)
        .addScaledVector(w1.mPos, h11 * dt);

      const camLook = new THREE.Vector3()
        .addScaledVector(w0.camLook, h00)
        .addScaledVector(w0.mLook, h10 * dt)
        .addScaledVector(w1.camLook, h01)
        .addScaledVector(w1.mLook, h11 * dt);

      const camRoll = THREE.MathUtils.lerp(w0.camRoll, w1.camRoll, t);
      const keyColor = new THREE.Color().lerpColors(w0.keyColor, w1.keyColor, t);
      const keyIntensity = THREE.MathUtils.lerp(w0.keyIntensity, w1.keyIntensity, t);
      const fogColor = new THREE.Color().lerpColors(w0.fogColor, w1.fogColor, t);
      const fogDensity = THREE.MathUtils.lerp(w0.fogDensity, w1.fogDensity, t);
      const groundColor = new THREE.Color().lerpColors(w0.groundColor, w1.groundColor, t);
      const ringColor = new THREE.Color().lerpColors(w0.ringColor, w1.ringColor, t);

      return { camPos, camLook, camRoll, keyColor, keyIntensity, fogColor, fogDensity, groundColor, ringColor };
    };

    // ==========================================
    // 9. POINTER / MOUSE INTERACTION & RAYCASTING TRACKER
    // ==========================================
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const raycaster = new THREE.Raycaster();
    const mouseRay = new THREE.Vector2();
    let currentHoveredState = false;
    let hoveredSection = -1;

    const handlePointerMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      mouse.targetX = (clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(clientY / window.innerHeight) * 2 + 1;
      mouseRay.x = mouse.targetX;
      mouseRay.y = mouse.targetY;
    };
    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    const handlePointerClick = (e) => {
      if (e.target && (e.target.closest('button') || e.target.closest('a') || e.target.closest('.cinematic-intro-card-dock'))) {
        return;
      }
      if (currentHoveredState) {
        callbacksRef.current.onObjectClick?.(hoveredSection);
      } else {
        callbacksRef.current.onObjectClickOutside?.();
      }
    };
    window.addEventListener('click', handlePointerClick);

    const handleResize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      updateCameraFov(w, h);
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    callbacksRef.current.onSceneReady?.();

    // ==========================================
    // 10. PROGRESSIVE ARRIVAL & WIREFRAME REVEAL
    // ==========================================
    const params = new URLSearchParams(window.location.search);
    const forcedTauParam = params.get('revealTau');
    const isForcedTau = forcedTauParam !== null && !isNaN(parseFloat(forcedTauParam));
    const forcedTau = isForcedTau ? Math.max(0, Math.min(1, parseFloat(forcedTauParam))) : null;

    const initialProg = scrollProgressRef?.current ?? 0;
    let isRevealComplete = isForcedTau ? forcedTau >= 1.0 : (initialProg > 0.02);
    let revealTau = isForcedTau ? forcedTau : (isRevealComplete ? 1.0 : 0.0);
    let revealStartTime = null;
    const REVEAL_DURATION = 2.4;

    if (isRevealComplete) {
      callbacksRef.current.onHeroRevealed?.();
    }

    // ==========================================
    // 11. PERSISTENT ANIMATION & INTERACTION LOOP
    // ==========================================
    let animationFrameId;
    const clock = new THREE.Clock();
    let progress = scrollProgressRef?.current ?? 0;
    const mouseDamped = { x: 0, y: 0 };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Virtual scroll critically-damped progress
      const targetProgress = scrollProgressRef?.current ?? 0;
      const diff = targetProgress - progress;
      progress += diff * 0.085;
      const wrappedProgress = ((progress % 1.0) + 1.0) % 1.0;

      // Mouse damping
      mouseDamped.x += (mouse.targetX - mouseDamped.x) * 0.06;
      mouseDamped.y += (mouse.targetY - mouseDamped.y) * 0.06;

      const motionScale = prefersReducedMotion ? 0.15 : 1.0;

      // Progressive reveal state machine
      if (!isRevealComplete && !isForcedTau) {
        if (Math.abs(targetProgress) > 0.02) {
          isRevealComplete = true;
          revealTau = 1.0;
          callbacksRef.current.onHeroRevealed?.();
        } else {
          if (revealStartTime === null) revealStartTime = elapsedTime;
          revealTau = Math.min(1.0, (elapsedTime - revealStartTime) / REVEAL_DURATION);
          if (revealTau >= 1.0) {
            isRevealComplete = true;
            callbacksRef.current.onHeroRevealed?.();
          }
        }
      }

      // Sample Spline
      const state = sampleTimeline(wrappedProgress);

      // Environment & Atmospheric Morphing
      keyLight.color.copy(state.keyColor);
      keyLight.intensity = state.keyIntensity;
      sceneFog.color.copy(state.fogColor);
      sceneFog.density = state.fogDensity;
      floorMat.color.copy(state.groundColor);
      horizonRingMat.color.copy(state.ringColor);

      // Particles drift
      atmosphereParticles.rotation.y = elapsedTime * 0.02 * motionScale;

      // ------------------------------------------
      // OBJECT VISIBILITY & ALPHA WINDOWING
      // ------------------------------------------
      let heroAlpha = 0;
      let aboutAlpha = 0;
      let skillsAlpha = 0;
      let projectsAlpha = 0;
      let contactAlpha = 0;

      // Section 1: Hero [0.94 -> 0.14] (Center 0.00)
      if (wrappedProgress >= 0.94) {
        heroAlpha = THREE.MathUtils.smoothstep((wrappedProgress - 0.94) / 0.06, 0, 1);
      } else if (wrappedProgress <= 0.08) {
        heroAlpha = 1.0;
      } else if (wrappedProgress < 0.14) {
        heroAlpha = 1.0 - THREE.MathUtils.smoothstep((wrappedProgress - 0.08) / 0.06, 0, 1);
      }

      // Section 2: About [0.14 -> 0.32] (Center 0.20)
      if (wrappedProgress >= 0.14 && wrappedProgress < 0.18) {
        aboutAlpha = THREE.MathUtils.smoothstep((wrappedProgress - 0.14) / 0.04, 0, 1);
      } else if (wrappedProgress >= 0.18 && wrappedProgress <= 0.26) {
        aboutAlpha = 1.0;
      } else if (wrappedProgress > 0.26 && wrappedProgress < 0.32) {
        aboutAlpha = 1.0 - THREE.MathUtils.smoothstep((wrappedProgress - 0.26) / 0.06, 0, 1);
      }

      // Section 3: Skills [0.34 -> 0.52] (Center 0.40)
      if (wrappedProgress >= 0.34 && wrappedProgress < 0.38) {
        skillsAlpha = THREE.MathUtils.smoothstep((wrappedProgress - 0.34) / 0.04, 0, 1);
      } else if (wrappedProgress >= 0.38 && wrappedProgress <= 0.46) {
        skillsAlpha = 1.0;
      } else if (wrappedProgress > 0.46 && wrappedProgress < 0.52) {
        skillsAlpha = 1.0 - THREE.MathUtils.smoothstep((wrappedProgress - 0.46) / 0.06, 0, 1);
      }

      // Section 4: Projects [0.54 -> 0.72] (Center 0.60)
      if (wrappedProgress >= 0.54 && wrappedProgress < 0.58) {
        projectsAlpha = THREE.MathUtils.smoothstep((wrappedProgress - 0.54) / 0.04, 0, 1);
      } else if (wrappedProgress >= 0.58 && wrappedProgress <= 0.66) {
        projectsAlpha = 1.0;
      } else if (wrappedProgress > 0.66 && wrappedProgress < 0.72) {
        projectsAlpha = 1.0 - THREE.MathUtils.smoothstep((wrappedProgress - 0.66) / 0.06, 0, 1);
      }

      // Section 5: Contact [0.74 -> 0.94] (Center 0.80)
      if (wrappedProgress >= 0.74 && wrappedProgress < 0.78) {
        contactAlpha = THREE.MathUtils.smoothstep((wrappedProgress - 0.74) / 0.04, 0, 1);
      } else if (wrappedProgress >= 0.78 && wrappedProgress <= 0.86) {
        contactAlpha = 1.0;
      } else if (wrappedProgress > 0.86 && wrappedProgress < 0.94) {
        contactAlpha = 1.0 - THREE.MathUtils.smoothstep((wrappedProgress - 0.86) / 0.08, 0, 1);
      }

      heroGroup.visible = heroAlpha > 0.01;
      aboutGroup.visible = aboutAlpha > 0.01;
      skillsGroup.visible = skillsAlpha > 0.01;
      projectsGroup.visible = projectsAlpha > 0.01;
      contactGroup.visible = contactAlpha > 0.01;

      // ------------------------------------------
      // ACTIVE SECTION & RAYCAST INTERSECTION
      // ------------------------------------------
      let currentSection = 0;
      if (wrappedProgress >= 0.14 && wrappedProgress < 0.32) currentSection = 1;
      else if (wrappedProgress >= 0.34 && wrappedProgress < 0.52) currentSection = 2;
      else if (wrappedProgress >= 0.54 && wrappedProgress < 0.72) currentSection = 3;
      else if (wrappedProgress >= 0.74 && wrappedProgress < 0.94) currentSection = 4;
      else currentSection = 0;

      const activeGroup = currentSection === 0 ? heroGroup :
                          currentSection === 1 ? aboutGroup :
                          currentSection === 2 ? skillsGroup :
                          currentSection === 3 ? projectsGroup : contactGroup;

      let isHovered = false;
      if (isRevealComplete && activeGroup && activeGroup.visible) {
        raycaster.setFromCamera(mouseRay, camera);
        const intersects = raycaster.intersectObjects(activeGroup.children, true);
        isHovered = intersects.length > 0;
      }

      if (isHovered !== currentHoveredState || (isHovered && currentSection !== hoveredSection)) {
        currentHoveredState = isHovered;
        hoveredSection = isHovered ? currentSection : -1;
        callbacksRef.current.onObjectInteract?.(isHovered, currentSection);
      }

      const targetScale = isHovered ? 1.05 : 1.0;
      activeGroup.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

      // ------------------------------------------
      // DIRECT MOUSE TACTILE INTERACTION
      // Active object dynamically tracks mouse pitch, yaw, and tilt!
      // ------------------------------------------
      const applyMouseInteraction = (group, baseRotX = 0, baseRotY = 0) => {
        const mouseSensX = isHovered ? 0.65 : 0.45;
        const mouseSensY = isHovered ? 0.50 : 0.35;
        group.rotation.y = baseRotY + mouseDamped.x * mouseSensX;
        group.rotation.x = baseRotX - mouseDamped.y * mouseSensY;
      };

      // 1. Hero Object Animations & Reveal
      if (heroGroup.visible) {
        applyMouseInteraction(heroGroup, Math.sin(elapsedTime * 0.4) * 0.06, elapsedTime * 0.2 * motionScale);
        heroOrbitalRing.rotation.y += 0.006 * motionScale;

        // Wireframe-to-Solid Dissolve
        if (!isRevealComplete) {
          const wireDissolve = THREE.MathUtils.smoothstep(revealTau, 0.30, 0.85);
          heroWireMesh.visible = wireDissolve < 0.99;
          laserWireMat.opacity = (1.0 - wireDissolve) * 0.9;
          liquidChromeMat.opacity = wireDissolve;
          liquidChromeMat.envMapIntensity = wireDissolve * 2.8;
          glowingRubyMat.opacity = wireDissolve;
          rubyCoreLight.intensity = wireDissolve * (3.0 + Math.sin(elapsedTime * 3.5) * 0.6);
        } else {
          heroWireMesh.visible = false;
          liquidChromeMat.opacity = heroAlpha;
          liquidChromeMat.envMapIntensity = 2.8;
          glowingRubyMat.opacity = heroAlpha;
          const baseRuby = isHovered && currentSection === 0 ? 5.2 : 3.0;
          rubyCoreLight.intensity = heroAlpha * (baseRuby + Math.sin(elapsedTime * (isHovered ? 4.5 : 2.8)) * 0.7);
        }
      }

      // 2. About Object Animations
      if (aboutGroup.visible) {
        applyMouseInteraction(aboutGroup, 0, elapsedTime * 0.15 * motionScale);
        aboutCore.rotation.y += 0.005 * motionScale;
        aboutJewel.rotation.y -= 0.008 * motionScale;
        gimbal1.rotation.x += 0.008 * motionScale;
        gimbal2.rotation.y += 0.007 * motionScale;
        gimbal3.rotation.z += 0.006 * motionScale;
        aboutJewelLight.intensity = isHovered && currentSection === 1 ? 5.2 : 3.2;
      }

      // 3. Skills Object Animations
      if (skillsGroup.visible) {
        applyMouseInteraction(skillsGroup, 0.1, -elapsedTime * 0.15 * motionScale);
        skillsCore.rotation.y += 0.006 * motionScale;
        skillsPrism.rotation.x += 0.010 * motionScale;
        skillsPrism.rotation.y -= 0.012 * motionScale;
        calibratorArms.forEach((arm, idx) => {
          const pulse = 1.0 + Math.sin(elapsedTime * 2.5 + idx) * 0.08;
          arm.scale.setScalar(pulse);
        });
        skillsCoreLight.intensity = isHovered && currentSection === 2 ? 5.0 : 3.0;
      }

      // 4. Projects Object Animations
      if (projectsGroup.visible) {
        applyMouseInteraction(projectsGroup, 0.05, elapsedTime * 0.12 * motionScale);
        pillarMesh.rotation.y += 0.004 * motionScale;
        shardMeshes.forEach((item, idx) => {
          const speed = (isHovered && currentSection === 3) ? 0.6 : 0.35;
          const angle = item.baseAngle + elapsedTime * (speed + idx * 0.05) * motionScale;
          item.mesh.position.x = Math.cos(angle) * item.radius;
          item.mesh.position.z = Math.sin(angle) * item.radius;
          item.mesh.position.y = Math.sin(elapsedTime * 1.8 + idx) * 0.25;
          item.mesh.rotation.y = -angle;
        });
        vaultCoreLight.intensity = isHovered && currentSection === 3 ? 5.2 : 3.5;
      }

      // 5. Contact Object Animations
      if (contactGroup.visible) {
        applyMouseInteraction(contactGroup, 0, 0);
        outerArchMesh.rotation.z = Math.sin(elapsedTime * 0.25) * 0.05 * motionScale;
        innerArchMesh.rotation.z = -Math.sin(elapsedTime * 0.25) * 0.05 * motionScale;
        accretionMesh.rotation.z += 0.012 * motionScale;
        accretionMat.opacity = 0.5 + Math.sin(elapsedTime * 3.0) * 0.18;
        const baseBeacon = isHovered && currentSection === 4 ? 6.5 : 4.5;
        beaconLight.intensity = baseBeacon + Math.sin(elapsedTime * 4.0) * 0.8;
      }

      // ------------------------------------------
      // CAMERA POSITIONING (INITIAL ZOOM & C1 HERMITE FLIGHT)
      // ------------------------------------------
      let finalCamPos = state.camPos.clone();
      if (!isRevealComplete) {
        // Dramatic wireframe zoom-in from wide establishing distance
        const zoomT = THREE.MathUtils.smoothstep(revealTau, 0.0, 0.95);
        const wideEstablishingPos = new THREE.Vector3(0.0, 1.4, 8.8);
        finalCamPos.lerpVectors(wideEstablishingPos, state.camPos, zoomT);
      }

      // Subtle mouse parallax
      finalCamPos.x += mouseDamped.x * 0.18;
      finalCamPos.y += mouseDamped.y * 0.12;

      camera.position.copy(finalCamPos);
      camera.lookAt(state.camLook);

      if (!prefersReducedMotion && Math.abs(state.camRoll) > 0.0001) {
        camera.rotateZ(state.camRoll);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 12. Complete Leak-Free Disposal
    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('click', handlePointerClick);
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
  }, []);

  if (!webGLSupported) {
    return (
      <div className="cinematic-webgl-fallback">
        <p>WebGL Hardware Acceleration is required for the 3D cinematic journey.</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="cinematic-three-container"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
