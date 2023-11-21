
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
        const section = document.querySelector('section section');
        for (const element of this.elements) {
            const a = document.createElement('article');
            a.addEventListener('click', this.flip.bind(this));
            a.innerHTML = '<p>Memory Card</p>';
            a.setAttribute('data-oculto', 'true');
            a.setAttribute('data-type', element.element)
            section.append(a);
        }
    }

    flip(ev){
        if(this.firstCard == null){
            this.firstCard = ev.target;
        } else {
            this.secondCard = ev.target;
        }
    }

    shuffleElements(){
        this.elements.shuffleElements();
    }

    unflipCards(){
        document.getElementsByName("article").forEach(element => {
            element.setAttribute('data-oculto', "false");
        });
    }

    resetBoard(){
        this.hasFlippedCard = false;
        this.lockBoard = false;
        this.firstCard = null;
        this.secondCard = null;
    }

    checkForMath(){

        const typeFirstCard  = this.firstCard.getAttribute('data-type');
        const typeSecondCard  = this.secondCard.getAttribute('data-type');

        if(this.firstCard.element.equals(this.secondCard.element)){
            this.unflipCards();
        }
    }
    
    disableCards(){
        this.resetBoard();
    }
}

var memoria = new Memoria();
this.memoria.createElements();