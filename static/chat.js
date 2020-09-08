let name = localStorage.getItem('name')
let pathname = window.location.pathname
let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

//  Creates chatbox.
function add_chat(chat) {
    const li = document.createElement('li');
    const div = document.createElement('div');
    const p = document.createElement('p')
    const span_name = document.createElement('span');
    const span_time = document.createElement('span');
    const br = document.createElement('br')

    //  If stored name is on chat, set items user-, name will not be shown.
    if (chat.name === name) {
        span_time.innerHTML = `${chat.timestamp}`
        p.innerHTML = chat.chat;
        // li.setAttribute('id', 'user-chatbox')
        div.setAttribute('id', 'user-container')
        p.setAttribute('id', 'user-text')
        span_time.setAttribute('id', 'user-time')
        li.append(span_time)
    //  If stored name is not on chat, set items other-, name will be shown.
    } else {
        span_name.innerHTML = chat.name
        span_time.innerHTML = `, ${chat.timestamp}`
        p.innerHTML = chat.chat;
        // li.setAttribute('id', 'other-chatbox')
        div.setAttribute('id', 'other-container')
        p.setAttribute('id', 'other-text')
        span_name.setAttribute('id', 'other-name')
        span_time.setAttribute('id', 'other-time')
        li.append(span_name);
        li.append(span_time)
    };
    li.append(br);
    div.append(p);
    li.append(div);
    // Add new li chat to ul #chats
    document.querySelector('#chats').append(li);
    // everytime chat is entered, scroll to bottom of screen
    window.scrollTo(0, document.body.scrollHeight);
}

document.addEventListener("DOMContentLoaded", () => {
    let favorite_button = document.getElementById('favorite');
    let unfavorite_button = document.getElementById('unfavorite');

    //  if pathname is in favorite list, disable and hide favorite_button
    if (favorites.includes(pathname.replace('/', '')) === true) {
        favorite_button.disabled = true;
        unfavorite_button.disabled = false;
        favorite_button.style.display = 'none';
    //  pathname is not in favorite list, disable and hide unfavorite_button
    } else {
        favorite_button.disabled = false;
        unfavorite_button.disabled = true;
        unfavorite_button.style.display = 'none';
    };

    //  For each stored favorite channel, created li with link for channel
    JSON.parse(localStorage.getItem("favorites") || "[]").forEach(favorite => {
        const li = document.createElement('li');
        li.setAttribute('class', 'nav-item');
        li.innerHTML = `<a class="nav-link" id="favorite_channel" href="/${favorite}">#${favorite}</a>`;
        document.getElementById('favorite_channels').append(li);

    });

    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    //  localstorage current_room to pathname
    localStorage.setItem('current_room', pathname)

    socket.on('connect', () => {
        //Make nav chatroom name
        document.querySelector('#chatroom_name').innerHTML = `#${pathname.replace('/', '')}`;

        socket.emit('user entered');

        socket.on('announce connected', data => {
            //for each chat, enter into function add_chat
            JSON.parse(data.list_of_chats).forEach(chat => {
                if (chat.pathname === pathname) add_chat(chat)
            });

            //When user hits submit, chat is sent to application.
            document.querySelector('#enter_chat').onsubmit = () => {
                const chat = document.querySelector('#chat').value;
                const timestamp = new Date().toUTCString();
                socket.emit('submit chat', {
                    'chat': chat,
                    'name': name,
                    'pathname': pathname,
                    'timestamp': timestamp
                });
                document.querySelector('#chat').value = '';
                return false;
            };

            //  delete current chatroom from favorites, refresh page
            document.querySelector('#unfavorite').onclick = () => {
                for (var i = 0; i < favorites.length; i++) {
                    if (favorites[i] === pathname.replace('/', '')) {
                        favorites.splice(i, 1);
                        i--;
                    };
                };
                localStorage.setItem('favorites', JSON.stringify(favorites));
                window.location.href = localStorage.getItem('current_room');
            };

            //  set chatroom to favorite, disable and hide unfavorite_button
            document.querySelector('#favorite').onclick = () => {
                favorites.push(pathname.replace('/', ''));
                localStorage.setItem('favorites', JSON.stringify(favorites));
                const li = document.createElement('li');
                li.setAttribute('class', 'nav-item');
                li.setAttribute('id', `${pathname}`);
                li.innerHTML = `<a class="nav-link" id="favorite_channel" href="${pathname}">#${pathname.replace('/', '')}</a>`;
                document.getElementById('favorite_channels').append(li);
                favorite_button = document.getElementById('favorite');
                unfavorite_button = document.getElementById('unfavorite');
                favorite_button.disabled = true;
                unfavorite_button.disabled = false;
                favorite_button.style.display = 'none';
                unfavorite_button.style.display = 'block';
            };
        });

    })
    //once chat is entered, send it through function add_chat
    socket.on('announce chat', data => {
        const li = document.createElement('li');
        if (data.pathname === pathname) add_chat(data)
    });
});






