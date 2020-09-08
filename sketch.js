let mu  = 0.05
let mBall = 0.17

var resolution = [1920, 1080];
var walls = [];
var balls = [];

let ballYellow;
let ballBlue;
let ballRed;
let ballPurple;
let ballOrange;
let ballGreen;
let ballDarkRed;
let ballBlack;
let ballWhite;

let frameTime;

let ballDiameter =  0.025656;
let ballRadius = ballDiameter / 2;

let xHeightDifference = Math.cos(Math.PI/6)*ballDiameter
let yHeightDifference = Math.sin(Math.PI/6)*ballDiameter

let startCoordinates = [[0.75, 0.25], [0.75 + 3*xHeightDifference, 0.25 + 3*yHeightDifference], [0.75 + 2*xHeightDifference, 0.25 + 2*yHeightDifference], [0.75 + 3*xHeightDifference, 0.25 - yHeightDifference], 
                        [0.75 + 2*xHeightDifference, 0.25 - 2*yHeightDifference],  [0.75 + 4*xHeightDifference, 0.25 + 4*yHeightDifference], [0.75 + 4*xHeightDifference, 0.25], 
                        [0.75 + 4*xHeightDifference, 0.25 - 2*yHeightDifference], [0.75 + 4*xHeightDifference, 0.25 + 2*yHeightDifference], [0.75 + 4*xHeightDifference, 0.25 - 4*yHeightDifference], [0.75 + 3*xHeightDifference, 0.25 - 3*yHeightDifference],
                        [0.75 + xHeightDifference, 0.25 + yHeightDifference], [0.75 + 3*xHeightDifference, 0.25 + yHeightDifference], [0.75 + xHeightDifference, 0.25 - yHeightDifference]]

let Ycenterline;


function setup() 
{
    frameRate(60);
    frameTime = 1/60;
    ballYellow = color(250, 181, 41);
    ballBlue = color(27, 72, 201);
    ballRed = color(222, 42, 27);
    ballPurple = color(33, 21, 57);
    ballOrange = color(252, 125, 81);
    ballGreen = color(16, 147, 97);
    ballDarkRed = color(131, 20, 29);
    ballBlack = color(25, 23, 24);
    ballWhite = color(216, 207, 178);
    Ycenterline = resolution[1]/2
    colors = [ballYellow, ballBlue, ballRed, ballPurple, ballOrange, ballGreen, ballDarkRed];
    for (i = 0; i <= colors.length - 1 ; i++){
        balls.push(new Ball(false, startCoordinates[i][0], startCoordinates[i][1], colors[i], i+1));
        balls.push(new Ball(true, startCoordinates[i+7][0], startCoordinates[i+7][1], colors[i], i+9));
    }
    balls.push(new Ball("black", 0.75 + 2*xHeightDifference, 0.25, ballBlack, 8));
    balls.push(new Ball("white", 0.25, 0.25, ballWhite, 0));
    resolution = [windowWidth, windowHeight];
    createCanvas(resolution[0], resolution[1]);
    print(balls[-1])
    walls = [0, 0, 1, 0.5];
    balls[balls.length-1].vx = 1;
    balls[balls.length-1].isMoving = true;
}
  
function draw() 
{
    background(255);
    fill(128, 66, 36);
    rect(resolution[0]/2 - 0.42*resolution[0], resolution[1]/2 - 0.22*resolution[0], 0.84*resolution[0], 0.44*resolution[0]);

    fill(0);
    //Corners
    circle(resolution[0]/2 - 0.4*resolution[0], resolution[1]/2 - 0.2*resolution[0], 0.04 * resolution[0]);
    circle(resolution[0]/2 - 0.4*resolution[0], resolution[1]/2 + 0.2*resolution[0], 0.04 * resolution[0]);
    circle(resolution[0]/2 + 0.4*resolution[0], resolution[1]/2 - 0.2*resolution[0], 0.04 * resolution[0]);
    circle(resolution[0]/2 + 0.4*resolution[0], resolution[1]/2 + 0.2*resolution[0], 0.04 * resolution[0]);
    
    //Middle edges
    circle(resolution[0]/2, resolution[1]/2 - 0.2*resolution[0], 0.04 * resolution[0]);
    circle(resolution[0]/2, resolution[1]/2 +  .2*resolution[0], 0.04 * resolution[0]);

    fill(44, 130, 87);
    rect(resolution[0]/2 - 0.4*resolution[0], resolution[1]/2 - 0.2*resolution[0], 0.8*resolution[0], 0.4*resolution[0]);

    //Ball rendering
    for (b of balls)
    {   
        b.x += b.vx * frameTime;
        b.y += b.vy * frameTime;
        if (b.isMoving)
        {
            b.isMoving = false;

            let nextVelocityStep = b.nextVelocityStep();

            //Collision Walls
            if (b.hitXWall() !== 0){
                b.vy  = Math.abs(b.vy)*b.hitXWall();
                console.log('hit wall')
            }
            if (b.hitYWall() !== 0){
                b.vx  = Math.abs(b.vx)*b.hitYWall();
                console.log('hit wall')
            }
            //Collision Balls
            for (b2 of balls)
            {
                if (b != b2 && !b.collidedWith.includes(b2) && b.dstToBall(b2) < 0 + 0*nextVelocityStep && false)
                {
                    b2.collidedWith.push(b);
                    b.collidedWith.push(b2);
                    ballCollision(b, b2);
                }
            }

            //Moving
            if(b.vx !== 0){
                b.isMoving = true;
                b.vx += 9.81/2*mu*frameTime * -(b.vx/Math.abs(b.vx));
                if (Math.abs(b.vx) <= 0.001){
                    b.vx = 0;
                }
            }
            if(b.vy !== 0){
                b.isMoving = true;
                b.vy += 9.81*mu*frameTime * -(b.vy/Math.abs(b.vy));
                if (Math.abs(b.vy) <= 0.001){
                        b.vy = 0;
                    }
            }
        }
        fill(b.color);
        circle(convertX(b.x), convertY(b.y), ballDiameter*0.8*resolution[0]);
    }
    for(b of balls)
    {
        b.collidedWith = [];
    }
}



function windowResized() 
{
    resizeCanvas(windowWidth, windowHeight);
    resolution = [windowWidth, windowHeight];
}

class Ball
{
    constructor(_team, _x, _y, _color, _number)
    {
        this.team = _team;
        this.x = _x;
        this.y = _y;
        this.vy = 0;
        this.vx = 0;
        this.isMoving = false;
        this.isWhite = false;
        this.isEight = false;
        this.color = _color;
        this.number = _number;
        this.collidedWith = [];
    }

    dstToBall(b)
    {
        return Math.sqrt(Math.pow(this.x-b.x,2) + Math.pow(this.y-b.y,2)) - ballDiameter;
    }
    
    hitXWall()
    {
        if (this.y <= ballRadius || this.y >= 0.5 - ballRadius)
            return true;
        return false;
    }

    hitYWall()
    {
        if ((this.x <= ballRadius))
            return 1;
        if  (this.x >= 1 - ballRadius){
            return -1;
        }
        return 0;
    }

    nextVelocityStep()
    {
        return Math.sqrt(Math.pow(this.vx, 2) + Math.pow(this.vy, 2));
    }
}


function convertX(x)
{
    return resolution[0]/2 - 0.4*resolution[0] + x*0.8*resolution[0]
}


function convertY(y){
    return resolution[1]/2 - 0.2*resolution[0] + y*0.8*resolution[0]
}

function ballCollision(b1, b2){
    let theta1 = Math.atan(b1.vy/b1.vx)
    let theta2 = Math.atan(b1.vy/b1.vx)
    let phi = Math.atan((b1.y - b2.y) / (b1.x - b2.x))

    vx1 = b2.vx*Math.cos(theta2-phi)*Math.cos(phi) + b1.vx*Math.sin(theta1 - phi)*Math.cos(phi+Math.PI/2)
    vy1 = b2.vy*Math.cos(theta2-phi)*Math.sin(phi) + b1.vy*Math.sin(theta1 - phi)*Math.sin(phi+Math.PI/2)

    vx2 = b1.vx*Math.cos(theta1-phi)*Math.cos(phi) + b2.vx*Math.sin(theta2 - phi)*Math.cos(phi+Math.PI/2)
    vy2 = b1.vy*Math.cos(theta1-phi)*Math.sin(phi) + b2.vy*Math.sin(theta2 - phi)*Math.sin(phi+Math.PI/2)
    
    //set balls back on their previous path a bit to get them to separate nicely

    

    b1.vx = vx1
    b1.vy = vy1
    b2.vx = vx2
    b2.vy = vy2

    //set balls back on their previous path a bit to get them to separate nicely

    b1.isMoving = true;
    b2.isMoving = true;


}
//team true --> striped
//lokaal coordinaten systeem origin in top left corner van tafel, lengte = 1 uts, hoogte = 0.5 uts