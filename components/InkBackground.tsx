
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const InkBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = document.getElementById('canvas-bg');
    if (!container) return;

    // --- 初始化场景 ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 500;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // --- 创建圆形柔光粒子贴图 ---
    const createCircleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
      }
      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    };

    // --- 粒子系统设置 ---
    const particleCount = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    // 存储初始随机值用于噪声计算
    const randoms = new Float32Array(particleCount);

    const colorInk = new THREE.Color('#2F3542');
    const colorGold = new THREE.Color('#D8C090');

    for (let i = 0; i < particleCount; i++) {
      // 随机初始位置
      positions[i * 3] = (Math.random() - 0.5) * 1000;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 1000;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 500;

      // 颜色混合
      const mixedColor = colorInk.clone().lerp(colorGold, Math.random() * 0.3);
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;

      sizes[i] = Math.random() * 10 + 5;
      randoms[i] = Math.random();
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 8,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      map: createCircleTexture(),
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // --- 鼠标交互 ---
    const mouse = new THREE.Vector2(-9999, -9999);
    const targetMouse = new THREE.Vector2(-9999, -9999);

    const handleMouseMove = (event: MouseEvent) => {
      targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        targetMouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
        targetMouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    // --- 动画循环 ---
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.001;

      // 平滑鼠标坐标
      mouse.lerp(targetMouse, 0.05);

      const posAttr = geometry.getAttribute('position');
      const particleArray = posAttr.array as Float32Array;

      // 转换为世界坐标的鼠标位置（简化版，假设 z=0 平面交互）
      const mouseWorldX = mouse.x * 500;
      const mouseWorldY = mouse.y * 300;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = particleArray[i3];
        const y = particleArray[i3 + 1];
        const z = particleArray[i3 + 2];

        // 基础意识流运动：结合多个正弦波模拟复杂噪声流
        // 速度调至极慢 0.001 左右
        const noiseX = Math.sin(y * 0.005 + time * 2.0 + randoms[i] * 10) * 0.2;
        const noiseY = Math.cos(x * 0.005 + time * 1.5 + randoms[i] * 10) * 0.2;
        const noiseZ = Math.sin((x + y) * 0.002 + time) * 0.1;

        particleArray[i3] += noiseX;
        particleArray[i3 + 1] += noiseY;
        particleArray[i3 + 2] += noiseZ;

        // 鼠标扰动：排斥效果
        const dx = x - mouseWorldX;
        const dy = y - mouseWorldY;
        const distSq = dx * dx + dy * dy;
        const limit = 150 * 150;
        
        if (distSq < limit) {
          const force = (1.0 - Math.sqrt(distSq) / 150) * 2.0;
          particleArray[i3] += dx * force * 0.05;
          particleArray[i3 + 1] += dy * force * 0.05;
        }

        // 边界处理：粒子缓缓回到屏幕内
        if (Math.abs(particleArray[i3]) > 800) particleArray[i3] *= -0.95;
        if (Math.abs(particleArray[i3 + 1]) > 600) particleArray[i3 + 1] *= -0.95;
      }

      posAttr.needsUpdate = true;
      particles.rotation.y = time * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    // --- 窗口适配 ---
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // --- 清理 ---
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return null;
};

export default InkBackground;
