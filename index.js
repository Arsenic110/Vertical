const http = require('http');
const fs = require('fs');
const socketio = require('socket.io');

const server = http.createServer(requestListener);

const config = require('./config');
const io = socketio(server);

const Player = require('./server/player');

var debug = false;

var players = [];

init();

function init()
{

    io.on("connection", registerConnection);

    server.listen(debug ? config.server.debug : config.server.port, () =>
    {
        console.log(`Listening at ${config.server.hostname}:${debug ? config.server.debug : config.server.port}`);
    });
    update();
}

function requestListener(request, response)
{
    var furl = request.url;
    
    fs.readFile(__dirname + furl, (err, data) =>
    {
        console.log(__dirname + furl);
        response.writeHead(200, {'Content-Type': 'text'});
        response.end(data);
    });
}

function registerConnection(Socket)
{
    console.log("Connection registered, ID: " + Socket.id);

    Socket.on("register", (data) =>
    {
        console.log("Registering player: " + data.name);
        players.push(new Player(data.name, Socket.id));
        Socket.emit("register success", {id: Socket.id});
        var playerDebug = "Current Players:";
        for(let i = 0; i < players.length; i++)
        {
            playerDebug += "\n-" + players[i].name;
        }
        console.log(playerDebug);
    })

    Socket.on("update", (data) =>
    {
        //this'll happen a lot.
        for(let i = 0; i < players.length; i++)
        {
            if(players[i].id == Socket.id)
            {
                players[i].setPostion(data.x, data.y);
                //console.log("Updated player: " + players[i].name);
                break;
            }
        }
    });

    Socket.on("disconnect", () =>
    {
        console.log("Disconnected player: " + Socket.id);
        for(let i = 0; i < players.length; i++)
        {
            if(players[i].id == Socket.id)
            {
                players.splice(i, 1);
                break;
            }
        }
    });
}

function update()
{
    if(players)
        io.emit("update players", players);
    setTimeout(update, 5);
}

function translateUrl(furl)
{
    //console.log(furl);
    var turl = "/index.html";

    //TODO: Insert file validation logic here

    if(furl.includes("public") || furl.includes("content") || true)
        turl = "/public" + furl;

    if(furl == "/")
        turl = "/public/index.html";

    console.log("Translated url: " + turl);
    return turl;
}