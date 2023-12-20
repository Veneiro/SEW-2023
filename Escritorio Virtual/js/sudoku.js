class Sudoku {
  constructor() {
    this.rows = 9;
    this.columns = 9;
    this.tablero =
      "3.4.69.5....27...49.2..4....2..85.198.9...2.551.39..6....8..5.32...46....4.75.9.6";
    this.tableroArray = new Array(this.rows);
    this.keySelected = null;
    for (let i = 0; i < this.rows; i++) {
      this.tableroArray[i] = new Array(this.columns);
    }
  }

  start() {
    document
      .querySelector("body")
      .addEventListener("keydown", this.select.bind(this));
    for (let i = 0; i < this.tableroArray.length; i++) {
      for (let j = 0; j < this.tableroArray[i].length; j++) {
        // Acceder a cada elemento de la matriz
        if (this.tablero.charAt(i * this.columns + j) == ".") {
          this.tableroArray[i][j] = 0;
        } else {
          this.tableroArray[i][j] = this.tablero.charAt(i * this.columns + j);
        }
      }
    }
  }

  createStructure() {
    const section = document.querySelector("main");
    for (let i = 0; i < this.tableroArray.length; i++) {
      for (let j = 0; j < this.tableroArray[i].length; j++) {
        const a = document.createElement("p");
        if (this.tableroArray[i][j] == 0) {
          a.innerHTML = "";
          a.setAttribute("data-state", " ");
          a.addEventListener("click", () => {
            if (a.getAttribute("data-state") == " ") {
              if (this.keySelected != null) {
                this.keySelected.setAttribute("data-state", " ");
              }
              this.keySelected = a;
              a.setAttribute("data-state", "clicked");
            }
          });
        } else {
          a.innerHTML = this.tableroArray[i][j];
          a.setAttribute("data-state", "blocked");
        }
        section.append(a);
      }
    }
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
    } else {
      alert("Primero selecciona la casilla para introducir el numero");
    }
  }

  introduceNumber(number) {
    if (this.keySelected.getAttribute("data-state") == "clicked") {
      const section = document.querySelector("main");
      const selectedIndex = Array.from(section.children).indexOf(
        this.keySelected
      );

      const rowIndex = Math.floor(selectedIndex / this.columns);
      const colIndex = selectedIndex % this.columns;
      if (
        !this.checkRow(rowIndex, number) &&
        !this.checkColumn(colIndex, number) &&
        !this.checkSubgrid(rowIndex, colIndex, number)
      ) {
        this.keySelected.innerHTML = number;
        this.keySelected.setAttribute("data-state", "correct");
      } else {
        // Mensaje o acción cuando se violan las reglas
        alert("Número no válido en esta posición.");
      }
    }
  }

  checkRow(rowIndex, number) {
    return this.tableroArray[rowIndex].some((cell) => cell == number);
  }

  checkColumn(colIndex, number) {
    for (let i = 0; i < this.rows; i++) {
      if (this.tableroArray[i][colIndex] == number) {
        return true;
      }
    }
    return false;
  }

  checkSubgrid(rowIndex, colIndex, number) {
    const subgridSize = 3;
    const startRow = Math.floor(rowIndex / subgridSize) * subgridSize;
    const startCol = Math.floor(colIndex / subgridSize) * subgridSize;

    for (let i = 0; i < subgridSize; i++) {
      for (let j = 0; j < subgridSize; j++) {
        if (this.tableroArray[startRow + i][startCol + j] == number) {
          return true;
        }
      }
    }
    return false;
  }

  paintSudoku() {
    this.createStructure();
  }
}

const sudoku = new Sudoku();
sudoku.start();
sudoku.paintSudoku();
