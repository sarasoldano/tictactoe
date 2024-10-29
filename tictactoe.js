
"use strict";

// author note: I used the Geeks 4 Geeks implementation on the minimax algoritm to create an unbeatable tictactoe machine.


const app = Vue.createApp({
    data() {
        return {
            currentplayer: 'X',
            board: [
                ["", "", ""], 
                ["", "", ""], 
                ["", "", ""]
            ]
        };
    },
    methods: {
        // when a button cell is clicked
        cellClicked(row, col) {
            // checks the board is not full and that the clicked button is empty
            if (!this.gameover && this.board[row][col] === '') {
                // console.log('start');

                // places X in cell that user picks
                this.board[row][col] = this.currentplayer;                
                // checks if board has been won
                if (this.checkforwin()) {
                    console.log('game over!');
                // checks if board has been won
                } else if (this.checkfortie()) {
                    console.log("its a tie");
                } else {
                    // computers turn -> O turn
                    this.currentplayer = this.currentplayer === 'X' ? 'O' : 'X';
                    if (this.currentplayer === 'O') {
                        this.computermove();
                    }
                }
            }
        },
        computermove() { 
            // console.log('computer making move');
            const move = this.findbestmove();
            // computer makes the next best move and places O in cell
            this.board[move.row][move.col] = this.currentplayer;
            if (this.checkforwin()) {
                console.log("winner:", this.currentplayer);
            } else if (this.checkfortie()) {
                console.log("tieeee");
            } else {
                // switches back to user
                this.currentplayer = this.currentplayer === 'X' ? 'O' : 'X';
            }
        },
        checkforwin() {
            // any horizontal wins
            // console.log('inside checkforwin first');
            for (let row = 0; row < 3; row++) {
                if (this.board[row][0] !== '' && this.board[row][0] == this.board[row][1] && this.board[row][1] == this.board[row][2]) {
                    // console.log('first');
                    return true;
                }
            }
            // any vertical wins
            for (let col = 0; col < 3; col++) {
                if (this.board[0][col] !== '' && this.board[0][col] == this.board[1][col] && this.board[1][col] == this.board[2][col]) {
                    return true;
                }
            }
            // any diagonal wins
            if (this.board[0][2] !== '' && this.board[0][2] == this.board[1][1] && this.board[1][1] == this.board[2][0]) {
                return true;
            }
            if (this.board[0][0] !== '' && this.board[0][0] == this.board[1][1] && this.board[1][1] == this.board[2][2]) {
                return true;
            }
            // otherwise board has not been won yet
            return false;
        },
        // checks if all the spaces are filled up 
        checkfortie() {
            for (let row of this.board) {
                for (let cell of row) {
                    if (cell === '') {
                        return false;
                    }
                }
            }
            return true;
        },
        // resets the board
        reset() {
            this.currentplayer = 'X';
            this.board = [
                ["", "", ""], 
                ["", "", ""], 
                ["", "", ""]
            ];
        }, // if board has been won, checks which player won
        eval(b) {
            // horizontal win
            for (let row = 0; row < 3; row++) {    
                if (b[row][0] === b[row][1] && b[row][1] === b[row][2]) {
                    if (b[row][0] === 'X') return -10;
                    else if (b[row][0] === 'O') return +10;
                }
            }
            // vertical win
            for (let col = 0; col < 3; col++) {
                if (b[0][col] === b[1][col] && b[1][col] === b[2][col]) {
                    if (b[0][col] === 'X') return -10;
                    else if (b[0][col] === 'O') return +10;
                }
            }
            // diagonal win
            if (b[0][0] == b[1][1] && b[1][1] == b[2][2]) {
                if (b[0][0] === 'X') return -10;
                else if (b[0][0] === 'O') return +10;
            }

            if (b[0][2] == b[1][1] && b[1][1] == b[2][0]) {
                if (b[0][2] === 'X') return -10;
                else if (b[0][2] === 'O') return +10;
            }

            return 0;


        },
        minimax(board, depth, ismax) {
            //console.log('enter mini');
            let score = this.eval(board);
            //console.log('its been evaled', score);
            // checks for win
            if (score === 10) return score - depth;

            if (score === -10) return score - depth;

            if (!this.movesleft(board)) return 0;

            
            if (ismax) {
                let best = -5555;

                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        if (board[i][j] === '') {
                            board[i][j] = 'O';
                            best = Math.max(best, this.minimax(board, depth + 1, !ismax));
                            board[i][j] = '';
                        }
                    }
                }
                return best;
            } else {
                let best = 5555;
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        if (board[i][j] === '') {
                            board[i][j] = 'X';
                            best = Math.min(best, this.minimax(board, depth + 1, !ismax));
                            //console.log('did i get here');
                            board[i][j] = '';
                        }
                    }
                }
                return best;
            }
        },
        // finds if there are still blank spaces
        movesleft() {
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (this.board[i][j] === '') {
                        return true;
                    }
                }
            }
            return false;
        },
        // finds the optimal move for the computer player
        findbestmove() {
            let bestval = -5555;
            let bestmove = { row: -1, col: -1 };
            //console.log('find best move entered');
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (this.board[i][j] === '') {
                        this.board[i][j] = 'O';
                        //console.log('testing');
                        let moveval = this.minimax(this.board, 0, false);
                        //console.log('post mini');
                        this.board[i][j] = '';
                        if (moveval > bestval) {
                            bestmove.row = i;
                            bestmove.col = j;
                            bestval = moveval;
                        }
                    }
                }
            }
            return bestmove;
        }
    }
});
app.mount('#app')
