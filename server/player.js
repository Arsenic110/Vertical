
class Player
{
    constructor(name, id)
    {
        this.name = name;
        this.id = id;
        this.x = 0;
        this.y = 0;
        this.color = { r:Math.random(255), g:Math.random(255), b:Math.random(255) };
    }

    setPostion(x, y)
    {
        this.x = x;
        this.y = y;
    }
}

module.exports = Player;