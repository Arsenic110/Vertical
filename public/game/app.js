var registered = false;
var registerContainer = $("#registerer");
var playerNameInput = $("#player-name-input");

var socket, id, windowWidth, windowHeight;

var updateIndex = 0;

var players = [];
var shipTexture;

var playerX, playerY, mouse, mouseWorld;

var control;

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

function preload()
{
    shipTexture = loadImage("/public/content/star-queen.png");
}

function setup()
{
    windowWidth = $(window).width() * 0.99;
    windowHeight = $(window).height() * 0.98;

    createCanvas(windowWidth, windowHeight);
    control = new Control();

}

function update()
{
    if(!registered)
        return;

    control.update();
    //update the player's position



    if(updateIndex < 0)
    {
        updateIndex++;
    }
    else 
    {
        updateIndex = 0;
        //send update to server

        var dat = control.transformToWorld(createVector(0, 0));
        
        socket.emit("update", {x: dat.x, y: dat.y, id: id});

        //if(players)
        //    console.log(players[0].color);
    }

}

function draw()
{
    //we separate our update and draw code.
    update();
    background(0, 150, 200, 255);

    control.draw();

    ellipse(0, 0, 10);

    //fill(255, 0, 0);
    //ellipse(mouseX, mouseY, 10);

    for(let i = 0; i < players.length; i++)
    {
        image(shipTexture, players[i].x - 60, players[i].y - 150);
        fill(players[i].color.r, players[i].color.g, players[i].color.b);


        text(players[i].name, players[i].x + 25, players[i].y);
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

function keyPressed()
{
    control.keyPressed(keyCode);
    //return false;
}
function keyReleased()
{
    control.keyReleased(keyCode);
    return false;
}
function mouseWheel(e)
{
    control.mouseWheel(e);
    
    return {passive:false};
}
function mouseClicked()
{
    control.mouseClicked();
}
function mouseDragged() 
{
    control.mouseDragged();
    return false;
}