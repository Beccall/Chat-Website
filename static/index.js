document.addEventListener("DOMContentLoaded", () => {
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    socket.on('connect', () => {
        let message = 'Welcome!';
        let name = localStorage.getItem('name');
        let current_room = localStorage.getItem('current_room');
        let home_button = document.getElementById("home");
        home_button.setAttribute('class', "nav-link active");

        //  List links for "favorite" channels
        if (localStorage.getItem('favorites')) {
            JSON.parse(localStorage.getItem("favorites") || "[]").forEach(favorite => {
                const li = document.createElement('li');
                li.setAttribute('class', 'nav-item');
                li.innerHTML = `<a class="nav-link" id="favorite_channel" href="/${favorite}">#${favorite}</a>`;
                document.getElementById('favorite_channels').append(li);

            });
        }
        ;

        //  If not user is clicked,will delete localStage, refresh to "/"
        document.querySelector('#not_user').onclick = () => {
            localStorage.removeItem('name');
            localStorage.removeItem('favorites');
            localStorage.removeItem('current_room')
            window.location.replace('/')
        };

        //  if there is a "current_room stored, will give link to go back
        if (localStorage.getItem('current_room')) {
            // window.location.href = current_room
            document.querySelector('#current_room').innerHTML = `  
                <a class="current_room" href= ${current_room} style="text-decoration: none"> Continue chatting in #${current_room.replace('/', '')}</a> `
        }
        ;

        //  if name is not in localStore, prompt for name, remove all other buttons/inputs
        if (!localStorage.getItem('name')) {
            message = 'Enter your name';
            document.getElementById('create_room').style.display = 'none';
            // document.getElementById('submit_chatroom').style.display = 'none';
            document.getElementById('not_user').style.display = 'none';
            document.getElementById('current_room').style.display = 'none';

            //  Name entered will be stored in localStorage. page refreshed
            document.querySelector('#enter_name').onclick = () => {
                const entered_name = document.querySelector('#name').value
                localStorage.setItem('name', entered_name);
                return true;
            };
            //  If name stored, will not prompt to enter name.
        } else {
            document.getElementById('enter_name').style.display = 'none';
            // document.getElementById('name').style.display = 'none';
            // document.getElementById('submit_name').style.display = 'none';
            message = `Hello, ${name}!`;
        }
        ;

        //  Welcome message
        document.querySelector('#welcome_message').innerHTML = `${message}`;

        //  On submit, room name sent to flask
        document.querySelector('#create_room').onsubmit = () => {
            //  Chatroom = value of the input of form #chatroom
            const chatroom = document.querySelector('#chatroom').value;
            socket.emit('submit chatroom', {'chatroom': chatroom});
            // Delete #error_message if there is one.
            if (document.getElementById("error_message")) {
                document.getElementById("error_message").remove();
            }
            //  Set input back to empty
            document.querySelector('#chatroom').value = '';
            return false;
        };

        //  redirect user to /chatroom
        socket.on('announce chatroom', data => {
            window.location.href = data.chatroom
        });

        //  create element to show error message from flask.
        socket.on('announce error', message => {
            const error = document.createElement('div');
            error.innerHTML = message;
            error.setAttribute('class', 'alert alert-danger');
            error.setAttribute('role', 'alert');
            error.setAttribute('id', 'error_message');
            document.querySelector('#heading').append(error);
        });
    });
});


