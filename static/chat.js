let name = localStorage.getItem('name')
let pathname = window.location.pathname


document.addEventListener("DOMContentLoaded", () => {
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    localStorage.setItem('current_room', pathname)

    socket.on('connect', () => {
        document.querySelector('#chatroom_name').innerHTML = pathname.replace('/', '');

        socket.emit('user entered');

        socket.on('announce connected', data => {

            JSON.parse(data.list_of_chats).forEach(chat => {
                const li = document.createElement('li');
                if (chat.pathname === pathname) {
                    li.innerHTML = ` ${chat.timestamp}> ${chat.name}: ${chat.chat}, ${chat.pathname}`;
                    document.querySelector('#chats').append(li);
                }
            })

            document.querySelector('#enter_chat').onsubmit = () => {
                const chats = document.querySelector('#chat').value;
                const timestamp = new Date();
                socket.emit('submit chat', {
                    'chats': chats,
                    'name': name,
                    'pathname': pathname,
                    'timestamp': timestamp
                });
                document.querySelector('#chat').value = '';
                return false;
            };

        })

    });

    socket.on('announce chat', data => {
        const li = document.createElement('li');
        if (data.pathname === pathname) {
            li.innerHTML = `${data.timestamp} > ${data.name}: ${data.chats}, ${data.pathname}`;
            document.querySelector('#chats').append(li);
        }
    });
});



