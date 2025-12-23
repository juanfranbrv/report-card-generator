import { useEffect } from 'react';
import * as THREE from 'three';

interface ParticleEffectProps {
    isActive: boolean;
}

const ParticleEffect: React.FC<ParticleEffectProps> = ({ isActive }) => {
    useEffect(() => {
        const canvas = document.getElementById('logo-particles') as HTMLCanvasElement;

        if (!canvas || !isActive) {
            return;
        }

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        camera.position.z = 25;

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const updateRendererSize = () => {
            if (canvas.clientWidth && canvas.clientHeight) {
                renderer.setSize(canvas.clientWidth, canvas.clientHeight);
                camera.aspect = canvas.clientWidth / canvas.clientHeight;
                camera.updateProjectionMatrix();
            }
        };
        updateRendererSize();

        const colorPalette = [
            0xff1493, 0xffd700, 0x00ff7f, 0x00bfff,
            0xff69b4, 0x7fff00, 0xff8c00, 0xda70d6,
            0xffff00, 0xff00ff
        ].map(hex => new THREE.Color(hex));

        const createParticles = (count: number, size: number, shapeType: number) => {
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(count * 3);
            const colors = new Float32Array(count * 3);
            const sizes = new Float32Array(count);
            const velocities: number[][] = [];
            const phases = new Float32Array(count);

            for (let i = 0; i < count; i++) {
                const i3 = i * 3;
                const angle = Math.random() * Math.PI * 2;
                const radius = Math.random() * 5;

                positions[i3] = Math.cos(angle) * radius;
                positions[i3 + 1] = Math.sin(angle) * radius;
                positions[i3 + 2] = (Math.random() - 0.5) * 8;

                const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
                colors[i3] = color.r;
                colors[i3 + 1] = color.g;
                colors[i3 + 2] = color.b;

                sizes[i] = Math.random() * size + size * 0.5;

                const speed = Math.random() * 0.2 + 0.05;
                const vAngle = Math.random() * Math.PI * 2;
                velocities.push([
                    Math.cos(vAngle) * speed * 0.5,
                    Math.random() * 0.1 + 0.03,
                    Math.sin(vAngle) * speed * 0.3,
                ]);

                phases[i] = Math.random() * Math.PI * 2;
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

            const shapeCanvas = document.createElement('canvas');
            shapeCanvas.width = 64;
            shapeCanvas.height = 64;
            const ctx = shapeCanvas.getContext('2d')!;
            ctx.fillStyle = 'white';
            ctx.shadowBlur = 15;
            ctx.shadowColor = 'white';

            if (shapeType === 0) { // star
                ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    const ang = (i * 4 * Math.PI) / 5 - Math.PI / 2;
                    ctx.lineTo(32 + Math.cos(ang) * 25, 32 + Math.sin(ang) * 25);
                }
                ctx.closePath();
                ctx.fill();
            } else if (shapeType === 1) { // circle
                const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
                grad.addColorStop(0, 'rgba(255,255,255,1)');
                grad.addColorStop(1, 'rgba(255,255,255,0)');
                ctx.fillStyle = grad;
                ctx.arc(32, 32, 28, 0, Math.PI * 2);
                ctx.fill();
            } else if (shapeType === 2) { // heart
                ctx.beginPath();
                ctx.moveTo(32, 25);
                ctx.bezierCurveTo(32, 20, 28, 16, 24, 16);
                ctx.bezierCurveTo(16, 16, 16, 24, 16, 24);
                ctx.bezierCurveTo(16, 32, 32, 44, 32, 44);
                ctx.bezierCurveTo(32, 44, 48, 32, 48, 24);
                ctx.bezierCurveTo(48, 24, 48, 16, 40, 16);
                ctx.bezierCurveTo(36, 16, 32, 20, 32, 25);
                ctx.fill();
            } else { // spark
                ctx.beginPath();
                ctx.moveTo(32, 8);
                ctx.lineTo(56, 32);
                ctx.lineTo(32, 56);
                ctx.lineTo(8, 32);
                ctx.closePath();
                ctx.fill();
            }

            const texture = new THREE.CanvasTexture(shapeCanvas);
            const material = new THREE.PointsMaterial({
                size: 6,
                map: texture,
                vertexColors: true,
                transparent: true,
                opacity: 0.7,
                sizeAttenuation: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
            });

            const points = new THREE.Points(geometry, material);
            (points as any).velocities = velocities;
            (points as any).phases = phases;
            (points as any).originalSizes = new Float32Array(sizes);
            return points;
        };

        const particles = [
            createParticles(40, 2.5, 0),
            createParticles(35, 2, 1),
            createParticles(25, 3, 2),
            createParticles(45, 1.8, 3),
        ];

        particles.forEach(p => scene.add(p));

        let time = 0;
        let animationId: number;

        const animate = () => {
            animationId = requestAnimationFrame(animate);
            time += 0.016;

            particles.forEach((points, idx) => {
                const pos = points.geometry.attributes.position.array as Float32Array;
                const sizeArr = points.geometry.attributes.size.array as Float32Array;
                const vel = (points as any).velocities;
                const ph = (points as any).phases;
                const origSizes = (points as any).originalSizes;
                const cnt = pos.length / 3;

                for (let i = 0; i < cnt; i++) {
                    const i3 = i * 3;
                    pos[i3] += vel[i][0];
                    pos[i3 + 1] += vel[i][1];
                    pos[i3 + 2] += vel[i][2];

                    sizeArr[i] = origSizes[i] * (Math.sin(time * 2 + ph[i]) * 0.3 + 1);

                    if (pos[i3 + 1] > 20) {
                        pos[i3 + 1] = -5;
                        pos[i3] = (Math.random() - 0.5) * 25;
                        pos[i3 + 2] = (Math.random() - 0.5) * 10;
                    }
                    if (Math.abs(pos[i3]) > 15) pos[i3] = -Math.sign(pos[i3]) * 15;
                    if (Math.abs(pos[i3 + 2]) > 8) pos[i3 + 2] = -Math.sign(pos[i3 + 2]) * 8;
                }

                points.geometry.attributes.position.needsUpdate = true;
                points.geometry.attributes.size.needsUpdate = true;
                points.rotation.y += 0.001 * (idx + 1);
                points.rotation.z += 0.0005;
            });

            renderer.render(scene, camera);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationId);
            renderer.dispose();
            particles.forEach(p => {
                p.geometry.dispose();
                (p.material as THREE.Material).dispose();
            });
        };
    }, [isActive]);

    return null;
};

export default ParticleEffect;
