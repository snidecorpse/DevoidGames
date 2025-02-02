import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import './constellation.css';

const Constellation = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Set up scene, camera, and renderer.
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // black background

    // Get container dimensions.
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    // Position the camera so that all objects are visible.
    camera.position.z = 400;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // ---- Create Three circles ----
    // These will be our “nodes” in the constellation.
    const circles = [];
    const circleGeometry = new THREE.CircleGeometry(20, 32);
    const circleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    // Define positions (you can adjust these as needed).
    const circlePositions = [
      new THREE.Vector3(-200, 0, 0),  // left circle
      new THREE.Vector3(0, 100, 0),   // top/middle circle
      new THREE.Vector3(200, 0, 0)    // right circle
    ];
    circlePositions.forEach((pos) => {
      const circleMesh = new THREE.Mesh(circleGeometry, circleMaterial);
      circleMesh.position.copy(pos);
      scene.add(circleMesh);
      circles.push(circleMesh);
    });

    // ---- Create a Particle “String” Effect ----
    // We define several control points for our curve.
    // The curve starts off to the left, passes near the circles, and ends off to the right.
    const controlPoints = [
      new THREE.Vector3(-300, -50, 0),           // start (off-screen left)
      new THREE.Vector3(-200, 0, 0),             // near left circle
      new THREE.Vector3(0, 150, 0),              // near top circle
      new THREE.Vector3(200, 0, 0),              // near right circle
      new THREE.Vector3(300, -50, 0)             // end (off-screen right)
    ];
    const curve = new THREE.CatmullRomCurve3(controlPoints);

    // Generate an array of points along the curve.
    const curvePoints = curve.getPoints(100);
    const pointsGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);

    // Create a PointsMaterial for our particle effect.
    const pointsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 3,
      sizeAttenuation: true
    });

    // Create the Points object that will display our “string” of particles.
    const particleString = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(particleString);

    // ---- Animation Loop ----
    let frameId;
    const animate = () => {
      // Update time (in seconds)
      const time = Date.now() * 0.002;

      // For a gentle idle animation, slightly oscillate some of the curve’s control points.
      // (Feel free to tweak the multipliers and phases for different effects.)
      controlPoints[1].y = Math.sin(time) * 20; // left control point oscillates
      controlPoints[2].y = 150 + Math.cos(time * 0.5) * 20; // top control point oscillates
      controlPoints[3].y = Math.sin(time) * 20; // right control point oscillates

      // Re-calculate the curve and update the particle geometry.
      const newCurvePoints = curve.getPoints(100);
      pointsGeometry.setFromPoints(newCurvePoints);
      // (Mark the attribute for update if needed.)
      if (pointsGeometry.attributes.position) {
        pointsGeometry.attributes.position.needsUpdate = true;
      }

      // (Optional) You can add a little rotation to the circles to enhance the idle feel.
      circles.forEach((circle) => {
        circle.rotation.z += 0.005;
      });

      // Render the scene.
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    // ---- Handle Resizing ----
    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    // ---- Cleanup on Unmount ----
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="constellation">
      <h1 className="constellation-title">Constellation</h1>
      <div className="constellation-canvas" ref={mountRef} />
    </div>
  );
};

export default Constellation;
