
class Memoria {
    elements = [
        {
            element: 'HTML 5',
            source: 'https://upload.wikimedia.org/wikipedia/commons/3/38/HTML5_Badge.svg'
        },
        {
            element: 'HTML 5',
            source: 'https://upload.wikimedia.org/wikipedia/commons/3/38/HTML5_Badge.svg'
        },
        {
            element: 'CSS3',
            source: 'https://upload.wikimedia.org/wikipedia/commons/6/62/CSS3_logo.svg'
        },
        {
            element: 'CSS3',
            source: 'https://upload.wikimedia.org/wikipedia/commons/6/62/CSS3_logo.svg'
        },
        {
            element: 'JS',
            source: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Javascript_badge.svg'
        },
        {
            element: 'JS',
            source: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Javascript_badge.svg'
        },
        {
            element: 'PHP',
            source: 'https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg'
        },
        {
            element: 'PHP',
            source: 'https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg'
        },
        {
            element: 'SVG',
            source: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/SVG_Logo.svg'
        },
        {
            element: 'SVG',
            source: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/SVG_Logo.svg'
        },
        {
            element: 'W3C',
            source: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/W3C_icon.svg'
        },
        {
            element: 'W3C',
            source: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/W3C_icon.svg'
        }
    ];

    constructor() {
        this.hasFlippedCard = false;
        this.lockBoard = false;
        this.firstCard = null;
        this.secondCard = null;
    }

    createElements() {
        const articles = [];
        const section = document.querySelector('main');
        for (const element of this.elements) {
            const a = document.createElement('article');
            a.addEventListener('click', this.flip.bind(this));
            a.innerHTML = '<h3>Memory Card</h3>';
            a.innerHTML += "<img src='" + element.source + "' alt='" + element.element +"'>";
            a.setAttribute('data-state', 'unflip');
            a.setAttribute('data-element', element.element);
            section.append(a);
        }
    }

    flip(ev) {
        const card = ev.target.parentNode;
        if (this.firstCard == null && card.getAttribute('data-state') == "unflip") {
            this.firstCard = card;
            card.setAttribute('data-state', "flip");
        } else if (this.secondCard == null && card.getAttribute('data-state') == "unflip"){
            this.secondCard = card;
            card.setAttribute('data-state', "flip");
            this.checkForMath();
        }
    }

    shuffleElements() {
        for (let i = this.elements.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.elements[i], this.elements[j]] = [this.elements[j], this.elements[i]];
        }
    }

    unflipCards() {
        setTimeout(() => {
            this.firstCard.setAttribute('data-state', "unflip");
            this.secondCard.setAttribute('data-state', "unflip");
            this.resetBoard();
        }, 1000);
    }

    resetBoard() {
        this.hasFlippedCard = false;
        this.lockBoard = false;
        this.firstCard = null;
        this.secondCard = null;
    }

    checkForMath() {
        const typeFirstCard = this.firstCard.getAttribute('data-element');
        const typeSecondCard = this.secondCard.getAttribute('data-element');
        if (typeFirstCard != typeSecondCard) {
            this.unflipCards();
        } else {
            this.disableCards();
            this.resetBoard();
        }
    }

    disableCards() {
        this.firstCard.setAttribute('data-state', "revealed");
        this.secondCard.setAttribute('data-state', "revealed");
        this.resetBoard();
    }
}

var memoria = new Memoria();
this.memoria.shuffleElements();
this.memoria.createElements();