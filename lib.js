/**
 *  @desc A moving letter from The Matrix
 */
class Letter {
    /**
     *  @desc Constructor
     *  @param String l - The letter
     *  @param color color - Base color of the line that contains it
     */
    constructor(l, color) {
        this.letter = l;
        this.color = [
            gaussian(color[0], internalColorVariation[0]),
            gaussian(color[1], internalColorVariation[1]),
            gaussian(color[2], internalColorVariation[2])
        ];
        for(let c of this.color) {
            if(c < 0) c = 0;
            else if(c > 255) c = 255;
        }
        if(this.color[0] > this.color[1]*0.8) this.color[0] = this.color[1]*0.8;
        if(this.color[2] > this.color[1]*0.8) this.color[2] = this.color[1]*0.8;
        size = size;
    }

    /**
     *  @desc Draw the letter
     *  @param Array position - [x, y]
     *  @param boolean deleteOnly
     *  @param boolean isHead
     */
    draw(position, deleteOnly = false, isHead = false) {
        // Draw a black square over where we want to write
        fill('black');
        strokeWeight(0);
        if(isHead) rect(position[0] - size/2 - 1, position[1] - size/2 - 1, size + 2, size + 2);
        else rect(position[0] - size/2 - 1, position[1] - size/2 - 3, size + 2, size);

        // If we acually want to write anything, do it
        if(!deleteOnly) {
            textFont('Helvetica');
            textSize(size);
            fill(this.color);
            if(isHead) {
                fill('white');
                strokeWeight(2);
                stroke(this.color);
            } else strokeWeight(0);
            textAlign(CENTER, CENTER);
            text(this.letter, ...position);
        }
    }
}

/**
 *  @desc A vertical line of moving letters from The Matrix
 */
class Line {

    /**
     *  @desc Constructor
     *  @param Number posx - X-coordinate for the line
     *  @param Number cols - Number of letters from the top to the bottom
     */
    constructor(posX, rows) {
        this.frameCount = 0;
        this.rows = rows;
        this.posX = posX;
        this.color = [
            gaussian(baseColor[0], baseColorVariation[0]),
            gaussian(baseColor[1], baseColorVariation[1]),
            gaussian(baseColor[2], baseColorVariation[2]),
        ];
        for(let c of this.color) {
            if(c < 0) c = 0;
            if(c > 255) c = 255;
        }

        this.letters = [];
        let simultaneous = Math.floor(Math.random()*37 + 3);
        this.head = -1;
        this.firstToHide = this.head - simultaneous;
        let last = "a";
        while(this.letters.length < this.rows) {
            let sel = symbols[Math.floor(Math.random()*symbols.length)];
            if(sel !== last) {
                this.letters.push(new Letter(sel, this.color));
                last = sel;
            }
        }
        while(this.velocity === undefined) {
            this.velocity = gaussian(15, 15);
            if(this.velocity < 0.1) delete this.velocity;
            if(this.velocity > 30) delete this.velocity;
        }
    }

    /**
     *  @desc Draw the head of the chain of letters, redraw the former head, delete the last
     */
    draw() {
        //draw the first
        if(this.head >= 0 && this.head < this.letters.length) {
            this.letters[this.head].draw([this.posX, (this.head + 0.5)*size], false, true)
        }

        //redraw the second
        if(this.head > 0 && this.head <= this.letters.length) {
            this.letters[this.head - 1].draw([this.posX, (this.head - 0.5)*size])
        }

        //delete the last
        if(this.firstToHide >= 0 && this.firstToHide < this.letters.length) {
            this.letters[this.firstToHide].draw([this.posX, (this.firstToHide + 0.5)*size], true);
        }
    }

    /**
     *  @desc velocity and deletion checks
     */
    update() {
        this.frameCount++;
        if(this.frameCount >= framerate/this.velocity) {
            this.frameCount = 0;
            this.head++;
            this.firstToHide++;
            if(this.firstToHide >= this.letters.length) this.deleteme = true;
            this.draw();
        }
    }
}

/**
 *  @desc A screen of lines of moving letters from The Matrix
 */
class Screen {
    /**
     *  @desc Constructor
     *  @param Number rows - Number of letters per column
     *  @param Number cols - Number of columns
     */
    constructor(rows, cols) {
        this.rows = rows;
        this.lines = [];
        while(this.lines.length < cols) {
            this.lines.push(false);
        }
        this.emptyLinesCount = cols;
    }

    /**
     *  @desc Find an empty place and add a line of letters to it
     */
    addLine(startingOffset = 0) {
        if(this.emptyLinesCount < 1) return;
        let sel = Math.floor(Math.random()*this.emptyLinesCount);
        let i = 0;
        while(sel >= 0) {
            if(this.lines.length <= i) {
                return;
            }
            if(this.lines[i] === false) {
                if(sel === 0) {
                    this.lines[i] = new Line(i*size, this.rows);
                    this.lines[i].head += startingOffset;
                    this.lines[i].firstToHide += startingOffset;
                    this.emptyLinesCount--;
                }
                sel--;
            }
            i++;
        }
    }

    /**
     *  @desc Draw the Screen
     */
    draw() {
        this.update();
    }

    /**
     *  @desc Update the state of the screen: update each line, and then delete/create new lines as needed
     */
    update() {
        let newLines = 0;
        for(let i = 0; i < this.lines.length; i++) {
            if(this.lines[i] != false) {
                this.lines[i].update();
                if(this.lines[i].deleteme) {
                    this.lines[i] = false;
                    this.emptyLinesCount++;
                    newLines++;
                }
            }
        }
        while(newLines > 0) {
            this.addLine();
            newLines--;
        }
    }
}
