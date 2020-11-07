function injectMessage(screen, message, h, nofade, fade) {
    if(message.length > screen.lines.length) return;
    let first = Math.floor((screen.lines.length - message.length)/2);
    for(let i = first; i < first + message.length; i++) {
        if(screen.lines[i] === false) {
            screen.lines[i] = new Line(i*size, screen.rows);
            screen.emptyLinesCount--;
            let offset = -Math.floor(Math.random()*10);
            screen.lines[i].head += offset;
            screen.lines[i].firstToHide += offset;
        }
        screen.lines[i] = new InjectedLine(screen.lines[i], message.charAt(i - first), h, fade);
    }
    screen.nofade = nofade;
    screen.firstInjected = first;
    screen.lastInjected = first + message.length - 1;
    screen.checkIfStartsFading = function() {
        for(let i = this.firstInjected; i <= this.lastInjected; i++) {
            if(this.lines[i].head !== undefined) return false;
        }
        return true;
    };
    screen.draw = function() {
        this.update();
        if(this.checkIfStartsFading()) {
            if(this.nofadeCounter === undefined) this.nofadeCounter = 0;
            this.nofadeCounter++;
            if(this.nofadeCounter === this.nofade*framerate) {
                for(let i = this.firstInjected; i <= this.lastInjected; i++) {
                    this.lines[i].startToFade = true;
                }
                this.draw = function() {this.update();};
                delete this.checkIfStartsFading;
                delete this.nofade;
                delete this.firstInjected;
                delete this.lastInjected;
                delete this.nofadeCounter;
            }
        }
    };
}

class InjectedLine extends Line {
    constructor(line, letter, position, fade) {
        super(line.posX, line.rows);
        this.frameCount = line.frameCount;
        this.rows = line.rows;
        this.posX = line.posX;
        this.color = line.color;
        this.letters = line.letters;
        this.head = line.head;
        this.firstToHide = line.firstToHide;
        this.velocity = line.velocity;
        this.letters[position] = new SpecialLetter(letter, this.color);
        this.fade = fade;
        this.injectionPoint = position;
        this.injectedLetter = letter;
    }

    update() {
        if(this.velocity < 15) this.velocity += 0.1;
        if(this.head < this.injectionPoint - 1) {
            super.update();
        }
        else if(this.head === this.injectionPoint - 1) {
            super.update();
            if(this.frameCount === 0) this.head = undefined;
        } else if(this.head === undefined) {
            if(this.startToFade) {
                this.frameCount++;
                if(this.frameCount >= framerate*(this.fade)) this.faded = true;
                let f = this.frameCount*255/(framerate*this.fade);
                if(f > 255) f = 255;
                this.letters[this.injectionPoint].fade([this.posX, (this.injectionPoint + 0.5)*size], f);
            }
            this.drawTail();
        } else {
            super.update();
            if(this.deleteme) {
                delete this.deleteme;
                this.frameCount = 0;
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

                this.letters[this.injectionPoint] = new SpecialLetter(this.injectedLetter, this.injectionPoint);
            }
        }
        if(this.faded) this.deleteme = true;
    }

    drawTail() {
        this.firstToHide++;
        if(this.firstToHide >= 0 && this.firstToHide < this.injectionPoint) {
            this.letters[this.firstToHide].draw([this.posX, (this.firstToHide + 0.5)*size], true);
        }
    }
}

class SpecialLetter extends Letter {

    constructor(...args) {
        super(...args);
        this.color = messageColor;
    }

    fade(position, q) {
        fill([0, 0, 0, q]);
        strokeWeight(0);
        rect(position[0] - size/2 - 1, position[1] - size/2 - 1, size + 2, size + 2);
    }
}
