       /**
     * DeshyEdge Consulting - Augmented Reality Industry Showcase
     * 
     * This module implements an augmented reality experience that showcases
     * DeshyEdge's industry expertise using WebXR technology.
     */

        // Industry data for AR visualization
        const industries = [
            {
                id: 'education',
                name: 'Education',
                description: 'Transforming educational institutions through innovative digital solutions and strategic planning.',
                tags: ['Digital Learning', 'EdTech', 'Analytics'],
                color: 0xfcd804, // Primary color
                model: 'education-model.glb',
                icon: 'book',
                metric: '85% Improvement',
                position: { x: 0, y: 0, z: -1 },
                scale: 0.5
            },
            {
                id: 'technology',
                name: 'Technology',
                description: 'Helping tech companies stay ahead with cutting-edge strategies and digital transformation.',
                tags: ['Innovation', 'Cloud Solutions', 'AI Integration'],
                color: 0xfcd804,
                model: 'technology-model.glb',
                icon: 'computer',
                metric: '92% Improvement',
                position: { x: 1, y: 0, z: -1 },
                scale: 0.5
            },
            {
                id: 'healthcare',
                name: 'Healthcare',
                description: 'Modernizing healthcare operations and patient experiences through strategic digital initiatives.',
                tags: ['Telemedicine', 'Data Security', 'Patient Experience'],
                color: 0xfcd804,
                model: 'healthcare-model.glb',
                icon: 'hospital',
                metric: '78% Improvement',
                position: { x: -1, y: 0, z: -1 },
                scale: 0.5
            },
            {
                id: 'finance',
                name: 'Finance',
                description: 'Enabling financial institutions to adapt to changing markets with innovative solutions.',
                tags: ['FinTech', 'Blockchain', 'Cybersecurity'],
                color: 0xfcd804,
                model: 'finance-model.glb',
                icon: 'chart',
                metric: '88% Improvement',
                position: { x: 0, y: 0, z: -2 },
                scale: 0.5
            },
            {
                id: 'retail',
                name: 'Retail',
                description: 'Revolutionizing retail experiences through omnichannel strategies and customer-centric solutions.',
                tags: ['E-commerce', 'Customer Experience', 'Supply Chain'],
                color: 0xfcd804,
                model: 'retail-model.glb',
                icon: 'shopping-bag',
                metric: '82% Improvement',
                position: { x: 1, y: 0, z: -2 },
                scale: 0.5
            },
            {
                id: 'manufacturing',
                name: 'Manufacturing',
                description: 'Transforming manufacturing processes through Industry 4.0 technologies and smart automation.',
                tags: ['IoT', 'Automation', 'Predictive Maintenance'],
                color: 0xfcd804,
                model: 'manufacturing-model.glb',
                icon: 'factory',
                metric: '80% Improvement',
                position: { x: -1, y: 0, z: -2 },
                scale: 0.5
            }
        ];

        // DOM Elements
        const arExperienceButton = document.getElementById('ar-experience-button');
        const arTutorialButton = document.getElementById('ar-tutorial-button');
        const arTutorialModal = document.getElementById('ar-tutorial-modal');
        const arTutorialClose = document.getElementById('ar-tutorial-close');
        const arTutorialStart = document.getElementById('ar-tutorial-start');
        const arExperienceContainer = document.getElementById('ar-experience-container');
        const arCanvas = document.getElementById('ar-canvas');
        const arLoadingOverlay = document.getElementById('ar-loading-overlay');
        const arCompatibilityMessage = document.getElementById('ar-compatibility-message');
        const arMessageText = document.getElementById('ar-message-text');
        const arIndustryInfo = document.getElementById('ar-industry-info');
        const arIndustryTitle = document.getElementById('ar-industry-title');
        const arIndustryDescription = document.getElementById('ar-industry-description');
        const arIndustryTag1 = document.getElementById('ar-industry-tag-1');
        const arIndustryTag2 = document.getElementById('ar-industry-tag-2');
        const arIndustryTag3 = document.getElementById('ar-industry-tag-3');
        const arIndustryMetric = document.getElementById('ar-industry-metric');
        const arIndustryMore = document.getElementById('ar-industry-more');
        const arExitButton = document.getElementById('ar-exit-button');
        const arInstructionText = document.getElementById('ar-instruction-text');
        const arInstructions = document.getElementById('ar-instructions');

        // AR Experience variables
        let xrSession = null;
        let xrReferenceSpace = null;
        let xrHitTestSource = null;
        let renderer = null;
        let scene = null;
        let camera = null;
        let controller = null;
        let reticle = null;
        let industryModels = [];
        let placedModels = [];
        let isARSupported = false;
        let isARInitialized = false;
        let isPlacementMode = true;
        let clock = null;
        let raycaster = null;
        let mouse = null;
        let loadedModels = {};
        let modelLoader = null;

        // Check if WebXR is supported
        function checkARSupport() {
            if ('xr' in navigator) {
                navigator.xr.isSessionSupported('immersive-ar')
                    .then((supported) => {
                        isARSupported = supported;
                        updateARButtonState();

                        if (supported) {
                            arCompatibilityMessage.classList.remove('hidden');
                            arMessageText.textContent = 'AR is supported on your device! Click "Launch AR Experience" to begin.';
                            arMessageText.parentElement.classList.add('text-primary');
                        } else {
                            arCompatibilityMessage.classList.remove('hidden');
                            arMessageText.textContent = 'AR is not supported on your device. Please try on a compatible mobile device.';
                        }
                    })
                    .catch((error) => {
                        console.error('Error checking AR support:', error);
                        isARSupported = false;
                        updateARButtonState();

                        arCompatibilityMessage.classList.remove('hidden');
                        arMessageText.textContent = 'Error checking AR compatibility. Please try on a different device.';
                    });
            } else {
                isARSupported = false;
                updateARButtonState();

                arCompatibilityMessage.classList.remove('hidden');
                arMessageText.textContent = 'WebXR is not supported in your browser. Please try on a compatible mobile device.';
            }
        }

        // Update AR button state based on support
        function updateARButtonState() {
            if (isARSupported) {
                arExperienceButton.disabled = false;
            } else {
                arExperienceButton.disabled = true;
                arExperienceButton.classList.add('opacity-50', 'cursor-not-allowed');
            }
        }

        // Initialize Three.js scene
        function initThreeScene() {
            // Create scene
            scene = new THREE.Scene();

            // Create camera
            camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

            // Create renderer
            renderer = new THREE.WebGLRenderer({
                canvas: arCanvas,
                antialias: true,
                alpha: true
            });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.xr.enabled = true;

            // Add ambient light
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambientLight);

            // Add directional light
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(0, 10, 0);
            scene.add(directionalLight);

            // Create reticle for placement
            const reticleGeometry = new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2);
            const reticleMaterial = new THREE.MeshBasicMaterial({ color: 0xfcd804 });
            reticle = new THREE.Mesh(reticleGeometry, reticleMaterial);
            reticle.matrixAutoUpdate = false;
            reticle.visible = false;
            scene.add(reticle);

            // Setup raycaster for interaction
            raycaster = new THREE.Raycaster();
            mouse = new THREE.Vector2();

            // Initialize clock for animations
            clock = new THREE.Clock();

            // Initialize model loader
            modelLoader = new THREE.GLTFLoader();

            // Create controller for interaction
            controller = renderer.xr.getController(0);
            controller.addEventListener('select', onSelect);
            scene.add(controller);

            // Handle window resize
            window.addEventListener('resize', onWindowResize);

            // Preload industry models
            preloadIndustryModels();
        }

        // Preload industry models
        function preloadIndustryModels() {
            // For this implementation, we'll create simple geometric shapes
            // In a production environment, you would load actual GLB models

            industries.forEach(industry => {
                let geometry;
                let material = new THREE.MeshStandardMaterial({
                    color: industry.color,
                    metalness: 0.3,
                    roughness: 0.4
                });

                // Create different geometries based on industry
                switch (industry.id) {
                    case 'education':
                        geometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
                        break;
                    case 'technology':
                        geometry = new THREE.SphereGeometry(0.25, 32, 32);
                        break;
                    case 'healthcare':
                        geometry = new THREE.CylinderGeometry(0.2, 0.2, 0.4, 32);
                        break;
                    case 'finance':
                        geometry = new THREE.TorusGeometry(0.2, 0.1, 16, 100);
                        break;
                    case 'retail':
                        geometry = new THREE.ConeGeometry(0.2, 0.4, 32);
                        break;
                    case 'manufacturing':
                        geometry = new THREE.OctahedronGeometry(0.25);
                        break;
                    default:
                        geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
                }

                const model = new THREE.Mesh(geometry, material);
                model.userData.industry = industry;

                // Add glow effect
                const glowMaterial = new THREE.ShaderMaterial({
                    uniforms: {
                        'c': { value: 0.1 },
                        'p': { value: 4.5 },
                        glowColor: { value: new THREE.Color(industry.color) },
                        viewVector: { value: camera.position }
                    },
                    vertexShader: `
                uniform vec3 viewVector;
                varying float intensity;
                void main() {
                    vec3 vNormal = normalize(normalMatrix * normal);
                    vec3 vNormel = normalize(normalMatrix * viewVector);
                    intensity = pow(0.9 - dot(vNormal, vNormel), 1.0);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
                    fragmentShader: `
                uniform vec3 glowColor;
                varying float intensity;
                void main() {
                    vec3 glow = glowColor * intensity;
                    gl_FragColor = vec4(glow, 1.0);
                }
            `,
                    side: THREE.BackSide,
                    blending: THREE.AdditiveBlending,
                    transparent: true
                });

                const glowMesh = new THREE.Mesh(geometry.clone(), glowMaterial);
                glowMesh.scale.multiplyScalar(1.2);

                // Create a group to hold the model and its glow
                const group = new THREE.Group();
                group.add(model);
                group.add(glowMesh);
                group.scale.set(industry.scale, industry.scale, industry.scale);
                group.userData.industry = industry;
                group.userData.isIndustryModel = true;

                // Store in loadedModels
                loadedModels[industry.id] = group;
            });
        }

        // Handle window resize
        function onWindowResize() {
            if (camera) {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
            }

            if (renderer) {
                renderer.setSize(window.innerWidth, window.innerHeight);
            }
        }

        // Handle controller select event (tap)
        function onSelect(event) {
            if (isPlacementMode && reticle.visible) {
                // Place industry models in a circle around the reticle
                const placementMatrix = new THREE.Matrix4();
                placementMatrix.fromArray(reticle.matrix.elements);

                // Place models in a circle
                const radius = 0.5;
                const numModels = industries.length;

                for (let i = 0; i < numModels; i++) {
                    const angle = (i / numModels) * Math.PI * 2;
                    const x = Math.cos(angle) * radius;
                    const z = Math.sin(angle) * radius;

                    const industry = industries[i];
                    const model = loadedModels[industry.id].clone();

                    // Position model relative to the reticle
                    model.position.set(x, 0.2, z);
                    model.position.applyMatrix4(placementMatrix);

                    // Add to scene and track
                    scene.add(model);
                    placedModels.push(model);

                    // Add floating animation
                    animateModel(model, i);
                }

                // Hide reticle and switch to interaction mode
                reticle.visible = false;
                isPlacementMode = false;

                // Update instructions
                arInstructionText.textContent = "Tap on an industry to explore";
            } else {
                // Check if user tapped on an industry model
                checkIndustryIntersection(controller);
            }
        }

        // Animate model with floating effect
        function animateModel(model, index) {
            const initialY = model.position.y;
            const phase = index * (Math.PI / 3); // Offset phase for each model

            model.userData.animate = (time) => {
                // Floating animation
                model.position.y = initialY + Math.sin(time * 2 + phase) * 0.05;

                // Rotation animation
                model.rotation.y = time * 0.5;
            };
        }

        // Start AR session
        function startARSession() {
            if (!isARSupported) return;

            // Show AR container
            arExperienceContainer.classList.remove('hidden');
            arLoadingOverlay.classList.remove('hidden');

            // Initialize Three.js if not already done
            if (!scene) {
                initThreeScene();
            }

            // Request AR session
            navigator.xr.requestSession('immersive-ar', {
                requiredFeatures: ['hit-test', 'dom-overlay'],
                domOverlay: { root: arExperienceContainer }
            }).then(onSessionStarted)
                .catch(error => {
                    console.error('Error starting AR session:', error);
                    arMessageText.textContent = 'Error starting AR session. Please try again.';
                    arExperienceContainer.classList.add('hidden');
                });
        }

        // Handle AR session start
        function onSessionStarted(session) {
            xrSession = session;

            // Setup session
            session.addEventListener('end', onSessionEnded);

            // Initialize renderer for XR
            renderer.xr.setReferenceSpaceType('local');
            renderer.xr.setSession(session);

            // Create hit test source
            session.requestReferenceSpace('viewer').then((referenceSpace) => {
                session.requestHitTestSource({ space: referenceSpace }).then((source) => {
                    xrHitTestSource = source;
                });
            });

            session.requestReferenceSpace('local').then((referenceSpace) => {
                xrReferenceSpace = referenceSpace;

                // Start rendering loop
                renderer.setAnimationLoop(onXRFrame);

                // Hide loading overlay after a short delay
                setTimeout(() => {
                    arLoadingOverlay.classList.add('hidden');
                    arInstructions.classList.remove('opacity-0');

                    // Show placement instructions
                    arInstructionText.textContent = "Move your device to find a surface";
                }, 1000);
            });

            isARInitialized = true;
        }

        // Handle AR session end
        function onSessionEnded() {
            xrSession = null;
            xrHitTestSource = null;

            // Reset state
            isPlacementMode = true;

            // Clear placed models
            placedModels.forEach(model => {
                scene.remove(model);
            });
            placedModels = [];

            // Hide AR container
            arExperienceContainer.classList.add('hidden');

            // Stop rendering loop
            renderer.setAnimationLoop(null);

            isARInitialized = false;
        }

        // XR animation frame
        function onXRFrame(time, frame) {
            if (!xrSession || !xrReferenceSpace) return;

            const session = frame.session;
            const pose = frame.getViewerPose(xrReferenceSpace);

            if (pose) {
                // Update camera
                const view = pose.views[0];
                const viewport = session.renderState.baseLayer.getViewport(view);
                renderer.setViewport(viewport.x, viewport.y, viewport.width, viewport.height);

                // Update view and projection matrices
                camera.matrix.fromArray(view.transform.matrix);
                camera.projectionMatrix.fromArray(view.projectionMatrix);
                camera.updateMatrixWorld(true);

                // Update raycaster for controller
                raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);

                // Handle hit testing for placement
                if (isPlacementMode && xrHitTestSource) {
                    const hitTestResults = frame.getHitTestResults(xrHitTestSource);

                    if (hitTestResults.length > 0) {
                        const hit = hitTestResults[0];
                        const hitPose = hit.getPose(xrReferenceSpace);

                        // Update reticle position
                        reticle.visible = true;
                        reticle.matrix.fromArray(hitPose.transform.matrix);

                        // Update instructions if needed
                        if (arInstructionText.textContent !== "Tap to place industries") {
                            arInstructionText.textContent = "Tap to place industries";
                        }
                    } else {
                        reticle.visible = false;

                        // Update instructions if needed
                        if (arInstructionText.textContent !== "Move your device to find a surface") {
                            arInstructionText.textContent = "Move your device to find a surface";
                        }
                    }
                }

                // Check for model interactions
                if (!isPlacementMode) {
                    checkIndustryIntersection(controller);
                }

                // Animate placed models
                const elapsedTime = clock.getElapsedTime();
                placedModels.forEach(model => {
                    if (model.userData.animate) {
                        model.userData.animate(elapsedTime);
                    }
                });

                // Render the scene
                renderer.render(scene, camera);
            }
        }

        // Check if controller/touch is intersecting with an industry model
        function checkIndustryIntersection(controller) {
            // Use raycaster to check for intersections
            const tempMatrix = new THREE.Matrix4();
            tempMatrix.identity().extractRotation(controller.matrixWorld);

            raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
            raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

            const intersects = raycaster.intersectObjects(placedModels, true);

            if (intersects.length > 0) {
                // Find the first intersected object that has industry data
                let selectedObject = intersects[0].object;

                // Traverse up to find parent with industry data if needed
                while (selectedObject && !selectedObject.userData.industry) {
                    selectedObject = selectedObject.parent;
                }

                if (selectedObject && selectedObject.userData.industry) {
                    showIndustryInfo(selectedObject.userData.industry);
                }
            }
        }

        // Show industry information panel
        function showIndustryInfo(industry) {
            // Update industry info panel
            arIndustryTitle.textContent = industry.name;
            arIndustryDescription.textContent = industry.description;

            // Update tags
            if (industry.tags && industry.tags.length > 0) {
                arIndustryTag1.textContent = industry.tags[0] || '';
                arIndustryTag2.textContent = industry.tags[1] || '';
                arIndustryTag3.textContent = industry.tags[2] || '';

                // Show/hide tags based on availability
                arIndustryTag1.style.display = industry.tags[0] ? 'inline-block' : 'none';
                arIndustryTag2.style.display = industry.tags[1] ? 'inline-block' : 'none';
                arIndustryTag3.style.display = industry.tags[2] ? 'inline-block' : 'none';
            }

            // Update metric
            arIndustryMetric.textContent = industry.metric || '';

            // Show the panel
            arIndustryInfo.classList.remove('opacity-0');

            // Set up "Learn More" button
            arIndustryMore.onclick = () => {
                // In a real implementation, this would navigate to the industry page
                // For now, we'll just end the AR session
                if (xrSession) {
                    xrSession.end();
                }

                // Scroll to the industry section
                const industryElement = document.querySelector(`#industry-${industry.id}`);
                if (industryElement) {
                    industryElement.scrollIntoView({ behavior: 'smooth' });
                }
            };

            // Hide panel after 5 seconds
            setTimeout(() => {
                arIndustryInfo.classList.add('opacity-0');
            }, 5000);
        }

        // Exit AR experience
        function exitARExperience() {
            if (xrSession) {
                xrSession.end();
            }
        }

        // Initialize AR components
        function initAR() {
            // Check AR support
            checkARSupport();

            // Set up event listeners
            if (arExperienceButton) {
                arExperienceButton.addEventListener('click', startARSession);
            }

            if (arTutorialButton) {
                arTutorialButton.addEventListener('click', () => {
                    arTutorialModal.classList.remove('hidden');
                });
            }

            if (arTutorialClose) {
                arTutorialClose.addEventListener('click', () => {
                    arTutorialModal.classList.add('hidden');
                });
            }

            if (arTutorialStart) {
                arTutorialStart.addEventListener('click', () => {
                    arTutorialModal.classList.add('hidden');
                    startARSession();
                });
            }

            if (arExitButton) {
                arExitButton.addEventListener('click', exitARExperience);
            }

            // Close modal when clicking outside
            arTutorialModal.addEventListener('click', (e) => {
                if (e.target === arTutorialModal) {
                    arTutorialModal.classList.add('hidden');
                }
            });

            // Handle escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    arTutorialModal.classList.add('hidden');

                    if (xrSession) {
                        xrSession.end();
                    }
                }
            });
        }

        // Initialize when DOM is loaded
        document.addEventListener('DOMContentLoaded', initAR);

        // Fallback for browsers without WebXR
        function createFallbackExperience() {
            // This would implement a non-AR 3D experience using Three.js
            // For simplicity, we'll just show a message in this implementation
            console.log('WebXR not available - using fallback experience');
        }