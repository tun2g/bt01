import { useState } from 'react';
import "./App.css";


function Square({ value, onSquareClick,win}) {
  if(!win) {

    return (
      <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
  }
  else{
    return (
      <button className="square winner" onClick={onSquareClick}>
      {value}
    </button>
    )
  }
}

function Board({ xIsNext, squares, onPlay, currentMove }) {
  function handleClick(i,j) {
    const index= i*3 + j 
    if (calculateWinner(squares.arr) || squares.arr[index]) {
      return;
    }
    let nextSquares=
      {
        "arr":Array(9).fill(null),
        "cur": {i,j}
      }
    ;
    for(let i=0;i<squares.arr.length;i++) {
      nextSquares.arr[i] = squares.arr[i]
    }
    if (xIsNext) {
      nextSquares.arr[index] = 'X';
    } else {
      nextSquares.arr[index] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares.arr);
  let status;
  if (winner) {
    status = 'Winner: ' + winner.type;

  } 
  else if(currentMove === 9)
  {
    status = 'Draw'
  }
  else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      {
        [...Array(3)].map((_,i)=>{
          return ( 
          <div className="board-row" key={`row${i}`}>
            {[...Array(3)].map((_,j)=>{
              const win = winner?.index.includes(i*3 + j) ? true : false 
              return(
              <Square key = {`col${j}`} value={squares.arr[i*3 + j]} onSquareClick={() => handleClick(i,j)} win={win}/>
              )
            })}
        </div>)
        })
      }
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState(
    [{
      "arr":Array(9).fill(null),
      "cur":null
    }]
  );
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const [sort,setSort] = useState(true);
  const currentSquares = {
    "arr": history[currentMove].arr,
    "cur": history[currentMove].cur
  };
  

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  let list 
  if(sort){
    list = history.slice()
  }
  else {
    list = history.slice().reverse()
  }
  const moves = list.map((squares, move) => {
    let description;
    if (sort) {

      if(move === history.length -1 && history.length > 1){
        description = `You are at move # (${squares.cur.i},${squares.cur.j})`
      }
      else if (move > 0) {
        description = `Go to move # (${squares.cur.i},${squares.cur.j})` ;
      }
      else {
        description = 'Go to game start';
      }
    }
    else {
      if(move === 0 && history.length > 1){
        description = `You are at move # (${squares.cur?.i},${squares.cur?.j})`
      }
      else if (move > 0 && move < history.length - 1) {
        description = `Go to move # (${squares.cur?.i},${squares.cur?.j})` ;
      }
      else {
        description = 'Go to game start';
      }
    }

    return (
      <li key={`move${move}`}>
        {
        (sort && move === history.length - 1 && history.length >1 ) || (move === 0 && history.length > 1 && !sort)
        ?
        <div>{description}</div>
        :
        <button onClick={() => jumpTo(sort?move: history.length - 1 - move)}>{description}</button>
        }
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} currentMove={currentMove}/>
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
      <button style={{margin:"100px 20px",height:"30px"}} 
      onClick={()=>{
        setSort(!sort)
        }}
      >{sort? "asc" : "des"}</button>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {type: squares[a], index: lines[i]};
    }
  }
  return null;
}
