import React from "react";
import { render } from "react-dom";
import "./index.css";
import Table from "./table";

class App extends React.Component {

    state = {
        commands: '',
        commandsToExecute: '',
        execute: false,
        startLocation: '00N',
        errorMessage: ''
    };

    addCommand = (e) => { this.setState({ commands: this.state.commands + e.target.value }) };
    runSample = (e) => { this.setState({ commands: e.target.value }); };
    execute = () => {
        this.setState({ ...this.state, errorMessage: '', execute: false })
        let startLocation = this.startInput.value.toUpperCase();
        if (/^[0-5][0-5][NEWS]$/.test(startLocation)) {
            this.setState({
                execute: true,
                commandsToExecute: this.state.commands,
                startLocation
            });
        } else
            this.setState({ ...this.state, errorMessage: 'Start is invalid.' })
    };
    clear = () => { this.setState({ commands: '', execute: false, commandsToExecute: '' }); };
    stopExecute = () => { this.setState({ execute: false }); };
    render() {
        let location = this.state.startLocation || '00N';
        location = location.split('').join(' ');
        return (
            <div className={'app'}>
                <div className={`control-panel`}>
                    <div className={'start-location'}>
                        <label>Start Location:</label>
                        <input type="text"
                            id="startLocation"
                            maxLength={3}
                            defaultValue={'00N'}
                            ref={(elm) => {
                                this.startInput = elm
                            }}
                        />
                    </div>
                    <div className='controls'>
                        <input type="text" readOnly value={this.state.commands} />
                        <button className={'cta'} onClick={this.execute}>Execute</button>
                    </div>
                    <div className='commands'>
                        <button value='M' onClick={this.addCommand}>Move</button>
                        <button value='L' onClick={this.addCommand}>Left</button>
                        <button value='R' onClick={this.addCommand}>Right</button>
                        <button value='P' onClick={this.addCommand}>Report</button>
                        <button onClick={this.clear} className='secondary'>CLEAR</button>
                    </div>
                    <div className='messages'>
                        <div>{this.state.errorMessage}</div>
                    </div>
                </div>
                <Table size={6}
                    location={location}
                    commands={this.state.commandsToExecute}
                    execute={this.state.execute}
                    onDone={this.stopExecute}
                />
            </div>
        )
    }
}

render(<App />, document.getElementById("root"));
