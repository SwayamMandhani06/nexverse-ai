'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

function readAccent() {
  const root = document.documentElement;
  const accent = getComputedStyle(root).getPropertyValue('--accent').trim() || '#7C3AED';
  const glow   = getComputedStyle(root).getPropertyValue('--accent-glow').trim() || '#A78BFA';
  return { accent, glow };
}

export default function EarphoneModel() {
  const mountRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── Scene ──
    const scene  = new THREE.Scene();
    const w = mount.clientWidth  || 480;
    const h = mount.clientHeight || 480;

    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.set(0, 0, 4.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping     = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    mount.appendChild(renderer.domElement);

    // ── Lights ──
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    const { accent, glow } = readAccent();

    // Key — accent from front-right
    const keyLight = new THREE.PointLight(new THREE.Color(accent), 8, 12);
    keyLight.position.set(3, 2, 4);
    scene.add(keyLight);

    // Fill — glow from left
    const fillLight = new THREE.PointLight(new THREE.Color(glow), 4, 10);
    fillLight.position.set(-3, -1, 3);
    scene.add(fillLight);

    // Rim — white from behind
    const rimLight = new THREE.PointLight(0xffffff, 2, 8);
    rimLight.position.set(0, 0, -4);
    scene.add(rimLight);

    // ── Geometry & Material ──
    const geometry = new THREE.TorusKnotGeometry(1, 0.32, 128, 16, 2, 3);
    const material = new THREE.MeshStandardMaterial({
      color:            new THREE.Color('#d8d8e8'),
      metalness:        0.95,
      roughness:        0.08,
      envMapIntensity:  1.2,
      emissive:         new THREE.Color(accent),
      emissiveIntensity: 0.07,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // ── Mood change: update light & emissive colours ──
    const onMoodChange = () => {
      const { accent: a, glow: g } = readAccent();
      keyLight.color.set(a);
      fillLight.color.set(g);
      material.emissive.set(a);
      material.needsUpdate = true;
    };
    window.addEventListener('moodchange', onMoodChange);

    // ── Mouse lerp ──
    const mouse  = { x: 0, y: 0 };
    const tilt   = { x: 0, y: 0 };
    const MAX_TILT = (15 * Math.PI) / 180;

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    // ── Resize ──
    const onResize = () => {
      const nw = mount.clientWidth;
      const nh = mount.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    // ── Render loop ──
    let rafId: number;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      mesh.rotation.y += 0.003;
      tilt.x += (mouse.y * MAX_TILT - tilt.x) * 0.05;
      tilt.y += (mouse.x * MAX_TILT - tilt.y) * 0.05;
      mesh.rotation.x  = tilt.x;
      mesh.rotation.z  = -tilt.y * 0.3;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('moodchange', onMoodChange);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      style={{ width: '100%', height: '100%', minWidth: 260, minHeight: 260 }}
    />
  );
}
