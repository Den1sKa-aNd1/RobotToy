import React from "react";
import Robot from "./robot";

class Table extends React.Component {

    initialState = {
        path: null,
        error: null,
        start: null,
        end: null,
        operation: [],
        location: "0;0",
        direction: "N",
        robotReportMessage: '',
    };

    state = Object.assign({}, this.initialState);
    componentDidMount() {
        this.reset(() => { this.process(this.props); });
    }
    componentWillReceiveProps(nextProps) {
        this.reset(() => { this.process(nextProps); });
    }
    reset = (cb) => {
        this.setState(this.initialState, cb);
    }
    process = (props) => {
        const { commands, location } = props;
        if (commands === '') { this.setState(this.initialState); }
        else {
            const parts = location.split(" ");
            this.setState({
                start: parts[0] + ";" + parts[1],
                location: parts[0] + ";" + parts[1],
                direction: parts[2]
            },
                () => { if (props.execute) { this.execute(commands); } }
            );
        }
    };
    runSequence = () => {
        let operation = this.state.operation.slice();
        let { location, path, direction } = this.state;
        path = path || {};
        path[location] = direction;
        let op = operation.shift();
        let newLocation = {};
        if (op === "L") newLocation = this.turnLeft();
        else if (op === "R") newLocation = this.turnRight();
        else if (op === "M") newLocation = this.moveForward();
        else if (op === "P") this.printPosition(location, direction);
        else this.printRobotMessage("Invalid command");
        if (newLocation.error) this.printRobotMessage('error move');
        this.setState(Object.assign(this.state, { operation, path, ...newLocation }), () => {
            if (this.state.operation.length > 0) setTimeout(this.runSequence.bind(this), 250);
            else this.setState({ end: this.state.location })
        })
    };

    execute = (commands) => {
        let operation = (commands || "").split("");
        this.setState({ operation }, () => { setTimeout(this.runSequence.bind(this), 250); });
    };

    turnLeft = () => {
        const { direction } = this.state;
        return ({ direction: LEFT_MAPPING[direction] });
    };
    turnRight = () => {
        const { direction } = this.state;
        return ({ direction: RIGHT_MAPPING[direction] });
    };
    moveForward = () => {
        const { size } = this.props;
        const { location, direction } = this.state;
        const vector = DIRECTION_STEPS[direction];
        const pos = location.split(';').map(Number);
        const x = pos[0] + vector[0];
        const y = pos[1] + vector[1];
        if (x < 0 || x >= size || y < 0 || y >= size) {
            return { error: true };
        }
        return {
            location: x + ';' + y
        };
    };
    printPosition = (location, direction) => {
        this.setState({ ...this.state, robotReportMessage: 'Location: ' + location + ', direction: ' + direction })
    }
    printRobotMessage = (message) => {
        this.setState({ ...this.state, robotReportMessage: message })
    }
    render() {
        const { size } = this.props;
        let { location, direction, path } = this.state;
        path = path || {};
        let squares = [];
        for (let i = size - 1; i >= 0; i--) {
            for (let j = 0; j < size; j++) {
                squares.push(j + ";" + i);
            }
        }
        return (
            <div>
                <div className="robotMessage">
                    Robot message:{this.state.robotReportMessage}
                </div>
                <ul className="table">
                    {squares.map(square => {
                        let robot = null;
                        let squareStatus = '';
                        if (this.state.error && this.state.end === square) squareStatus = 'error';
                        if (this.state.start === square) squareStatus += ' start';
                        if (this.state.end === square) squareStatus += ' end';
                        if (location === square) robot = <Robot direction={direction} />;
                        return (
                            <li className={`square ${!!path[square] ? 'path' : ''} ${squareStatus}`} key={square}>
                                <label>{square}</label>
                                {robot}
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }
}
const DIRECTION_STEPS = { S: [0, -1], W: [-1, 0], N: [0, 1], E: [1, 0] };
const LEFT_MAPPING = { N: "W", W: "S", S: "E", E: "N" };
const RIGHT_MAPPING = { N: "E", E: "S", S: "W", W: "N" };
export default Table;
