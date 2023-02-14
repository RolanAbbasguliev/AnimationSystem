import { useEffect } from "react";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const App = () => {
  useEffect(() => {
    const canvas = document.getElementById("myThreeJsCanvas");

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    });

    renderer.shadowMap.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const orbit = new OrbitControls(camera, renderer.domElement);

    camera.position.set(-10, 30, 30);
    orbit.update(); //every time camera position update

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    /**
     * Create box
     */
    const boxGeomtry = new THREE.BoxGeometry();
    const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const box = new THREE.Mesh(boxGeomtry, boxMaterial);
    scene.add(box);

    /**
     * Create plane
     */
    const planeGeomtry = new THREE.PlaneGeometry(30, 30);
    const planeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(planeGeomtry, planeMaterial);
    scene.add(plane);
    plane.rotation.x = -0.5 * Math.PI;
    plane.receiveShadow = true;

    /**
     * Create grid helper
     */
    const gridHelper = new THREE.GridHelper(30, 10);
    gridHelper.rotation.x = 2 * Math.PI;
    scene.add(gridHelper);

    /**
     * Create sphere
     */
    const sphereGeomtry = new THREE.SphereGeometry(4, 20, 20);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: 0x0000ff,
      wireframe: false,
    });
    const sphere = new THREE.Mesh(sphereGeomtry, sphereMaterial);
    scene.add(sphere);

    sphere.position.set(-10, 10, 0);
    sphere.castShadow = true;

    /**
     * GUI Configuration init
     */
    const gui = new dat.GUI();

    const options = {
      sphereColor: sphere.material.color.getHex(),
      wireframe: false,
      speed: 0.01,
      angle: 0.2,
      penumbra: 0,
      intensity: 1,
    };

    gui
      .add(options, "wireframe")
      .onChange((e) => (sphere.material.wireframe = e));

    gui
      .addColor(options, "sphereColor")
      .onChange((e) => sphere.material.color.set(e));

    gui.add(options, "speed", 0, 0.01);

    gui.add(options, "angle", 0, 1);
    gui.add(options, "penumbra", 0, 1);
    gui.add(options, "intensity", 0, 1);

    let step = 0;
    let speed = 0.01;

    /**
     * Light settings
     */
    // const ambientLight = new THREE.AmbientLight(0x333333);
    // scene.add(ambientLight);

    // const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    // scene.add(directionalLight);
    // directionalLight.position.set(-30, 50, 0);
    // directionalLight.castShadow = true;
    // directionalLight.shadow.camera.bottom = -12;

    // const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
    // scene.add(dLightHelper);

    // const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
    // scene.add(dLightShadowHelper);

    const spotLight = new THREE.SpotLight(0xffffff);
    scene.add(spotLight);
    spotLight.position.set(-100, 100, 0);
    spotLight.castShadow = true;
    spotLight.angle = 0.2;

    const sLightHelper = new THREE.SpotLightHelper(spotLight);
    scene.add(sLightHelper);

    const animate = () => {
      box.rotation.x += 0.01;
      box.rotation.y += 0.01;

      step += options.speed;
      sphere.position.y = 10 * Math.abs(Math.sin(step));

      spotLight.angle = options.angle;
      spotLight.penumbra = options.penumbra;
      spotLight.intensity = options.intensity;
      sLightHelper.update();
      renderer.render(scene, camera);
    };
    renderer.setAnimationLoop(animate);
  }, []);

  return (
    <div>
      <div id="gui_container"></div>
      <canvas id="myThreeJsCanvas" />
    </div>
  );
};

export default App;
