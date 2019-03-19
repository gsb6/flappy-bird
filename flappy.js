function newElement(tagName, className) {
    const element = document.createElement(tagName);

    element.classList.add(className);
    return element;
}

function Barrier (reverse = false) {
    this.element = newElement('div', 'barrier');

    const barrierBody = newElement('div', 'barrier-body');
    const barrierBorder = newElement('div', 'barrier-border');

    this.element.appendChild(reverse ? barrierBody : barrierBorder);
    this.element.appendChild(reverse ? barrierBorder : barrierBody);

    this.setHeight = height => barrierBody.style.height = `${height}px`;
}

function PairBarriers (height, interspace, posX) {
    this.element = newElement('div', 'pair-barriers');
    this.superior = new Barrier(true);
    this.inferior = new Barrier(false);

    this.element.appendChild(this.superior.element);
    this.element.appendChild(this.inferior.element);

    this.randomInterspace = () => {
        const heightSup = Math.random() * (height - interspace);
        const heightInf = height - interspace - heightSup;

        this.superior.setHeight(heightSup);
        this.inferior.setHeight(heightInf);
    }

    this.getX = () => parseInt(this.element.style.left.split('px')[0]);
    this.setX = x => this.element.style.left = `${x}px`;

    this.getWidth = () => this.element.clientWidth;

    this.randomInterspace();
    this.setX(posX);
}

// const pb = new PairBarriers(700, 200, 400);
// document.querySelector('[data-flappy]').appendChild(pb.element);

function Barriers(width, height, interspace, gap, score) {
    const displacement = 3;

    this.pairs = [
        new PairBarriers(height, interspace, width),
        new PairBarriers(height, interspace, (width + gap)),
        new PairBarriers(height, interspace, (width + gap * 2)),
        new PairBarriers(height, interspace, (width + gap * 3))
    ]

    this.animate = () => {
        this.pairs.forEach(pair => {
            pair.setX(pair.getX() - displacement);

            // quando elemento sair da área do jogo
            if (pair.getX() < -pair.getWidth()) {
                pair.setX(pair.getX() + gap * this.pairs.length);
                pair.randomInterspace();
            }

            const middle = width / 2;
            const middleCrossed = pair.getX() + displacement >= middle && pair.getX() < middle;

            // if middleCrossed then score()
            middleCrossed && score();
        });
    }
}

function Bird(gameHeight) {
    let flying = false;

    this.element = newElement('img', 'bird');
    this.element.src = 'bird.png';

    this.getY = () => parseInt(this.element.style.bottom.split('px')[0]);
    this.setY = y => this.element.style.bottom = `${y}px`;

    window.onkeydown = () => flying = true;
    window.onkeyup = () => flying = false;

    this.animate = () => {
        const newY = this.getY() + (flying ? 8 : -5);
        const maxHeight = gameHeight - this.element.clientHeight;

        if (newY <= 0) {
            this.setY(0);
        } else if (newY >= maxHeight) {
            this.setY(maxHeight);
        } else {
            this.setY(newY);
        }
    }

    this.setY(gameHeight / 2);
}

function Progress() {
    this.element = newElement('span', 'progress');
    this.update = point => this.element.innerHTML = point;

    this.update(0);
}

function overlapping(elementA, elementB) {
    const rectA = elementA.getBoundingClientRect();
    const rectB = elementB.getBoundingClientRect();

    const horizontal = (rectA.left + rectA.width >= rectB.left) && (rectB.left + rectB.width >= rectA.left);
    const vertical = (rectA.top + rectA.height >= rectB.top) && (rectB.top + rectB.height >= rectA.top);

    return horizontal && vertical;
}

function collided(bird, barriers) {
    let collided = false;

    barriers.pairs.forEach(pairBarriers => {
        if (!collided) {
            const barrierSup = pairBarriers.superior.element;
            const barrierInf = pairBarriers.inferior.element;

            collided = overlapping(bird.element, barrierSup) || overlapping(bird.element, barrierInf);
        }
    })

    return collided;
}

function FlappyBird() {
    let points = 0;

    const gameArea = document.querySelector('[data-flappy]');
    const gameWidth = gameArea.clientWidth;
    const gameHeight = gameArea.clientHeight;

    const bird = new Bird(gameHeight);
    const progress = new Progress();
    const barriers = new Barriers(gameWidth, gameHeight, 200, 400, () => {
        progress.update(++points);
    });

    gameArea.appendChild(bird.element);
    gameArea.appendChild(progress.element);

    barriers.pairs.forEach(pair => {
        gameArea.appendChild(pair.element)
    });

    this.start = () => {
        // loop do jogo
        const timer = setInterval(() => {
            bird.animate();
            barriers.animate();

            if(collided(bird, barriers)) {
                clearInterval(timer);
            }
        }, 20)
    }
}

new FlappyBird().start();