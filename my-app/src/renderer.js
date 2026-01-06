import * as THREE from 'three';
import { GLTFLoader} from 'three/examples/jsm/Addons.js';

function renderer(path) {
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const Loader = new GLTFLoader();
    Loader.load(path, function (gltf) {
    scene.add(gltf.scene);
    }, undefined, function (error) {
    console.error(error);
    });
    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        camera.rotation.y += 0.01;
    }
    animate();
}

export default renderer;