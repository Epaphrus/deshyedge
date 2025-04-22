// 3D Service Explorer Implementation
document.addEventListener("DOMContentLoaded", function () {
  // Check if the service explorer container exists
  const serviceExplorerContainer = document.getElementById(
    "service-explorer-container"
  );
  if (!serviceExplorerContainer) return;

  // Load Three.js from CDN if it's not already loaded
  if (typeof THREE === "undefined") {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    script.onload = initServiceExplorer;
    document.head.appendChild(script);
  } else {
    initServiceExplorer();
  }

  // Service data
  const services = [
    {
      id: "digital-transformation",
      title: "Digital Transformation",
      description:
        "We help businesses leverage digital technologies to create new or modify existing business processes, culture, and customer experiences.",
      tags: ["Strategy", "Innovation", "Technology"],
      color: 0xfcd804, // Primary color
      icon: "computer",
    },
    {
      id: "strategic-consulting",
      title: "Strategic Consulting",
      description:
        "Our strategic consulting services help organizations improve their performance through analysis of existing problems and development of plans for improvement.",
      tags: ["Business Analysis", "Planning", "Optimization"],
      color: 0xfcd804,
      icon: "clipboard",
    },
    {
      id: "training-development",
      title: "Training & Development",
      description:
        "We provide comprehensive training programs designed to enhance skills and knowledge of your workforce, driving innovation and productivity.",
      tags: ["Skills Enhancement", "Workshops", "Digital Literacy"],
      color: 0xfcd804,
      icon: "book",
    },
    {
      id: "technology-implementation",
      title: "Technology Implementation",
      description:
        "We implement cutting-edge technologies tailored to your business needs, ensuring seamless integration with existing systems.",
      tags: ["Integration", "Automation", "Cloud Solutions"],
      color: 0xfcd804,
      icon: "settings",
    },
    {
      id: "data-analytics",
      title: "Data Analytics",
      description:
        "Transform your data into actionable insights with our advanced analytics services, enabling data-driven decision making.",
      tags: ["Business Intelligence", "Predictive Analytics", "Visualization"],
      color: 0xfcd804,
      icon: "chart",
    },
    {
      id: "digital-marketing",
      title: "Digital Marketing",
      description:
        "Enhance your digital presence and reach your target audience with our comprehensive digital marketing strategies.",
      tags: ["SEO", "Content Strategy", "Social Media"],
      color: 0xfcd804,
      icon: "megaphone",
    },
  ];

  // Current service index
  let currentServiceIndex = 0;

  // Three.js variables
  let scene, camera, renderer, controls;
  let serviceObjects = [];
  let raycaster, mouse;
  let animationFrameId;
  let isTransitioning = false;

  // Initialize the 3D scene
  function initServiceExplorer() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x040707); // Dark background

    // Create camera
    camera = new THREE.PerspectiveCamera(
      60,
      serviceExplorerContainer.clientWidth /
        serviceExplorerContainer.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Create renderer
    const canvas = document.getElementById("service-explorer-canvas");
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(
      serviceExplorerContainer.clientWidth,
      serviceExplorerContainer.clientHeight
    );
    renderer.setPixelRatio(window.devicePixelRatio);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 10, 10);
    scene.add(directionalLight);

    // Add point lights for dramatic effect
    const pointLight1 = new THREE.PointLight(0xfcd804, 1, 20);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x4c4c4d, 1, 20);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    // Initialize raycaster for interaction
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Create service objects
    createServiceObjects();

    // Set up event listeners
    setupEventListeners();

    // Create service indicators
    createServiceIndicators();

    // Show first service
    showServiceDetail(0);

    // Start animation loop
    animate();

    // Hide loading screen
    document.getElementById("service-explorer-loading").style.opacity = 0;
    setTimeout(() => {
      document.getElementById("service-explorer-loading").style.display =
        "none";
    }, 500);
  }

  // Create 3D objects for each service
  function createServiceObjects() {
    // Clear existing objects
    serviceObjects.forEach((obj) => scene.remove(obj));
    serviceObjects = [];

    // Create a group for all service objects
    const servicesGroup = new THREE.Group();
    scene.add(servicesGroup);

    // Create objects for each service
    services.forEach((service, index) => {
      // Create geometry based on service type
      let geometry;

      switch (service.icon) {
        case "computer":
          geometry = new THREE.BoxGeometry(1.5, 1, 0.1);
          break;
        case "clipboard":
          geometry = new THREE.CylinderGeometry(0.8, 0.8, 0.1, 32);
          break;
        case "book":
          geometry = new THREE.BoxGeometry(1.2, 1.5, 0.2);
          break;
        case "settings":
          geometry = new THREE.TorusGeometry(0.7, 0.2, 16, 100);
          break;
        case "chart":
          geometry = new THREE.ConeGeometry(0.8, 1.5, 32);
          break;
        case "megaphone":
          geometry = new THREE.DodecahedronGeometry(0.8, 0);
          break;
        default:
          geometry = new THREE.SphereGeometry(0.8, 32, 32);
      }

      // Create material
      const material = new THREE.MeshPhysicalMaterial({
        color: service.color,
        metalness: 0.2,
        roughness: 0.5,
        reflectivity: 0.5,
        clearcoat: 0.3,
        clearcoatRoughness: 0.2,
      });

      // Create mesh
      const mesh = new THREE.Mesh(geometry, material);

      // Position in 3D space - arrange in a circle
      const angle = (index / services.length) * Math.PI * 2;
      const radius = 8;
      mesh.position.x = Math.cos(angle) * radius;
      mesh.position.y = Math.sin(angle) * radius;
      mesh.position.z = 0;

      // Store original position for animations
      mesh.userData = {
        originalPosition: mesh.position.clone(),
        service: service,
        index: index,
      };

      // Add to scene and array
      servicesGroup.add(mesh);
      serviceObjects.push(mesh);
    });

    // Position the first service in view
    positionServiceInView(0, false);
  }

  // Position a specific service in the center view
  function positionServiceInView(index, animate = true) {
    if (isTransitioning) return;
    isTransitioning = true;

    const targetObject = serviceObjects[index];
    const targetPosition = new THREE.Vector3(0, 0, 0);

    if (animate) {
      // Animate all objects
      serviceObjects.forEach((obj, i) => {
        // Calculate new positions
        let newPosition;

        if (i === index) {
          // Target object moves to center
          newPosition = targetPosition;
        } else {
          // Other objects move to their original positions in the circle
          const angle = (i / services.length) * Math.PI * 2;
          const radius = 8;
          newPosition = new THREE.Vector3(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius,
            0
          );
        }

        // Animate the transition
        const duration = 1.5; // seconds
        const startPosition = obj.position.clone();
        const startTime = Date.now();

        function updatePosition() {
          const elapsed = (Date.now() - startTime) / 1000; // seconds
          const progress = Math.min(elapsed / duration, 1);

          // Ease in-out function
          const easeProgress =
            progress < 0.5
              ? 2 * progress * progress
              : 1 - Math.pow(-2 * progress + 2, 2) / 2;

          obj.position.lerpVectors(startPosition, newPosition, easeProgress);

          // Rotate the object during transition
          obj.rotation.x += 0.01;
          obj.rotation.y += 0.01;

          if (progress < 1) {
            requestAnimationFrame(updatePosition);
          } else {
            // If this is the last object to finish animating
            if (i === serviceObjects.length - 1) {
              isTransitioning = false;
            }
          }
        }

        updatePosition();
      });

      // Show service details with a delay
      setTimeout(() => {
        showServiceDetail(index);
      }, 500);
    } else {
      // Instantly position without animation
      targetObject.position.copy(targetPosition);
      isTransitioning = false;
    }
  }

  // Show service detail in the overlay
  function showServiceDetail(index) {
    const service = services[index];
    const detailCard = document.getElementById("service-detail-card");
    const title = document.getElementById("service-detail-title");
    const description = document.getElementById("service-detail-description");

    // Update content
    title.textContent = service.title;
    description.textContent = service.description;

    // Update tags
    for (let i = 1; i <= 3; i++) {
      const tagElement = document.getElementById(`service-tag-${i}`);
      if (tagElement) {
        if (i <= service.tags.length) {
          tagElement.textContent = service.tags[i - 1];
          tagElement.style.display = "inline-block";
        } else {
          tagElement.style.display = "none";
        }
      }
    }

    // Show the card with animation
    detailCard.style.opacity = "0";
    setTimeout(() => {
      detailCard.style.opacity = "1";
    }, 100);

    // Update indicators
    updateServiceIndicators(index);

    // Update current index
    currentServiceIndex = index;
  }

  // Create service indicators
  function createServiceIndicators() {
    const indicatorsContainer = document.getElementById("service-indicators");
    if (!indicatorsContainer) return;

    // Clear existing indicators
    indicatorsContainer.innerHTML = "";

    // Create an indicator for each service
    services.forEach((service, index) => {
      const indicator = document.createElement("button");
      indicator.className =
        "w-3 h-3 rounded-full bg-light/30 hover:bg-primary transition-all";
      indicator.setAttribute("aria-label", `View ${service.title}`);
      indicator.dataset.index = index;

      // Add click event
      indicator.addEventListener("click", () => {
        if (currentServiceIndex !== index && !isTransitioning) {
          positionServiceInView(index);
        }
      });

      indicatorsContainer.appendChild(indicator);
    });

    // Update indicators to show current service
    updateServiceIndicators(0);
  }

  // Update service indicators to highlight current service
  function updateServiceIndicators(index) {
    const indicators = document.querySelectorAll("#service-indicators button");
    indicators.forEach((indicator, i) => {
      if (i === index) {
        indicator.classList.remove("bg-light/30");
        indicator.classList.add("bg-primary");
        indicator.style.width = "24px";
      } else {
        indicator.classList.add("bg-light/30");
        indicator.classList.remove("bg-primary");
        indicator.style.width = "12px";
      }
    });
  }

  // Set up event listeners
  function setupEventListeners() {
    // Window resize
    window.addEventListener("resize", onWindowResize);

    // Mouse move for hover effects
    serviceExplorerContainer.addEventListener("mousemove", onMouseMove);

    // Click for selection
    serviceExplorerContainer.addEventListener("click", onMouseClick);

    // Navigation buttons
    const prevButton = document.getElementById("prev-service");
    const nextButton = document.getElementById("next-service");

    if (prevButton) {
      prevButton.addEventListener("click", () => {
        if (!isTransitioning) {
          const newIndex =
            (currentServiceIndex - 1 + services.length) % services.length;
          positionServiceInView(newIndex);
        }
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", () => {
        if (!isTransitioning) {
          const newIndex = (currentServiceIndex + 1) % services.length;
          positionServiceInView(newIndex);
        }
      });
    }
  }

  // Handle window resize
  function onWindowResize() {
    camera.aspect =
      serviceExplorerContainer.clientWidth /
      serviceExplorerContainer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(
      serviceExplorerContainer.clientWidth,
      serviceExplorerContainer.clientHeight
    );
  }

  // Handle mouse move
  function onMouseMove(event) {
    // Calculate mouse position in normalized device coordinates
    const rect = serviceExplorerContainer.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  // Handle mouse click
  function onMouseClick() {
    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(serviceObjects);

    if (intersects.length > 0 && !isTransitioning) {
      const selectedObject = intersects[0].object;
      const serviceIndex = selectedObject.userData.index;

      if (serviceIndex !== currentServiceIndex) {
        positionServiceInView(serviceIndex);
      }
    }
  }

  // Animation loop
  function animate() {
    animationFrameId = requestAnimationFrame(animate);

    // Rotate objects slightly
    serviceObjects.forEach((obj, index) => {
      if (index !== currentServiceIndex || isTransitioning) {
        obj.rotation.x += 0.005;
        obj.rotation.y += 0.005;
      } else {
        // Rotate the centered object more slowly
        obj.rotation.y += 0.01;
      }
    });

    // Update raycaster for hover effects
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(serviceObjects);

    // Reset all objects to normal scale
    serviceObjects.forEach((obj) => {
      if (obj.userData.index !== currentServiceIndex) {
        obj.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
        obj.material.emissive = new THREE.Color(0x000000);
      }
    });

    // Scale up hovered object
    if (intersects.length > 0) {
      const hoveredObject = intersects[0].object;
      if (
        hoveredObject.userData.index !== currentServiceIndex &&
        !isTransitioning
      ) {
        hoveredObject.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1);
        hoveredObject.material.emissive = new THREE.Color(0x333333);
        document.body.style.cursor = "pointer";
      }
    } else {
      document.body.style.cursor = "default";
    }

    // Render the scene
    renderer.render(scene, camera);
  }

  // Add subtle floating animation to the centered object
  function animateCenteredObject() {
    if (
      serviceObjects.length === 0 ||
      currentServiceIndex >= serviceObjects.length
    )
      return;

    const centeredObject = serviceObjects[currentServiceIndex];
    const time = Date.now() * 0.001; // Convert to seconds

    // Subtle floating motion
    centeredObject.position.y = Math.sin(time) * 0.1;

    // Subtle rotation
    centeredObject.rotation.y += 0.01;
  }

  // Clean up resources when the component is unmounted
  function cleanupServiceExplorer() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }

    // Remove event listeners
    window.removeEventListener("resize", onWindowResize);
    if (serviceExplorerContainer) {
      serviceExplorerContainer.removeEventListener("mousemove", onMouseMove);
      serviceExplorerContainer.removeEventListener("click", onMouseClick);
    }

    // Dispose of Three.js resources
    if (serviceObjects.length > 0) {
      serviceObjects.forEach((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((mat) => mat.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
    }

    if (renderer) renderer.dispose();
  }

  // Check if user's device supports WebGL
  function checkWebGLSupport() {
    try {
      const canvas = document.createElement("canvas");
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
      );
    } catch (e) {
      return false;
    }
  }

  // If WebGL is not supported, show the fallback content
  if (!checkWebGLSupport()) {
    if (serviceExplorerContainer) {
      serviceExplorerContainer.style.display = "none";
    }

    const fallbackMessage = document.createElement("div");
    fallbackMessage.className =
      "bg-dark/80 text-light p-6 rounded-xl text-center mb-16";
    fallbackMessage.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 class="text-xl font-bold mb-2">3D Experience Not Available</h3>
            <p class="text-light/80">Your device doesn't support the 3D service explorer. Please view our services in the standard format below.</p>
        `;

    // Insert fallback message before the service list
    const serviceList = document.getElementById("service-list");
    if (serviceList) {
      serviceList.parentNode.insertBefore(fallbackMessage, serviceList);
    }
  }

  // Add this function to the window object to allow for cleanup
  window.cleanupServiceExplorer = cleanupServiceExplorer;
});
