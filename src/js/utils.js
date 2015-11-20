var utils = {};
utils.generate = {};
utils.add = {}
utils.remove = {};
utils.get = {};


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
var objectArr = [];
utils.generate.randomObjects = function() {
    var mesh,
        generate = function() {
            utils.remove.passedObjects();
            for(var i = 0; i <12 ; i++){
                mesh = utils.generate.addObjects_();
                if((mesh.position.z < camera.position.z -70) && ((mesh.position.x < -5) || (mesh.position.x > 5))){
                    scene.add(mesh);
                    objectArr.push(mesh);
                }
            }
            utils.generate.obstacles();
        };
    
    generate();
    setInterval(generate, 7000);
};

/**
 * dd
 */
var collideObj = []
utils.generate.obstacles = function(){
        var geo = new THREE.BoxGeometry(10,4,1),
                material = new THREE.MeshBasicMaterial({shading: THREE.FlatShading});
        material.color.setRGB(0xffffff);
       
        var mesh = new THREE.Mesh(geo, material);
        mesh.position.z = user.position.z -30;
        scene.add(mesh);
        collideObj.push(mesh);
};

utils.get.collideableObjects = function (){
    return collideObj;
}

/**
 * Removes objects that user has passed. TODO: Does not remove all.
 */
utils.remove.passedObjects = function(){
    console.log(objectArr.length);
    for(var i = 0; i < objectArr.length; i++){
        obj = objectArr[i];
        if(obj.position.z > user.position.z){
            scene.remove(obj);
            objectArr.shift(obj);
        }
    }
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
    mesh.position.z = ((user.position.z - (( Math.random() - 0.5 ) * 1000) %100)) + (-100);
    mesh.updateMatrix();
    mesh.matrixAutoUpdate = false;

    return mesh;
};


/**
 * Add planes to scene.
 */
utils.add.planes = function() {
    var planeSegments = 50,
        plane = new THREE.Mesh(
            new THREE.PlaneGeometry(horizon, horizon, planeSegments, planeSegments),
            new THREE.MeshBasicMaterial({ color:0x000000, wireframe: false })
        );

    plane.rotation.x = -Math.PI / 2;
    plane.position.y = 0;

    planes.push(plane);

    planes.push(plane.clone());
    planes[1].position.z = plane.position.z - horizon;

    planes.push(plane.clone());
    planes[2].position.z = plane.position.z - horizon * 2;

    for (var index in planes)
        scene.add(planes[index]);
};
