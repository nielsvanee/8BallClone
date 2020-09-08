//niels is a nagger

let e = 0.93
let mu  = 0.005

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
}
  
function draw() 
{
    background(255);
    fill(44, 130, 87);
    rect(resolution[0]/2 -  0.4*resolution[0], resolution[1]/2 -  0.2*resolution[0], 0.8*resolution[0], 0.4*resolution[0]);
    
    //Ball rendering
    for (b of balls)
    { 
        fill(b.color);
        circle(convertX(b.x), convertY(b.y), ballDiameter*0.8*resolution[0]);
    }

}

function windowResized() 
{
    resizeCanvas(windowWidth, windowHeight);
    resolution = [windowWidth, windowHeight];
    walls = [resolution[0]/2 - 0.4*resolution[0], resolution[1]/2 - 0.2*resolution[0], resolution[0]/2 + 0.4*resolution[0], resolution[1]/2 + 0.2*resolution[0]];
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
    }

    dstToBall(b)
    {
        return Math.sqrt(Math.pow(x-b.x,2) + Math.pow(y-b.y,2)) - ballDiameter;
    }
    
    dstToYWall()
    {
        dstNorth = this.y - walls[1];
        dstSouth = walls[3] - this.y;
        return Math.min(dstNorth, dstSouth);
    }

    dstToXWall()
    {
        dstWest = this.x - walls[0];
        dstEast = walls[2] - this.x;
        return Math.min(dstEast, dstWest);
    }
}


function convertX(x){

    return resolution[0]/2 -  0.4*resolution[0] + x*0.8*resolution[0]
}


function convertY(y){
    return resolution[1]/2 -  0.2*resolution[0] + y*0.8*resolution[0]
}

//team true --> striped
//lokaal coordinaten systeem origin in top left corner van tafel, lengte = 1 uts, hoogte = 0.5 uts