import React from "react";

interface TimerProps {

}

export class Timer extends React.Component {
    constructor(props: TimerProps) {
        super(props);
        this.startTimer = this.startTimer.bind(this);
    }

    clickedTimes: number = 0;

    startTimer() {
        console.log("Starting timer #" + this.clickedTimes)
        this.clickedTimes++
    }

    render() {
        return (
            <div id="timerContainer">
                <div id="p1container">
                    <code id="timeDisplay">00:00</code>
                </div>
                <div id="p2container">
                    <code id="timeDisplay">00:00</code>
                </div>
                <button onClick={this.startTimer}>Start timer</button>
            </div>
        );
    }
}