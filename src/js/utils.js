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
    var geometry   = new THREE.SphereGeometry(0.5, 32, 32),
        material  = new THREE.MeshPhongMaterial();


    user = new THREE.Mesh(geometry, material);

    user.translateY(0.5);
    user.castShadow = true;
    user.receiveShadow = true;
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
        };

    generate();
    setInterval(generate, 7000);
};

/**
 * dd
 */
var collideObj = []
utils.generate.obstacles = function(){
    var rand = 7000;
    var interval;
    var mulConstant = 7000;
    setTimeout(10000);
    beginGenerate = function (){
        var mesh = utils.generate.shape();
        scene.add(mesh);
        collideObj.push(mesh);

        mulConstant = (mulConstant > 1500) ? mulConstant - 500 * coefficient : 1400;

        var rand = 800+Math.floor(Math.random() * mulConstant);
        clearInterval(interval);
        interval = setInterval(beginGenerate, rand);
        console.log(mulConstant);
    };
    beginGenerate();
};

var obstaclePos = [-3.5, 3.5];
var obstacleLen = [10, 8];
/**
 * Generates obstacle shapes.
 */
utils.generate.shape = function (){
    var length = obstacleLen[Math.floor(Math.random() * obstacleLen.length)],
        pos = 0,
        height = 4;

    if (length !== 10) {
        pos = obstaclePos[Math.floor(Math.random() * obstaclePos.length)];
        height = 8;
    }

    var geo = new THREE.BoxGeometry(length,height,0.5),
        material = new THREE.MeshPhongMaterial({
            map: (new THREE.TextureLoader()).load('./img/brick.jpg')
        }),
        mesh = new THREE.Mesh(geo, material);

    mesh.position.z = user.position.z - 40;
    mesh.position.x = pos;

    mesh.castShadow = true;
    mesh.receiveShadow = false;

    return mesh;
}

utils.get.collideableObjects = function (){
    return collideObj;
}

/**
 * Removes objects that user has passed. TODO: Does not remove all.
 */
utils.remove.passedObjects = function(){
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
        material = new THREE.MeshPhongMaterial();
    material.color.setRGB( Math.random(), Math.random(), Math.random() );

    var mesh = new THREE.Mesh( geometry, material );

    mesh.position.x = (( Math.random() - 0.5 ) * 1000) %30;
    mesh.position.x += (mesh.position.x > 0) ? 10 : -10;
    mesh.position.z = ((user.position.z - (( Math.random() - 0.5 ) * 1000) %100)) + (-100);
    mesh.updateMatrix();
    mesh.matrixAutoUpdate = false;
    mesh.castShadow = true;
    mesh.receiveShadow = false;
    return mesh;
};


/**
 * Add planes to scene.
 */
utils.add.planes = function() {
    var textureLoader = new THREE.TextureLoader();

    var grassMaterial = textureLoader.load('./img/grass.jpg');

    grassMaterial.wrapS = grassMaterial.wrapT = THREE.RepeatWrapping;
    grassMaterial.repeat.set(10, 50);

    var planeSegments = 500,
    plane = new THREE.Mesh(
        new THREE.PlaneGeometry(200, horizon, planeSegments, planeSegments),
        new THREE.ShaderMaterial( {
            uniforms: {
                time: { type: "f", value: 1.0 },
                resolution: { type: "v2", value: new THREE.Vector2() }
            },
            vertexShader: document.getElementById( 'vertexShader' ).textContent,
            fragmentShader: document.getElementById( 'fragment_shader' ).textContent
        })
    );

    plane.castShadow = false;
    plane.receiveShadow = true;
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
