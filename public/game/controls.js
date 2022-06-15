class Control
{
    constructor()
    {
        this.transform = createVector(10, 10);
        this.scaleFactor = 1;
        this.scale = (1 / this.scaleFactor);

        this.test = false;
        this.speed = 5;
        this.speedBase = 5;
        this.keys = 
        [
            87, //w
            83, //s
            68, //a
            65, //d
            32, //space
            67, //c

        ];

        this.trArray = [];
    }

    update()
    {
        this.scale = (1 / this.scaleFactor);
        mouse = createVector(mouseX, mouseY);
        mouseWorld = this.transformToWorld(createVector(mouseX - window.width / 2, mouseY - window.height / 2));
        this.speed = this.scale * this.speedBase;

        //move if key down
        if(this.trArray[0])
        {//w
            this.transform.y -= this.speed;
        }
        if(this.trArray[1])
        {//s
            this.transform.y += this.speed;
            
        }
        if(this.trArray[2])
        {//a
            this.transform.x += this.speed;
            
        }
        if(this.trArray[3])
        {//d
            this.transform.x -= this.speed;
            
        }
        if(this.trArray[5])
        {//c

        }
    }

    draw()
    {
        this.performTransform();
    }

    performTransform()
    {

        //make scale around center - needs to be constant
        translate(window.width / 2, window.height / 2);
        scale(this.scaleFactor);

        translate(-this.transform.x, -this.transform.y);
    }

    panTo(c)
    {
        this.transform = c;
    }

    transformToWorld(c)
    {
        let nx = this.transform.x + c.x * this.scale,
            ny = this.transform.y + c.y * this.scale;
        return createVector(nx, ny);
    }

    transformToScreen(c)
    {
        let nx = (c.x - this.transform.x) / this.scale,
            ny = (c.y - this.transform.y) / this.scale;
        return createVector(nx, ny);
    }

    keyPressed(keyCode)
    {
        for(let i = 0; i < this.keys.length; i++)
        {//main update loop
            if(keyCode == this.keys[i])
                this.trArray[i] = true;
        }

        //pause if spacebar hit
        if(keyCode == 32)
        {//spessbar
            simulate = !simulate;
        }

        
        //print coords if C hit
        if(keyCode == 67)
        {//C

        }
        if(keyCode == 61)
        {// possibly =

        }

        if(keyCode == 18)
        {
            //alt

        }
        if(keyCode == 17)
        {
            //ctrl

        }

    }

    keyReleased(keyCode)
    {
        for(let i = 0; i < this.keys.length; i++)
        {
            if(keyCode == this.keys[i])
                this.trArray[i] = false;
        }

        if(keyCode == 18)
        {
            //alt
            progressBar = false;
        }
        if(keyCode == 17)
        {
            //ctrl
            debugDraw = false;
        }
    }

    mouseWheel(e)
    {
        if(e.delta < 0)
            this.applyScale(1.1);
        else
            this.applyScale(0.9);
    }

    applyScale(s) 
    {
        this.scaleFactor = this.scaleFactor * s;


        //mouseX and Y used for zooming into the mouse location
        //this.transform.x = mouseX * (1-s) + this.transform.x * s;
        //this.transform.y = mouseY * (1-s) + this.transform.y * s;

        //this SORTA worked
        //this.transform.x += mouseX / s;
        //this.transform.y += mouseY / s;

        //this.transform.x -= mouseWorld.x;
        //this.transform.y -= mouseWorld.y;
    }

    mouseDragged() 
    {
        if(mouseButton != "center")
            return;
        ui.setSelect(undefined);
        //drag transformation
        this.transform.x -= (mouseX - pmouseX) * this.scale;
        this.transform.y -= (mouseY - pmouseY) * this.scale;
    }

    mouseClicked()
    {

    }

    isMouseInside(x, y, w, h, mx, my)
    {
        if(mx > x && mx < x + w && my > y && my < y + h)
        {
            return true; 
        } 
        return false; 
    }
}