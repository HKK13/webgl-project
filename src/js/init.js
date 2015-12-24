var renderer, scene, camera, grid, user;
var horizon = 3000;
var planes = [], objects = [];
var coefficient = 0.1,
    directionalLight;

function init() {
    scene = new THREE.Scene(); //Create a THREE.JS Scene
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000); //Params: 1- Field Of View 2- Aspect Ratio(Always width/height) 3- near 4- far
    renderer = new THREE.WebGLRenderer({antialias: true}); //The real magic!
    renderer.setSize(window.innerWidth, window.innerHeight); //If used with 3rd param as false -> decreases resolution

    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setClearColor(0x00FFFF, 1);
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;

    /** Append to DOM */
    document.body.appendChild(renderer.domElement);

    /** Set initial camera position */
    camera.position.z = 9;
    camera.position.x = 0;
    camera.position.y = 5;

    /** Initialize fog */
    scene.fog = new THREE.FogExp2( renderer.getClearColor(), 0.0005 );


    //Lightning
    //TODO WTF SHADOW!?
    directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    directionalLight.position.set( 100, 100, 0 );
    directionalLight.castShadow = true;
    directionalLight.shadowDarkness = 0.5;
    directionalLight.shadowCameraRight     =  5;
    directionalLight.shadowCameraLeft     = -5;
    directionalLight.shadowCameraTop      =  5;
    directionalLight.shadowCameraBottom   = -5;
    directionalLight.shadowCameraNear = true;

    scene.add( directionalLight );

    var light = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( light );
};
