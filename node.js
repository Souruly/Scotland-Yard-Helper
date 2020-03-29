function Node(num, posX, posY) {
    this.number = num;
    this.x = round(posX);
    this.y = round(posY);
    this.taxi = [];
    this.bus = [];
    this.underground = [];
    this.r = 70;
    this.w = 30;
    this.h = 40;

    this.show = function () {
        noFill();
        stroke(255);
        strokeWeight(10);
        ellipse(this.x, this.y, this.r, this.r);
        stroke(0);
        strokeWeight(6);
        ellipse(this.x, this.y, this.r, this.r);
        strokeWeight(2);
        if(this.bus.length==0)
        {
            noFill();
        }
        else{
            fill(0,0,255);
        }
        arc(this.x,this.y,this.r,this.r,0,-PI);
        if(this.underground.length==0)
        {
            noFill();
        }
        else{
            fill(255,0,0);
        }
        rect(this.x-this.w/2,this.y-this.h/2,this.w,this.h);
        noStroke();
        fill(0);
        textSize(32);
        text(this.number, this.x, this.y);

    }
}