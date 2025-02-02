import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";
import "./constellation.css";

/**
 * A library of popular constellations with rough 2D coordinates (z=0).
 * These are not astronomical, just approximate for a recognizable shape.
 */
const CONSTELLATIONS = [
  {
    name: "Big Dipper",
    stars: [
      { x: 0.0,  y: 0.0,   z: 0 },
      { x: 2.0,  y: 1.0,   z: 0 },
      { x: 4.0,  y: 2.0,   z: 0 },
      { x: 5.6,  y: 1.8,   z: 0 },
      { x: 6.6,  y: 1.0,   z: 0 },
      { x: 8.0,  y: 1.3,   z: 0 },
      { x: 9.5,  y: 2.0,   z: 0 },
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
    ],
  },
  {
    name: "Little Dipper",
    stars: [
      { x: 0.0,   y:  0.0, z: 0 }, // Polaris approx
      { x: -1.5,  y: -1.0, z: 0 },
      { x: -2.4,  y: -2.0, z: 0 },
      { x: -3.0,  y: -3.0, z: 0 },
      { x: -4.3,  y: -3.5, z: 0 },
      { x: -5.6,  y: -2.8, z: 0 },
      { x: -6.2,  y: -2.0, z: 0 },
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
    ],
  },
  {
    name: "Orion",
    stars: [
      { x: 0,    y: 0,   z: 0 }, // Betelgeuse
      { x: 2.5,  y: 2.2, z: 0 }, // Bellatrix
      { x: 3.0,  y: 0.0, z: 0 }, // Rigel
      { x: 1.7,  y: 1.0, z: 0 }, // Middle Belt star
      { x: 2.2,  y: 0.7, z: 0 }, // Right Belt star
      { x: 1.2,  y: 1.2, z: 0 }, // Left Belt star
      { x: 1.0,  y: -1.0,z: 0 }, // Saiph
    ],
    edges: [
      // Belt
      [3, 4],
      [4, 5],
      // Connect Betelgeuse to belt
      [0, 5],
      [0, 3],
      // Connect Bellatrix to belt
      [1, 3],
      [1, 4],
      // Connect Rigel & Saiph
      [2, 6],
      // Orion shape lines
      [0, 6],
      [1, 2],
    ],
  },
  {
    name: "Cassiopeia",
    stars: [
      { x: 0,   y: 0,   z: 0 }, 
      { x: 1.5, y: 1.0, z: 0 }, 
      { x: 3.2, y: 0.5, z: 0 }, 
      { x: 4.3, y: 1.2, z: 0 }, 
      { x: 5.8, y: 0.8, z: 0 },
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ],
  },
  {
    name: "Scorpius",
    stars: [
      { x: 0,   y: 0,    z: 0 },  // Antares
      { x: 1.5, y: -1.0, z: 0 },
      { x: 2.0, y: -2.2, z: 0 },
      { x: 2.7, y: -3.5, z: 0 },
      { x: 3.9, y: -4.0, z: 0 },
      { x: 5.0, y: -3.2, z: 0 },
      { x: 5.2, y: -2.0, z: 0 },
      { x: 4.5, y: -1.0, z: 0 },
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 7],
    ],
  },
];

const Constellation = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // ---------------------------------------------------------
    // 1. SCENE, CAMERA, RENDERER
    // ---------------------------------------------------------
    const scene = new THREE.Scene();
    const sizes = { width: window.innerWidth, height: window.innerHeight };

    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      500
    );
    camera.position.set(0, 0, 50);
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Optional OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = false;

    // ---------------------------------------------------------
    // 2. PARAMETERS & LIL-GUI
    // ---------------------------------------------------------
    const parameters = {
      // Scene
      backgroundColor: "#020817",

      // Starfield
      starCount: 30000,
      areaWidth: 340,
      areaHeight: 196,
      areaDepth: 257,
      starSize: 0.077,
      starInsideColor: "#ffffff",
      starOutsideColor: "#94bbe9",

      // Animation
      horizontalSpeed: 0.2,
      verticalAmplitude: 2,
      verticalFrequency: 0.2,
      parallaxFactor: 0.2,

      // Constellations
      constellationAreaWidth: 100,   // random X range in which constellations appear
      constellationAreaHeight: 100,  // random Y range
      starSphereSize: 0.12,
      lineColor: "#ffffff",
      lineOpacity: 0.61,
    };

    scene.background = new THREE.Color(parameters.backgroundColor);

    // Create the lil-gui panel
    const gui = new GUI();
    gui.domElement.style.display = 'none';

    // Folder: Scene
    const sceneFolder = gui.addFolder("Scene");
    sceneFolder
      .addColor(parameters, "backgroundColor")
      .name("Background")
      .onChange(() => {
        scene.background.set(parameters.backgroundColor);
      });

    // Folder: Starfield
    const starFolder = gui.addFolder("Starfield");
    starFolder
      .add(parameters, "starCount", 1000, 30000, 1000)
      .name("Star Count")
      .onFinishChange(() => regenerateStarField());
    starFolder
      .add(parameters, "areaWidth", 50, 500, 1)
      .name("Width")
      .onFinishChange(() => regenerateStarField());
    starFolder
      .add(parameters, "areaHeight", 50, 500, 1)
      .name("Height")
      .onFinishChange(() => regenerateStarField());
    starFolder
      .add(parameters, "areaDepth", 50, 500, 1)
      .name("Depth")
      .onFinishChange(() => regenerateStarField());
    starFolder
      .add(parameters, "starSize", 0.001, 0.1, 0.001)
      .name("Star Size")
      .onChange((val) => {
        if (starMaterial) starMaterial.size = val;
      });
    starFolder
      .addColor(parameters, "starInsideColor")
      .name("Inside Color")
      .onFinishChange(() => regenerateStarField());
    starFolder
      .addColor(parameters, "starOutsideColor")
      .name("Outside Color")
      .onFinishChange(() => regenerateStarField());

    // Folder: Animation
    const animFolder = gui.addFolder("Animation");
    animFolder
      .add(parameters, "horizontalSpeed", 0.0, 2, 0.1)
      .name("Horz Speed");
    animFolder
      .add(parameters, "verticalAmplitude", 0, 10, 0.1)
      .name("Vert Amplitude");
    animFolder
      .add(parameters, "verticalFrequency", 0, 2, 0.01)
      .name("Vert Frequency");
    animFolder
      .add(parameters, "parallaxFactor", 0, 2, 0.1)
      .name("Parallax");

    // Folder: Constellations
    const constFolder = gui.addFolder("Constellations");
    constFolder
      .add(parameters, "constellationAreaWidth", 50, 1000, 10)
      .name("Const Area Width")
      .onFinishChange(() => placeAllConstellations()); 
    constFolder
      .add(parameters, "constellationAreaHeight", 50, 1000, 10)
      .name("Const Area Height")
      .onFinishChange(() => placeAllConstellations());
    constFolder
      .add(parameters, "starSphereSize", 0.01, 1, 0.01)
      .name("Const Star Size")
      .onFinishChange(() => placeAllConstellations());
    constFolder
      .addColor(parameters, "lineColor")
      .name("Const Line Color")
      .onChange((val) => {
        if (constellationLineMaterial) constellationLineMaterial.color.set(val);
      });
    constFolder
      .add(parameters, "lineOpacity", 0, 1, 0.01)
      .name("Line Opacity")
      .onChange((val) => {
        if (constellationLineMaterial) constellationLineMaterial.opacity = val;
      });

    // ---------------------------------------------------------
    // 3. STARFIELD CREATION
    // ---------------------------------------------------------
    let starGeometry = null;
    let starMaterial = null;
    let starPoints = null;

    function generateStarField() {
      // Clean up old geometry/material
      if (starPoints) {
        scene.remove(starPoints);
        starGeometry.dispose();
        starMaterial.dispose();
      }

      // New geometry for points
      starGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(parameters.starCount * 3);
      const colors = new Float32Array(parameters.starCount * 3);

      const color1 = new THREE.Color(parameters.starInsideColor);
      const color2 = new THREE.Color(parameters.starOutsideColor);

      for (let i = 0; i < parameters.starCount; i++) {
        const i3 = i * 3;
        // Random positions in a rectangular prism
        const x = Math.random() * parameters.areaWidth - parameters.areaWidth / 2;
        const y = Math.random() * parameters.areaHeight - parameters.areaHeight / 2;
        const z = Math.random() * parameters.areaDepth - parameters.areaDepth / 2;

        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;

        // Interpolate color
        const mixedColor = color1.clone();
        mixedColor.lerp(color2, Math.random());
        colors[i3 + 0] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
      }

      starGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      starGeometry.setAttribute(
        "color",
        new THREE.BufferAttribute(colors, 3)
      );

      // Points material
      starMaterial = new THREE.PointsMaterial({
        size: parameters.starSize,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
      });

      // Points object
      starPoints = new THREE.Points(starGeometry, starMaterial);
      scene.add(starPoints);
    }

    generateStarField();
    function regenerateStarField() {
      generateStarField();
    }

    // ---------------------------------------------------------
    // 4. MULTIPLE CONSTELLATIONS AT ONCE
    // ---------------------------------------------------------
    let allConstellationsGroup = null;
    let constellationLineMaterial = null; // shared by all lines if you want uniform color

    function placeAllConstellations() {
      // Remove old group if exists
      if (allConstellationsGroup) {
        scene.remove(allConstellationsGroup);
        allConstellationsGroup.traverse((child) => {
          if (child.isMesh) {
            child.geometry.dispose();
            child.material.dispose();
          }
          if (child.isLineSegments) {
            child.geometry.dispose();
            child.material.dispose();
          }
        });
      }

      allConstellationsGroup = new THREE.Group();
      scene.add(allConstellationsGroup);

      // We create one line material that all constellations can share
      constellationLineMaterial = new THREE.LineBasicMaterial({
        color: parameters.lineColor,
        transparent: true,
        opacity: parameters.lineOpacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      // For each constellation, we build a sub-group
      CONSTELLATIONS.forEach((c) => {
        const subGroup = new THREE.Group();

        // (A) create spheres for each star
        const sphereGeom = new THREE.SphereGeometry(parameters.starSphereSize, 16, 16);
        const sphereMat = new THREE.MeshBasicMaterial({ color: "#ffffff" });

        c.stars.forEach((pos) => {
          const starMesh = new THREE.Mesh(sphereGeom, sphereMat);
          starMesh.position.set(pos.x, pos.y, pos.z);
          subGroup.add(starMesh);
        });

        // (B) create lines
        const linePositions = [];
        c.edges.forEach(([a, b]) => {
          const starA = c.stars[a];
          const starB = c.stars[b];
          linePositions.push(starA.x, starA.y, starA.z, starB.x, starB.y, starB.z);
        });
        const lineGeo = new THREE.BufferGeometry();
        lineGeo.setAttribute(
          "position",
          new THREE.BufferAttribute(new Float32Array(linePositions), 3)
        );
        const lines = new THREE.LineSegments(lineGeo, constellationLineMaterial);
        subGroup.add(lines);

        // Now place this constellation at a random position
        const randX =
          Math.random() * parameters.constellationAreaWidth -
          parameters.constellationAreaWidth / 2;
        const randY =
          Math.random() * parameters.constellationAreaHeight -
          parameters.constellationAreaHeight / 2;

        subGroup.position.set(randX, randY, 0);
        allConstellationsGroup.add(subGroup);
      });
    }

    // Create them initially
    placeAllConstellations();

    // ---------------------------------------------------------
    // 5. MOUSE PARALLAX
    // ---------------------------------------------------------
    let mouseX = 0;
    let mouseY = 0;
    function onMouseMove(e) {
      mouseX = e.clientX / sizes.width - 0.5;
      mouseY = e.clientY / sizes.height - 0.5;
    }
    window.addEventListener("mousemove", onMouseMove);

    // ---------------------------------------------------------
    // 6. ANIMATION LOOP
    // ---------------------------------------------------------
    const clock = new THREE.Clock();

    function animate() {
      const elapsedTime = clock.getElapsedTime();

      // Starfield drift
      if (starPoints) {
        starPoints.position.x = -elapsedTime * parameters.horizontalSpeed;
        starPoints.position.y =
          Math.sin(elapsedTime * parameters.verticalFrequency) *
          parameters.verticalAmplitude;
      }

      // Parallax
      const parallaxX = mouseX * parameters.parallaxFactor;
      const parallaxY = -mouseY * parameters.parallaxFactor;
      camera.position.x = parallaxX;
      camera.position.y = parallaxY;

      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();

    // ---------------------------------------------------------
    // 7. HANDLE RESIZE
    // ---------------------------------------------------------
    function onResize() {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
      renderer.setSize(sizes.width, sizes.height);
    }
    window.addEventListener("resize", onResize);

    // ---------------------------------------------------------
    // CLEANUP
    // ---------------------------------------------------------
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      gui.destroy();

      // Starfield cleanup
      if (starPoints) {
        scene.remove(starPoints);
        starGeometry.dispose();
        starMaterial.dispose();
      }

      // Constellations cleanup
      if (allConstellationsGroup) {
        scene.remove(allConstellationsGroup);
        allConstellationsGroup.traverse((child) => {
          if (child.isMesh) {
            child.geometry.dispose();
            child.material.dispose();
          }
          if (child.isLineSegments) {
            child.geometry.dispose();
            child.material.dispose();
          }
        });
      }

      // Remove renderer
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="constellation-webgl"></div>;
};

export default Constellation;