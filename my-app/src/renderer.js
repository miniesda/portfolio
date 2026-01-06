import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

function ThreeRenderer({
  path,
  animated = false,
  animatedMP4Model = null,
  animatedModelName = null
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight,  0.1, 1000);
    camera.position.z = 5;

    const webglRenderer = new THREE.WebGLRenderer({ antialias: true });
    webglRenderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    webglRenderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(webglRenderer.domElement);

    const loader = new GLTFLoader();
    loader.load(path, (gltf) => {
      scene.add(gltf.scene);

      if (animated && animatedMP4Model && animatedModelName) {
        const animatedModel = gltf.scene.getObjectByName(animatedModelName);

        if (!animatedModel) {
          console.warn('Mesh no encontrado:', animatedModelName);
          return;
        }

        const video = document.createElement('video');
        video.src = animatedMP4Model;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.autoplay = true;
        video.play();

        const videoTexture = new THREE.VideoTexture(video);
        videoTexture.colorSpace = THREE.SRGBColorSpace;

        animatedModel.material = new THREE.MeshBasicMaterial({
          map: videoTexture,
        });
      }
    });

    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      scene.rotation.y += 0.01;
      webglRenderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      webglRenderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
      webglRenderer.dispose();
      containerRef.current.removeChild(webglRenderer.domElement);
    };
  }, [path, animated, animatedMP4Model, animatedModelName]);

  return (
    <div
      ref={containerRef}
      className="renderer-container"
      style={{ width: '100%', height: '100%' }}
    />
  );
}

export default ThreeRenderer;