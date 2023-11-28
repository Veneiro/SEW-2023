class Sudoku {

    constructor(){
        this.rows = 9;
        this.columns = 9;
        this.tablero = "3.4.69.5....27...49.2..4....2..85.198.9...2.551.39..6....8..5.32...46....4.75.9.6";
        this.tableroArray = new Array(this.rows);
        for (let i = 0; i < this.rows; i++) {
            this.tableroArray[i] = new Array(this.columns);
        }
    }

    start(){
        for (let i = 0; i < this.tableroArray.length; i++) {
            for (let j = 0; j < this.tableroArray[i].length; j++) {
                // Acceder a cada elemento de la matriz
                this.tableroArray[i][j] = this.tablero.charAt(i * this.columns + j);
            }
        }
    }
}

const sudoku = new Sudoku();
sudoku.start();