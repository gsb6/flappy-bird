function newElement(tagName, className) {
    const element = document.createElement(tagName);

    element.classList.add(className);
    return element;
}

class Barrier {
    constructor(reverse = false) {
        this.element = newElement('div', 'barrier');

        const barrierBody = newElement('div', 'barrier-body');
        const barrierBorder = newElement('div', 'barrier-border');

        this.element.appendChild(reverse ? barrierBody : barrierBorder);
        this.element.appendChild(reverse ? barrierBorder : barrierBody);

        this.setHeight = height => barrierBody.style.height = `${height}px`;
    }
}

class PairBarriers {
    constructor(height, interspace, posX) {
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
}

const pb = new PairBarriers(700, 200, 400);
document.querySelector('[data-flappy]').appendChild(pb.element);