// -------------------------------------------------------------------------State Building-------------------------------------------------------------------------

let state = {};

const resetState = () => {
    state.board = [
        // For tictactoe we need 9 squares with tags for who's in control and whether it's occupied.
        // Both tags will get filled in as players take their turns.
        // I may need to go back and edit this to exclude the occupied tag but we'll see as we get further...
        {control: '', occupied: false},
        {control: '', occupied: false},
        {control: '', occupied: false},
        {control: '', occupied: false},
        {control: '', occupied: false},
        {control: '', occupied: false},
        {control: '', occupied: false},
        {control: '', occupied: false},
        {control: '', occupied: false},
    ];
    state.players = ['', ''];
    state.whosOnFirst = Math.round(Math.random());
    state.getCurrentPlayer = () => state.players[state.whosOnFirst];
    state.winner = null;
};

// -------------------------------------------------------------------------DOM Selectors-------------------------------------------------------------------------

const theBoard = document.getElementById('board');                  // This is just declaring the <main> as the board to play [The Game] on

const turnAnnouncer = document.getElementById('current_player');    // This is giving an official referee badge to the <h3> at the bottom of the index.html

const resetButton = document.getElementById('reset');    // This is giving an official referee badge to the <h3> at the bottom of the index.html

// -------------------------------------------------------------------------Game Helper Functions-------------------------------------------------------------------------

const changeTurn = () => {
    state.whosOnFirst = Math.abs(state.whosOnFirst - 1);
    // Since it starts at 0, every time someone takes a turn
    // the turn index goes down by 1 (from 1 to 0 and 0 to -1)
    // and then takes the absolute value, changing any -1's
    // back into a 1 so the function can be done indefinitely.
};

const computerTurn = () => {
    if (state.players[state.whosOnFirst] === "Computer") {                  // Should the player enter the name "Computer" for player 2, Single-player mode is engaged.
        let rando = Math.floor(Math.random() * state.board.length);
        while (state.board[rando].occupied) {
            rando = Math.floor(Math.random() * state.board.length);
        };
        state.board[rando].control = state.players[state.whosOnFirst];      // Whoever's on first is labeled as the owner of the square, then...
        state.board[rando].occupied = true;                                 // The square is no longer available to take.
        changeTurn();
        buildTime();
    };
};

// This function started simple but grew out of control. It was easier to work inside this function than to make an entirely new one, as it's already checking who
// controls each square. So I revamped it to push the values for state.board.control into a new array and then run a bunch of if checks for each winning move.
// Once it finds a winning combination, it changes the state.winner to whoever controls a specific square in the win condition.
const checkBoard = () => {
    let squareArray = [];
    for (let i = 0; i < state.board.length;  i++) {
        const square = state.board[i];
        console.log(square.control);
        squareArray.push(square.control);
    };
    console.log(squareArray);
    if ((squareArray[0] === squareArray[1]) && (squareArray[1] === squareArray[2])) {
        state.winner = state.board[0].control;
        console.log(state.winner);
    };
    if ((squareArray[0] === squareArray[3]) && (squareArray[3] === squareArray[6])) {
        state.winner = state.board[0].control;
        console.log(state.winner);
    };
    if ((squareArray[0] === squareArray[4]) && (squareArray[4] === squareArray[8])) {
        state.winner = state.board[0].control;
        console.log(state.winner);
    };
    if ((squareArray[2] === squareArray[4]) && (squareArray[4] === squareArray[6])) {
        state.winner = state.board[2].control;
        console.log(state.winner);
    };
    if ((squareArray[1] === squareArray[4]) && (squareArray[4] === squareArray[7])) {
        state.winner = state.board[4].control;
        console.log(state.winner);
    };
    if ((squareArray[3] === squareArray[4]) && (squareArray[4] === squareArray[5])) {
        state.winner = state.board[4].control;
        console.log(state.winner);
    };
    if ((squareArray[2] === squareArray[5]) && (squareArray[5] === squareArray[8])) {
        state.winner = state.board[8].control;
        console.log(state.winner);
    };
    if ((squareArray[6] === squareArray[7]) && (squareArray[7] === squareArray[8])) {
        state.winner = state.board[8].control;
        console.log(state.winner);
    };
};


// --------------------------------------------------------------DOM Manipulation Functions--------------------------------------------------------------------

const buildTheBoard = () => {
    theBoard.innerHTML = '';                                    // Scorched earth is the best policy.
    for (let i = 0; i < state.board.length; i++) {              // Should run for 9 iterations. If not, this might not be tic-tac-toe...
        const gridElement = document.createElement('div');      // Make divs out of the boxes
        gridElement.classList.add('grid');                      // Send them to cotillion so they have some class
        if (state.board[i].occupied) {
            gridElement.classList.add('taken');
            if (state.board[i].control === state.players[0]) {
                gridElement.innerHTML = 'X';
            } else {
                gridElement.innerHTML = 'O'
            };
        };
        gridElement.dataset.position = i;                       // Assign a new property called "position" to each of them
        theBoard.appendChild(gridElement);                      // Make sure that the board has the created grid elements as children
    };
};

const gatherPlayers = () => {
    let text;

    if (!state.players[0] || !state.players[1]) {               // If there are no players, we need a field to take player names as inputs
        text = `
        <input name="player1" placeholder="Enter Player 1">
        <input name="player2" placeholder="Enter Player 2">
        <button class="start">Begin!</button>
        <h5>To play alone, enter "Computer" as one of the player names.</h5>
        `;
    } else {                                                    // If there are players, we need to know whose turn it is!
        if (state.winner) {
            text = `<span class='player'>${state.winner} has won!</span>`;
        } else {
            text = `<span class='player'>${state.getCurrentPlayer()}</span>, it is currently your move.`
        }
    }
    turnAnnouncer.innerHTML = text;
};

const buildTime = () => {
    buildTheBoard();
    gatherPlayers();
    computerTurn();
    console.log(state);
};

// -------------------------------------------------------------------------Event Listeners-------------------------------------------------------------------------

theBoard.addEventListener('click', (event) => {
    if (state.winner) return;
    
    if (event.target.className !== 'grid') return;                      // Set up a release valve if the click isnt on a div element (aka one of the squares)

    const gridId = event.target.dataset.position;                       // Paint the target for the event listener
    
    if (state.players[0] === '' || state.players[1] === '') return;     // Set up another release valve in case players have not been declared yet

    state.board[gridId].control = state.players[state.whosOnFirst];     // Whoever's on first is labeled as the owner of the square, then...
    state.board[gridId].occupied = true;                                // The square is no longer available to take.
    
    //console.dir(event.target);                                          // Log the directory for the selected square so we can run troubleshooting later and make sure things are progressing smoothly.
    checkBoard();
    changeTurn();
    buildTime();
});

turnAnnouncer.addEventListener('click', (event) => {
    console.log('this is the event from turnAnnouncer', event.target);
    if (event.target.className === "start") {
        const player1Input = document.querySelector('input[name=player1]');
        const player1Value = player1Input.value;
        state.players[0] = player1Value;
        const player2Input = document.querySelector('input[name=player2]');
        const player2Value = player2Input.value;
        state.players[1] = player2Value;
        buildTime();
    }
});

resetButton.addEventListener('click', () => {
    location.reload();
});

// -------------------------------------------------------------------Pull yourself up by the bootstraps------------------------------------------------------------------

resetState();
buildTime();