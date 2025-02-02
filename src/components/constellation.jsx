import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import "./constellation.css";

const Constellation = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    // === SETUP SCENE, CAMERA, AND RENDERER ===
    const scene = new THREE.Scene();

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    containerRef.current.appendChild(renderer.domElement);

    // === CREATE BACKGROUND STARS ===
    const starCount = 500;
    const starsGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      // Spread stars randomly within a large cube
      starPositions[i * 3] = (Math.random() - 0.5) * 200;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 200;
    }
    starsGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));

    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1,
      sizeAttenuation: true,
    });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // === CREATE MAIN BRIGHT SPHERES ===
    const sphereCount = 4;
    const mainSpheres = [];
    const sphereGeometry = new THREE.SphereGeometry(2, 32, 32);

    // Create spheres with slightly different colors and random initial positions.
    for (let i = 0; i < sphereCount; i++) {
      const sphereMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(Math.random(), 1, 0.5),
      });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.set(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        0
      );
      scene.add(sphere);
      mainSpheres.push(sphere);
    }

    // === MOUSE INTERACTION SETUP ===
    const mouse = new THREE.Vector2(0, 0);
    const raycaster = new THREE.Raycaster();
    // For each main sphere, we’ll track a “target” position that we interpolate toward.
    const targetPositions = mainSpheres.map((sphere) => sphere.position.clone());

    // Update the target positions based on mouse movement.
    const onMouseMove = (event) => {
      // Normalize mouse coordinates (-1 to 1)
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Convert the normalized position to a point in 3D space on the z=0 plane.
      const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
      vector.unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      const pos = camera.position.clone().add(dir.multiplyScalar(distance));

      // Set a slightly offset target for each main sphere.
      mainSpheres.forEach((sphere, index) => {
        const offset = new THREE.Vector3(
          (index - (sphereCount - 1) / 2) * 5,
          (index - (sphereCount - 1) / 2) * 5,
          0
        );
        targetPositions[index] = pos.clone().add(offset);
      });
    };

    window.addEventListener("mousemove", onMouseMove);

    // When clicking, use the raycaster to detect if a main sphere was hit.
    const onClick = (event) => {
      // Update the normalized mouse vector
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(mainSpheres);
      if (intersects.length > 0) {
        // Redirect to a new page (or use your router to navigate)
        window.location.href = "/targetPage"; // Change this route as needed.
      }
    };

    window.addEventListener("click", onClick);

    // === ANIMATION LOOP ===
    const animate = () => {
      requestAnimationFrame(animate);

      // Smoothly interpolate each sphere toward its target position.
      mainSpheres.forEach((sphere, index) => {
        sphere.position.lerp(targetPositions[index], 0.1);
      });

      // Optional: rotate the star field slowly for a subtle dynamic effect.
      stars.rotation.y += 0.0005;

      renderer.render(scene, camera);
    };
    animate();

    // === HANDLE WINDOW RESIZE ===
    const handleResize = () => {
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // === CLEANUP ON UNMOUNT ===
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onClick);
      containerRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="constellation-container" ref={containerRef}></div>;
};

export default Constellation;
