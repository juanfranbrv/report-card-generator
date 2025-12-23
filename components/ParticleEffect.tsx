import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ParticleEffectProps {
    isActive: boolean;
}

const ParticleEffect: React.FC<ParticleEffectProps> = ({ isActive }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const particlesRef = useRef<THREE.Points | null>(null);
    const animationIdRef = useRef<number | null>(null);

    useEffect(() => {
        if (!canvasRef.current || !isActive) {
            // Cleanup if toggled off
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current);
            }
            if (rendererRef.current) {
                rendererRef.current.dispose();
            }
            return;
        }

        const canvas = canvasRef.current;
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        // Camera
        const camera = new THREE.PerspectiveCamera(
            75,
            canvas.clientWidth / canvas.clientHeight,
            0.1,
            1000
        );
        camera.position.z = 30;

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
        });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        rendererRef.current = renderer;

        // Create particles
        const particleCount = 150;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        const velocities = new Float32Array(particleCount * 3);

        // Bright, cheerful colors for kids
        const colorPalette = [
            new THREE.Color(0xff6b9d), // Pink
            new THREE.Color(0xffd93d), // Yellow
            new THREE.Color(0x6bcf7f), // Green
            new THREE.Color(0x4ecdc4), // Cyan
            new THREE.Color(0xc44569), // Red
            new THREE.Color(0x95e1d3), // Mint
            new THREE.Color(0xf8b500), // Orange
            new THREE.Color(0x9b59b6), // Purple
        ];

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;

            // Random position
            positions[i3] = (Math.random() - 0.5) * 60;
            positions[i3 + 1] = (Math.random() - 0.5) * 60;
            positions[i3 + 2] = (Math.random() - 0.5) * 20;

            // Random color from palette
            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            // Random size
            sizes[i] = Math.random() * 2 + 1;

            // Random velocity
            velocities[i3] = (Math.random() - 0.5) * 0.02;
            velocities[i3 + 1] = (Math.random() * 0.02) + 0.01; // Upward bias
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        // Particle material with texture
        const material = new THREE.PointsMaterial({
            size: 3,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);
        particlesRef.current = particles;

        // Animation
        const animate = () => {
            animationIdRef.current = requestAnimationFrame(animate);

            const positions = particles.geometry.attributes.position.array as Float32Array;

            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;

                // Update position with velocity
                positions[i3] += velocities[i3];
                positions[i3 + 1] += velocities[i3 + 1];
                positions[i3 + 2] += velocities[i3 + 2];

                // Wrap around - when particles go off screen, respawn at bottom
                if (positions[i3 + 1] > 30) {
                    positions[i3 + 1] = -30;
                    positions[i3] = (Math.random() - 0.5) * 60;
                    positions[i3 + 2] = (Math.random() - 0.5) * 20;
                }

                // Side wrapping
                if (Math.abs(positions[i3]) > 30) {
                    positions[i3] = -Math.sign(positions[i3]) * 30;
                }
                if (Math.abs(positions[i3 + 2]) > 10) {
                    positions[i3 + 2] = -Math.sign(positions[i3 + 2]) * 10;
                }
            }

            particles.geometry.attributes.position.needsUpdate = true;
            particles.rotation.y += 0.001;

            renderer.render(scene, camera);
        };

        animate();

        // Handle resize
        const handleResize = () => {
            if (!canvas || !renderer) return;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current);
            }
            if (rendererRef.current) {
                rendererRef.current.dispose();
            }
            geometry.dispose();
            material.dispose();
        };
    }, [isActive]);

    if (!isActive) return null;

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 right-0 w-1/2 h-full pointer-events-none z-10"
            style={{ opacity: 0.7 }}
        />
    );
};

export default ParticleEffect;
