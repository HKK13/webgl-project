var utils = {};
utils.generate = {};
utils.add = {}


/**
 * Generates a cube.
 * @returns {THREE.Mesh} Cube object
 */
utils.generate.user = function() {
    var geometry = new THREE.BoxGeometry(1,1,1),
        material = new THREE.MeshBasicMaterial({ color: 0x00ff00});

    user = new THREE.Mesh(geometry, material);

    user.translateY(1);
    scene.add(user);
    return user;
};


/**
 * Generates random objects every 7 seconds.
 */
utils.generate.randomObjects = function() {
    var mesh,
        generate = function() {
            for(var i = 0; i <20 ; i++){
                mesh = utils.generate.addObjects_();
                if((mesh.position.z < camera.position.z -70) && ((mesh.position.x < -5) || (mesh.position.x > 5))){
                    scene.add(mesh);
                }
            }
        };

    generate();
    setInterval(generate, 7000);
};


/**
 * Add objects and return the mesh.
 * @private
 *
 * @returns {THREE.Mesh}
 */
utils.generate.addObjects_ = function() {
    var geometry = new THREE.SphereGeometry( 5, 32,32 ),
        material = new THREE.MeshBasicMaterial( { shading: THREE.FlatShading } );
    material.color.setRGB( Math.random(), Math.random(), Math.random() );

    var mesh = new THREE.Mesh( geometry, material );

    mesh.position.x = (( Math.random() - 0.5 ) * 1000) %30;
    mesh.position.x += (mesh.position.x > 0) ? 10 : -10;
    mesh.position.z = ((camera.position.z - (( Math.random() - 0.5 ) * 1000) %100)) + (-100);
    mesh.updateMatrix();
    mesh.matrixAutoUpdate = false;

    return mesh;
};


/**
 * Add planes to scene.
 */
utils.add.planes = function() {
    var planeSegments = 500,
        plane = new THREE.Mesh(
            new THREE.PlaneGeometry(horizon, horizon, planeSegments, planeSegments),
            new THREE.MeshBasicMaterial({ color:0xEEDBA6, wireframe: true })
        );

    plane.rotation.x = Math.PI / 2;
    plane.position.y = 0;

    planes.push(plane);

    planes.push(plane.clone());
    planes[1].position.z = plane.position.z - horizon;

    planes.push(plane.clone());
    planes[2].position.z = plane.position.z - horizon * 2;

    for (var index in planes)
        scene.add(planes[index]);
};
