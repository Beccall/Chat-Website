import os

from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit
import json

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

list_of_chats = []
list_of_rooms = []
rooms = []


@app.route("/")
def index():
    return render_template("index.html", list_of_rooms=list_of_rooms)


@app.route("/<chat_room>")
def chat_room(chat_room):
    return render_template("chat.html", list_of_rooms=list_of_rooms, chat_room=chat_room)


@socketio.on("user entered")
def connected():
    emit("announce connected", {"list_of_rooms": json.dumps(list_of_rooms), "list_of_chats": json.dumps(list_of_chats)},
         broadcast=False)


@socketio.on("submit chat")
def chat(data):
    chat = data["chat"]
    name = data["name"]
    pathname = data["pathname"]
    timestamp = data["timestamp"]
    dct = {}
    for i in list_of_chats:
        for key in i:
            dct['%s' % i[key]] = []
    for key in dct:
        for i in range(len(list_of_chats)):
            if str(list_of_chats[i]['pathname']) == key:
                dct[key].append(list_of_chats[i])
        if len(dct[key]) > 99:
            list_of_chats.remove(dct[key][0])

    list_of_chats.append({"chat": chat, "name": name, "pathname": pathname, "timestamp": timestamp})
    emit("announce chat", {"chat": chat, "name": name, "pathname": pathname, "timestamp": timestamp}, broadcast=True)


@socketio.on("submit chatroom")
def chatroom(data):
    chatroom = data["chatroom"].lower()
    if " " in chatroom:
        message = "Room name cannot contain a space"
        emit("announce error", message, broadcast=False)
    elif len(chatroom) > 15:
        message = "Room name must be 15 characters or less"
        emit("announce error", message, broadcast=False)
    elif chatroom in rooms:
        message = f"{chatroom} already exists! please enter a new name."
        emit("announce error", message, broadcast=False)
    else:
        rooms.append(chatroom)
        list_of_rooms.append({"chatroom": chatroom})
        emit("announce chatroom", {"chatroom": chatroom}, broadcast=True)

