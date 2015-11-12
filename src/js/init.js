var renderer, scene, camera, grid, user;
var horizon = 3000;
var planes = [], objects = [];
var coefficient = 0.1;

(function() {
    scene = new THREE.Scene(); //Create a THREE.JS Scene
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000); //Params: 1- Field Of View 2- Aspect Ratio(Always width/height) 3- near 4- far
    renderer = new THREE.WebGLRenderer({antialias: true}); //The real magic!
    renderer.setSize(window.innerWidth, window.innerHeight); //If used with 3rd param as false -> decreases resolution

    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setClearColor(0x00FFFF, 1);

    /** Append to DOM */
    document.body.appendChild(renderer.domElement);

    /** Set initial camera position */
    camera.position.z = 9;
    camera.position.x = 0;
    camera.position.y = 5;

    /** Initialize fog */
    scene.fog = new THREE.FogExp2( renderer.getClearColor(), 0.0005 );
})();
