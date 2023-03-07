import './App.css';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import { Chess, Square, Move } from "chess.js";
import { Chessboard } from "react-chessboard";
import {Player, Timer} from "./timer"
import ChessTimer from './timer'
import {GameSounds} from "./audio";
import {wait} from "@testing-library/user-event/dist/utils";

interface ShortMove {
    from: Square;
    to: Square;
    promotion?: string;
}

function App() {
    const checkTriggeredRef = useRef(false);

    const [currentPlayer, setCurrentPlayer] = useState("white");

    const [timer, setTimer] = useState(new Timer({secAmount: 180}, lossPopup));


    const audio: GameSounds = new GameSounds()

    const [game, setGame] = useState(new Chess());
    const gameCopy: Chess = Object.create(game);

    function makeAMove(move: ShortMove | string) : Move | null {
        console.log(move);
        const result = gameCopy.move(move);
        setGame(gameCopy);
        return result; // null if the move was illegal, the move object if the move was legal
    }

    // This does a completely random move with no intelligence
    function makeRandomMove() {
        const possibleMoves = gameCopy.moves() as string[];
        if (gameCopy.isGameOver() || gameCopy.isDraw() || possibleMoves.length === 0)
            return; // exit if the game is over
        const randomIndex = Math.floor(Math.random() * possibleMoves.length);
        makeAMove(possibleMoves[randomIndex]);
    }

    function onDrop(sourceSquare: Square, targetSquare: Square): boolean {

        if (makeAMove({ from: sourceSquare, to: targetSquare })) {
            //makeRandomMove(); // Uncomment to play against random bot
            afterDrop()
            return true;
        } else if (makeAMove({ from: sourceSquare, to: targetSquare, promotion: 'q' })) {
            //makeRandomMove(); // Uncomment to play against random bot
            afterDrop()
            return true;
        } else {
            return false;
        }
    }

    function afterDrop() {
        const timerCopy: Timer = Object.create(timer);
        audio.playMove()
        timer.test++ // DEBUG
        timerCopy.togglePlayer()
        setTimer(timerCopy)
        checkTriggeredRef.current = false
        //checkCheck();
    }

    function lossPopup(looser: Player) {
        console.log("Loosing player is " + looser)
    }

    function resetGame() {
        setGame(new Chess());
        setTimer(new Timer({secAmount: 180}, lossPopup));
    }

    const checkCheck = useCallback(() => {
        if (game.isCheck()) {
            if (!checkTriggeredRef.current)  {
                checkTriggeredRef.current = true
                audio.playCheck()
                console.log("Check!")
            }
        }
        //else console.log("Not check")
    }, [game, checkTriggeredRef, audio]);

    // This is needed to be run every 0.5s to fix a bug with chess.js
    useEffect(() => {
        const interval = setInterval(() => {
            checkCheck()
        }, 500);

        return () => clearInterval(interval);
    }, [checkCheck]);

    function checkEnd() {

    }

    function delay(time: number) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    return (
        <div id="main-content">
            <div id="headerbar">
                <div id="logo-title">
                    ♟ schackmatt
                </div>
                <div>
                    <button onClick={resetGame} id="reset-button">Reset / Resign</button>
                </div>
            </div>
            <div id="chess-pane">
                <div id="playerTurn">
                    Current player is {currentPlayer}
                </div>
                <div id="timer1">
                    <ChessTimer timer={timer} setTimer={setTimer}/>
                </div>
                <div id="chessboard">
                    <Chessboard position={game.fen()} onPieceDrop={onDrop} />
                </div>
            </div>
        </div>
    );
}

export default App;
