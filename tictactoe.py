"""
Tic Tac Toe Player
"""

import math
import copy

X = "X"
O = "O"
EMPTY = None

def initial_state():
    """
    Returns starting state of the board.
    """
    return [[EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY]]


def player(board):
    """
    Returns player who has the next turn on a board.
    """
    number_of_empty = 0
    number_of_x = 0
    y_number = 0
    for row in board:
        for each_player in row:
            if each_player == "X":
                number_of_x += 1
            elif each_player == "O":
                y_number += 1
            else:
                number_of_empty += 1

    if number_of_x == 0 and y_number == 0:
        return "X"
    if number_of_x > y_number:
        return "O"
    elif y_number > number_of_x:
        return "X"
    else:
        return "X"

    raise NotImplementedError


def actions(board):
    """
    Returns set of all possible actions (i, j) available on the board.
    """
    next_moves = set()
    row_index = 0
    for row in board:
        cell_index = 0
        for cell in row:
            if cell is None:
                next_move = (row_index, cell_index)
                next_moves.add(next_move)
            cell_index += 1
        row_index += 1

    return next_moves


def result(board, action):
    """
    Returns the board that results from making move (i, j) on the board.
    """
    row, col = action
    if board[row][col] != None:
        raise Exception("The Error Happened")

    artificial_board = copy.deepcopy(board)
    player_current = player(board)
    artificial_board[row][col] = player_current

    return artificial_board


def winner(board):
    """
    Returns the winner of the game, if there is one.
    """
    winner = None

    for row_index in range(3):
        number_of_nones = 0
        for col_index in range(3):
            if board[row_index][col_index] == None:
                number_of_nones += 1
        if number_of_nones == 3:
            continue
        else:
            if board[row_index][0] == board[row_index][1] == board[row_index][2]:
                winner = board[row_index][0]
                return winner

    for i_col in range(3):
        noned_cells = 0
        for i_row in range(3):
            if board[i_row][i_col] == None:
                noned_cells += 1
        if noned_cells == 3:
            continue
        else:
            if board[0][i_col] == board[1][i_col] == board[2][i_col]:
                winner = board[0][i_col]
                return winner

    d_nones = 0
    for d_row in range(3):
        if board[d_row][d_row] == None:
            d_nones += 1
    if d_nones != 3:
        if board[0][0] == board[1][1] == board[2][2]:
            winner = board[0][0]
            return winner

    antid_nones = 0
    for antid_row in range(3):
        if board[antid_row][-(antid_row + 1)] == None:
            antid_nones += 1
    if antid_nones != 3:
        if board[0][-1] == board[1][-2] == board[2][-3]:
            winner = board[0][-1]
            return winner

    return winner


def terminal(board):
    """
    Returns True if game is over, False otherwise.
    """
    number_of_empty = 0
    for row in board:
        for cell in row:
            if cell == None:
                number_of_empty += 1
    the_winner = winner(board)

    if the_winner != None or number_of_empty == 0:
        return True
    else:
        return False


def utility(board):
    """
    Returns 1 if X has won the game, -1 if O has won, 0 otherwise.
    """
    condition = terminal(board)
    the_winner = winner(board)
    if condition == True:
        if the_winner == "X":

            return 1
        elif the_winner == "O":

            return -1

        else:
            return 0

    raise NotImplementedError


def minimax(board):
    """
    Returns the optimal action for the current player on the board.
    """
    if terminal(board) == True:
        return None
    else:
        artificial_board = copy.deepcopy(board)
        if player(artificial_board) == X:
            min_score = -math.inf
            for action in actions(artificial_board):
                our_max = min_value(result(artificial_board, action))
                if our_max > min_score:
                    min_score = our_max
                    best_move = action
        else:
            max_score = math.inf
            for action in actions(artificial_board):
                our_min = max_value(result(artificial_board, action))
                if our_min < max_score:
                    max_score = our_min
                    best_move = action
        return best_move

def max_value(board):
    if terminal(board) == True:
        return utility(board)
    else:
        max_eval = -math.inf
        for action in actions(board):
            eval = min_value(result(board, action))
            max_eval = max(eval, max_eval)
        return max_eval

def min_value(board):
    if terminal(board) == True:
        return utility(board)
    else:
        minEval = math.inf
        for each_action in actions(board):
            eval = max_value(result(board, each_action))
            minEval = min(minEval, eval)
        return minEval

