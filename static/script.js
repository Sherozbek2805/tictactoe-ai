let board = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
]

let user = null
let ai = null
let gameOver = false
let isPlayerTurn = false

const cells = document.querySelectorAll(".cell")
const statusText = document.getElementById("status")

cells.forEach(cell => {
    cell.addEventListener("click", playerMove)
})

function choosePlayer(choice) {

    user = choice
    ai = choice === "X" ? "O" : "X"

    document.getElementById("playerSelect").style.display = "none"

    if (user === "X") {
        statusText.innerText = "Your turn"
        isPlayerTurn = true
    } 
    else {
        statusText.innerText = "AI thinking..."
        isPlayerTurn = false
        aiMove()
    }
}

function playerMove(e) {

    if (gameOver || !isPlayerTurn) return

    let row = e.target.dataset.row
    let col = e.target.dataset.col

    if (board[row][col] !== null) return

    board[row][col] = user
    e.target.innerText = user

    isPlayerTurn = false

    checkGame()

    if (!gameOver) {
        aiMove()
    }
}

async function aiMove() {

    statusText.innerText = "AI thinking..."

    // small delay for realism
    await new Promise(r => setTimeout(r, 500))

    let response = await fetch("/ai_move", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ board: board })
    })

    let data = await response.json()

    let move = data.move

    if (move && !gameOver) {

        let r = move[0]
        let c = move[1]

        board[r][c] = ai

        document.querySelector(
            `.cell[data-row="${r}"][data-col="${c}"]`
        ).innerText = ai

        checkGame()

        if (!gameOver) {
            isPlayerTurn = true
            statusText.innerText = "Your turn"
        }
    }
}

function checkGame() {

    let winner = getWinner()

    if (winner) {
        statusText.innerText = winner + " wins!"
        gameOver = true
        return
    }

    let full = true

    for (let row of board) {
        for (let cell of row) {
            if (cell === null) {
                full = false
            }
        }
    }

    if (full) {
        statusText.innerText = "Draw!"
        gameOver = true
    }
}

function getWinner() {

    const combos = [

        [[0,0],[0,1],[0,2]],
        [[1,0],[1,1],[1,2]],
        [[2,0],[2,1],[2,2]],

        [[0,0],[1,0],[2,0]],
        [[0,1],[1,1],[2,1]],
        [[0,2],[1,2],[2,2]],

        [[0,0],[1,1],[2,2]],
        [[0,2],[1,1],[2,0]]

    ]

    for (let combo of combos) {

        let a = combo[0]
        let b = combo[1]
        let c = combo[2]

        if (
            board[a[0]][a[1]] &&
            board[a[0]][a[1]] === board[b[0]][b[1]] &&
            board[a[0]][a[1]] === board[c[0]][c[1]]
        ) {
            return board[a[0]][a[1]]
        }
    }

    return null
}

function resetGame() {

    board = [
        [null,null,null],
        [null,null,null],
        [null,null,null]
    ]

    cells.forEach(cell => {
        cell.innerText = ""
    })

    user = null
    ai = null
    gameOver = false
    isPlayerTurn = false

    document.getElementById("playerSelect").style.display = "block"

    statusText.innerText = "Choose your player"
}