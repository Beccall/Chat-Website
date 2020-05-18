document.addEventListener("DOMContentLoaded", () => {
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    socket.on('connect', () => {

        let message = 'Welcome!';
        let name = localStorage.getItem('name')
        let current_room = localStorage.getItem('current_room')

        document.querySelector('#not_user').onclick = () => {
            localStorage.removeItem('name');
            localStorage.removeItem('current_room')
            window.location.replace('/')
        }
        if (localStorage.getItem('current_room')) {
            // window.location.href = current_room
            document.querySelector('#current_room').innerHTML = `Continue in previous chat room:
                <a href= ${current_room} style="text-decoration: none">${current_room.replace('/', '')}</a> `
        }

        if (!localStorage.getItem('name')) {
            message = 'Welcome!!! Enter your name';
            document.getElementById('chatroom').style.display = 'none';
            document.getElementById('chatrooms').style.display = 'none';
            document.getElementById('create_room').style.display = 'none';
            document.getElementById('submit_chatroom').style.display = 'none';
            document.getElementById('not_user').style.display = 'none';
            document.getElementById('current_room').style.display = 'none';


            document.querySelector('#enter_name').onclick = () => {
                const entered_name = document.querySelector('#name').value
                localStorage.setItem('name', entered_name);
                return true;
            };

        } else {
            document.getElementById('enter_name').style.display = 'none';
            document.getElementById('name').style.display = 'none';
            document.getElementById('enter_name').style.display = 'none';

            message = `Hello, ${name}!`;
        }


        document.querySelector('#enter_message').innerHTML = `${message}`;
        socket.emit('user connected');

        socket.on('announce rooms', data => {
            JSON.parse(data.list_of_rooms).forEach(room => {
                const li = document.createElement('li');
                li.innerHTML = `<a href= ${room.chatroom} style="text-decoration: none">${room.chatroom}</a>`;
                document.querySelector('#chatrooms').append(li);
            });
        });

        document.querySelector('#create_room').onsubmit = () => {
            const chatroom = document.querySelector('#chatroom').value;
            socket.emit('submit chatroom', {'chatroom': chatroom});
            document.querySelector('#chatroom').value = '';
            return false;
        };

        socket.on('announce chatroom', data => {
            document.querySelector('#error_message').innerHTML = `You created ${data.chatroom}! To start chatting <a href= ${data.chatroom} style="text-decoration: none">Click Here</a> `
            const li = document.createElement('li');
            li.innerHTML = `<a href= ${data.chatroom} style="text-decoration: none">${data.chatroom}</a>`;
            document.querySelector('#chatrooms').append(li);
        });

        socket.on('announce error', message => {
            document.querySelector('#error_message').innerHTML = message;
        });

    });

});


