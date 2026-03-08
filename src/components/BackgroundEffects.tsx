import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const BackgroundEffects = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [particles, setParticles] = useState<any[]>([]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: e.clientX,
                y: e.clientY,
            });
        };

        window.addEventListener("mousemove", handleMouseMove);

        // Initialize particles after mount to ensure window is defined
        const newParticles = Array.from({ length: 40 }).map(() => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: Math.random() * 0.5 + 0.1,
            scale: Math.random() * 1.5 + 0.5,
            duration: Math.random() * 10 + 10,
            width: Math.random() * 3 + 1 + "px",
            height: Math.random() * 3 + 1 + "px",
            animateX: Math.random() * 200 - 100,
            animateY: Math.random() * -500 - 100,
        }));
        setParticles(newParticles);

        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none mix-blend-screen">
            {/* Grid Shimmer */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(to_bottom,white,transparent)] opacity-10" />
            <div
                className="absolute inset-0 grid-shimmer opacity-20"
                style={{
                    background: "linear-gradient(90deg, rgba(var(--primary), 0.1) 1px, transparent 1px), linear-gradient(rgba(var(--primary), 0.1) 1px, transparent 1px)",
                    backgroundSize: "40px 40px"
                }}
            />

            {/* Soft animated gradient & Smoke effect base */}
            <div className="absolute inset-0 smoke-effect opacity-60" />

            {/* Light field / beam texture linked to mouse position */}
            <motion.div
                className="absolute w-[800px] h-[800px] rounded-full blur-3xl opacity-30 pointer-events-none transition-transform duration-700 ease-out"
                animate={{
                    x: mousePosition.x - 400,
                    y: mousePosition.y - 400,
                }}
                style={{
                    background: "radial-gradient(circle, hsl(var(--primary) / 0.4) 0%, transparent 60%)"
                }}
            />

            <motion.div
                className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-20 pointer-events-none transition-transform duration-1000 ease-out delay-75"
                animate={{
                    x: mousePosition.x - 300,
                    y: mousePosition.y - 300,
                }}
                style={{
                    background: "radial-gradient(circle, hsl(var(--accent) / 0.4) 0%, transparent 60%)"
                }}
            />

            {/* Particle drift */}
            <div className="absolute inset-0 w-full h-full">
                {particles.map((p, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-primary rounded-full"
                        initial={{
                            x: p.x,
                            y: p.y,
                            opacity: p.opacity,
                            scale: p.scale,
                        }}
                        animate={{
                            y: [null, p.animateY],
                            x: [null, p.x + p.animateX],
                            opacity: [null, 0],
                        }}
                        transition={{
                            duration: p.duration,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        style={{
                            width: p.width,
                            height: p.height,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};
