$('#singlePlayerButton').on('click', function() {
    startGame();
});


var startGame = function() {
    init();

    var textBoxObject = document.getElementById('textBox'),
    startTime = null;

    /* Generate user. */
    utils.generate.user();

    var gameEnded = false;

    //textBoxObject.innerHTML = 'Game is starting in 3 seconds...';

    utils.generate.randomObjects();

    utils.add.planes();

    function render(time){ //Refresh 60 times per second.
        if (gameEnded) return;

        renderer.render(scene, camera);

        TWEEN.update(time);

        if (coefficient  <= 0.2)
        coefficient += 0.0001;

        directionalLight.x -= coefficient * 10;
        user.position.z -= coefficient;
        directionalLight.position.z = user.position.z+100;
        camera.position.z = user.position.z + 9;

        requestAnimationFrame(render);

        for (var vertexIndex = 0; vertexIndex < user.geometry.vertices.length; vertexIndex++){		//view-source:https://stemkoski.github.io/Three.js/Collision-Detection.html
            var localVertex = user.geometry.vertices[vertexIndex].clone();
            var globalVertex = localVertex.applyMatrix4( user.matrix );
            var directionVector = globalVertex.sub( user.position );

            var ray = new THREE.Raycaster( user.position.clone(), directionVector.clone().normalize() );
            var collisionResults = ray.intersectObjects( utils.get.collideableObjects() );

            if( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() )  {
                gameEnded = true;
                textBoxObject.innerHTML = 'Sorry. Your point is: ' + (Date.now() - startTime);

                setTimeout(function() {
                    document.getElementsByClassName('container')[0].style.display = 'none';

                    setTimeout(function() {
                        location.reload();
                    }, 3000);
                }, 2000);
            }
        }
    }

    var count = 3,
    counter = setInterval(function() {
        if (count == 0) {
            render();
            utils.generate.obstacles();
            startTime = Date.now();
            //textBoxObject.innerHTML = 'Good luck!';
            return clearInterval(counter);
        }
        count--;
        //textBoxObject.innerHTML = 'Game is starting in ' + count + ' seconds...';
    }, 1000);
}
