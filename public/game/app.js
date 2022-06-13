var registered = false;
var registerContainer = $("#registerer");
var playerNameInput = $("#player-name-input");

var socket, id;

var updateIndex = 0;

var players = [];

window.onload = init;

function init()
{
    //connect to the server
    var href = window.location.href.split("/")[0] + "//" + window.location.href.split("/")[1] + window.location.href.split("/")[2];
    socket = io.connect(href);

    socket.on("register success", (id) => 
    {
        console.log("Registered successfully! ID is: " + id.id);
        //ididid
        id = id.id;
        registerContainer.hide();
        registered = true;
    });

    socket.on("update players", (data) =>
    {
        //console.log("Updating players");
        players = data;
    });
}

function setup()
{
    createCanvas($(window).width() * 0.99, $(window).height() * 0.98);


}

function update()
{
    if(!registered)
        return;
    if(updateIndex < 1)
    {
        updateIndex++;
    }
    else 
    {
        updateIndex = 0;
        //send update to server
        socket.emit("update", {x: mouseX, y: mouseY, id: id});

        //if(players)
        //    console.log(players);
    }

}

function draw()
{
    //we separate our update and draw code.
    update();
    background(0, 150, 200, 255);

    //fill(255, 0, 0);
    //ellipse(mouseX, mouseY, 10);

    for(let i = 0; i < players.length; i++)
    {
        fill(players[i].color.r, players[i].color.g, players[i].color.b);
        ellipse(players[i].x, players[i].y, 10);

        text(players[i].name, players[i].x + 15, players[i].y);
    }
}

function registerPlayer()
{
    if(registered)
    {
        return;
    }

    var name = playerNameInput.val();

    if(name.length == 0)
    {
        alert("Please enter a name!");
        return;
    }
    console.log(name);


    //okay so here we just have to send a message to the server to register our player.
    socket.emit("register", {name: name, id: id});
}