"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { useTheme } from "next-themes"

export default function ThreeScene() {
  const mountRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const { theme } = useTheme()

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    mountRef.current.appendChild(renderer.domElement)

    sceneRef.current = scene
    rendererRef.current = renderer

    // Create floating geometric shapes
    const geometries = [
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.SphereGeometry(0.7, 32, 32),
      new THREE.ConeGeometry(0.7, 1.5, 8),
      new THREE.OctahedronGeometry(0.8),
      new THREE.TetrahedronGeometry(0.9),
    ]

    const materials = [
      new THREE.MeshPhongMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.7,
        shininess: 100,
      }),
      new THREE.MeshPhongMaterial({
        color: 0x8b5cf6,
        transparent: true,
        opacity: 0.7,
        shininess: 100,
      }),
      new THREE.MeshPhongMaterial({
        color: 0x06b6d4,
        transparent: true,
        opacity: 0.7,
        shininess: 100,
      }),
      new THREE.MeshPhongMaterial({
        color: 0xec4899,
        transparent: true,
        opacity: 0.7,
        shininess: 100,
      }),
      new THREE.MeshPhongMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: 0.7,
        shininess: 100,
      }),
    ]

    const meshes = []

    // Create multiple floating objects
    for (let i = 0; i < 15; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)]
      const material = materials[Math.floor(Math.random() * materials.length)]
      const mesh = new THREE.Mesh(geometry, material)

      // Random positioning
      mesh.position.x = (Math.random() - 0.5) * 20
      mesh.position.y = (Math.random() - 0.5) * 20
      mesh.position.z = (Math.random() - 0.5) * 20

      // Random rotation
      mesh.rotation.x = Math.random() * Math.PI
      mesh.rotation.y = Math.random() * Math.PI
      mesh.rotation.z = Math.random() * Math.PI

      // Random scale
      const scale = 0.5 + Math.random() * 0.5
      mesh.scale.setScalar(scale)

      scene.add(mesh)
      meshes.push({
        mesh,
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.02,
        },
        floatSpeed: Math.random() * 0.02 + 0.01,
        floatOffset: Math.random() * Math.PI * 2,
      })
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 10, 5)
    scene.add(directionalLight)

    const pointLight1 = new THREE.PointLight(0x3b82f6, 1, 100)
    pointLight1.position.set(-10, -10, -10)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0x8b5cf6, 1, 100)
    pointLight2.position.set(10, 10, 10)
    scene.add(pointLight2)

    // Camera position
    camera.position.z = 15

    // Animation loop
    let animationId
    const animate = () => {
      animationId = requestAnimationFrame(animate)

      // Animate meshes
      meshes.forEach((item, index) => {
        const { mesh, rotationSpeed, floatSpeed, floatOffset } = item

        // Rotation
        mesh.rotation.x += rotationSpeed.x
        mesh.rotation.y += rotationSpeed.y
        mesh.rotation.z += rotationSpeed.z

        // Floating motion
        mesh.position.y += Math.sin(Date.now() * floatSpeed + floatOffset) * 0.01
      })

      // Rotate camera around the scene
      const time = Date.now() * 0.0005
      camera.position.x = Math.cos(time) * 15
      camera.position.z = Math.sin(time) * 15
      camera.lookAt(scene.position)

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      window.removeEventListener("resize", handleResize)
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  // Update colors based on theme
  useEffect(() => {
    if (!sceneRef.current || !rendererRef.current) return

    const isDark = theme === "dark"

    // Update background
    sceneRef.current.fog = isDark ? new THREE.Fog(0x000000, 10, 50) : new THREE.Fog(0xffffff, 10, 50)

    // Update materials opacity based on theme
    sceneRef.current.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.opacity = isDark ? 0.8 : 0.6
      }
    })
  }, [theme])

  return <div ref={mountRef} className="absolute inset-0" />
}
