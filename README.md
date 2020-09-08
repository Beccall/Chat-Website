# Project 2
Web Programming with Python and JavaScript
##

## Project Description
Website for online messaging. Users can send and receive messages in real time.
Users can also create new channels and can add specific channels to their favorite list.

## Files

### application.py
main python file, uses flask to create web routes. Stores up to 100 messages per chatroom in list called list_of_chats.

### requirements.txt
List of plugins required to run application.py

### templates/layout.html
Basic layout that extends to all html files. Includes nav bar and nav column. 

### templates/index.html
Home Page     
route: `/`

User can create username, chatroom and access list of chat rooms from this route.

### templates/chat.html
Chat Room  
route: `/<chat_room>`  

User can send/receive chats. They can access other chat rooms or set current chat room to a favorite. 

### static/index.js  
Home Page Javascript for templates/index.html

### static/chat.js
Home Page Javascript for templates/chat.html

## personal touch
My personal touch for the project is a favorites list. User can favorite/unfavorite chat rooms. These rooms will append to a list on the nav column so user will not have to utilize the dropdown menu to access them.. 

