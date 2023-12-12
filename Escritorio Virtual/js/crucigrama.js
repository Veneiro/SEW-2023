class Crucigrama {
  board;
  columnas = 9;
  filas = 11;
  init_time;
  end_time;
  boardSinInicializar;
  keySelected;

  first_number;
  second_number;
  expresion;
  result;

  constructor() {
    this.board = new Array(this.filas)
      .fill()
      .map((_) => new Array(this.columnas).fill(0));
    this.expression_row = true;
    this.expresion_col = true;
  }

  start(dificultad) {
    document
      .querySelector("body")
      .addEventListener("keydown", this.select.bind(this));
    switch (dificultad) {
      case "fácil":
        dificultad =
          "4,*,.,=,12,#,#,#,5,#,#,*,#,/,#,#,#,*,4,-,.,=,.,#,15,#,.,*,#,=,#,=,#,/,#,=,.,#,3,#,4,*,.,=,20,=,#,#,#,#,#,=,#,#,8,#,9,-,.,=,3,#,.,#,#,-,#,+,#,#,#,*,6,/,.,=,.,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,6,#,8,*,.,=,16";
        this.rellenar_crucigrama(dificultad);
        break;
      case "medio":
        dificultad =
          "12,*,.,=,36,#,#,#,15,#,#,*,#,/,#,#,#,*,.,-,.,=,.,#,55,#,.,*,#,=,#,=,#,/,#,=,.,#,15,#,9,*,.,=,45,=,#,#,#,#,#,=,#,#,72,#,20,-,.,=,11,#,.,#,#,-,#,+,#,#,#,*,56,/,.,=,.,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,12,#,16,*,.,=,32";
        this.rellenar_crucigrama(dificultad);
        break;
      case "difícil":
        dificultad =
          "4,.,.,=,36,#,#,#,25,#,#,*,#,.,#,#,#,.,.,-,.,=,.,#,15,#,.,*,#,=,#,=,#,.,#,=,.,#,18,#,6,*,.,=,30,=,#,#,#,#,#,=,#,#,56,#,9,-,.,=,3,#,.,#,#,*,#,+,#,#,#,*,20,.,.,=,18,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,18,#,24,.,.,=,72";
        this.rellenar_crucigrama(dificultad);
        break;
    }
  }

  rellenar_crucigrama(dificultad) {
    let counter = 0;
    for (let i = 0; i < this.filas; i++) {
      for (let j = 0; j < this.columnas; j++) {
        let dificultad_array = dificultad.split(",");
        switch (dificultad_array[counter]) {
          case ".":
            this.board[i][j] = 0;
            break;
          case "#":
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
            let cell = document.createElement("p");
            cell.setAttribute("data-state", " ");
            cell.addEventListener("click", () => {
              if (cell.getAttribute("data-state") == " ") {
                if (this.keySelected != null) {
                  this.keySelected.setAttribute("data-state", " ");
                }
                this.keySelected = cell;
                cell.setAttribute("data-state", "clicked");
              }
            });
            $("main").append(cell);
            break;
          case -1:
            $("main").append('<p data-state="empty"></p>');
            break;
          default:
            $("main").append(
              '<p data-state="blocked">' + this.board[i][j] + "</p>"
            );
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
          this.introduceElement(1);
          break;
        case "2":
          this.introduceElement(2);
          break;
        case "3":
          this.introduceElement(3);
          break;
        case "4":
          this.introduceElement(4);
          break;
        case "5":
          this.introduceElement(5);
          break;
        case "6":
          this.introduceElement(6);
          break;
        case "7":
          this.introduceElement(7);
          break;
        case "8":
          this.introduceElement(8);
          break;
        case "9":
          this.introduceElement(9);
          break;
        case "+":
          this.introduceElement("+");
          break;
        case "-":
          this.introduceElement("-");
          break;
        case "*":
          this.introduceElement("*");
          break;
        case "/":
          this.introduceElement("/");
          break;
      }
    } else {
      alert("Debes pulsar una casilla antes de introducir un valor");
    }
  }

  introduceElement(number) {
    if (this.keySelected.getAttribute("data-state") == "clicked") {
      const section = document.querySelector("main");
      const selectedIndex = Array.from(section.children).indexOf(
        this.keySelected
      );

      const rowIndex = Math.floor(selectedIndex / this.columnas);
      const colIndex = selectedIndex % this.columnas;

      if (this.checkRow(rowIndex, colIndex, number) && this.checkColumn(rowIndex, colIndex, number)) {
        this.keySelected.innerHTML = number;
        this.keySelected.setAttribute("data-state", "correct");
        this.keySelected = undefined;
        if (this.check_win_condition()) {
          console.log(this.board);
          let formulario = '<form action="crucigrama.php" method="post"><p><label for="nombre">Nombre:</label><input type="text" name="nombre" id="nombre"><label for="apellidos">Apellidos:</label><input type="text" name="apellidos" id="apellidos"></p><button type="submit">Guardar Record</button></form>'
          document.querySelector('main').innerHTML = formulario;
        }
      } else {
        // Mensaje o acción cuando se violan las reglas
        alert("Posición inválida o resultado incorrecto");
      }
    }
  }

  checkRow(rowIndex, colIndex, number) {
    let c = 1;
    while (colIndex + c < this.columnas &&this.board[rowIndex][colIndex + c] != undefined) {
      if (this.board[rowIndex][colIndex + c] == "=") {
        this.board[rowIndex][colIndex] = number;
        this.first_number = this.board[rowIndex][colIndex + (c - 3)];
        this.second_number = this.board[rowIndex][colIndex + (c - 1)];
        this.expresion = this.board[rowIndex][colIndex + (c - 2)];
        this.result = this.board[rowIndex][colIndex + (c + 1)];
        let expresionArray = [
          this.first_number,
          this.expresion,
          this.second_number,
        ];
        if(expresionArray.includes(0)){
          return true;
          //this.checkColumn(rowIndex, colIndex, number);
        }
        if (eval(expresionArray.join("")) == this.result) {
          return true;
        }
        this.board[rowIndex][colIndex] = 0;
        return false;
      }
      c++;
    }
    this.board[rowIndex][colIndex] = number;
    return true;
  }

  checkColumn(rowIndex, colIndex, number) {
    let c = 1;
    while (rowIndex + c < this.filas && this.board[rowIndex + c][colIndex] != undefined) {
      if (this.board[rowIndex + c][colIndex] == "=") {
        this.board[rowIndex][colIndex] = number;
        this.first_number = this.board[rowIndex + (c - 3)][colIndex];
        this.second_number = this.board[rowIndex + (c - 1)][colIndex];
        this.expresion = this.board[rowIndex + (c - 2)][colIndex];
        this.result = this.board[rowIndex + (c + 1)][colIndex];
        let expresionArray = [
          this.first_number,
          this.expresion,
          this.second_number,
        ];
        if(expresionArray.includes(0)){
          return true;
        }
        if (eval(expresionArray.join("")) == this.result) {
          return true;
        }
        this.board[rowIndex][colIndex] = 0;
        return false;
      }
      c++;
    }
    this.board[rowIndex][colIndex] = number;
    return true;
  }

  check_win_condition() {
    for (let i = 0; i < this.filas; i++) {
      for (let j = 0; j < this.columnas; j++) {
        if (this.board[i][j] == 0) {
          return false;
        }
      }
    }
    this.end_time = Date.now();
    return true;
  }

  calculate_date_difference() {
    let time_spend = new Date(this.end_time - this.init_time);
    return (
      time_spend.getUTCHours() +
      ":" +
      time_spend.getUTCMinutes() +
      ":" +
      time_spend.getUTCSeconds()
    );
  }

  test() {
    this.init_time = new Date();
    this.sleep(1000);
    this.end_time = new Date();
    let time_spend = new Date(this.end_time - this.init_time);
    console.log(
      time_spend.getUTCHours() +
        ":" +
        time_spend.getUTCMinutes() +
        ":" +
        time_spend.getUTCSeconds()
    );
  }

  sleep(ms) {
    var esperarHasta = new Date().getTime() + ms;
    while (new Date().getTime() < esperarHasta) continue;
  }
}

var crucigrama = new Crucigrama();
crucigrama.start("medio");
crucigrama.paintMathword();
