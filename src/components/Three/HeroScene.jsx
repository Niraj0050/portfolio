import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/**
 * HeroScene.jsx
 * High-Precision 3D Centerpiece Background faithfully matching the reference image:
 * 1. Central Faceted Obsidian Crystal with sharp triangular planar facets.
 * 2. Radiant Molten Gold & Fire Energy Core (Chevron Shards ><) inside the crystal.
 * 3. Thick Liquid-Chrome Equatorial Ring with dual-tone cyber cyan rim & fiery orange reflections.
 * 4. Diagonal Chrome Ring & Outer Glowing Trajectory Guide.
 * 5. Interactive Beacon Node with concentric halo ( ● ) tracking the pointer.
 * 6. Dynamic Trailing Line / Laser Ribbon drawn on pointer movement, smoothly fading from behind.
 * 7. Stable, 100% stationary pitch-black obsidian stage floor with glowing neon orange ring & reflection pools.
 * 8. Perfectly centered in the right space, with equal margin on both sides across all resolutions.
 * 9. Mirror-Chrome Spheres & Dark Obsidian Satellites.
 * 10. Independent, asynchronous motion for EVERY object (gem, individual rings, satellites, beacon).
 */
export default function HeroScene({ isExploded = false, onToggleExplode }) {
  const mountRef = useRef(null);
  const [webglSupported, setWebglSupported] = useState(true);

  const isExplodedRef = useRef(isExploded);
  const onToggleExplodeRef = useRef(onToggleExplode);
  const triggerShockwaveRef = useRef(null);

  useEffect(() => {
    isExplodedRef.current = isExploded;
    if (triggerShockwaveRef.current) {
      triggerShockwaveRef.current();
    }
  }, [isExploded]);

  useEffect(() => {
    onToggleExplodeRef.current = onToggleExplode;
  }, [onToggleExplode]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return undefined;

    let renderer;
    let animationFrameId = 0;
    let resizeObserver;
    let visibilityObserver;
    let disposed = false;

    // Track Three.js resources for complete memory cleanup
    const geometries = new Set();
    const materials = new Set();
    const textures = new Set();

    const trackGeo = (geo) => {
      geometries.add(geo);
      return geo;
    };
    const trackMat = (mat) => {
      materials.add(mat);
      return mat;
    };
    const trackTex = (tex) => {
      textures.add(tex);
      return tex;
    };

    // 1. WebGL Support Verification
    try {
      const testCanvas = document.createElement("canvas");
      const gl =
        testCanvas.getContext("webgl2") ||
        testCanvas.getContext("webgl") ||
        testCanvas.getContext("experimental-webgl");
      if (!gl) {
        setWebglSupported(false);
        return undefined;
      }
    } catch {
      setWebglSupported(false);
      return undefined;
    }

    // 2. Scene & Initial Dimensions
    const scene = new THREE.Scene();
    const initialWidth = Math.max(container.clientWidth, 1);
    const initialHeight = Math.max(container.clientHeight, 1);
    const aspect = initialWidth / initialHeight;

    const fov = 40;
    const camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 150);

    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      setWebglSupported(false);
      return undefined;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(initialWidth, initialHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.outline = "none";
    container.appendChild(renderer.domElement);

    // 3. High-Contrast Procedural PMREM Studio Environment Map
    // Liquid chrome reflections: deep crimson at bottom/inside, pure white studio specular glints on chrome metal
    const envCanvas = document.createElement("canvas");
    envCanvas.width = 1024;
    envCanvas.height = 512;
    const ctx = envCanvas.getContext("2d");

    const bgGrad = ctx.createLinearGradient(0, 0, 0, 512);
    bgGrad.addColorStop(0, "#020204");
    bgGrad.addColorStop(0.55, "#050508");
    bgGrad.addColorStop(1, "#07070b");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1024, 512);

    const paintGlow = (x, y, radius, stops) => {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      stops.forEach(([stop, color]) => gradient.addColorStop(stop, color));
      ctx.fillStyle = gradient;
      ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    };

    // Deep crimson radiant emitter (bottom right / inner reflections)
    paintGlow(800, 360, 340, [
      [0, "#ff2244"],
      [0.22, "#dc2626"],
      [0.6, "rgba(185, 28, 28, 0.42)"],
      [1, "rgba(0, 0, 0, 0)"],
    ]);
    // Razor-sharp chrome silver specular rim emitter (upper left rim light)
    paintGlow(220, 110, 280, [
      [0, "#ffffff"],
      [0.22, "#e2e8f0"],
      [0.62, "rgba(203, 213, 225, 0.35)"],
      [1, "rgba(0, 0, 0, 0)"],
    ]);
    // Pure studio mirror specular glint
    paintGlow(512, 60, 110, [
      [0, "rgba(255, 255, 255, 0.98)"],
      [0.35, "rgba(255, 255, 255, 0.45)"],
      [1, "rgba(0, 0, 0, 0)"],
    ]);

    const envTexture = trackTex(new THREE.CanvasTexture(envCanvas));
    envTexture.mapping = THREE.EquirectangularReflectionMapping;
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    const envTarget = pmrem.fromEquirectangular(envTexture);
    scene.environment = envTarget.texture;

    // Helper: Procedural Radial Glow Texture for Soft Optical Bloom
    const createGlowTexture = (colorHex, innerOpacity = 1.0) => {
      const gCanvas = document.createElement("canvas");
      gCanvas.width = gCanvas.height = 256;
      const gCtx = gCanvas.getContext("2d");
      const color = new THREE.Color(colorHex);
      const r = Math.round(color.r * 255);
      const g = Math.round(color.g * 255);
      const b = Math.round(color.b * 255);
      const grad = gCtx.createRadialGradient(128, 128, 0, 128, 128, 128);
      grad.addColorStop(0, `rgba(${r},${g},${b},${innerOpacity})`);
      grad.addColorStop(0.22, `rgba(${r},${g},${b},${innerOpacity * 0.65})`);
      grad.addColorStop(0.65, `rgba(${r},${g},${b},${innerOpacity * 0.16})`);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      gCtx.fillStyle = grad;
      gCtx.fillRect(0, 0, 256, 256);
      return trackTex(new THREE.CanvasTexture(gCanvas));
    };

    const makeGlowSprite = (colorHex, w, h, opacity = 1.0) => {
      const mat = trackMat(
        new THREE.SpriteMaterial({
          map: createGlowTexture(colorHex, opacity),
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      const sprite = new THREE.Sprite(mat);
      sprite.scale.set(w, h, 1);
      return sprite;
    };

    // Helper: Procedural Concentric Beacon Halo Texture (matching Black + Premium Red direction)
    const createBeaconTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 256;
      const bCtx = canvas.getContext("2d");
      const cx = 128;
      const cy = 128;

      // 1. Soft atmospheric crimson optical flare bloom
      const outerGrad = bCtx.createRadialGradient(cx, cy, 0, cx, cy, 110);
      outerGrad.addColorStop(0, "rgba(239, 68, 68, 0.48)");
      outerGrad.addColorStop(0.35, "rgba(220, 38, 38, 0.22)");
      outerGrad.addColorStop(0.7, "rgba(185, 28, 28, 0.05)");
      outerGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      bCtx.fillStyle = outerGrad;
      bCtx.beginPath();
      bCtx.arc(cx, cy, 110, 0, Math.PI * 2);
      bCtx.fill();

      // 2. Concentric Crimson Halo Ring (Delicate, sharp, matching reference)
      const ringRadius = 58;
      bCtx.beginPath();
      bCtx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
      bCtx.lineWidth = 7.5;
      bCtx.strokeStyle = "#dc2626";
      bCtx.shadowColor = "#ef4444";
      bCtx.shadowBlur = 14;
      bCtx.stroke();

      // Crisp chrome-silver inner accent line on the halo ring
      bCtx.beginPath();
      bCtx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
      bCtx.lineWidth = 2.4;
      bCtx.strokeStyle = "#ffffff";
      bCtx.stroke();

      // 3. Central Glowing Incandescent Orb (pure white core to crimson edge)
      const centerGrad = bCtx.createRadialGradient(cx, cy, 0, cx, cy, 18);
      centerGrad.addColorStop(0, "#ffffff");
      centerGrad.addColorStop(0.4, "#ffd5dc");
      centerGrad.addColorStop(0.8, "#dc2626");
      centerGrad.addColorStop(1, "rgba(220, 38, 38, 0)");
      bCtx.fillStyle = centerGrad;
      bCtx.beginPath();
      bCtx.arc(cx, cy, 18, 0, Math.PI * 2);
      bCtx.fill();

      return trackTex(new THREE.CanvasTexture(canvas));
    };

    // Helper: Procedural Stage Floor Surface Texture
    // Machined dark obsidian platform with chrome and crimson specular reflection pools
    const createStageFloorTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 1024;
      const fCtx = canvas.getContext("2d");
      const cx = 512;
      const cy = 512;

      // Base: Deep metallic obsidian
      fCtx.fillStyle = "#03050a";
      fCtx.fillRect(0, 0, 1024, 1024);

      // Concentric micro-grooves
      for (let r = 80; r < 500; r += 14) {
        fCtx.beginPath();
        fCtx.arc(cx, cy, r, 0, Math.PI * 2);
        fCtx.lineWidth = 1.2;
        fCtx.strokeStyle = "rgba(255, 255, 255, 0.035)";
        fCtx.stroke();
      }

      // Left Chrome Specular Pool Reflection
      const chromePool = fCtx.createRadialGradient(360, 480, 0, 360, 480, 220);
      chromePool.addColorStop(0, "rgba(255, 255, 255, 0.22)");
      chromePool.addColorStop(0.45, "rgba(203, 213, 225, 0.1)");
      chromePool.addColorStop(1, "rgba(0, 0, 0, 0)");
      fCtx.fillStyle = chromePool;
      fCtx.beginPath();
      fCtx.arc(360, 480, 220, 0, Math.PI * 2);
      fCtx.fill();

      // Center-Right Warm Crimson Specular Pool Reflection
      const crimsonPool = fCtx.createRadialGradient(580, 490, 0, 580, 490, 260);
      crimsonPool.addColorStop(0, "rgba(220, 38, 38, 0.45)");
      crimsonPool.addColorStop(0.35, "rgba(185, 28, 28, 0.22)");
      crimsonPool.addColorStop(0.75, "rgba(153, 27, 27, 0.06)");
      crimsonPool.addColorStop(1, "rgba(0, 0, 0, 0)");
      fCtx.fillStyle = crimsonPool;
      fCtx.beginPath();
      fCtx.arc(580, 490, 260, 0, Math.PI * 2);
      fCtx.fill();

      return trackTex(new THREE.CanvasTexture(canvas));
    };

    // 4. Lighting Rig
    scene.add(new THREE.AmbientLight(0x06060a, 1.2)); // Deep space void ambient

    const rimChrome = new THREE.DirectionalLight(0xffffff, 4.8);
    rimChrome.position.set(-7.0, 5.0, -3.5);
    scene.add(rimChrome);

    const rimCrimson = new THREE.DirectionalLight(0xdc2626, 3.2);
    rimCrimson.position.set(6.0, -2.5, -2.0);
    scene.add(rimCrimson);

    const whiteLight = new THREE.DirectionalLight(0xffffff, 2.6);
    whiteLight.position.set(1.5, 6.5, 4.5);
    scene.add(whiteLight);

    // Interactive Cursor-Tracking Point Light (Creates specular gleams following cursor)
    const cursorLight = new THREE.PointLight(0xffffff, 2.0, 10.0);
    cursorLight.position.set(0, 0, 4.0);
    scene.add(cursorLight);

    // 5. Responsive Layout Coordinates:
    // Guarantees EXACT equal space on left (distance from text to model) and right (distance from model to screen edge)
    const computeLayout = (w, h) => {
      const asp = w / h;
      const dist = 10.4;
      const vFovRad = (fov * Math.PI) / 180;
      const visibleHeight = 2 * Math.tan(vFovRad / 2) * dist;
      const visibleWidth = visibleHeight * asp;

      let offsetX = 0;
      let offsetY = 0.15;
      let stageY = -2.85;

      if (w < 768 || asp < 0.95) {
        // Mobile portrait: center horizontally, place slightly lower
        offsetX = 0;
        offsetY = -0.65;
        stageY = -3.45;
      } else {
        // Desktop / Tablet:
        // Container: max-width 1240px, centered with 24px padding
        const containerMargin = Math.max((w - 1240) / 2, 0);
        const textLeftPx = containerMargin + 24;
        // The text block has max-width: 580px, with content taking ~540px
        const textWidthPx = Math.min(540, w * 0.42);
        const textRightPx = textLeftPx + textWidthPx;

        // Space available to the right of the text
        const remainingRightPx = Math.max(w - textRightPx, 100);

        // Center point of this right space:
        // Distance from text to targetCenterPx == remainingRightPx / 2
        // Distance from targetCenterPx to screen right edge == remainingRightPx / 2
        // EXACT EQUAL BREATHING ROOM ON BOTH SIDES!
        const targetCenterPx = textRightPx + remainingRightPx / 2;

        // Convert targetCenterPx into NDC (-1 to +1)
        const ndcX = (targetCenterPx / w) * 2 - 1;

        // Convert NDC to 3D world X at z = 0
        offsetX = ndcX * (visibleWidth / 2);
        offsetY = 0.15;
        stageY = -2.85;
      }

      return { offsetX, offsetY, stageY, dist, visibleWidth, visibleHeight };
    };

    let layout = computeLayout(initialWidth, initialHeight);

    // Camera is positioned rock-solid looking directly forward along Z-axis
    // Zero parallax tilting ensures bottom stage ring remains 100% stationary and stable!
    camera.position.set(0, 0, layout.dist);
    camera.lookAt(0, 0, 0);

    // 6. Root Groups:
    // A. modelRoot: Anchored at sculpture location. Handles user drag rotation.
    // Each child object inside modelRoot moves with its own INDEPENDENT motion!
    const modelRoot = new THREE.Group();
    modelRoot.position.set(layout.offsetX, layout.offsetY, 0);
    scene.add(modelRoot);

    // B. stageGroup: Anchored and 100% stationary on the floor beneath sculpture
    // "niche ka ring stable hai move nahi ho raha"
    const stageGroup = new THREE.Group();
    stageGroup.position.set(layout.offsetX, layout.stageY, 0);
    stageGroup.rotation.x = -Math.PI * 0.44; // Fixed isometric floor perspective
    scene.add(stageGroup);

    // Core point light attached to model location
    const coreLight = new THREE.PointLight(0xdc2626, 12.0, 9.0, 1.2);
    coreLight.position.set(layout.offsetX, layout.offsetY, 0);
    scene.add(coreLight);

    // Subtle warm crimson floor reflection light on the stage
    const floorReflectLight = new THREE.PointLight(0x991b1b, 3.5, 4.5);
    floorReflectLight.position.set(layout.offsetX, layout.stageY + 0.5, 0.5);
    scene.add(floorReflectLight);

    // ==========================================
    // A. CENTRAL FACETED DIAMOND GEM SCULPTURE & ARCHITECTURAL LAYERS
    // ==========================================
    const gemGroup = new THREE.Group();
    modelRoot.add(gemGroup);

    // Creates an authentic faceted diamond bipyramid with razor-sharp planar triangular facets
    const createDiamondGeometry = (radius, heightRatio, segments = 8) => {
      const positions = [];
      const topY = radius * heightRatio;
      const bottomY = -radius * heightRatio;

      // Calculate equator vertices in a circle
      const equator = [];
      for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 2 + Math.PI / segments;
        equator.push([Math.cos(angle) * radius, 0, Math.sin(angle) * radius]);
      }

      // Upper pyramid triangular facets (sharp planar facets)
      for (let i = 0; i < segments; i++) {
        const next = (i + 1) % segments;
        positions.push(
          0, topY, 0,
          equator[i][0], equator[i][1], equator[i][2],
          equator[next][0], equator[next][1], equator[next][2]
        );
      }

      // Lower pyramid triangular facets (sharp planar facets)
      for (let i = 0; i < segments; i++) {
        const next = (i + 1) % segments;
        positions.push(
          0, bottomY, 0,
          equator[next][0], equator[next][1], equator[next][2],
          equator[i][0], equator[i][1], equator[i][2]
        );
      }

      const geo = trackGeo(new THREE.BufferGeometry());
      geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      geo.computeVertexNormals();
      return geo;
    };

    // Creates upper pyramid with sharp planar facets for Layer 01 (Frontend Presentation Glass)
    const createUpperPyramidGeometry = (radius, heightRatio, segments = 8) => {
      const positions = [];
      const topY = radius * heightRatio;
      const equator = [];
      for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 2 + Math.PI / segments;
        equator.push([Math.cos(angle) * radius, 0, Math.sin(angle) * radius]);
      }
      for (let i = 0; i < segments; i++) {
        const next = (i + 1) % segments;
        positions.push(
          0, topY, 0,
          equator[i][0], equator[i][1], equator[i][2],
          equator[next][0], equator[next][1], equator[next][2]
        );
      }
      // Base cap closure so the separated glass looks thick and solid
      for (let i = 1; i < segments - 1; i++) {
        positions.push(
          equator[0][0], 0, equator[0][2],
          equator[i + 1][0], 0, equator[i + 1][2],
          equator[i][0], 0, equator[i][2]
        );
      }
      const geo = trackGeo(new THREE.BufferGeometry());
      geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      geo.computeVertexNormals();
      return geo;
    };

    // Creates lower pyramid with sharp planar facets for Layer 04 (Runtime Platform / Base Shell)
    const createLowerPyramidGeometry = (radius, heightRatio, segments = 8) => {
      const positions = [];
      const bottomY = -radius * heightRatio;
      const equator = [];
      for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 2 + Math.PI / segments;
        equator.push([Math.cos(angle) * radius, 0, Math.sin(angle) * radius]);
      }
      for (let i = 0; i < segments; i++) {
        const next = (i + 1) % segments;
        positions.push(
          0, bottomY, 0,
          equator[next][0], equator[next][1], equator[next][2],
          equator[i][0], equator[i][1], equator[i][2]
        );
      }
      // Top cap closure
      for (let i = 1; i < segments - 1; i++) {
        positions.push(
          equator[0][0], 0, equator[0][2],
          equator[i][0], 0, equator[i][2],
          equator[i + 1][0], 0, equator[i + 1][2]
        );
      }
      const geo = trackGeo(new THREE.BufferGeometry());
      geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      geo.computeVertexNormals();
      return geo;
    };

    // Layer 03: Relational Data Core Group
    const coreGroup = new THREE.Group();
    gemGroup.add(coreGroup);

    // Internal High-Intensity Point Light illuminating the inner core and inner chrome rim
    const gemInteriorLight = new THREE.PointLight(0xdc2626, 3.5, 6.0, 1.2);
    coreGroup.add(gemInteriorLight);

    // 1. Inner Blazing Incandescent Core (Crimson Ruby Facets)
    const innerGeo = createDiamondGeometry(1.22, 1.34, 8);
    const innerCoreMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x991b1b,
        emissive: 0xdc2626,
        emissiveIntensity: 2.6,
        metalness: 0.2,
        roughness: 0.1,
        flatShading: true,
      })
    );
    const innerCore = new THREE.Mesh(innerGeo, innerCoreMat);
    innerCore.renderOrder = 1;
    coreGroup.add(innerCore);

    // Glowing Crimson Inner Triangular Chevron Shards
    const chevronGeo = trackGeo(new THREE.BufferGeometry());
    const chevPos = [
      // Front Upper triangle pointing down: TopLeft, TopRight, Center
      -0.55, 0.75, 0.35,   0.55, 0.75, 0.35,   0.0, 0.0, 0.55,
      // Front Lower triangle pointing up: BottomLeft, Center, BottomRight
      -0.55, -0.75, 0.35,  0.0, 0.0, 0.55,     0.55, -0.75, 0.35,
      // Front Left wing
      -0.55, 0.75, 0.35,   0.0, 0.0, 0.55,    -0.55, -0.75, 0.35,
      // Front Right wing
      0.55, 0.75, 0.35,    0.55, -0.75, 0.35,  0.0, 0.0, 0.55,

      // Back Upper triangle
      -0.55, 0.75, -0.35,  0.0, 0.0, -0.55,    0.55, 0.75, -0.35,
      // Back Lower triangle
      -0.55, -0.75, -0.35, 0.55, -0.75, -0.35, 0.0, 0.0, -0.55,
      // Back Left wing
      -0.55, 0.75, -0.35, -0.55, -0.75, -0.35, 0.0, 0.0, -0.55,
      // Back Right wing
      0.55, 0.75, -0.35,   0.0, 0.0, -0.55,    0.55, -0.75, -0.35,
    ];
    chevronGeo.setAttribute("position", new THREE.Float32BufferAttribute(chevPos, 3));
    chevronGeo.computeVertexNormals();

    const chevronMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xff1e38,
        emissive: 0xef4444,
        emissiveIntensity: 3.6,
        metalness: 0.7,
        roughness: 0.12,
        side: THREE.DoubleSide,
      })
    );
    const chevronMesh = new THREE.Mesh(chevronGeo, chevronMat);
    chevronMesh.renderOrder = 2;
    coreGroup.add(chevronMesh);

    // Inner Radiant Crimson Lattice
    const innerLatticeGeo = trackGeo(new THREE.IcosahedronGeometry(1.28, 0));
    innerLatticeGeo.scale(0.88, 1.28, 0.88);
    const innerLatticeMat = trackMat(
      new THREE.MeshBasicMaterial({
        color: 0xdc2626,
        wireframe: true,
        transparent: true,
        opacity: 0.65,
      })
    );
    const innerLattice = new THREE.Mesh(innerLatticeGeo, innerLatticeMat);
    innerLattice.renderOrder = 2;
    coreGroup.add(innerLattice);

    // Subtle Core Glow Accent
    const coreGlow = makeGlowSprite(0xdc2626, 2.5, 2.9, 0.42);
    coreGlow.renderOrder = 3;
    coreGroup.add(coreGlow);

    // Common Glass & Edges Materials
    const outerGemMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0x05060a,
        metalness: 0.08,
        roughness: 0.02,
        transmission: 0.85,
        ior: 1.68,
        thickness: 1.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.02,
        reflectivity: 0.98,
        flatShading: true,
        transparent: true,
        opacity: 0.88,
        depthWrite: true,
        envMapIntensity: 3.2,
      })
    );

    const edgesMat = trackMat(
      new THREE.LineBasicMaterial({
        color: 0xef4444,
        transparent: true,
        opacity: 0.85,
        linewidth: 2,
      })
    );

    // 2. Layer 01: Top Glass Shell (Frontend Presentation Canopy)
    const topGlassGroup = new THREE.Group();
    gemGroup.add(topGlassGroup);

    const topOuterGeo = createUpperPyramidGeometry(1.68, 1.45, 8);
    const topOuterGem = new THREE.Mesh(topOuterGeo, outerGemMat);
    topOuterGem.renderOrder = 4;
    topGlassGroup.add(topOuterGem);

    const topEdgesGeo = trackGeo(new THREE.EdgesGeometry(topOuterGeo, 15));
    const topEdgeSegments = new THREE.LineSegments(topEdgesGeo, edgesMat);
    topEdgeSegments.renderOrder = 5;
    topGlassGroup.add(topEdgeSegments);

    // 3. Layer 04: Bottom Glass Shell (Runtime Platform Shell)
    const bottomGlassGroup = new THREE.Group();
    gemGroup.add(bottomGlassGroup);

    const bottomOuterGeo = createLowerPyramidGeometry(1.68, 1.45, 8);
    const bottomOuterGem = new THREE.Mesh(bottomOuterGeo, outerGemMat);
    bottomOuterGem.renderOrder = 4;
    bottomGlassGroup.add(bottomOuterGem);

    const bottomEdgesGeo = trackGeo(new THREE.EdgesGeometry(bottomOuterGeo, 15));
    const bottomEdgeSegments = new THREE.LineSegments(bottomEdgesGeo, edgesMat);
    bottomEdgeSegments.renderOrder = 5;
    bottomGlassGroup.add(bottomEdgeSegments);

    // ==========================================
    // SHOCKWAVE PULSE MESHES (Concept 2: Core Overdrive Shockwave Pulse)
    // ==========================================
    const shockwaveGroup = new THREE.Group();
    shockwaveGroup.position.set(layout.offsetX, layout.offsetY, 0);
    shockwaveGroup.rotation.x = -Math.PI * 0.44;
    scene.add(shockwaveGroup);

    const shockwaveCyanGeo = trackGeo(new THREE.RingGeometry(0.85, 1.08, 64));
    const shockwaveCyanMat = trackMat(
      new THREE.MeshBasicMaterial({
        color: 0xdc2626,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    const shockwaveCyanMesh = new THREE.Mesh(shockwaveCyanGeo, shockwaveCyanMat);
    shockwaveCyanMesh.visible = false;
    shockwaveGroup.add(shockwaveCyanMesh);

    const shockwaveAmberGeo = trackGeo(new THREE.RingGeometry(0.72, 0.94, 64));
    const shockwaveAmberMat = trackMat(
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    const shockwaveAmberMesh = new THREE.Mesh(shockwaveAmberGeo, shockwaveAmberMat);
    shockwaveAmberMesh.visible = false;
    shockwaveGroup.add(shockwaveAmberMesh);

    // ==========================================
    // B. THICK POLISHED LIQUID-CHROME RINGS
    // (Each ring moves with its own INDEPENDENT rotation, phase, and hover)
    // ==========================================
    const mirrorChromeMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 1.0,
        roughness: 0.015,
        envMapIntensity: 3.2,
      })
    );

    // Ring 1 Group: Heavy Polished Chrome Equatorial Ring encircling the waist horizontally
    // Gentle forward tilt (0.12 rad ~ 21.6 deg) matching reference isometric view
    const ring1Group = new THREE.Group();
    ring1Group.rotation.x = Math.PI * 0.12;
    modelRoot.add(ring1Group);

    const ring1Geo = trackGeo(new THREE.TorusGeometry(2.38, 0.115, 48, 160));
    const ring1 = new THREE.Mesh(ring1Geo, mirrorChromeMat);
    ring1Group.add(ring1);

    // Ring 2 Group: Inclined Polished Chrome Ring looping around diagonally
    const ring2Group = new THREE.Group();
    ring2Group.rotation.x = -Math.PI * 0.28;
    ring2Group.rotation.y = 0.36;
    modelRoot.add(ring2Group);

    const ring2Geo = trackGeo(new THREE.TorusGeometry(2.68, 0.052, 32, 140));
    const ring2 = new THREE.Mesh(ring2Geo, mirrorChromeMat);
    ring2Group.add(ring2);

    // Ring 3 Group: Outer Thin Glowing Amber Trajectory Ring Guide
    const ring3Radius = 3.12;
    const ring3Group = new THREE.Group();
    ring3Group.rotation.x = 0.26;
    ring3Group.rotation.z = -0.18;
    modelRoot.add(ring3Group);

    const ring3Geo = trackGeo(new THREE.TorusGeometry(ring3Radius, 0.014, 16, 160));
    const ring3Mat = trackMat(
      new THREE.MeshBasicMaterial({
        color: 0xff5500,
        transparent: true,
        opacity: 0.92,
      })
    );
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3Group.add(ring3);

    // ==========================================
    // C. FLOATING CHROME SPHERES & DARK CRYSTALS
    // (Each satellite orbits with its own INDEPENDENT speed, radius, and wobble)
    // ==========================================
    const satellites = [];

    // Satellite 1: Top-Left Large Chrome Mirror Sphere (Reflects cyan & amber)
    const sat1Geo = trackGeo(new THREE.SphereGeometry(0.28, 36, 36));
    const sat1 = new THREE.Mesh(sat1Geo, mirrorChromeMat);
    modelRoot.add(sat1);
    satellites.push({
      mesh: sat1,
      orbitRadius: 2.35,
      speed: -0.32,
      angle: Math.PI * 0.72,
      yBase: 1.5,
      wobbleSpeed: 1.1,
      wobbleAmp: 0.18,
    });

    // Satellite 2: Right Chrome Mirror Sphere
    const sat2Geo = trackGeo(new THREE.SphereGeometry(0.22, 32, 32));
    const sat2 = new THREE.Mesh(sat2Geo, mirrorChromeMat);
    modelRoot.add(sat2);
    satellites.push({
      mesh: sat2,
      orbitRadius: 2.55,
      speed: 0.36,
      angle: 0.15,
      yBase: 0.2,
      wobbleSpeed: 0.9,
      wobbleAmp: 0.15,
    });

    // Satellite 3: Bottom-Left Chrome Mirror Sphere
    const sat3Geo = trackGeo(new THREE.SphereGeometry(0.2, 30, 30));
    const sat3 = new THREE.Mesh(sat3Geo, mirrorChromeMat);
    modelRoot.add(sat3);
    satellites.push({
      mesh: sat3,
      orbitRadius: 2.45,
      speed: -0.42,
      angle: Math.PI * 1.35,
      yBase: -1.0,
      wobbleSpeed: 1.3,
      wobbleAmp: 0.16,
    });

    // Dark Obsidian Satellites Material
    const darkCrystalMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x080c16,
        metalness: 0.96,
        roughness: 0.1,
        flatShading: true,
        envMapIntensity: 2.5,
      })
    );

    // Satellite 4: Upper-Right Floating Mini Faceted Crystal (Octahedron)
    const sat4Geo = trackGeo(new THREE.OctahedronGeometry(0.32, 0));
    const sat4 = new THREE.Mesh(sat4Geo, darkCrystalMat);
    modelRoot.add(sat4);
    satellites.push({
      mesh: sat4,
      orbitRadius: 2.75,
      speed: -0.24,
      angle: 0.8,
      yBase: 1.9,
      wobbleSpeed: 0.8,
      wobbleAmp: 0.12,
      rotXSpeed: 0.012,
      rotYSpeed: 0.018,
      rotZSpeed: 0.008,
    });

    // Satellite 5: Lower-Right Floating Mini Faceted Crystal
    const sat5Geo = trackGeo(new THREE.OctahedronGeometry(0.26, 0));
    const sat5 = new THREE.Mesh(sat5Geo, darkCrystalMat);
    modelRoot.add(sat5);
    satellites.push({
      mesh: sat5,
      orbitRadius: 2.7,
      speed: 0.28,
      angle: Math.PI * 1.75,
      yBase: -0.9,
      wobbleSpeed: 1.0,
      wobbleAmp: 0.14,
      rotXSpeed: -0.015,
      rotYSpeed: 0.02,
      rotZSpeed: -0.01,
    });

    // ==========================================
    // D. CIRCULAR DEEP-BLACK REFLECTIVE STAGE PEDESTAL
    // (Stationary & 100% stable at bottom: "niche ka ring stable hai move nahi ho raha")
    // ==========================================
    // Dark Glossy Black Obsidian Stage Floor Disc with cyan and orange specular pools
    const stageDiscGeo = trackGeo(new THREE.CircleGeometry(4.8, 64));
    const stageDiscMat = trackMat(
      new THREE.MeshStandardMaterial({
        map: createStageFloorTexture(),
        color: 0xffffff,
        metalness: 0.94,
        roughness: 0.1,
        side: THREE.DoubleSide,
        envMapIntensity: 1.8,
      })
    );
    const stageDisc = new THREE.Mesh(stageDiscGeo, stageDiscMat);
    stageGroup.add(stageDisc);

    // Glowing Neon Amber Ring etched into pitch-black stage floor
    const amberFloorRingGeo = trackGeo(new THREE.RingGeometry(3.32, 3.39, 96));
    const amberFloorRingMat = trackMat(
      new THREE.MeshBasicMaterial({
        color: 0xff6600,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.98,
      })
    );
    const amberFloorRing = new THREE.Mesh(amberFloorRingGeo, amberFloorRingMat);
    amberFloorRing.position.z = 0.005;
    stageGroup.add(amberFloorRing);

    // Soft Additive Glow Ring for Floor Neon Groove
    const amberFloorGlowGeo = trackGeo(new THREE.RingGeometry(3.22, 3.48, 96));
    const amberFloorGlowMat = trackMat(
      new THREE.MeshBasicMaterial({
        color: 0xff6600,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.42,
        blending: THREE.AdditiveBlending,
      })
    );
    const amberFloorGlow = new THREE.Mesh(amberFloorGlowGeo, amberFloorGlowMat);
    amberFloorGlow.position.z = 0.006;
    stageGroup.add(amberFloorGlow);

    // Concentric Subtle Cyan Track Ring on Stage (Reflecting upper-left cyan lighting)
    const cyanFloorRingGeo = trackGeo(new THREE.RingGeometry(2.32, 2.37, 80));
    const cyanFloorRingMat = trackMat(
      new THREE.MeshBasicMaterial({
        color: 0x00d4ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.58,
      })
    );
    const cyanFloorRing = new THREE.Mesh(cyanFloorRingGeo, cyanFloorRingMat);
    cyanFloorRing.position.z = 0.005;
    stageGroup.add(cyanFloorRing);

    // Inner Subtle Warm Amber Groove Ring
    const innerAmberRingGeo = trackGeo(new THREE.RingGeometry(1.48, 1.51, 64));
    const innerAmberRingMat = trackMat(
      new THREE.MeshBasicMaterial({
        color: 0xff8822,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35,
      })
    );
    const innerAmberRing = new THREE.Mesh(innerAmberRingGeo, innerAmberRingMat);
    innerAmberRing.position.z = 0.005;
    stageGroup.add(innerAmberRing);

    // Outer Subtle Dark Metallic Groove
    const outerTrackRingGeo = trackGeo(new THREE.RingGeometry(4.25, 4.28, 96));
    const outerTrackRingMat = trackMat(
      new THREE.MeshBasicMaterial({
        color: 0x121824,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5,
      })
    );
    const outerTrackRing = new THREE.Mesh(outerTrackRingGeo, outerTrackRingMat);
    outerTrackRing.position.z = 0.005;
    stageGroup.add(outerTrackRing);

    // ==========================================
    // E. 3D POINTER-TRACKING BEACON NODE & ULTRA-SMOOTH LASER TRAIL
    // "pointer pe move hone wala tha use nikalna nahi tha"
    // "tail ko smooth karna hai"
    // ==========================================
    const beaconGroup = new THREE.Group();
    scene.add(beaconGroup);

    // 1. Central 3D Incandescent Sphere
    const beaconGeo = trackGeo(new THREE.SphereGeometry(0.02, 16, 16));
    const beaconMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffaa00,
        emissiveIntensity: 4.0,
        roughness: 0.08,
      })
    );
    const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
    beaconGroup.add(beaconMesh);

    // 2. Camera-Facing Concentric Halo Sprite (Exact ( ● ) halo ring + flare bloom)
    const beaconSpriteMat = trackMat(
      new THREE.SpriteMaterial({
        map: createBeaconTexture(),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    const beaconSprite = new THREE.Sprite(beaconSpriteMat);
    beaconSprite.scale.set(0.42, 0.42, 1);
    beaconGroup.add(beaconSprite);

    // 3. Dynamic Local PointLight so beacon illuminates nearby objects as it moves
    const beaconLight = new THREE.PointLight(0xff7700, 2.2, 3.5, 1.2);
    beaconGroup.add(beaconLight);

    // Pre-allocated typed arrays for Ultra-Smooth Subdivided Ribbon
    const MAX_SMOOTH_POINTS = 64;
    const maxVertices = MAX_SMOOTH_POINTS * 2;
    const maxIndices = (MAX_SMOOTH_POINTS - 1) * 6;

    const trailPositions = new Float32Array(maxVertices * 3);
    const trailColors = new Float32Array(maxVertices * 3);
    const glowPositions = new Float32Array(maxVertices * 3);
    const glowColors = new Float32Array(maxVertices * 3);
    const trailIndices = new Uint16Array(maxIndices);

    for (let i = 0; i < MAX_SMOOTH_POINTS - 1; i++) {
      const i6 = i * 6;
      const v = i * 2;
      trailIndices[i6] = v;
      trailIndices[i6 + 1] = v + 1;
      trailIndices[i6 + 2] = v + 2;
      trailIndices[i6 + 3] = v + 1;
      trailIndices[i6 + 4] = v + 3;
      trailIndices[i6 + 5] = v + 2;
    }

    // Core Laser Trail Ribbon
    const ribbonGeo = trackGeo(new THREE.BufferGeometry());
    ribbonGeo.setAttribute("position", new THREE.BufferAttribute(trailPositions, 3));
    ribbonGeo.setAttribute("color", new THREE.BufferAttribute(trailColors, 3));
    ribbonGeo.setIndex(new THREE.BufferAttribute(trailIndices, 1));
    ribbonGeo.setDrawRange(0, 0);

    const ribbonMat = trackMat(
      new THREE.MeshBasicMaterial({
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      })
    );
    const ribbonMesh = new THREE.Mesh(ribbonGeo, ribbonMat);
    ribbonMesh.renderOrder = 8;
    scene.add(ribbonMesh);

    // Outer Soft Glow Aura Ribbon
    const glowRibbonGeo = trackGeo(new THREE.BufferGeometry());
    glowRibbonGeo.setAttribute("position", new THREE.BufferAttribute(glowPositions, 3));
    glowRibbonGeo.setAttribute("color", new THREE.BufferAttribute(glowColors, 3));
    glowRibbonGeo.setIndex(new THREE.BufferAttribute(trailIndices, 1));
    glowRibbonGeo.setDrawRange(0, 0);

    const glowRibbonMat = trackMat(
      new THREE.MeshBasicMaterial({
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      })
    );
    const glowRibbonMesh = new THREE.Mesh(glowRibbonGeo, glowRibbonMat);
    glowRibbonMesh.renderOrder = 7;
    scene.add(glowRibbonMesh);

    const rawTrail = [];
    const MAX_RAW_NODES = 24;
    const TRAIL_MAX_AGE = 0.65; // Seconds

    // Chaikin smoothing helper for 3D points (creates buttery smooth curves with zero kinks)
    const smooth3D = (pts) => {
      if (pts.length < 3) return pts;
      const res = [pts[0]];
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i];
        const p1 = pts[i + 1];
        res.push({
          x: 0.75 * p0.x + 0.25 * p1.x,
          y: 0.75 * p0.y + 0.25 * p1.y,
          z: 0.75 * p0.z + 0.25 * p1.z,
          life: 0.75 * p0.life + 0.25 * p1.life,
        });
        res.push({
          x: 0.25 * p0.x + 0.75 * p1.x,
          y: 0.25 * p0.y + 0.75 * p1.y,
          z: 0.25 * p0.z + 0.75 * p1.z,
          life: 0.25 * p0.life + 0.75 * p1.life,
        });
      }
      res.push(pts[pts.length - 1]);
      return res;
    };

    // ==========================================
    // F. BACKGROUND CINEMATIC TRAJECTORY ARCS
    // (Subtle glowing curved line streaks arcing in background matching reference image)
    // ==========================================
    const bgStreaksGroup = new THREE.Group();
    bgStreaksGroup.position.set(0, 0, -3.5);
    scene.add(bgStreaksGroup);

    const createBackgroundArc = (curvePoints, colorHex, opacity) => {
      const curve = new THREE.CatmullRomCurve3(curvePoints);
      const points = curve.getPoints(60);
      const geo = trackGeo(new THREE.BufferGeometry().setFromPoints(points));
      const mat = trackMat(
        new THREE.LineBasicMaterial({
          color: colorHex,
          transparent: true,
          opacity: opacity,
          blending: THREE.AdditiveBlending,
        })
      );
      return new THREE.Line(geo, mat);
    };

    // Upper-left to bottom-right glowing golden background trajectory arc 1
    const bgArc1 = createBackgroundArc(
      [
        new THREE.Vector3(-12.0, 5.5, 0),
        new THREE.Vector3(-5.0, 4.2, 0),
        new THREE.Vector3(2.0, 2.8, 0),
        new THREE.Vector3(8.0, 0.5, 0),
        new THREE.Vector3(12.0, -2.5, 0),
      ],
      0xff7700,
      0.35
    );
    bgStreaksGroup.add(bgArc1);

    // Parallel subtle background arc 2
    const bgArc2 = createBackgroundArc(
      [
        new THREE.Vector3(-10.0, 7.0, 0),
        new THREE.Vector3(-3.5, 5.2, 0),
        new THREE.Vector3(3.5, 3.5, 0),
        new THREE.Vector3(9.5, 1.2, 0),
      ],
      0xff9922,
      0.22
    );
    bgStreaksGroup.add(bgArc2);

    // ==========================================
    // G. AMBIENT QUANTUM EMBERS & CYBER STARDUST
    // ==========================================
    const particleCount = 420;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const cAmber = new THREE.Color(0xff7700);
    const cGold = new THREE.Color(0xffaa22);
    const cCyan = new THREE.Color(0x00e5ff);

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      particlePositions[idx] = (Math.random() - 0.5) * 24;
      particlePositions[idx + 1] = (Math.random() - 0.5) * 12;
      particlePositions[idx + 2] = (Math.random() - 0.5) * 8 - 1.0;

      const color = i % 5 === 0 ? cCyan : i % 2 === 0 ? cAmber : cGold;
      particleColors[idx] = color.r;
      particleColors[idx + 1] = color.g;
      particleColors[idx + 2] = color.b;
    }

    const particleGeo = trackGeo(new THREE.BufferGeometry());
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    const particleMat = trackMat(
      new THREE.PointsMaterial({
        size: 0.045,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
      })
    );

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ==========================================
    // H. INTERACTION STATE & POINTER TRACKING
    // ==========================================
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let isDragging = false;
    let pointerDownPos = { x: 0, y: 0 };
    let prevMousePos = { x: 0, y: 0 };
    let dragVelocity = { x: 0, y: 0 };

    const raycaster = new THREE.Raycaster();
    const mouseNdc = new THREE.Vector2();
    let isHoveringDiamond = false;

    let lastUserMoveTime = -10000;
    let hasUserMovedPointer = false;
    const pointerWorldTarget = new THREE.Vector3();

    // Default beacon position at upper-right orbit
    const defaultBeaconX = layout.offsetX + Math.cos(0.55) * ring3Radius;
    const defaultBeaconY = layout.offsetY + Math.sin(0.55) * 1.85 + 0.6;
    const currentBeaconPos = new THREE.Vector3(defaultBeaconX, defaultBeaconY, 0.4);
    beaconGroup.position.copy(currentBeaconPos);

    const handlePointerMove = (e) => {
      lastUserMoveTime = performance.now();
      hasUserMovedPointer = true;

      // Track cursor relative to the canvas bounding rect for 100% pixel-perfect accuracy
      const rect = container.getBoundingClientRect();
      const mouseCanvasX = e.clientX - rect.left;
      const mouseCanvasY = e.clientY - rect.top;

      const ndcX = (mouseCanvasX / rect.width) * 2 - 1;
      const ndcY = -(mouseCanvasY / rect.height) * 2 + 1;

      pointer.targetX = ndcX;
      pointer.targetY = ndcY;
      mouseNdc.x = ndcX;
      mouseNdc.y = ndcY;

      // Exact camera ray unproject to plane z = 0.5 (exact cursor location in 3D space)
      const rayOrigin = camera.position.clone();
      const rayDir = new THREE.Vector3(ndcX, ndcY, 0.5).unproject(camera).sub(rayOrigin).normalize();
      const targetZ = 0.5;
      const dist = (targetZ - rayOrigin.z) / rayDir.z;
      pointerWorldTarget.copy(rayOrigin.add(rayDir.multiplyScalar(dist)));

      // Raycast to test hover over interactive 3D diamond
      raycaster.setFromCamera(mouseNdc, camera);
      const hits = raycaster.intersectObjects([topOuterGem, bottomOuterGem, innerCore, chevronMesh], true);
      isHoveringDiamond = hits.length > 0;
      if (!isDragging) {
        container.style.cursor = isHoveringDiamond ? "pointer" : "default";
      }

      if (isDragging) {
        const deltaX = e.clientX - prevMousePos.x;
        const deltaY = e.clientY - prevMousePos.y;
        dragVelocity.x = deltaX * 0.005;
        dragVelocity.y = deltaY * 0.005;
        prevMousePos = { x: e.clientX, y: e.clientY };
      }
    };

    const handlePointerDown = (e) => {
      if (
        e.target.tagName === "BUTTON" ||
        e.target.tagName === "A" ||
        e.target.closest("a") ||
        e.target.closest("button")
      ) {
        return;
      }
      isDragging = true;
      pointerDownPos = { x: e.clientX, y: e.clientY };
      prevMousePos = { x: e.clientX, y: e.clientY };
      container.style.cursor = "grabbing";
    };

    const handlePointerUp = (e) => {
      const moveDist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      isDragging = false;
      container.style.cursor = isHoveringDiamond ? "pointer" : "default";

      // If clicked without dragging (threshold < 6px)
      if (moveDist < 6) {
        raycaster.setFromCamera(mouseNdc, camera);
        const hits = raycaster.intersectObjects([topOuterGem, bottomOuterGem, innerCore, chevronMesh], true);
        if (hits.length > 0) {
          triggerShockwave();
          onToggleExplodeRef.current?.();
        }
      }
    };

    container.style.cursor = "default";
    container.style.touchAction = "pan-y";
    container.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    // ==========================================
    // I. DYNAMIC VIEWPORT RESIZING (Equal Margins on Both Sides)
    // ==========================================
    const updateFraming = () => {
      if (!container || !camera || !renderer) return;
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || 700;
      if (newWidth === 0 || newHeight === 0) return;

      const newAspect = newWidth / newHeight;
      camera.aspect = newAspect;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);

      // Recompute dynamic layout & distance
      layout = computeLayout(newWidth, newHeight);

      camera.position.set(0, 0, layout.dist);
      camera.lookAt(0, 0, 0);

      modelRoot.position.set(layout.offsetX, layout.offsetY, 0);
      stageGroup.position.set(layout.offsetX, layout.stageY, 0);
      shockwaveGroup.position.set(layout.offsetX, layout.offsetY, 0);
      coreLight.position.set(layout.offsetX, layout.offsetY, 0);
      floorReflectLight.position.set(layout.offsetX, layout.stageY + 0.5, 0.5);
    };

    resizeObserver = new ResizeObserver(updateFraming);
    resizeObserver.observe(container);
    window.addEventListener("resize", updateFraming);

    // Visibility Observer
    let isVisible = true;
    visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    visibilityObserver.observe(container);

    // ==========================================
    // J. SMOOTH 60FPS ANIMATION LOOP
    // "phis har object aalaag move ho raha hai"
    // (Every object has independent movement and rotation frequencies!)
    // ==========================================
    const clock = new THREE.Clock();
    const viewDir = new THREE.Vector3(0, 0, 1);
    const tangent = new THREE.Vector3();
    const side = new THREE.Vector3();

    let currentExplode = 0.0;
    let shockwaveProgress = 1.0;

    const triggerShockwave = () => {
      shockwaveProgress = 0.0;
    };
    triggerShockwaveRef.current = triggerShockwave;

    const animate = () => {
      if (disposed) return;
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const dt = Math.min(clock.getDelta(), 0.1);
      const t = clock.getElapsedTime();

      // Exploded View smooth interpolation
      const targetExplode = isExplodedRef.current ? 1.0 : 0.0;
      currentExplode += (targetExplode - currentExplode) * 0.075;

      // Shockwave Pulse Animation (Concept 2: Core Overdrive Shockwave Pulse)
      let shockwaveOverdrive = 0.0;
      if (shockwaveProgress < 1.0) {
        shockwaveProgress += dt * 1.6;
        const p = Math.min(shockwaveProgress, 1.0);
        const easeOut = 1.0 - Math.pow(1.0 - p, 3);
        const shockScale = 0.5 + easeOut * 5.8;

        shockwaveCyanMesh.scale.set(shockScale, shockScale, shockScale);
        shockwaveAmberMesh.scale.set(shockScale * 0.86, shockScale * 0.86, shockScale * 0.86);

        const fade = Math.max(0, 1.0 - p);
        shockwaveCyanMat.opacity = fade * 0.95;
        shockwaveAmberMat.opacity = fade * 0.85;

        shockwaveCyanMesh.visible = p < 0.98;
        shockwaveAmberMesh.visible = p < 0.98;

        if (p < 0.35) {
          shockwaveOverdrive = Math.sin((p / 0.35) * Math.PI) * 4.5;
        }
      } else {
        shockwaveCyanMesh.visible = false;
        shockwaveAmberMesh.visible = false;
      }

      // Smooth cursor interpolation
      pointer.x += (pointer.targetX - pointer.x) * 0.08;
      pointer.y += (pointer.targetY - pointer.y) * 0.08;

      // Specular cursor light tracks mouse across full hero
      cursorLight.position.x = pointer.x * (layout.visibleWidth / 2);
      cursorLight.position.y = pointer.y * (layout.visibleHeight / 2);
      cursorLight.position.z = 4.0;

      // ====================================================
      // 1. INDEPENDENT MOTION: Central Faceted Diamond Gem & Exploded Architecture Layers
      // Floating hover + independent axial rotation + breathing molten core
      // ====================================================
      gemGroup.position.y = Math.sin(t * 1.1) * 0.08;
      gemGroup.rotation.y += 0.0035;
      gemGroup.rotation.z = Math.sin(t * 0.75) * 0.025;

      // Exploded Shell Separation (Layer 01 & Layer 04)
      topGlassGroup.position.y = currentExplode * 1.55;
      bottomGlassGroup.position.y = -currentExplode * 1.35;

      // Layer 03: Core scaling & incandescent overdrive
      const corePulse = 1.0 + Math.sin(t * 2.2) * 0.035;
      const coreScale = (1.0 + currentExplode * 0.18) * corePulse;
      coreGroup.scale.set(coreScale, coreScale, coreScale);

      const baseCoreGlow = 2.4 + Math.sin(t * 2.2) * 0.4 + currentExplode * 1.8 + shockwaveOverdrive;
      innerCoreMat.emissiveIntensity = baseCoreGlow;
      chevronMat.emissiveIntensity = 3.5 + Math.sin(t * 2.2) * 0.5 + currentExplode * 2.2 + shockwaveOverdrive * 1.5;
      coreLight.intensity = 2.6 + Math.sin(t * 2.2) * 0.4 + currentExplode * 2.2 + shockwaveOverdrive * 2.0;
      gemInteriorLight.intensity = 3.5 + Math.sin(t * 2.2) * 0.4 + currentExplode * 2.5 + shockwaveOverdrive * 2.5;

      // ====================================================
      // 2. INDEPENDENT MOTION: Thick Liquid-Chrome Equatorial Ring (Layer 02: API Engine)
      // Has its own independent phase hover and slow precession!
      // ====================================================
      ring1Group.position.y = Math.sin(t * 0.95 + 1.2) * 0.045 + currentExplode * 0.22;
      ring1.rotation.z += 0.0016; // Spins smoothly on its own plane
      ring1Group.rotation.z = Math.sin(t * 0.65 + 0.4) * 0.02;
      ring1Group.scale.setScalar(1.0 + currentExplode * 0.28);

      // ====================================================
      // 3. INDEPENDENT MOTION: Diagonal Chrome Ring
      // Rotates along its own diagonal plane independently!
      // ====================================================
      ring2Group.position.y = Math.sin(t * 0.85 + 2.5) * 0.05 - currentExplode * 0.22;
      ring2.rotation.z += 0.0024;
      ring2Group.scale.setScalar(1.0 + currentExplode * 0.22);

      // ====================================================
      // 4. INDEPENDENT MOTION: Outer Trajectory Guide Ring
      // ====================================================
      ring3Group.position.y = Math.sin(t * 0.7 + 3.0) * 0.035;
      ring3.rotation.z -= 0.0014;
      ring3Group.scale.setScalar(1.0 + currentExplode * 0.15);

      // ====================================================
      // 5. USER DRAG INERTIA on ModelRoot
      // Only the modelRoot responds to user drag, stage floor remains stable!
      // ====================================================
      if (isDragging) {
        modelRoot.rotation.y += dragVelocity.x;
        modelRoot.rotation.x += dragVelocity.y * 0.3;
      } else {
        dragVelocity.x *= 0.92;
        dragVelocity.y *= 0.92;
        modelRoot.rotation.y += dragVelocity.x + 0.0012; // slow base momentum
        modelRoot.rotation.x += (0 - modelRoot.rotation.x) * 0.03;
      }

      // ====================================================
      // 6. INDEPENDENT MOTION: 5 Orbiting Satellites (widen orbit on explode)
      // Each satellite has its own orbital plane, speed, radius, and wobble!
      // ====================================================
      satellites.forEach((sat) => {
        if (!sat.mesh) return;
        sat.angle += sat.speed * 0.015;
        const wobble = Math.sin(t * sat.wobbleSpeed) * sat.wobbleAmp;
        const currentRadius = sat.orbitRadius * (1.0 + currentExplode * 0.2);

        sat.mesh.position.x = Math.cos(sat.angle) * currentRadius;
        sat.mesh.position.z = Math.sin(sat.angle) * currentRadius;
        sat.mesh.position.y = sat.yBase + wobble;

        if (sat.rotXSpeed) {
          sat.mesh.rotation.x += sat.rotXSpeed;
          sat.mesh.rotation.y += sat.rotYSpeed;
          sat.mesh.rotation.z += sat.rotZSpeed;
        }
      });

      // ====================================================
      // 7. 3D POINTER BEACON & ULTRA-SMOOTH LASER TRAIL
      // "pointer pe move hone wala tha use nikalna nahi tha"
      // "tail ko smooth karna hai"
      // ====================================================
      const now = performance.now();
      const isUserActive = hasUserMovedPointer && now - lastUserMoveTime < 2400;

      if (isUserActive) {
        currentBeaconPos.x += (pointerWorldTarget.x - currentBeaconPos.x) * 0.75;
        currentBeaconPos.y += (pointerWorldTarget.y - currentBeaconPos.y) * 0.75;
        currentBeaconPos.z += (pointerWorldTarget.z - currentBeaconPos.z) * 0.75;
      } else {
        const idleAngle = t * 0.45 + 0.55;
        const targetOrbitX = layout.offsetX + Math.cos(idleAngle) * ring3Radius;
        const targetOrbitY = layout.offsetY + Math.sin(idleAngle) * 1.85 + 0.6;
        const targetOrbitZ = Math.sin(idleAngle) * 0.8 + 0.2;

        currentBeaconPos.x += (targetOrbitX - currentBeaconPos.x) * 0.06;
        currentBeaconPos.y += (targetOrbitY - currentBeaconPos.y) * 0.06;
        currentBeaconPos.z += (targetOrbitZ - currentBeaconPos.z) * 0.06;
      }

      beaconGroup.position.copy(currentBeaconPos);

      const beaconPulse = 1.0 + Math.sin(t * 3.6) * 0.06;
      beaconSprite.scale.set(0.42 * beaconPulse, 0.42 * beaconPulse, 1);
      beaconLight.intensity = 2.2 + Math.sin(t * 3.6) * 0.4;

      // Age raw trail nodes
      for (let i = rawTrail.length - 1; i >= 0; i--) {
        rawTrail[i].age += dt;
        rawTrail[i].life = Math.max(0, 1.0 - rawTrail[i].age / TRAIL_MAX_AGE);
        if (rawTrail[i].life <= 0) {
          rawTrail.splice(i, 1);
        }
      }

      // Add new point if beacon moved
      const lastPoint = rawTrail[0];
      let shouldAdd = false;
      if (!lastPoint) {
        shouldAdd = true;
      } else {
        const dx = currentBeaconPos.x - lastPoint.x;
        const dy = currentBeaconPos.y - lastPoint.y;
        const dz = currentBeaconPos.z - lastPoint.z;
        if (dx * dx + dy * dy + dz * dz > 0.0012) {
          shouldAdd = true;
        }
      }

      if (shouldAdd) {
        rawTrail.unshift({
          x: currentBeaconPos.x,
          y: currentBeaconPos.y,
          z: currentBeaconPos.z,
          age: 0,
          life: 1.0,
        });
        if (rawTrail.length > MAX_RAW_NODES) {
          rawTrail.pop();
        }
      }

      // Generate Ultra-Smooth Subdivided 3D Ribbon ("tail ko smooth karna hai")
      if (rawTrail.length >= 2) {
        const smoothed = smooth3D(rawTrail);
        const count = Math.min(smoothed.length, MAX_SMOOTH_POINTS);

        for (let i = 0; i < count; i++) {
          const pt = smoothed[i];
          const progress = 1.0 - i / (count - 1); // 1.0 at head, 0.0 at tail tip

          // Head Taper: Tapers to EXACT 0.0 at i = 0 inside the center orb, eliminating ANY flat cutoff or sharp corners!
          const headProgress = Math.min(1.0, i / Math.min(5, count - 1));
          const headTaper = Math.sin(headProgress * Math.PI * 0.5);

          // Tail Taper: smoothly tapers to 0 at the tail tip
          const tailTaper = Math.pow(progress, 0.85);
          const widthEnvelope = headTaper * tailTaper * pt.life;

          // Exponential decay for ultra-smooth needle tapering
          const fade = headTaper * Math.pow(progress, 1.1) * Math.pow(pt.life, 1.3);

          // Tangent calculation
          let tx, ty;
          if (i < count - 1) {
            tx = smoothed[i].x - smoothed[i + 1].x;
            ty = smoothed[i].y - smoothed[i + 1].y;
          } else {
            tx = smoothed[i - 1].x - smoothed[i].x;
            ty = smoothed[i - 1].y - smoothed[i].y;
          }
          const tLen = Math.hypot(tx, ty) || 1;
          const nx = -ty / tLen;
          const ny = tx / tLen;

          // Sleek, refined ribbon widths matching the delicate laser trajectory in reference
          const coreWidth = 0.022 * widthEnvelope;
          const glowWidth = 0.065 * widthEnvelope;

          const vIdx = i * 2;
          const pIdx = vIdx * 3;

          // Core Ribbon Positions
          trailPositions[pIdx] = pt.x + nx * coreWidth;
          trailPositions[pIdx + 1] = pt.y + ny * coreWidth;
          trailPositions[pIdx + 2] = pt.z;

          trailPositions[pIdx + 3] = pt.x - nx * coreWidth;
          trailPositions[pIdx + 4] = pt.y - ny * coreWidth;
          trailPositions[pIdx + 5] = pt.z;

          // Glow Ribbon Positions
          glowPositions[pIdx] = pt.x + nx * glowWidth;
          glowPositions[pIdx + 1] = pt.y + ny * glowWidth;
          glowPositions[pIdx + 2] = pt.z;

          glowPositions[pIdx + 3] = pt.x - nx * glowWidth;
          glowPositions[pIdx + 4] = pt.y - ny * glowWidth;
          glowPositions[pIdx + 5] = pt.z;

          // Colors
          let r = 1.0, g = 0.45, b = 0.0;
          if (progress > 0.8) {
            r = 1.0;
            g = 0.88 + 0.12 * ((progress - 0.8) / 0.2);
            b = 0.5 + 0.45 * ((progress - 0.8) / 0.2);
          } else if (progress > 0.35) {
            const tr = (progress - 0.35) / 0.45;
            r = 1.0;
            g = 0.4 + 0.48 * tr;
            b = 0.05 + 0.45 * tr;
          } else {
            const tr = progress / 0.35;
            r = 0.82 + 0.18 * tr;
            g = 0.15 + 0.25 * tr;
            b = 0.0;
          }

          const cR = r * fade;
          const cG = g * fade;
          const cB = b * fade;

          trailColors[pIdx] = cR;
          trailColors[pIdx + 1] = cG;
          trailColors[pIdx + 2] = cB;
          trailColors[pIdx + 3] = cR;
          trailColors[pIdx + 4] = cG;
          trailColors[pIdx + 5] = cB;

          const gR = r * fade * 0.42;
          const gG = g * fade * 0.32;

          glowColors[pIdx] = gR;
          glowColors[pIdx + 1] = gG;
          glowColors[pIdx + 2] = 0;
          glowColors[pIdx + 3] = gR;
          glowColors[pIdx + 4] = gG;
          glowColors[pIdx + 5] = 0;
        }

        ribbonGeo.attributes.position.needsUpdate = true;
        ribbonGeo.attributes.color.needsUpdate = true;
        ribbonGeo.setDrawRange(0, (count - 1) * 6);

        glowRibbonGeo.attributes.position.needsUpdate = true;
        glowRibbonGeo.attributes.color.needsUpdate = true;
        glowRibbonGeo.setDrawRange(0, (count - 1) * 6);
      } else {
        ribbonGeo.setDrawRange(0, 0);
        glowRibbonGeo.setDrawRange(0, 0);
      }

      // ====================================================
      // 8. Ambient particles slow drifting motion
      // ====================================================
      particles.rotation.y = t * 0.012;

      renderer.render(scene, camera);
    };

    animate();

    // 11. Comprehensive Cleanup
    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrameId);
      resizeObserver?.disconnect();
      visibilityObserver?.disconnect();
      window.removeEventListener("resize", updateFraming);
      container.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      scene.environment = null;
      envTarget.dispose();
      pmrem.dispose();
      envTexture.dispose();
      textures.forEach((texture) => texture.dispose());
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (!webglSupported) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          minHeight: 320,
          display: "grid",
          placeItems: "center",
          background: "radial-gradient(circle, rgba(255,107,0,.12), transparent 70%)",
          borderRadius: "var(--radius-lg, 16px)",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💎</div>
          <p style={{ color: "var(--text-secondary, #aab2c0)" }}>
            WebGL is unavailable. Please enable browser hardware acceleration.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      role="img"
      aria-label="Interactive 3D futuristic diamond centerpiece with chrome orbital rings and glowing trailing pointer"
      style={{
        width: "100%",
        height: "100%",
        minHeight: 320,
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        userSelect: "none",
      }}
    />
  );
}
