"use strict";


//
// INITIALISE THE GAME //
//

const container = document.getElementById('container');
let buttons = [];
let buttonValues = [];
let numberOfRows;
let numberOfColumns;
let availableMines = 35;
let numberOfSpaces;
let mineCount = 0;
let mineArray = [];
let remainingSpaces;


function init() {
  function makeRows(rows, cols) {
    container.style.setProperty('--grid-rows', rows);
    container.style.setProperty('--grid-cols', cols);
    for (let i = 0; i < (rows * cols); i++) {
      let cell = document.createElement("button");
      cell.type = "button";
      container.appendChild(cell).className = "grid-item";
      container.appendChild(cell).id = i;
      buttons.push(cell);      
    }
    numberOfSpaces = rows*cols;
    numberOfRows = rows;
    numberOfColumns = cols;
  }
  makeRows(16, 16);

  remainingSpaces = numberOfSpaces - availableMines;

  // ASSIGN TYPE 

  let avlMines = availableMines;

  for (let i = 0; i < numberOfRows; i++) { // populate the rows
    let currentRow = [];
    for (let c = 0; c < numberOfColumns; c++) { // populate the columns
      let random = Math.random();
      console.log(random);
      let ratio = avlMines / numberOfSpaces;
      if (random > ratio || avlMines === 0) {
        currentRow.push({flagged: false, posx: c, posy: i, state: 'NotClicked', type: 'number', value: '', neighbours: []});
        numberOfSpaces = numberOfSpaces - 1;
      } else if (random < ratio && avlMines > 0) {
        currentRow.push({flagged: false, posx: c, posy: i, state: 'NotClicked', type: 'mine', value: 'M', neighbours: []});
        avlMines = avlMines - 1;
        numberOfSpaces = numberOfSpaces - 1;
        ratio = avlMines / numberOfSpaces;
        let id = (i * numberOfColumns) + c;
        mineArray.push(id);
      }
    }
    buttonValues.push(currentRow);
  }

  console.log(`Mines are in IDs: ${mineArray}`); //NEED TO REMOVE THIS <<<<<<

  // ASSIGN MINE COUNT

  for (let r = 0; r < numberOfRows; r++) { // scroll through rows

    for (let c = 0; c < numberOfColumns; c++) { //scroll through cols
      
      function checkMineCount(nbrPosY, nbrPosX) {
        if (buttonValues[nbrPosY][nbrPosX].type === "mine") {
          mineCount = mineCount + 1;
        }
        return mineCount;
      }

      if (buttonValues[r][c].type !== "mine") {
        if (r === 0 && c === 0) { // TOP LEFT
          checkMineCount(r, c + 1);
          checkMineCount(r + 1, c);
          checkMineCount(r + 1, c + 1);
        } else if (r === 0 && c > 0 && c < numberOfColumns - 1) { // TOP ROW
          checkMineCount(r, c - 1);
          checkMineCount(r, c + 1);
          checkMineCount(r + 1, c - 1);
          checkMineCount(r + 1, c);
          checkMineCount(r + 1, c + 1);
        } else if (r === 0 && c === numberOfColumns - 1) { // TOP RIGHT
          checkMineCount(r, c - 1);
          checkMineCount(r + 1, c - 1);
          checkMineCount(r + 1, c);
        } else if (r > 0 && r < numberOfRows - 1 && c === 0) { // LEFT MIDDLES
          checkMineCount(r - 1, c);
          checkMineCount(r - 1, c + 1);
          checkMineCount(r, c + 1);
          checkMineCount(r + 1, c);
          checkMineCount(r + 1, c + 1);
        } else if (r > 0 && r < numberOfRows - 1 && c === numberOfColumns - 1) { // RIGHT MIDDLES
          checkMineCount(r - 1, c - 1);
          checkMineCount(r - 1, c);
          checkMineCount(r, c - 1);
          checkMineCount(r + 1, c - 1);
          checkMineCount(r + 1, c);
        } else if (r === numberOfRows - 1 && c === 0) { // BOTTOM LEFT
          checkMineCount(r - 1, c);
          checkMineCount(r - 1, c + 1);
          checkMineCount(r, c + 1);
        } else if (r === numberOfRows - 1 && c > 0 && c < numberOfColumns - 1) { // BOTTOM ROW
          checkMineCount(r - 1, c - 1);
          checkMineCount(r - 1, c);
          checkMineCount(r - 1, c + 1);
          checkMineCount(r, c - 1);
          checkMineCount(r, c + 1);
        } else if (r === numberOfRows - 1 && c === numberOfColumns - 1) { // BOTTOM RIGHT
          checkMineCount(r - 1, c - 1);
          checkMineCount(r - 1, c);
          checkMineCount(r, c - 1);
        } else {
          checkMineCount(r - 1, c - 1);
          checkMineCount(r - 1, c);
          checkMineCount(r - 1, c + 1);
          checkMineCount(r, c - 1);
          checkMineCount(r, c + 1);
          checkMineCount(r + 1, c - 1);
          checkMineCount(r + 1, c);
          checkMineCount(r + 1, c + 1);
        }
        
        buttonValues[r][c].value = mineCount;
        mineCount = 0;
      } else {
        continue;
      }

    }

  }

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('contextmenu', function(e){btnRightClicked(e, e.target.id)});
  };

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function(e){btnClicked(e.target.id)});
  };

}

init();

// LEFT CLICK

const btnClicked = function(id) {  
  let y = Math.trunc(id / numberOfColumns);
  let x = id - (y * numberOfRows);

  if (buttonValues[y][x].state === "Clicked") {
    return;
  }

  buttons[id].classList.remove('btnRtClicked');

  if (buttonValues[y][x].type === "mine") { // GAME OVER
    gameOver();
    revealMines();
    alert(`Game over!`);
    return;
  }

  if (buttonValues[y][x].value === 0) { // EMPTY SPACE
    checkZeros(y, x);
  } else { // NUMBER
    console.log(buttonValues[y][x].state);
    setClicked(id, y, x);
    buttons[id].classList.add('btnClicked');
    buttons[id].innerText = buttonValues[y][x].value;
    buttons[id].classList.remove('btnRtClicked');
  }

  function checkZeros (r, c) {
    if (r < 0 || c > numberOfColumns - 1 || r > numberOfRows - 1 || c < 0) {
      return;
    }
    
    if (buttonValues[r][c].state === 'Clicked') {
      return;
    }

    if (buttonValues[r][c].type !== 'mine') {
      let newId = (r * numberOfRows) + c;
      buttons[newId].classList.add('btnClicked');
      if (buttonValues[r][c].value !== 0) {
        setClicked(newId, r, c);
        buttons[newId].innerText = buttonValues[r][c].value;
        buttons[newId].classList.remove('btnRtClicked');
        return;
      } else {
        buttonValues[r][c].state = "Clicked";
        buttons[newId].innerText = '';
        buttons[newId].classList.remove('btnRtClicked');
        remainingSpaces = remainingSpaces - 1;
      }
    } else {
      return;
    }

    checkZeros(r - 1, c);
    checkZeros(r + 1, c);
    checkZeros(r, c - 1);
    checkZeros(r, c + 1);
    checkZeros(r - 1, c - 1);
    checkZeros(r + 1, c - 1);
    checkZeros(r - 1, c + 1);
    checkZeros(r + 1, c + 1);

  }

checkWin();

}

// RIGHT CLICK
  
const btnRightClicked = function(e, id) {
  let y = Math.trunc(id / numberOfColumns);
  let x = id - (y * numberOfRows);

    if (buttonValues[y][x].state !== "Clicked") {

      if (buttonValues[y][x].flagged === false) {
        e.preventDefault();
        buttons[id].innerText = "?";
        buttons[id].classList.add('btnRtClicked');
        buttonValues[y][x].flagged = true;
      } else if (buttonValues[y][x].flagged === true) {
        e.preventDefault();
        buttons[id].innerText = "";
        buttons[id].classList.remove('btnRtClicked');
        buttonValues[y][x].flagged = false;
      }

    } else {
      e.preventDefault();
      return;
    }  
};


// GAME OVER

function gameOver() {
  for (let i = 0; i < buttons.length; i++) {
    document.getElementById(`${i}`).disabled = true;
  }
}

// REVEAL MINES

function revealMines() {
  for (let i = 0; i < mineArray.length; i++) {
    buttons[mineArray[i]].classList.add('btnRtClicked');
    buttons[mineArray[i]].innerText = "M";
  }
}


// CHECK WIN

function checkWin() {
  if (remainingSpaces === 0) {
    revealMines();
    gameOver();
    alert('you win');
  } else {
    return;
  }
}

// SET CLICKED

function setClicked(id, y, x) {
 if (buttonValues[y][x].state === "NotClicked") {
  buttonValues[y][x].state = "Clicked";
  remainingSpaces = remainingSpaces - 1;
 } else {
   return;
 }
}


// NEW GAME

document.getElementById("reset").addEventListener("click", function() {

  for (let i = 0; i < buttons.length; i++) {
    var test = document.getElementById(`${i}`);
    test.remove();
  }

  buttons = [];
  buttonValues = [];
  numberOfSpaces;
  mineCount = 0;
  mineArray = [];
  remainingSpaces = 0;

  init();

});