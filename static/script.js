let board = [
[null,null,null],
[null,null,null],
[null,null,null]
]

let user = null
let ai = null
let gameOver = false

const cells = document.querySelectorAll(".cell")
const statusText = document.getElementById("status")

cells.forEach(cell=>{
cell.addEventListener("click", playerMove)
})

function choosePlayer(choice){

user = choice
ai = choice === "X" ? "O" : "X"

document.getElementById("playerSelect").style.display = "none"

statusText.innerText = "Game started!"

if(ai === "X"){
aiMove()
}

}

function playerMove(e){

if(gameOver || !user) return

let row = e.target.dataset.row
let col = e.target.dataset.col

if(board[row][col] !== null) return

board[row][col] = user
e.target.innerText = user

checkGame()

if(!gameOver){
aiMove()
}

}

async function aiMove(){

statusText.innerText = "AI thinking..."

let response = await fetch("/ai_move",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({board:board})
})

let data = await response.json()

let move = data.move

if(move && !gameOver){

let r = move[0]
let c = move[1]

board[r][c] = ai

document.querySelector(
`.cell[data-row="${r}"][data-col="${c}"]`
).innerText = ai

checkGame()

}

}

function checkGame(){

let winner = getWinner()

if(winner){

statusText.innerText = winner + " wins!"
gameOver = true
return
}

if(board.flat().every(c=>c!==null)){
statusText.innerText = "Draw!"
gameOver = true
return
}

statusText.innerText = "Your turn"

}

function getWinner(){

const wins = [
[[0,0],[0,1],[0,2]],
[[1,0],[1,1],[1,2]],
[[2,0],[2,1],[2,2]],
[[0,0],[1,0],[2,0]],
[[0,1],[1,1],[2,1]],
[[0,2],[1,2],[2,2]],
[[0,0],[1,1],[2,2]],
[[0,2],[1,1],[2,0]]
]

for(let combo of wins){

let a = combo[0]
let b = combo[1]
let c = combo[2]

if(
board[a[0]][a[1]] &&
board[a[0]][a[1]] === board[b[0]][b[1]] &&
board[a[0]][a[1]] === board[c[0]][c[1]]
){
return board[a[0]][a[1]]
}

}

return null
}

function resetGame(){

board = [
[null,null,null],
[null,null,null],
[null,null,null]
]

cells.forEach(c=>c.innerText="")

gameOver = false
user = null
ai = null

document.getElementById("playerSelect").style.display = "block"

statusText.innerText = "Choose your player"

}