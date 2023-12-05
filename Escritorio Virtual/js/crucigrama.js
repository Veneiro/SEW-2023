class Crucigrama {

    board;
    columnas = 9;
    filas = 11;
    init_time;
    end_time;
    boardSinInicializar;
    keySelected;

    constructor() {
        this.board = new Array(this.filas).fill().map(_ => new Array(this.columnas).fill(0));
    }

    start(dificultad) {
        document
            .querySelector("body")
            .addEventListener("keydown", this.select.bind(this));
        switch (dificultad) {
            case "fácil":
                dificultad = "4,*,.,=,12,#,#,#,5,#,#,*,#,/,#,#,#,*,4,-,.,=,.,#,15,#,.,*,#,=,#,=,#,/,#,=,.,#,3,#,4,*,.,=,20,=,#,#,#,#,#,=,#,#,8,#,9,-,.,=,3,#,.,#,#,-,#,+,#,#,#,*,6,/,.,=,.,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,6,#,8,*,.,=,16";
                this.rellenar_crucigrama(dificultad);
                break;
            case "medio":
                dificultad = "12,*,.,=,36,#,#,#,15,#,#,*,#,/,#,#,#,*,.,-,.,=,.,#,55,#,.,*,#,=,#,=,#,/,#,=,.,#,15,#,9,*,.,=,45,=,#,#,#,#,#,=,#,#,72,#,20,-,.,=,11,#,.,#,#,-,#,+,#,#,#,*,56,/,.,=,.,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,12,#,16,*,.,=,32";
                this.rellenar_crucigrama(dificultad);
                break;
            case "difícil":
                dificultad = "4,.,.,=,36,#,#,#,25,#,#,*,#,.,#,#,#,.,.,-,.,=,.,#,15,#,.,*,#,=,#,=,#,.,#,=,.,#,18,#,6,*,.,=,30,=,#,#,#,#,#,=,#,#,56,#,9,-,.,=,3,#,.,#,#,*,#,+,#,#,#,*,20,.,.,=,18,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,18,#,24,.,.,=,72";
                this.rellenar_crucigrama(dificultad);
                break;
        }
    }

    rellenar_crucigrama(dificultad) {
        let counter = 0;
        for (let i = 0; i < this.filas; i++) {
            for (let j = 0; j < this.columnas; j++) {
                let dificultad_array = dificultad.split(',');
                switch (dificultad_array[counter]) {
                    case '.':
                        this.board[i][j] = 0;
                        break;
                    case '#':
                        this.board[i][j] = -1;
                        break;
                    default:
                        this.board[i][j] = dificultad_array[counter];
                        break;
                }
                counter++;
            }
        }
    }

    paintMathword() {
        for (let i = 0; i < this.filas; i++) {
            for (let j = 0; j < this.columnas; j++) {
                switch (this.board[i][j]) {
                    case 0:
                        let cell = document.createElement('p');
                        cell.setAttribute('data-state', " ")
                        cell.addEventListener("click", () => {
                            if (cell.getAttribute("data-state") == " ") {
                                if (this.keySelected != null) {
                                    this.keySelected.setAttribute("data-state", " ");
                                }
                                this.keySelected = cell;
                                cell.setAttribute("data-state", "clicked");
                            }
                        });
                        $('section main').append(cell)
                        break;
                    case -1:
                        $('section main').append('<p data-state="empty"></p>')
                        break;
                    default:
                        $('section main').append('<p data-state="blocked">' + this.board[i][j] + '</p>')
                        break;
                }
            }
        }
        this.initialize_time();
    }

    initialize_time() {
        this.init_time = Date.now();
    }

    select(event) {
        const tecla = event.key;
        if (this.keySelected != null) {
            switch (tecla) {
                case "1":
                    this.introduceNumber(1);
                    break;
                case "2":
                    this.introduceNumber(2);
                    break;
                case "3":
                    this.introduceNumber(3);
                    break;
                case "4":
                    this.introduceNumber(4);
                    break;
                case "5":
                    this.introduceNumber(5);
                    break;
                case "6":
                    this.introduceNumber(6);
                    break;
                case "7":
                    this.introduceNumber(7);
                    break;
                case "8":
                    this.introduceNumber(8);
                    break;
                case "9":
                    this.introduceNumber(9);
                    break;
            }
        }
    }

    introduceNumber(number) {
        
    }

    check_win_condition(){
        for (let i = 0; i < this.filas; i++) {
            for (let j = 0; j < this.columnas; j++) {
                if(this.board[i][j] == 0){
                    return false;
                }
            }
        }
        this.end_time = Date.now();
        return true;
    }

    calculate_date_difference(){
        let time_spend = this.end_time - this.init_time;
        console.log(time_spend)
    }

    test(){
        this.init_time = new Date(hours, minutes, seconds);
        this.sleep(1000);
        this.end_time = new Date(hours, minutes, seconds);
        let time_spend = this.end_time - this.init_time;
        console.log(this.init_time);
        console.log(this.end_time);
        console.log(time_spend);
    }

    sleep(ms){
        var esperarHasta = new Date().getTime() + ms;
        while(new Date().getTime() < esperarHasta) continue;
    }
}

var crucigrama = new Crucigrama();
crucigrama.start("medio");
crucigrama.paintMathword();
crucigrama.test();