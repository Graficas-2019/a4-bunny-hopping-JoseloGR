var renderer         = null, 
    scene            = null, 
    camera           = null,
    orbitControls    = null,
    root             = null,
    bunnyGroup       = null,
    bunny            = null,
    objLoader        = null,
    ambientLight     = null,
    directionalLight = null;

var animator      = null,
    animate       = null,
    duration      = 10, // sec
    loopAnimation = true;

function createScene(canvas) {    
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Create a new Three.js scene
    scene = new THREE.Scene();

    scene.background = new THREE.Color( 0.2, 0.2, 0.2 );

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 400 );
    camera.position.set(0, 0, 5);
    scene.add(camera);

    // element that is included in the camera to indicate the point of focus where it will rotate
    orbitControls = new THREE.OrbitControls(camera, renderer.domElement); 

    // Create a group to hold all the objects
    root = new THREE.Object3D;

    ambientLight = new THREE.AmbientLight ( 0xffffff);
    root.add(ambientLight);

    // Add a directional light to show off the object
    directionalLight = new THREE.DirectionalLight( 0xffffff, 1);
    // Create and add all the lights
    directionalLight.position.set(0, 1, 2);
    root.add(directionalLight);

    // Create a group to hold the objects
    bunnyGroup = new THREE.Object3D;
    root.add(bunnyGroup);

    loadObj();
    scene.add(root);
    
    setTimeout(() => {
        animate = !animate;
        playAnimations();
    }, 2000);
}

function playAnimations(){
    if(animator) {
        animator.stop();
    }

    bunnyGroup.position.set(0, 0, 0);
    bunnyGroup.rotation.set(0, 0, 0);

    if (animate) {
        animator = new KF.KeyFrameAnimator;
        animator.init({
            interps:
                [
                    { 
                        keys: [0, 0.0625, 0.125, 0.1875, 0.25, 0.3125, 0.375, 0.4375, 0.5, 0.5625, 0.625, 0.6875, 0.75, 0.8125, 0.875, 0.9375, 1],
                        values: [
                            {x: 0,     y: 0, z: 0    },
                            {x: -1.0,  y: 1, z: -1.0 },
                            {x: -2.0,  y: 0, z: -2.0 },
                            {x: -3.0,  y: 1, z: -1.0 },
                            {x: -4.0,  y: 0, z: 0.0  },
                            {x: -3.0,  y: 1, z: 1.0  },
                            {x: -2.0,  y: 0, z: 2.0  },
                            {x: -1.0,  y: 1, z: 1.0  },
                            {x: 0.0,   y: 0, z: 0.0  },
                            {x: 1.0,   y: 1, z: -1.0 },
                            {x: 2.0,   y: 0, z: -2.0 },
                            {x: 3.0,   y: 1, z: -1.0 },
                            {x: 4.0,   y: 0, z: 0.0  },
                            {x: 3.0,   y: 1, z: 1.0  },
                            {x: 2.0,   y: 0, z: 2.0  },
                            {x: 1.0,   y: 1, z: 1.0  },
                            {x: 0.0,   y: 0, z: 0.0  },
                        ],
                        target: bunnyGroup.position
                    },
                    {
                        keys: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1],
                        values: [
                            {y: 0              },
                            {y: Math.PI/2      },
                            {y: Math.PI        },
                            {y: 3 * Math.PI/2  },
                            {y: 2 * Math.PI    },
                            {y: 3 * Math.PI/2  },                
                            {y: Math.PI        },
                            {y: Math.PI/2      },
                            {y: 0              },
                        ],
                        target: bunnyGroup.rotation
                    }
                ],
            loop: loopAnimation,
            duration: duration * 1000,
            easing: TWEEN.Easing.Quartic.InOut,
        });
        animator.start();
    }
}

function run() {
    requestAnimationFrame(function() { run(); });

    // Render the scene
    renderer.render( scene, camera );

    // Update the animations
    KF.update();

    // Update the camera controller
    orbitControls.update();
}

function loadObj(){
    if(!objLoader)
        objLoader = new THREE.OBJLoader();
    
    objLoader.load(
        'Stanford_Bunny/UVUnwrapped_Stanford_Bunny.obj',

        function(object){
            var texture = new THREE.TextureLoader().load('Stanford_Bunny/UVmapping3072_g005c.jpg');
            var normalMap = new THREE.TextureLoader().load('Stanford_Bunny/UVmapping3072_TerraCotta_g001c.jpg');
            // var specularMap = new THREE.TextureLoader().load('../models/cerberus/Cerberus_M.jpg');

            object.traverse( function ( child ) {
                if ( child instanceof THREE.Mesh ) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.material.map = texture;
                    child.material.normalMap = normalMap;
                    // child.material.specularMap = specularMap;
                }
            });
                    
            bunny = object;
            bunny.scale.set(2, 2, 2);
            bunnyGroup.add(bunny);
        },
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        // called when loading has errors
        function ( error ) {
            console.log( 'An error happened' );
        });
}