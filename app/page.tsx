"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Sphere,
  MeshDistortMaterial,
  Float,
  Environment,
  Html,
  Stars,
} from "@react-three/drei";
import type * as THREE from "three";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaReact,
  FaNodeJs,
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaGitAlt,
  FaDatabase,
  FaServer,
  FaCode,
  FaExternalLinkAlt,
  FaDownload,
  FaArrowUp,
  FaAward,
  FaStar,
  FaCalendarAlt,
  FaUsers,
  FaRocket,
  FaLightbulb,
  FaHeart,
  FaQuoteLeft,
  FaEdit,
  FaCog,
  FaMobile,
  FaShoppingCart,
  FaChartLine,
} from "react-icons/fa";
import {
  SiTailwindcss,
  SiNextdotjs,
  SiExpress,
  SiMongodb,
  SiSolidity,
  SiTypescript,
  SiNestjs,
  SiSass,
  SiDocker,
  SiKubernetes,
  SiFirebase,
  SiGraphql,
  SiRedis,
  SiPostgresql,
} from "react-icons/si";

// Enhanced 3D Components with better lighting and effects
function FloatingGeometry({
  position,
  color,
  speed = 1,
}: {
  position: [number, number, number];
  color: string;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.3;
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5;

      // Pulsing effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * speed * 2) * 0.1;
      meshRef.current.scale.setScalar(scale);
    }

    if (lightRef.current) {
      lightRef.current.intensity =
        2 + Math.sin(state.clock.elapsedTime * 2) * 0.5;
    }
  });

  return (
    <group>
      <pointLight
        ref={lightRef}
        position={position}
        color={color}
        intensity={2}
        distance={10}
      />
      <mesh ref={meshRef} position={position}>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshStandardMaterial
          color={color}
          wireframe
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
}

function AnimatedSphere({
  position,
  color,
}: {
  position: [number, number, number];
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity =
        0.1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} position={position} args={[0.4, 64, 64]}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.4}
          speed={3}
          emissive={color}
          emissiveIntensity={0.1}
        />
      </Sphere>
    </Float>
  );
}

function HeroScene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#2196F3" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#1E88E5" />

      <Stars
        radius={300}
        depth={60}
        count={1000}
        factor={7}
        saturation={0}
        fade
        speed={1}
      />

      <FloatingGeometry position={[-4, 2, -2]} color="#2196F3" speed={1.5} />
      <FloatingGeometry position={[4, -2, -1]} color="#1E88E5" speed={1.2} />
      <FloatingGeometry position={[-2, -3, -3]} color="#42A5F5" speed={0.8} />
      <FloatingGeometry position={[2, 3, -4]} color="#1976D2" speed={1.1} />

      <AnimatedSphere position={[3, 3, -2]} color="#2196F3" />
      <AnimatedSphere position={[-3, -1, -1]} color="#1E88E5" />
      <AnimatedSphere position={[1, -2, -4]} color="#42A5F5" />
      <AnimatedSphere position={[-1, 2, -3]} color="#1976D2" />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        autoRotate
        autoRotateSpeed={0.3}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
    </>
  );
}

function SkillSphere({
  position,
  skill,
  color,
}: {
  position: [number, number, number];
  skill: string;
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      const scale = hovered ? 1.2 : 1;
      meshRef.current.scale.lerp({ x: scale, y: scale, z: scale } as any, 0.1);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={2}>
      <mesh
        ref={meshRef}
        position={position}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.3 : 0.1}
        />
        <Html distanceFactor={8} center>
          <div className="text-white text-sm font-bold bg-gray-900/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-blue-500/30 pointer-events-none">
            {skill}
          </div>
        </Html>
      </mesh>
    </Float>
  );
}

function SkillsScene() {
  const skills = [
    { name: "React", position: [-2, 1, 0], color: "#2196F3" },
    { name: "Node.js", position: [2, 1, 0], color: "#1E88E5" },
    { name: "Solidity", position: [0, 2, 0], color: "#42A5F5" },
    { name: "TypeScript", position: [-1, -1, 1], color: "#1976D2" },
    { name: "MongoDB", position: [1, -1, 1], color: "#2196F3" },
    { name: "Next.js", position: [0, 0, -1], color: "#1E88E5" },
  ];

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#2196F3" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#1E88E5" />

      <Stars
        radius={200}
        depth={50}
        count={500}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />

      {skills.map((skill, index) => (
        <SkillSphere
          key={index}
          position={skill.position as [number, number, number]}
          skill={skill.name}
          color={skill.color}
        />
      ))}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.8}
      />
    </>
  );
}

function ProjectCard3D({
  position,
  color,
  title,
}: {
  position: [number, number, number];
  color: string;
  title: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.3) * 0.05;

      const scale = hovered ? 1.1 : 1;
      meshRef.current.scale.lerp({ x: scale, y: scale, z: scale } as any, 0.1);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh
        ref={meshRef}
        position={position}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <boxGeometry args={[1.2, 0.8, 0.1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.2 : 0.05}
        />
        <Html distanceFactor={6} center>
          <div className="text-white text-xs font-bold bg-gray-900/80 backdrop-blur-sm px-2 py-1 rounded border border-blue-500/30 pointer-events-none">
            {title}
          </div>
        </Html>
      </mesh>
    </Float>
  );
}

function ProjectsScene() {
  const projects = [
    { title: "DeFi Platform", position: [-2, 0, 0], color: "#2196F3" },
    { title: "E-Commerce", position: [0, 0, 0], color: "#1E88E5" },
    { title: "NFT Marketplace", position: [2, 0, 0], color: "#42A5F5" },
  ];

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#2196F3" />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#1E88E5" />

      <Stars
        radius={150}
        depth={40}
        count={300}
        factor={3}
        saturation={0}
        fade
        speed={0.3}
      />

      {projects.map((project, index) => (
        <ProjectCard3D
          key={index}
          position={project.position as [number, number, number]}
          color={project.color}
          title={project.title}
        />
      ))}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.6}
      />
    </>
  );
}

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("home");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Enhanced scroll-based animations
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "home",
        "about",
        "skills",
        "experience",
        "projects",
        "services",
        "testimonials",
        "blog",
        "contact",
      ];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }

      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen overflow-x-hidden">
      {/* Enhanced Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 z-50 origin-left shadow-lg shadow-blue-500/50"
        style={{ scaleX }}
      />

      {/* Enhanced Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md z-40 border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent"
            >
              TheDeveloper
            </motion.div>

            <div className="hidden md:flex space-x-8">
              {[
                "home",
                "about",
                "skills",
                "experience",
                "projects",
                "services",
                "testimonials",
                "blog",
                "contact",
              ].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className={`capitalize transition-all duration-300 hover:text-blue-400 relative ${
                    activeSection === item ? "text-blue-400" : "text-gray-300"
                  }`}
                >
                  {item}
                  {activeSection === item && (
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600"
                      layoutId="activeSection"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section
        id="home"
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
            <Suspense fallback={null}>
              <HeroScene />
              <Environment preset="night" />
            </Suspense>
          </Canvas>
        </div>

        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-gray-900/50 to-blue-800/30" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <div className="w-40 h-40 mx-auto mb-8 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse shadow-2xl shadow-blue-500/50"></div>
                <div className="absolute inset-2 bg-gray-900 rounded-full flex items-center justify-center">
                  <FaCode className="text-5xl text-blue-400" />
                </div>
                {/* Orbiting elements */}
                <motion.div
                  className="absolute -top-2 -right-2 w-6 h-6 bg-blue-400 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 10,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />
                <motion.div
                  className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500 rounded-full"
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 8,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />
              </div>
            </motion.div>

            <motion.h1
              className="text-7xl md:text-9xl font-bold mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Hi, I'm{" "}
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Matthew
              </span>
            </motion.h1>

            <motion.div
              className="text-3xl md:text-4xl text-gray-300 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <span className="text-blue-400">Software Developer</span> &{" "}
              <span className="text-blue-500">Blockchain Enthusiast</span>
            </motion.div>

            <motion.p
              className="text-xl md:text-2xl text-gray-400 mb-10 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              Crafting innovative digital experiences and decentralized
              solutions. Transforming ideas into scalable, modern applications
              with cutting-edge technologies.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <motion.button
                onClick={() => scrollToSection("projects")}
                className="px-12 py-5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full font-semibold text-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/70"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore My Work
              </motion.button>

              <motion.button
                className="px-12 py-5 border-2 border-blue-500 rounded-full font-semibold text-lg hover:bg-blue-500/10 transition-all duration-300 flex items-center gap-3 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaDownload />
                Download Resume
              </motion.button>
            </motion.div>

            {/* Enhanced Stats */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              {[
                { number: "37+", label: "Projects Completed" },
                { number: "4+", label: "Years Experience" },
                { number: "25+", label: "Happy Clients" },
                { number: "18+", label: "Technologies Mastered" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center p-6 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-blue-500/20 hover:border-blue-500/50 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-4xl font-bold text-blue-400 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Enhanced Social Links */}
            <motion.div
              className="flex justify-center space-x-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
            >
              {[
                {
                  icon: FaGithub,
                  href: "https://github.com/Matthew-Ayinde/",
                  label: "GitHub",
                },
                {
                  icon: FaLinkedin,
                  href: "https://www.linkedin.com/in/matthew-ayinde-9b4894231/",
                  label: "LinkedIn",
                },
                {
                  icon: FaTwitter,
                  href: "https://x.com/Your_cute_coder",
                  label: "Twitter",
                },
                {
                  icon: FaEnvelope,
                  href: "mailto:it.matthewayinde@gmail.com",
                  label: "Email",
                },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-16 h-16 bg-gray-800/50 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-blue-400 transition-all duration-300 border border-gray-700 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/30"
                  whileHover={{ scale: 1.2, y: -5, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <social.icon className="text-xl" />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <div className="w-8 h-12 border-2 border-blue-400 rounded-full flex justify-center shadow-lg shadow-blue-500/30">
            <motion.div
              className="w-2 h-4 bg-blue-400 rounded-full mt-2"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
          </div>
        </motion.div>
      </section>

      {/* Enhanced About Section */}
      <section
        id="about"
        className="py-32 bg-gray-800/30 relative overflow-hidden"
      >
        <motion.div className="absolute inset-0 opacity-5" style={{ y: y1 }}>
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl md:text-7xl font-bold mb-8">
              About{" "}
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Me
              </span>
            </h2>
            <div className="w-40 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto shadow-lg shadow-blue-500/50"></div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-20 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative z-10">
                <div className="w-96 h-96 mx-auto relative">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl transform rotate-6 shadow-2xl shadow-blue-500/50"
                    animate={{ rotate: [6, -6, 6] }}
                    transition={{
                      duration: 6,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
                  <div className="absolute inset-4 bg-gray-900 rounded-3xl flex items-center justify-center border border-blue-500/20">
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 20,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                      >
                        <FaCode className="text-8xl text-blue-400 mb-4 mx-auto" />
                      </motion.div>
                      <div className="text-2xl font-bold text-white">
                        Software
                      </div>
                      <div className="text-lg text-blue-400">Developer</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced floating elements */}
              <motion.div
                className="absolute -top-8 -right-8 w-20 h-20 bg-blue-500/20 rounded-full backdrop-blur-sm border border-blue-500/30"
                animate={{ y: [-10, 10, -10], rotate: [0, 180, 360] }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
              />
              <motion.div
                className="absolute -bottom-8 -left-8 w-16 h-16 bg-blue-400/20 rounded-full backdrop-blur-sm border border-blue-400/30"
                animate={{ y: [10, -10, 10], rotate: [360, 180, 0] }}
                transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-5xl font-bold mb-6">
                  <span className="text-blue-400">Passionate</span> Software
                  Engineer
                </h3>
                <p className="text-xl text-gray-300 leading-relaxed mb-6">
                  I'm a Software Engineer based in Nigeria, specializing in full
                  stack web development through hands-on learning and building
                  applications. I am a recent graduate with a Bachelor of
                  Science degree in Computer Science, equipped with a
                  substantial knowledge base spanning both frontend and backend
                  web technologies. Proficient in HTML5, CSS3, vanilla
                  JavaScript, Sass, Tailwind, Bootstrap, React, NodeJs, Express
                  Js, Nest Js and primarily utilizing the MERN stack for web
                  development, I have demonstrated competence in designing and
                  developing modern web applications. Furthermore, I possess
                  substantial expertise in the development of blockchain
                  applications using the Solidity programming language,
                  underscoring my versatility and proficiency in cutting-edge
                  technologies.
                </p>
                <p className="text-lg text-gray-400 leading-relaxed">
                  My journey began with a curiosity for how things work behind
                  the scenes of the web. This curiosity evolved into a passion
                  for building scalable, user-centric applications that solve
                  real-world problems. I believe in the power of technology to
                  transform businesses and improve lives.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {[
                  {
                    icon: FaMapMarkerAlt,
                    title: "Based in",
                    value: "Lagos",
                    color: "text-blue-400",
                  },
                  {
                    icon: FaCalendarAlt,
                    title: "Experience",
                    value: "4+ Years",
                    color: "text-blue-500",
                  },
                  {
                    icon: FaAward,
                    title: "Education",
                    value: "B.Sc Computer Science",
                    color: "text-blue-600",
                  },
                  {
                    icon: FaRocket,
                    title: "Focus",
                    value: "MERN & Blockchain",
                    color: "text-blue-300",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-blue-500/20 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
                    whileHover={{ scale: 1.05, y: -5 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <item.icon className={`text-3xl ${item.color} mb-3`} />
                    <h4 className="font-semibold text-white mb-1">
                      {item.title}
                    </h4>
                    <p className="text-gray-400">{item.value}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 p-8 rounded-xl border border-blue-500/30 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <h4 className="text-2xl font-bold text-blue-400 mb-4">
                  My Mission
                </h4>
                <p className="text-gray-300 leading-relaxed">
                  To leverage technology as a force for positive change,
                  creating digital solutions that are not only technically
                  excellent but also accessible, inclusive, and impactful for
                  communities across Africa and beyond.
                </p>
              </motion.div>
            </motion.div>
          </div>

          {/* Enhanced Personal Interests */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="text-4xl font-bold mb-12 text-blue-400">
              Beyond Coding
            </h3>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  icon: FaLightbulb,
                  title: "Innovation",
                  desc: "Always exploring new technologies and methodologies",
                },
                {
                  icon: FaUsers,
                  title: "Community",
                  desc: "Active in tech communities and mentoring aspiring developers",
                },
                {
                  icon: FaHeart,
                  title: "Open Source",
                  desc: "Contributing to open source projects and sharing knowledge",
                },
                {
                  icon: FaRocket,
                  title: "Entrepreneurship",
                  desc: "Building products that solve real-world problems",
                },
              ].map((interest, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-800/40 backdrop-blur-sm p-8 rounded-xl border border-blue-500/20 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
                  whileHover={{ scale: 1.05, y: -10 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: index * 0.5,
                    }}
                  >
                    <interest.icon className="text-4xl text-blue-400 mb-6 mx-auto" />
                  </motion.div>
                  <h4 className="font-bold text-white mb-3 text-lg">
                    {interest.title}
                  </h4>
                  <p className="text-gray-400">{interest.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Skills Section */}
      <section id="skills" className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl md:text-7xl font-bold mb-8">
              Technical{" "}
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Expertise
              </span>
            </h2>
            <div className="w-40 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto mb-8 shadow-lg shadow-blue-500/50"></div>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              A comprehensive toolkit of modern technologies and frameworks,
              constantly evolving with industry trends
            </p>
          </motion.div>

          {/* Enhanced 3D Skills Visualization */}
          <motion.div
            className="h-96 mb-20 rounded-2xl overflow-hidden border border-blue-500/30 shadow-2xl shadow-blue-500/20"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
              <Suspense fallback={null}>
                <SkillsScene />
                <Environment preset="city" />
              </Suspense>
            </Canvas>
          </motion.div>

          {/* Enhanced Skills Grid */}
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Frontend Development */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 p-8 rounded-2xl border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/20"
            >
              <div className="text-center mb-8">
                <motion.div
                  className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/50"
                  whileHover={{ rotate: 12, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaCode className="text-4xl text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-blue-400">
                  Frontend Development
                </h3>
                <p className="text-gray-400 mt-2">
                  Creating beautiful, responsive user interfaces
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    name: "React.js",
                    icon: FaReact,
                    level: 95,
                    color: "from-blue-400 to-blue-600",
                  },
                  {
                    name: "Next.js",
                    icon: SiNextdotjs,
                    level: 90,
                    color: "from-blue-500 to-blue-700",
                  },
                  {
                    name: "TypeScript",
                    icon: SiTypescript,
                    level: 88,
                    color: "from-blue-600 to-blue-800",
                  },
                  {
                    name: "Tailwind CSS",
                    icon: SiTailwindcss,
                    level: 95,
                    color: "from-blue-400 to-blue-600",
                  },
                  {
                    name: "HTML5",
                    icon: FaHtml5,
                    level: 98,
                    color: "from-blue-500 to-blue-700",
                  },
                  {
                    name: "CSS3",
                    icon: FaCss3Alt,
                    level: 95,
                    color: "from-blue-400 to-blue-600",
                  },
                  {
                    name: "JavaScript",
                    icon: FaJs,
                    level: 92,
                    color: "from-blue-600 to-blue-800",
                  },
                  {
                    name: "Sass/SCSS",
                    icon: SiSass,
                    level: 85,
                    color: "from-blue-500 to-blue-700",
                  },
                ].map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <skill.icon className="text-xl text-blue-400" />
                      </motion.div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-white">
                            {skill.name}
                          </span>
                          <span className="text-sm text-blue-400 font-semibold">
                            {skill.level}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className={`bg-gradient-to-r ${skill.color} h-2 rounded-full shadow-lg`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ duration: 1.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Backend Development */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-600/10 to-blue-700/10 p-8 rounded-2xl border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/20"
            >
              <div className="text-center mb-8">
                <motion.div
                  className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-600/50"
                  whileHover={{ rotate: 12, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaServer className="text-4xl text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-blue-400">
                  Backend Development
                </h3>
                <p className="text-gray-400 mt-2">
                  Building robust, scalable server-side solutions
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    name: "Node.js",
                    icon: FaNodeJs,
                    level: 92,
                    color: "from-blue-400 to-blue-600",
                  },
                  {
                    name: "Express.js",
                    icon: SiExpress,
                    level: 90,
                    color: "from-blue-500 to-blue-700",
                  },
                  {
                    name: "NestJS",
                    icon: SiNestjs,
                    level: 80,
                    color: "from-blue-600 to-blue-800",
                  },
                  {
                    name: "MongoDB",
                    icon: SiMongodb,
                    level: 88,
                    color: "from-blue-400 to-blue-600",
                  },
                  {
                    name: "PostgreSQL",
                    icon: SiPostgresql,
                    level: 85,
                    color: "from-blue-500 to-blue-700",
                  },
                  {
                    name: "Docker",
                    icon: SiDocker,
                    level: 78,
                    color: "from-blue-500 to-blue-700",
                  },
                ].map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <skill.icon className="text-xl text-blue-400" />
                      </motion.div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-white">
                            {skill.name}
                          </span>
                          <span className="text-sm text-blue-400 font-semibold">
                            {skill.level}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className={`bg-gradient-to-r ${skill.color} h-2 rounded-full shadow-lg`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ duration: 1.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Blockchain Development */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-700/10 to-blue-800/10 p-8 rounded-2xl border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/20"
            >
              <div className="text-center mb-8">
                <motion.div
                  className="w-24 h-24 bg-gradient-to-br from-blue-700 to-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-700/50"
                  whileHover={{ rotate: 12, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <SiSolidity className="text-4xl text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-blue-400">
                  Blockchain Development
                </h3>
                <p className="text-gray-400 mt-2">
                  Decentralized applications and smart contracts
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    name: "Solidity",
                    icon: SiSolidity,
                    level: 88,
                    color: "from-blue-400 to-blue-600",
                  },
                  {
                    name: "Web3.js",
                    icon: FaCode,
                    level: 85,
                    color: "from-blue-500 to-blue-700",
                  },
                  {
                    name: "Ethers.js",
                    icon: FaCode,
                    level: 82,
                    color: "from-blue-600 to-blue-800",
                  },
                  {
                    name: "Smart Contracts",
                    icon: FaCode,
                    level: 90,
                    color: "from-blue-400 to-blue-600",
                  },
                  {
                    name: "DApp Development",
                    icon: FaCode,
                    level: 85,
                    color: "from-blue-500 to-blue-700",
                  },
                  {
                    name: "Truffle",
                    icon: FaCode,
                    level: 75,
                    color: "from-blue-400 to-blue-600",
                  },
                  {
                    name: "IPFS",
                    icon: FaDatabase,
                    level: 72,
                    color: "from-blue-500 to-blue-700",
                  },
                ].map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <skill.icon className="text-xl text-blue-400" />
                      </motion.div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-white">
                            {skill.name}
                          </span>
                          <span className="text-sm text-blue-400 font-semibold">
                            {skill.level}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className={`bg-gradient-to-r ${skill.color} h-2 rounded-full shadow-lg`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ duration: 1.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* DevOps & Tools */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-800/10 to-blue-900/10 p-8 rounded-2xl border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/20"
            >
              <div className="text-center mb-8">
                <motion.div
                  className="w-24 h-24 bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-800/50"
                  whileHover={{ rotate: 12, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaRocket className="text-4xl text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-blue-400">
                  DevOps & Tools
                </h3>
                <p className="text-gray-400 mt-2">
                  Deployment, monitoring, and development tools
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    name: "Git & GitHub",
                    icon: FaGitAlt,
                    level: 92,
                    color: "from-blue-400 to-blue-600",
                  },
                  {
                    name: "Docker",
                    icon: SiDocker,
                    level: 80,
                    color: "from-blue-500 to-blue-700",
                  },
                  {
                    name: "Firebase",
                    icon: SiFirebase,
                    level: 85,
                    color: "from-blue-400 to-blue-600",
                  },
                  {
                    name: "Vercel",
                    icon: FaCode,
                    level: 90,
                    color: "from-blue-500 to-blue-700",
                  },
                  {
                    name: "Netlify",
                    icon: FaCode,
                    level: 88,
                    color: "from-blue-600 to-blue-800",
                  },
                  {
                    name: "CI/CD",
                    icon: FaRocket,
                    level: 78,
                    color: "from-blue-400 to-blue-600",
                  },
                ].map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <skill.icon className="text-xl text-blue-400" />
                      </motion.div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-white">
                            {skill.name}
                          </span>
                          <span className="text-sm text-blue-400 font-semibold">
                            {skill.level}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className={`bg-gradient-to-r ${skill.color} h-2 rounded-full shadow-lg`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ duration: 1.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Continue with other sections using the same enhanced blue theme... */}
      {/* For brevity, I'll show the pattern for the next section */}

      {/* Enhanced Experience Section */}
      <section
        id="experience"
        className="py-32 bg-gray-800/30 relative overflow-hidden"
      >
        <motion.div className="absolute inset-0 opacity-5" style={{ y: y2 }}>
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8">
              Professional{" "}
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Journey
              </span>
            </h2>
            <div className="w-40 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto mb-8 shadow-lg shadow-blue-500/50"></div>
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
              A timeline of growth, learning, and impactful contributions across
              various organizations
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line - positioned differently for mobile vs desktop */}
            <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-blue-600 shadow-lg shadow-blue-500/50"></div>

            {[
              {
                title: "Senior Front End Engineer",
                company: "Xown Solutions",
                period: "March 2025 - Present",
                location: "Lagos",
                type: "Full-time",
                description:
                  "Working with a team of 8 developers in building enterprise-grade web applications. Architected and implemented microservices infrastructure that improved system performance by ≥35%. Spearheaded the adoption of modern development practices including CI/CD, automated testing, and code reviews.",
                achievements: [
                  "Reduced application load time by 60% through performance optimization",
                  "Mentored 5 junior developers, with 3 receiving promotions",
                  "Implemented automated testing suite increasing code coverage to 85%",
                  "Led migration from monolithic to microservices architecture",
                ],
                technologies: [
                  "React",
                  "Node.js",
                  "MongoDB",
                  "AWS",
                  "Docker",
                  "Kubernetes",
                  "GraphQL",
                ],
                color: "from-blue-500 to-blue-600",
              },
              {
                title: "Blockchain Developer",
                company: "Osun State University",
                period: "Mar 2023 - Jun 2023",
                location: "Remote",
                type: "Contract",
                description:
                  "Specialized in developing and auditing smart contracts for an electronic health management systems. Conducted security audits, identified and fixed critical vulnerabilities.",
                achievements: [
                  "Identified and fixed 15+ critical security vulnerabilities",
                  "Optimized gas consumption by 30% across multiple contracts",
                  "Published 3 technical articles on smart contract security",
                ],
                technologies: [
                  "Solidity",
                  "Web3.js",
                  "Truffle",
                  "React",
                  "IPFS",
                  "Node Js",
                ],
                color: "from-blue-600 to-blue-700",
              },
              {
                title: "Full Stack Developer",
                company: "Insight Redefini",
                period: "Dec 2023 - Feb 2025",
                location: "Lagos",
                type: "Full-time",
                description:
                  "Developed responsive web applications for diverse clients ranging from startups to established businesses. Collaborated closely with design teams to implement pixel-perfect UI/UX designs. Integrated various third-party services and payment gateways.",
                achievements: [
                  "Delivered 25+ client projects with 98% satisfaction rate",
                  "Reduced development time by 40% through reusable component library",
                  "Integrated payment systems",
                  "Improved SEO rankings for clients by average of 150%",
                ],
                technologies: [
                  "React",
                  "Express.js",
                  "PostgreSQL",
                  "Tailwind CSS",
                  "Stripe",
                  "AWS",
                ],
                color: "from-blue-700 to-blue-800",
              },
            ].map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`relative flex items-center mb-12 md:mb-20 ${
                  // Mobile: all items align left, Desktop: alternating
                  index % 2 === 0
                    ? "justify-start"
                    : "justify-start md:justify-end"
                }`}
              >
                <div
                  className={`w-full md:w-5/12 ${
                    // Mobile: padding left for timeline, Desktop: alternating padding
                    index % 2 === 0 ? "pl-12 md:pl-0 md:pr-8" : "pl-12 md:pl-8"
                  }`}
                >
                  <motion.div
                    className="bg-gray-800/60 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20"
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 bg-gradient-to-r ${exp.color} rounded-full animate-pulse shadow-lg`}
                        ></div>
                        <span className="text-blue-400 font-semibold text-base md:text-lg">
                          {exp.period}
                        </span>
                      </div>
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm border border-blue-500/30 w-fit">
                        {exp.type}
                      </span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold mb-2 text-white">
                      {exp.title}
                    </h3>
                    <h4 className="text-lg md:text-xl text-blue-400 font-semibold mb-2">
                      {exp.company}
                    </h4>
                    <p className="text-gray-400 mb-4 flex items-center gap-2">
                      <FaMapMarkerAlt className="text-sm flex-shrink-0" />
                      {exp.location}
                    </p>

                    <p className="text-gray-300 mb-6 leading-relaxed text-sm md:text-base">
                      {exp.description}
                    </p>

                    <div className="mb-6">
                      <h5 className="font-semibold text-white mb-3">
                        Key Achievements:
                      </h5>
                      <ul className="space-y-2">
                        {exp.achievements.map((achievement, achIndex) => (
                          <li
                            key={achIndex}
                            className="text-gray-300 text-sm flex items-start gap-2"
                          >
                            <FaStar className="text-blue-400 mt-1 flex-shrink-0" />
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm border border-blue-500/30 hover:bg-blue-500/20 transition-colors duration-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Timeline dot - positioned differently for mobile vs desktop */}
                <motion.div
                  className={`absolute left-0 md:left-1/2 md:transform md:-translate-x-1/2 w-8 h-8 bg-gradient-to-r ${exp.color} rounded-full border-4 border-gray-900 z-10 shadow-lg shadow-blue-500/50`}
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.3 }}
                ></motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Projects Section */}
      <section id="projects" className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl md:text-7xl font-bold mb-8">
              Featured{" "}
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Projects
              </span>
            </h2>
            <div className="w-40 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto mb-8 shadow-lg shadow-blue-500/50"></div>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              A showcase of innovative solutions, from decentralized
              applications to enterprise-grade web platforms
            </p>
          </motion.div>

          {/* Enhanced 3D Projects Visualization */}
          <motion.div
            className="h-80 mb-20 rounded-2xl overflow-hidden border border-blue-500/30 shadow-2xl shadow-blue-500/20"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
              <Suspense fallback={null}>
                <ProjectsScene />
                <Environment preset="sunset" />
              </Suspense>
            </Canvas>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "24/7 Travels - An Online Travel Agency",
                description:
                  "A Well established Lagos based travel agency that emphasizes attractive pricing, flexible payment plans, and active digital engagement to make travel accessible and convenient.",
                image: "/247travels.png",
                technologies: ["React", "Tailwind", "SASS", ".NET"],
                github: "https://github.com/Matthew-Ayinde/",
                demo: "https://247travels.com/",
                category: "Travel",
                stats: { users: "10K+"},
              },
              {
                title: "Insight Redefini",
                description:
                  "Nigeria's Leading marketing communications group based in Nigeria, and is part of the global Publicis Groupe network, one of the world’s largest communications and advertising organizations.",
                image: "/insightredefini.png",
                technologies: ["Next.js", "Tailwind", "CSS", "Shad CN"],
                github: "#",
                demo: "https://insightredefini.com/",
                category: "Advertising",
                stats: { visitors: "25K+" },
              },
              {
                title: "Green Atlas Farms and Agro",
                description:
                  "A Nigerian real estate and property development firm based in Abuja that specialize in land acquisition, residential housing, and luxury property development",
                image: "/holdings.jpeg",
                technologies: ["React", "Tailwind", "SASS"],
                github: "#",
                demo: "https://greenatlasfarmsandagro.com/",
                category: "Real Estate",
                stats: { visitors: "5K+", },
              },
              {
                title: "Darabara",
                description:
                  "A UK-based nanny recruitment and training agency that connects families with qualified caregivers and offers professional development for nannies.",
                image: "/darabara.jpeg",
                technologies: ["React", "Tailwind", ".NET", "SQL"],
                github: "#",
                demo: "https://darabara.co.uk",
                category: "Childcare",
                stats: { users: "20K+" },
              },
              {
                title: "Insight Publicis",
                description:
                  "A leading marketing communications and advertising agency in Nigeria and West Africa. Founded in 1979 by Biodun Shobanjo and Jimi Awosika, it operates under the Troyka Group and is now part of the Publicis Groupe network",
                image: "/publicis.jpeg",
                technologies: ["React", "Tailwind", "SASS"],
                github: "#",
                demo: "https://insightpublicis.com",
                category: "Productivity",
                stats: { users: "500+" },
              },
              {
                title: "Dees Travels",
                description:
                  "A well established Nigerian travel-management company founded in 2000, headquartered in Lagos",
                image: "/dees.jpeg",
                technologies: [
                  "React",
                  "Tailwind",
                  "SQL",
                  ".NET"
                ],
                github: "#",
                demo: "https://deestravels.com/",
                category: "Travel",
                stats: { users: "50K+" },
              },
            ].map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group perspective-1000"
              >
                <motion.div
                  className="bg-gray-800/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300 transform-gpu hover:shadow-xl hover:shadow-blue-500/20"
                  whileHover={{
                    rotateY: 5,
                    rotateX: 5,
                    scale: 1.02,
                    transition: { duration: 0.3 },
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-blue-500/80 backdrop-blur-sm text-white rounded-full text-sm border border-blue-400/50">
                        {project.category}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 flex gap-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {Object.entries(project.stats).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="font-bold text-sm">{value}</div>
                          <div className="text-xs opacity-80 capitalize">
                            {key}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs border border-blue-500/30"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-4">
                      <motion.a
                        href={project.demo}
                        className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaExternalLinkAlt />
                        <span className="text-sm">Live</span>
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Services Section */}
      <section
        id="services"
        className="py-32 bg-gray-800/30 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl md:text-7xl font-bold mb-8">
              My{" "}
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Services
              </span>
            </h2>
            <div className="w-40 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto mb-8 shadow-lg shadow-blue-500/50"></div>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Comprehensive digital solutions tailored to transform your ideas
              into powerful, scalable applications
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FaCode,
                title: "Full Stack Web Development",
                description:
                  "End-to-end web application development using modern technologies like React, Node.js, and cloud platforms. From concept to deployment.",
                features: [
                  "Responsive Design",
                  "API Development",
                  "Database Design",
                  "Performance Optimization",
                ],
                color: "from-blue-500 to-blue-600",
              },
              {
                icon: SiSolidity,
                title: "Blockchain Development",
                description:
                  "Smart contract development, DApp creation, and blockchain integration services. Expertise in Ethereum, Solidity, and Web3 technologies.",
                features: [
                  "Smart Contracts",
                  "DApp Development",
                  "Token Creation",
                  "Security Audits",
                ],
                color: "from-blue-600 to-blue-700",
              },
              {
                icon: FaMobile,
                title: "Mobile App Development",
                description:
                  "Cross-platform mobile applications using React Native and Flutter. Native performance with shared codebase efficiency.",
                features: [
                  "iOS & Android",
                  "Cross-Platform",
                  "Native Performance",
                  "App Store Deployment",
                ],
                color: "from-blue-700 to-blue-800",
              },
              {
                icon: FaShoppingCart,
                title: "E-Commerce Solutions",
                description:
                  "Complete e-commerce platforms with payment integration, inventory management, and analytics. Scalable and secure online stores.",
                features: [
                  "Payment Integration",
                  "Inventory Management",
                  "Analytics Dashboard",
                  "SEO Optimization",
                ],
                color: "from-blue-400 to-blue-500",
              },
              {
                icon: FaCog,
                title: "API Development & Integration",
                description:
                  "RESTful and GraphQL API development, third-party integrations, and microservices architecture for scalable applications.",
                features: [
                  "REST & GraphQL APIs",
                  "Third-party Integration",
                  "Microservices",
                  "Documentation",
                ],
                color: "from-blue-500 to-blue-600",
              },
              {
                icon: FaChartLine,
                title: "Technical Consulting",
                description:
                  "Strategic technology consulting, code reviews, architecture planning, and team mentoring to optimize your development process.",
                features: [
                  "Architecture Planning",
                  "Code Reviews",
                  "Team Mentoring",
                  "Technology Strategy",
                ],
                color: "from-blue-600 to-blue-700",
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <motion.div
                  className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300 h-full hover:shadow-xl hover:shadow-blue-500/20"
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <motion.div
                    className={`w-20 h-20 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <service.icon className="text-3xl text-white" />
                  </motion.div>

                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors duration-300">
                    {service.title}
                  </h3>

                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  <ul className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <motion.li
                        key={featureIndex}
                        className="text-gray-400 text-sm flex items-center gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: featureIndex * 0.1,
                        }}
                        viewport={{ once: true }}
                      >
                        <div className="w-2 h-2 bg-blue-400 rounded-full shadow-sm shadow-blue-400/50"></div>
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section id="testimonials" className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl md:text-7xl font-bold mb-8">
              Client{" "}
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Testimonials
              </span>
            </h2>
            <div className="w-40 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto mb-8 shadow-lg shadow-blue-500/50"></div>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              What clients and colleagues say about working with me
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Daveworld",
                role: "Daveworld Inc.",
                image: "/daveworld.jpg",
                testimonial:
                 "I've had the pleasure of working with Matthew on several projects, his commitment to meeting project deadlines is truly exceptional🥰",
                 rating: 5,
              },
              {
                name: "Vicol Olawade",
                role: "CEO, TixVnt",
                image: "/victor.png",
                testimonial: "It's always nice working with you Matt. Your resilence is on another level and it makes me confident whenever you are asked to handle a job",
                rating: 5,
              },
              {
                name: "Saheed",
                role: "Software Engineer, YabaTech",
                image: "/saheed.jpg",
                testimonial: "Matthew is an amazing programmer, he taught me the basics of JavaScript and he made me see the Joy in programming and liking it. Thank you😊🙏",
                             },
              
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <motion.div
                  className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300 h-full hover:shadow-xl hover:shadow-blue-500/20"
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <FaQuoteLeft className="text-4xl text-blue-400 mb-6 opacity-50" />
                  </motion.div>

                  <p className="text-gray-300 mb-6 leading-relaxed italic text-lg">
                    "{testimonial.testimonial}"
                  </p>

                  <div className="flex items-center gap-4 mb-4">
                    <motion.img
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-blue-500/30"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <div>
                      <h4 className="font-bold text-white text-lg">
                        {testimonial.name}
                      </h4>
                      <p className="text-blue-400 text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, starIndex) => (
                      <motion.div
                        key={starIndex}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: starIndex * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <FaStar className="text-blue-400 text-lg" />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Enhanced Contact Section */}
      <section id="contact" className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl md:text-7xl font-bold mb-8">
              Get In{" "}
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Touch
              </span>
            </h2>
            <div className="w-40 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto mb-8 shadow-lg shadow-blue-500/50"></div>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Ready to bring your ideas to life? Let's discuss your next project
              and create something amazing together.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-4xl font-bold mb-6 text-blue-400">
                  Let's Connect
                </h3>
                <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                  Whether you have a project in mind, want to collaborate, or
                  just want to say hello, I'd love to hear from you. Let's
                  create something extraordinary together!
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    icon: FaEnvelope,
                    title: "Email",
                    value: "it.matthewayinde@email.com",
                    href: "mailto:it.matthewayinde@email.com",
                    color: "from-blue-500 to-blue-600",
                  },
                  {
                    icon: FaPhone,
                    title: "Phone",
                    value: "+234 7045 814 645",
                    href: "tel:+2347045814645",
                    color: "from-blue-600 to-blue-700",
                  },
                  {
                    icon: FaMapMarkerAlt,
                    title: "Location",
                    value: "Lagos",
                    href: "#",
                    color: "from-blue-700 to-blue-800",
                  },
                ].map((contact, index) => (
                  <motion.a
                    key={index}
                    href={contact.href}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-6 p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl hover:bg-gray-700/50 transition-all duration-300 group border border-blue-500/30 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20"
                    whileHover={{ scale: 1.02, x: 10 }}
                  >
                    <motion.div
                      className={`w-20 h-20 bg-gradient-to-r ${contact.color} rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <contact.icon className="text-2xl text-white" />
                    </motion.div>
                    <div>
                      <h4 className="font-semibold text-blue-400 text-lg">
                        {contact.title}
                      </h4>
                      <p className="text-gray-300 text-lg">{contact.value}</p>
                    </div>
                  </motion.a>
                ))}
              </div>

              <div className="flex space-x-6 pt-8">
                {[
                  {
                    icon: FaGithub,
                    href: "https://github.com/Matthew-Ayinde/",
                    label: "GitHub",
                    color: "hover:text-blue-400",
                  },
                  {
                    icon: FaLinkedin,
                    href: "https://www.linkedin.com/in/matthew-ayinde-9b4894231/",
                    label: "LinkedIn",
                    color: "hover:text-blue-400",
                  },
                  {
                    icon: FaTwitter,
                    href: "https://x.com/Your_cute_coder",
                    label: "Twitter",
                    color: "hover:text-blue-400",
                  },
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className={`w-16 h-16 bg-gray-800/50 backdrop-blur-sm rounded-xl flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300 border border-blue-500/30 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20`}
                    whileHover={{ scale: 1.1, y: -5 }}
                  >
                    <social.icon className="text-2xl" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20"
            >
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-blue-400 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-blue-500/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-white placeholder-gray-400"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-400 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-blue-500/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-white placeholder-gray-400"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-400 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-blue-500/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-white placeholder-gray-400"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-400 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-blue-500/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-white placeholder-gray-400"
                    placeholder="Project Collaboration"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-400 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-blue-500/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-none text-white placeholder-gray-400"
                    placeholder="Tell me about your project..."
                  ></textarea>
                </div>

                <motion.button
                  type="submit"
                  className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Send Message
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="py-12 border-t border-blue-500/20 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-4">
                THE DEVELOPER
              </div>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Crafting digital experiences that make a difference. Let's build
                the future together.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex justify-center space-x-6 mb-8"
            >
              {[
                { icon: FaGithub, href: "https://github.com/Matthew-Ayinde/", label: "GitHub" },
                { icon: FaLinkedin, href: "https://www.linkedin.com/in/matthew-ayinde-9b4894231/", label: "LinkedIn" },
                { icon: FaTwitter, href: "https://x.com/Your_cute_coder", label: "Twitter" },
                { icon: FaEnvelope, href: "mailto:it.matthewayinde@gmail.com", label: "Email" },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                  whileHover={{ scale: 1.2, y: -2 }}
                >
                  <social.icon className="text-xl" />
                </motion.a>
              ))}
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-gray-500"
            >
              © 2025 The Developer
            </motion.p>
          </div>
        </div>
      </footer>

      {/* Enhanced Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-blue-500/50 z-40 ${
          showScrollTop ? "opacity-100" : "opacity-0 pointer-events-none"
        } transition-opacity duration-300 border border-blue-400/30`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={showScrollTop ? { y: [0, -5, 0] } : {}}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        <FaArrowUp className="text-xl" />
      </motion.button>
    </div>
  );
}
