import './App.css';
import React, { useState } from 'react';
import { Chess, Square, Move } from "chess.js";
import { Chessboard } from "react-chessboard";
import { Timer } from "./timer"
import {GameSounds} from "./audio";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {root as appRoot} from "./index";

function Example() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Launch demo modal
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}


interface ShortMove {
    from: Square;
    to: Square;
    promotion?: string;
}

function App() {

    const audio: GameSounds = new GameSounds()

    const [game, setGame] = useState(new Chess());
    const gameCopy: Chess = Object.create(game);

    function makeAMove(move: ShortMove | string) : Move | null {
        console.log(move);
        const result = gameCopy.move(move);
        setGame(gameCopy);
        return result; // null if the move was illegal, the move object if the move was legal
    }

    // This creates a completely random move with no intelligence
    function makeRandomMove() {
        const possibleMoves = gameCopy.moves() as string[];
        if (gameCopy.isGameOver() || gameCopy.isDraw() || possibleMoves.length === 0)
            return; // exit if the game is over
        const randomIndex = Math.floor(Math.random() * possibleMoves.length);
        makeAMove(possibleMoves[randomIndex]);
    }

    function onDrop(sourceSquare: Square, targetSquare: Square): boolean {
        const gameCopy: Chess = Object.create(game);
        if (makeAMove({ from: sourceSquare, to: targetSquare })) {
            //makeRandomMove();
            audio.playMove()
            appRoot.render(<Example/>)
            return true;
        } else if (makeAMove({ from: sourceSquare, to: targetSquare, promotion: 'q' })) {
            //makeRandomMove();
            audio.playMove()
            appRoot.render(<Example/>)
            return true;
        } else {
            return false;
        }
    }

    return (
        <div id="main-content">
            <div id="headerbar">
                <div id="logo-title">
                    ♟ schackmatt
                </div>
                <Timer/>
            </div>
            <div id="chess-pane">
                Here is game information
                <div id="chessboard">
                    <Chessboard position={game.fen()} onPieceDrop={onDrop} />
                </div>
            </div>


            <div id="timer-container">
                <div id="timer">03:00</div>
            </div>

            <div id="timer-container1">
                <div id="timer1">03:00</div>
            </div>


            <div id="confirm_Btn" title="Resign?"><div id="myDialogText"></div>
            </div>

            <div id="dialog-confirm" title="You lost - you resigned the game">


                <button id="timer_start_Btn">START GAME</button>
                <button id="resignBtn">RESIGN</button>
                <button id="startBtn">START POSITION</button>
                <button id="clearBtn">CLEAR BOARD</button>
            </div>
        </div>
    );
}

/*
function timer() {
    let playing = true;
    let currentPlayer = 1;

    let starttime = 180;
    let starttime1 = 180;

    function Playerswap() {
        if (playing) {
            return currentPlayer = currentPlayer === 1 ? 2 : 1;
        }
    }

    document.getElementById("timer_start_Btn").addEventListener("click", function () {
        document.getElementById("timer_start_Btn").style.display = "none";


        let timer2 = setInterval(function () {
            let minutes = Math.floor(starttime / 60);
            let seconds = starttime % 60;
            let clocktime = (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);

            let minutes1 = Math.floor(starttime1 / 60);
            let seconds1 = starttime1 % 60;
            let clocktime1 = (minutes1 < 10 ? "0" + minutes1 : minutes1) + ":" + (seconds1 < 10 ? "0" + seconds1 : seconds1);


            if (currentPlayer === 1) {
                document.getElementById("timer1").innerHTML = clocktime;
                starttime = starttime - 1;

                if (starttime <= 30) {
                    document.getElementById("timer1").style.color = "#CC0000";
                }
                if (starttime <= 0) {
                    clearInterval(timer2);
                    alert("LOST THE GAME\n You lost on time");


                }

            }

            if (currentPlayer === 2) {
                document.getElementById("timer").innerHTML = clocktime1;
                starttime1 = starttime1 - 1;

                if (starttime1 <= 30) {
                    document.getElementById("timer").style.color = "#CC0000";
                }
                if (starttime1 <= 0) {
                    clearInterval(timer2);
                    alert("LOST THE GAME\n You lost on time");


                }

            }

            document.getElementById("resignBtn").addEventListener("click", function () {
                clearInterval(timer2);
            });


        }, 1000);
    },)

    document.addEventListener('keyup', event => {
        if (event.code === 'Space') {
            Playerswap();
        }
    });

    $("#myDialogText").text("Are you sure you want to resign?");

    $( function() {
        $(document).ready(function() {
            $("#resignBtn").click(function() {
                $("#confirm_Btn").dialog({
                    resizable: false,
                    height: "auto",
                    width: 400,
                    modal: true,
                    buttons: {
                        "Cancel": function () {
                            $(this).dialog("close");
                        },
                        "Resign": function () {
                            $("#confirm_Btn").click(function(){
                                $("#dialog-confirm").dialog({
                                    resizable: false,
                                    height: auto,
                                    width: 300,
                                    modal: true,
                                    buttons: {
                                        "Play again": function() {
                                            $(this).dialog("close");
                                        }
                                    }

                                });
                                // Handle resign button click here
                                $(this).dialog("close");

                            });

                        }
                    }
                })
            });
        });
    });
}
*/



export default App;
