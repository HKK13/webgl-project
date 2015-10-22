function Environment(scene) {
    this.renderer = new THREE.WebGLRenderer();

    this.initializeRenderer();
};

Environment.prototype.initializeRenderer = function() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
};
