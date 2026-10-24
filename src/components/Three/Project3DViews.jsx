import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * 1. Database3DView: Interactive 3D Relational Database Monolith
 * Tailored for: Student Record Management System (Python, Tkinter, MySQL)
 */
export function Database3DView({ isHovered = false }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 220;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.set(2.8, 2.5, 3.8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambLight = new THREE.AmbientLight(0x0f172a, 2.0);
    scene.add(ambLight);

    const dirLight = new THREE.DirectionalLight(0xff6b00, 3.0);
    dirLight.position.set(4, 5, 3);
    scene.add(dirLight);

    const cyanLight = new THREE.PointLight(0x00e5ff, 2.5, 10);
    cyanLight.position.set(-3, -2, -2);
    scene.add(cyanLight);

    // Group for database tiers
    const dbGroup = new THREE.Group();
    scene.add(dbGroup);

    // Create 3 layered database cylinders
    const tierCount = 3;
    const cylinderGeo = new THREE.CylinderGeometry(1.1, 1.1, 0.35, 32);
    const cylinderMat = new THREE.MeshStandardMaterial({
      color: 0x181c28,
      metalness: 0.85,
      roughness: 0.25,
      emissive: 0x241407,
      emissiveIntensity: 0.5
    });

    const glowRingMat = new THREE.MeshBasicMaterial({
      color: 0xff6b00,
      wireframe: true,
      transparent: true,
      opacity: 0.8
    });

    for (let i = 0; i < tierCount; i++) {
      const tierMesh = new THREE.Mesh(cylinderGeo, cylinderMat);
      tierMesh.position.y = (i - 1) * 0.55;
      dbGroup.add(tierMesh);

      // Glowing rim ring
      const ringGeo = new THREE.TorusGeometry(1.12, 0.02, 8, 32);
      const ringMesh = new THREE.Mesh(ringGeo, glowRingMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.y = (i - 1) * 0.55;
      dbGroup.add(ringMesh);
    }

    // Floating relational data nodes around database
    const nodes = [];
    const nodeGeo = new THREE.BoxGeometry(0.18, 0.18, 0.18);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      emissive: 0x00e5ff,
      emissiveIntensity: 0.9,
      roughness: 0.2
    });

    for (let i = 0; i < 6; i++) {
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      const angle = (i / 6) * Math.PI * 2;
      const radius = 1.7;
      node.position.set(Math.cos(angle) * radius, (Math.sin(angle * 2) * 0.4), Math.sin(angle) * radius);
      dbGroup.add(node);
      nodes.push({ mesh: node, angle, radius });
    }

    // Connective line grid
    const lineMat = new THREE.LineBasicMaterial({ color: 0xff6b00, transparent: true, opacity: 0.35 });
    const lineGeo = new THREE.BufferGeometry();
    const linePos = [];
    nodes.forEach(n => {
      linePos.push(0, 0, 0, n.mesh.position.x, n.mesh.position.y, n.mesh.position.z);
    });
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3));
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    dbGroup.add(lines);

    // Mouse tilt tracking
    let targetRotY = 0;
    let targetRotX = 0;
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotY = x * 0.5;
      targetRotX = y * 0.3;
    };
    container.addEventListener('mousemove', handleMouseMove);

    // Visibility observer
    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.1 });
    observer.observe(container);

    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;
      const t = clock.getElapsedTime();

      dbGroup.rotation.y += 0.008 + (targetRotY * 0.05);
      dbGroup.rotation.x += (targetRotX - dbGroup.rotation.x) * 0.08;

      nodes.forEach((n, idx) => {
        n.mesh.position.y = Math.sin(t * 2 + idx) * 0.45;
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animId);
      container.removeEventListener('mousemove', handleMouseMove);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      cylinderGeo.dispose();
      cylinderMat.dispose();
      glowRingMat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      style={{ 
        width: '100%', 
        height: '100%', 
        minHeight: '230px', 
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }} 
    />
  );
}

/**
 * 2. WebPrism3DView: Interactive 3D Holographic UI Glass Prism
 * Tailored for: Personal Portfolio Website (React.js, Vite, Three.js, Glassmorphism)
 */
export function WebPrism3DView({ isHovered = false }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 220;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.set(3.2, 2.2, 3.4);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambLight = new THREE.AmbientLight(0x0f172a, 2.2);
    scene.add(ambLight);

    const keyLight = new THREE.DirectionalLight(0x00e5ff, 3.5);
    keyLight.position.set(4, 4, 3);
    scene.add(keyLight);

    const amberLight = new THREE.PointLight(0xff6b00, 2.5, 8);
    amberLight.position.set(-2, -2, 2);
    scene.add(amberLight);

    // Group for floating glass screens
    const prismGroup = new THREE.Group();
    scene.add(prismGroup);

    // Create 3 layered translucent glass panes (Browser layout, Wireframe code, Hero visual)
    const paneGeo = new THREE.BoxGeometry(2.0, 1.35, 0.05);

    // Pane 1: Backing UI Screen
    const paneMatBack = new THREE.MeshStandardMaterial({
      color: 0x101420,
      metalness: 0.9,
      roughness: 0.2,
      transparent: true,
      opacity: 0.85
    });
    const pane1 = new THREE.Mesh(paneGeo, paneMatBack);
    pane1.position.z = -0.3;
    prismGroup.add(pane1);

    // Pane 2: Middle Translucent Glass Layer
    const paneMatMid = new THREE.MeshPhysicalMaterial({
      color: 0x00e5ff,
      transmission: 0.6,
      opacity: 0.7,
      transparent: true,
      roughness: 0.15,
      metalness: 0.1,
      ior: 1.5
    });
    const pane2 = new THREE.Mesh(paneGeo, paneMatMid);
    pane2.position.z = 0;
    prismGroup.add(pane2);

    // Pane 3: Glowing Wireframe Grid (Frontend UI Structure)
    const wireGeo = new THREE.EdgesGeometry(paneGeo);
    const wireMat = new THREE.LineBasicMaterial({ color: 0x00e5ff, linewidth: 2 });
    const wireframeMesh = new THREE.LineSegments(wireGeo, wireMat);
    wireframeMesh.position.z = 0.3;
    prismGroup.add(wireframeMesh);

    // Floating UI Code Tokens (Small interactive cubes)
    const tokenGeo = new THREE.BoxGeometry(0.2, 0.06, 0.02);
    const tokenMat = new THREE.MeshBasicMaterial({ color: 0xff6b00 });
    for (let i = 0; i < 4; i++) {
      const token = new THREE.Mesh(tokenGeo, tokenMat);
      token.position.set(-0.6 + i * 0.4, 0.35, 0.33);
      prismGroup.add(token);
    }

    // Ambient floating particles
    const partGeo = new THREE.BufferGeometry();
    const partPos = [];
    for (let i = 0; i < 40; i++) {
      partPos.push(
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 2.5,
        (Math.random() - 0.5) * 2
      );
    }
    partGeo.setAttribute('position', new THREE.Float32BufferAttribute(partPos, 3));
    const partMat = new THREE.PointsMaterial({ size: 0.05, color: 0x00e5ff, transparent: true, opacity: 0.8 });
    const particles = new THREE.Points(partGeo, partMat);
    prismGroup.add(particles);

    // Mouse tilt
    let targetX = 0;
    let targetY = 0;
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      targetX = (((e.clientX - rect.left) / rect.width) * 2 - 1) * 0.45;
      targetY = -(((e.clientY - rect.top) / rect.height) * 2 - 1) * 0.3;
    };
    container.addEventListener('mousemove', handleMouseMove);

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.1 });
    observer.observe(container);

    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;
      const t = clock.getElapsedTime();

      prismGroup.rotation.y += (targetX - prismGroup.rotation.y) * 0.08 + 0.005;
      prismGroup.rotation.x += (targetY - prismGroup.rotation.x) * 0.08;
      pane2.position.y = Math.sin(t * 1.5) * 0.06;
      wireframeMesh.position.y = Math.sin(t * 1.5 + 0.5) * 0.06;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animId);
      container.removeEventListener('mousemove', handleMouseMove);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      paneGeo.dispose();
      paneMatBack.dispose();
      paneMatMid.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      tokenGeo.dispose();
      tokenMat.dispose();
      partGeo.dispose();
      partMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      style={{ 
        width: '100%', 
        height: '100%', 
        minHeight: '230px', 
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }} 
    />
  );
}

/**
 * 3. NeuralSurface3DView: Interactive 3D Loss Surface / Neural Topology
 * Tailored for: Machine Learning Mini Project (Python, Pandas, Scikit-Learn)
 */
export function NeuralSurface3DView({ isHovered = false }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 220;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.set(2.6, 2.8, 3.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambLight = new THREE.AmbientLight(0x0f172a, 2.0);
    scene.add(ambLight);

    const amberLight = new THREE.DirectionalLight(0xf59e0b, 3.2);
    amberLight.position.set(3, 4, 2);
    scene.add(amberLight);

    const purpleLight = new THREE.PointLight(0xa855f7, 2.5, 8);
    purpleLight.position.set(-3, -2, -2);
    scene.add(purpleLight);

    const mlGroup = new THREE.Group();
    scene.add(mlGroup);

    // Parametric undulating plane geometry (Loss surface / Decision manifold)
    const gridSize = 24;
    const planeGeo = new THREE.PlaneGeometry(2.4, 2.4, gridSize, gridSize);
    planeGeo.rotateX(-Math.PI / 2);

    const pos = planeGeo.attributes.position;
    const originalY = new Float32Array(pos.count);
    for (let i = 0; i < pos.count; i++) {
      originalY[i] = pos.getY(i);
    }

    const planeMat = new THREE.MeshStandardMaterial({
      color: 0x131724,
      metalness: 0.85,
      roughness: 0.3,
      wireframe: true,
      emissive: 0x221105,
      emissiveIntensity: 0.4
    });
    const planeMesh = new THREE.Mesh(planeGeo, planeMat);
    mlGroup.add(planeMesh);

    // Glowing data point clusters (Representing classified observations)
    const clusterCount = 18;
    const clusterGeo = new THREE.SphereGeometry(0.045, 12, 12);
    const clusterMatA = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const clusterMatB = new THREE.MeshBasicMaterial({ color: 0x10b981 });

    const clusterPoints = [];
    for (let i = 0; i < clusterCount; i++) {
      const isClassA = i % 2 === 0;
      const pt = new THREE.Mesh(clusterGeo, isClassA ? clusterMatA : clusterMatB);
      const angle = (i / clusterCount) * Math.PI * 2;
      const radius = 0.5 + Math.random() * 0.5;
      pt.position.set(Math.cos(angle) * radius, 0.2, Math.sin(angle) * radius);
      mlGroup.add(pt);
      clusterPoints.push(pt);
    }

    // Mouse tilt
    let targetX = 0;
    let targetY = 0;
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      targetX = (((e.clientX - rect.left) / rect.width) * 2 - 1) * 0.45;
      targetY = -(((e.clientY - rect.top) / rect.height) * 2 - 1) * 0.3;
    };
    container.addEventListener('mousemove', handleMouseMove);

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.1 });
    observer.observe(container);

    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;
      const t = clock.getElapsedTime();

      // Undulate surface vertices (simulating neural optimization convergence)
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const z = pos.getZ(i);
        const y = Math.sin(x * 3.5 + t * 2) * Math.cos(z * 3.5 + t * 2) * 0.25;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;
      planeGeo.computeVertexNormals();

      // Floating cluster points
      clusterPoints.forEach((pt, idx) => {
        pt.position.y = 0.25 + Math.sin(t * 3 + idx) * 0.1;
      });

      mlGroup.rotation.y += 0.007 + (targetX * 0.05);
      mlGroup.rotation.x += (targetY - mlGroup.rotation.x) * 0.08;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animId);
      container.removeEventListener('mousemove', handleMouseMove);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      planeGeo.dispose();
      planeMat.dispose();
      clusterGeo.dispose();
      clusterMatA.dispose();
      clusterMatB.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      style={{ 
        width: '100%', 
        height: '100%', 
        minHeight: '230px', 
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }} 
    />
  );
}
