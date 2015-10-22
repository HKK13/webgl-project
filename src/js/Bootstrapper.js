function Bootstrapper() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

    this.bindEvents();
};

/**
 * Bind necessary events.
 */
Bootstrapper.prototype.bindEvents = function() {
    var that = this;

    document.addEventListener('DOMContentLoaded', function() {
        that.environment = new Environment(that.scene);

        that.initializeCube();
    });
};


Bootstrapper.prototype.initializeCube = function() {
    var that = this;

    var geometry = new THREE.BoxGeometry(1, 1, 1),
        material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
        cube = new THREE.Mesh(geometry, material);

    this.scene.add(cube);
    this.camera.position.z = 5;

    var render = function () {
        requestAnimationFrame( render );

        cube.rotation.x += 0.1;
        cube.rotation.y += 0.1;

        that.environment.renderer.render(that.scene, that.camera);
    };

    render();
};
