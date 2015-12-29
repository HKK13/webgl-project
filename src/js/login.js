var gameEnded = false;
var rooms, currentUserPoint = 0, roomName;

$('#singlePlayerButton').on('click', function() {
    startGame(false);
});

socket.on('getRooms', function(received) {
    rooms = received;

    var roomsField = $('.field.rooms')[0];

    var template = '<div class="ui selection dropdown">' +
    '<input type="hidden" name="roomName" id="roomName">' +
    '<i class="dropdown icon"></i>' +
    '<div class="default text">Select A Room</div>' +
    '<div class="menu">';

    rooms.forEach(function(room) {
        template += '<div class="item" data-value="' + room.name+ '">' + room.name + '</div>';
    });

    template +='</div>' +
    '</div>';

    roomsField.innerHTML += template;

    $('.ui.dropdown').dropdown();

    var modalElem= $('.small.modal.multiplayer').modal('setting', {
        closable  : true,
        onDeny    : function() {
            return true;
        },
        onApprove : function() {
            var username = $('#username')[0].value;
            if (!username) return alert('Please enter a username');

            roomName = $('#roomName')[0].value;

            socket.emit('joinRoom', roomName);

            setTimeout(function() {
                setMessageLoadingSpinner('Loading game...');
                toggleLoadingSpinner();
            }, 1000);

            return true;
        }
    });

    modalElem.modal('show');
})

$('#joinButton').on('click', function() {
    $('.header.modal.title')[0].innerHTML = 'Join Multiplayer';
    var roomsField = $('.field.rooms')[0];

    roomsField.innerHTML = '<label>Rooms</label>';

    socket.emit('queryRooms');
});

socket.on('gameStarted', function() {
    toggleLoadingSpinner();
    startGame(true);
});

socket.on('gameEnded', function(rivalsPoint) {
    gameEnded = true;
    console.log('Game ended', rivalsPoint);
    console.log('My point', currentUserPoint);
    if (!gameEnded) {
        alert('Wow, you win!');
    } else if (rivalsPoint > currentUserPoint) {
        alert('You lose!');
    } else {
        alert('You win!');
    }
});

$('#createButton').on('click', function() {
    $('.header.modal.title')[0].innerHTML = 'Create Multiplayer';

    $('.field.rooms')[0].innerHTML = '';

    var modalElem= $('.small.modal.multiplayer').modal('setting', {
        closable  : true,
        onDeny    : function() {
            return true;
        },
        onApprove : function() {
            var username = $('#username')[0].value;
            if (!username) return alert('Please enter a username');

            socket.emit('createRoom', username);

            setTimeout(function() {
                setMessageLoadingSpinner('Waiting for another user');
                toggleLoadingSpinner();
            }, 1000);

            return true;
        }
    });

    modalElem.modal('show');
});

var toggleLoadingSpinner = function() {
    $('.loadingSpinner').toggleClass('active');
    $('.loaderBar').toggleClass('showLoaderBar');
};

var setMessageLoadingSpinner = function(msg) {
    $('.loadingText')[0].innerHTML = msg || 'Loading';
};

var startGame = function(isMultiplayer) {
    toggleLoadingSpinner();

    init();

    if(isMultiplayer)
    utils.generate.opponent(); // TODO: Don't forget this.

    var textBoxObject = document.getElementById('textBox'),
    startTime = null;

    /* Generate user. */
    utils.generate.user();

    var gameStarted = false;
    utils.generate.randomObjects();
    var clock = new THREE.Clock();
    utils.add.planes();

    socket.on('positionUpdated', function(coordinates){
        opponent.position.x = coordinates.x;
        opponent.position.y = coordinates.y;
        opponent.position.z = coordinates.z;
    });

    function render(time){ //Refresh 60 times per second.
        if (gameEnded) return;

        var delta = clock.getDelta();

        uniforms1.time.value += delta * 5;

        renderer.render(scene, camera);

        if (!gameStarted) {
            toggleLoadingSpinner();
            gameStarted = true;
        }

        if(roomName){
            socket.emit('positionUpdate', {
                x: user.position.x,
                y: user.position.y,
                z: user.position.z
            });
        }

        TWEEN.update(time);

        if (coefficient  <= 0.2)
        coefficient += 0.0001;

        user.position.z -= coefficient;
        socket.emit('positionUpdate', user.position);
        directionalLight.position.z = user.position.z+100;
        camera.position.z = user.position.z + 9;
        user.rotateX(-1 * coefficient);


        requestAnimationFrame(render);
        currentUserPoint = Date.now() - startTime;

        for (var vertexIndex = 0; vertexIndex < user.geometry.vertices.length; vertexIndex++){		//view-source:https://stemkoski.github.io/Three.js/Collision-Detection.html
            var localVertex = user.geometry.vertices[vertexIndex].clone();
            var globalVertex = localVertex.applyMatrix4( user.matrix );
            var directionVector = globalVertex.sub( user.position );

            var ray = new THREE.Raycaster( user.position.clone(), directionVector.clone().normalize() );
            var collisionResults = ray.intersectObjects( utils.get.collideableObjects() );

            if( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() )  {
                if (!gameEnded) {
                    gameEnded = true;
                    currentUserPoint = Date.now() - startTime;

                    socket.emit('gameShouldEnd', currentUserPoint);
                    console.log('currentUserPoint', currentUserPoint);
                }
            }
        }
    }

    var count = 3,
    counter = setInterval(function() {
        if (count == 0) {
            render();
            utils.generate.obstacles();
            startTime = Date.now();
            return clearInterval(counter);
        }
        setMessageLoadingSpinner('Game is starting in ' + count + ' seconds...');

        count--;
    }, 1000);
}
