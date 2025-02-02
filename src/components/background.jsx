import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";
import "./Background.css";

const Background = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // ==================================================
    // 1. SCENE, CAMERA, RENDERER
    // ==================================================
    const scene = new THREE.Scene();

    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100
    );
    camera.position.set(3, 3, 3);
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // ==================================================
    // 2. ORBIT CONTROLS
    // ==================================================
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.4;
    // Disable “manual” orbit for a purely parallax-based effect if desired
    // controls.enableRotate = false;

    // ==================================================
    // 3. PARAMETERS & GUI
    // ==================================================
    const parameters = {
      // Galaxy parameters
      starCount: 15000,
      galaxyRadius: 10,
      starSize: 0.014,
      insideColor: "#ff6030",
      outsideColor: "#1b3984",

      // Scene colors
      backgroundColor: "#020817",
      starColor: "#ffffff", // if you want uniform color

      // Animation & parallax
      rotationSpeed: 0.0002,   // how fast the galaxy rotates
      pulseSpeed: 1.3,      // how fast the pulsing effect is
      parallaxFactor: 0.5,  // how strongly mouse movement affects the camera

      // Orbit controls
      autoRotate: true,
      autoRotateSpeed: 0.5,
    };

    scene.background = new THREE.Color(parameters.backgroundColor);

    // Create a GUI panel
    const gui = new GUI();

    // Folder: Scene
    const sceneFolder = gui.addFolder("Scene");
    sceneFolder.addColor(parameters, "backgroundColor").name("Background")
      .onChange(() => {
        scene.background.set(parameters.backgroundColor);
      });

    // Folder: Galaxy
    const galaxyFolder = gui.addFolder("Galaxy");
    galaxyFolder.add(parameters, "starCount", 1000, 30000, 1000)
      .name("Star Count")
      .onFinishChange(generateGalaxy);
    galaxyFolder.add(parameters, "galaxyRadius", 1, 10, 0.1)
      .name("Galaxy Radius")
      .onFinishChange(generateGalaxy);
    galaxyFolder.add(parameters, "starSize", 0.001, 0.1, 0.001)
      .name("Star Size")
      .onChange((val) => {
        if (galaxyMaterial) galaxyMaterial.size = val;
      });
    galaxyFolder.addColor(parameters, "insideColor").name("Inside Color")
      .onFinishChange(generateGalaxy);
    galaxyFolder.addColor(parameters, "outsideColor").name("Outside Color")
      .onFinishChange(generateGalaxy);

    // Folder: Animation
    const animFolder = gui.addFolder("Animation");
    animFolder.add(parameters, "rotationSpeed", 0.0, 0.2, 0.001).name("Rotation Speed");
    animFolder.add(parameters, "pulseSpeed", 0, 5, 0.1).name("Pulse Speed");
    animFolder.add(parameters, "parallaxFactor", 0, 2, 0.1).name("Parallax Factor");

    // Folder: Orbit Controls
    const orbitFolder = gui.addFolder("Orbit Controls");
    orbitFolder.add(parameters, "autoRotate").name("Auto Rotate")
      .onChange((val) => controls.autoRotate = val);
    orbitFolder.add(parameters, "autoRotateSpeed", 0.1, 5, 0.1)
      .name("Rotation Speed")
      .onChange((val) => controls.autoRotateSpeed = val);

    // ==================================================
    // 4. CREATE GALAXY FUNCTION
    // ==================================================
    let galaxyPoints = null;
    let galaxyGeometry = null;
    let galaxyMaterial = null;

    function generateGalaxy() {
      // Clean up old galaxy if it exists
      if (galaxyPoints !== null) {
        galaxyGeometry.dispose();
        galaxyMaterial.dispose();
        scene.remove(galaxyPoints);
      }

      // Geometry
      galaxyGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(parameters.starCount * 3);
      const colors = new Float32Array(parameters.starCount * 3);

      const colorInside = new THREE.Color(parameters.insideColor);
      const colorOutside = new THREE.Color(parameters.outsideColor);

      for (let i = 0; i < parameters.starCount; i++) {
        const i3 = i * 3;

        // Random radius from 0 to galaxyRadius
        const radius = Math.random() * parameters.galaxyRadius;

        // Random angles
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(Math.random() * 2 - 1);

        // Position (spherical coords)
        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);

        // Color: gradient from insideColor to outsideColor
        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, radius / parameters.galaxyRadius);
        colors[i3 + 0] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
      }

      galaxyGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      galaxyGeometry.setAttribute(
        "color",
        new THREE.BufferAttribute(colors, 3)
      );

      // Material
      galaxyMaterial = new THREE.PointsMaterial({
        size: parameters.starSize,
        vertexColors: true, // use per-particle colors from the geometry
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
      });

      // Points
      galaxyPoints = new THREE.Points(galaxyGeometry, galaxyMaterial);
      scene.add(galaxyPoints);
    }

    // Generate initial galaxy
    generateGalaxy();

    // ==================================================
    // 5. MOUSE PARALLAX
    // ==================================================
    let mouseX = 0;
    let mouseY = 0;

    // Ranges from [-0.5..0.5]
    const onMouseMove = (event) => {
      mouseX = event.clientX / sizes.width - 0.5;
      mouseY = event.clientY / sizes.height - 0.5;
    };
    window.addEventListener("mousemove", onMouseMove);

    // ==================================================
    // 6. ANIMATION LOOP
    // ==================================================
    const clock = new THREE.Clock();
    function animate() {
      const elapsedTime = clock.getElapsedTime();

      // Rotate the galaxy
      if (galaxyPoints) {
        galaxyPoints.rotation.y = elapsedTime * parameters.rotationSpeed;
      }

      // Star pulsing (vary the size slightly over time)
      if (galaxyMaterial) {
        const pulse = 1.0 + 0.3 * Math.sin(elapsedTime * parameters.pulseSpeed);
        galaxyMaterial.size = parameters.starSize * pulse;
      }

      // Parallax effect: shift camera based on mouse
      const parallaxX = mouseX * parameters.parallaxFactor;
      const parallaxY = -mouseY * parameters.parallaxFactor; // invert Y for natural feel
      camera.position.x = 3 + parallaxX;
      camera.position.y = 3 + parallaxY;

      // Update controls (auto rotate, damping)
      controls.update();

      // Render
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();

    // ==================================================
    // 7. RESIZE HANDLER
    // ==================================================
    const onWindowResize = () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
      renderer.setSize(sizes.width, sizes.height);
    };
    window.addEventListener("resize", onWindowResize);

    // ==================================================
    // CLEANUP ON UNMOUNT
    // ==================================================
    return () => {
      window.removeEventListener("resize", onWindowResize);
      window.removeEventListener("mousemove", onMouseMove);
      gui.destroy();
      if (galaxyPoints) {
        galaxyGeometry.dispose();
        galaxyMaterial.dispose();
        scene.remove(galaxyPoints);
      }
      mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="webgl"></div>;
};

export default Background;
