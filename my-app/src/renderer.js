import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function ThreeRenderer({
  path,
  animated = false,
  animatedMP4Model = null,
  animatedModelName = null,
  children
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const backgroundColor = new THREE.Color(0x282c34);
    scene.background = backgroundColor;
    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight,  0.1, 1000);
    camera.position.set(-1, 2.5, -2);

    const light = new THREE.AmbientLight(0x404040); // soft white light
    light.intensity = 20;
    light.shadows = true;
    scene.add(light);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    containerRef.current.innerHTML = '';

    const webglRenderer = new THREE.WebGLRenderer({ antialias: true });
    webglRenderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    webglRenderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(webglRenderer.domElement);

    const controls = new OrbitControls(camera, webglRenderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controls.maxPolarAngle = Math.PI / 2;

    const loader = new GLTFLoader();
    let mixer;
    let animationClips = [];
    let videos = [];
    loader.load(path, (gltf) => {
      scene.add(gltf.scene);

      gltf.scene.traverse((object) => {
          if (object.isMesh) {
          console.log('Mesh name:', object.name);
          }
      });
      
      if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(gltf.scene);
          gltf.animations.forEach((clip) => {
          animationClips.push(mixer.clipAction(clip));
          });
      }

      if (animated && animatedMP4Model && animatedModelName) {
        for (let i = 0; i < animatedMP4Model.length; i++) {
        const animatedModel = gltf.scene.getObjectByName(animatedModelName[i]);

        if (!animatedModel) {
          console.warn('Mesh no encontrado:', animatedModelName[i]);
          return;
        }

        const video = document.createElement('video');
        video.src = animatedMP4Model[i];
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.autoplay = true;
        videos.push(video);

        const videoTexture = new THREE.VideoTexture(video);
        videoTexture.colorSpace = THREE.SRGBColorSpace;
        videoTexture.flipY = false;

          animatedModel.material = new THREE.MeshBasicMaterial({
            map: videoTexture,
          });
        }
      }
    },
    undefined,
    (err) => console.error("Error loading GLB:", err)
    );

    let frameId;
    const clock = new THREE.Clock();

    const animate = () => {
      if (animationClips) {
        animationClips.forEach((clip) => {
        clip.play();
        });
      }
      if (videos) {
        videos.forEach((video) => {
        video.play();
        });
      }
      frameId = requestAnimationFrame(animate);
      scene.rotation.y -= 0.001;

      const delta = clock.getDelta();
      if (mixer) mixer.update(delta);
      controls.update();
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
    };
  }, [path, animated, animatedMP4Model, animatedModelName, children]);

  return (
    <div
      ref={containerRef}
      className="renderer-container"
      style={{ width: window.innerWidth, height: window.innerHeight }}
    />
  );
}

export default ThreeRenderer;