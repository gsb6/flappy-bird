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
            console.log(pair.getX());
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

const barriers = new Barriers(1200, 700, 200, 400);
const gameArea = document.querySelector('[data-flappy]');

barriers.pairs.forEach(pair => gameArea.appendChild(pair.element));
setInterval(() => {
    barriers.animate();
}, 20);