import React, { Component } from "react";
import AceEditor from "react-ace";
import 'brace/mode/mips_assembler';
import 'brace/theme/ambiance';
import Toolbar from "./Toolbar";
import Assembler from "../Code/Assembler";
import { connect } from "react-redux";
import ActionTypes from "../Store/ActionTypes";
import ProgramStates from "../Code/ProgramStates";

const mapStateToProps = (state) => {
    return {
        programCounter: state.programCounter,
        lastProgramCounter: (state.stepHistory === null || state.stepHistory.length <= 1) ? 0 : state.stepHistory[state.stepHistory.length-2],
        hasCompleted: (state.currentState === ProgramStates.Completed),
        numberOfInstructions: state.instructions.length
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        initProgram: (initData) => dispatch(initData),
        stepProgram: () => dispatch({ type: ActionTypes.STEP_INSTRUCTION }),
        runProgram: () => dispatch({ type: ActionTypes.RUN_PROGRAM })
    }
};

const selectedLineGutterClass = "select";
const haltLineGutterClass = "halt";

class IDE extends Component {

    constructor(props) {
        super(props);

        this.state = {
            instructions: []
        }
    }

    assemble = () => {
        if (this.editor === null || this.editor === undefined)
            return;

        const lines = this.editor.session.getLines(0, this.editor.session.getLength());
        console.log(lines);
        this.props.initProgram(Assembler.Assemble(lines));

        // Remove all line indicators
        for (let i=0; i < lines.length; i++){
            this.editor.session.removeGutterDecoration(i, selectedLineGutterClass);
            this.editor.session.removeGutterDecoration(i, haltLineGutterClass);
        }

        this.editor.session.addGutterDecoration(0, selectedLineGutterClass);
    };

    step = () => {
        this.props.stepProgram();
    };

    run = () => {
        this.props.runProgram();
    };

    highlightLine = (lineNumber, lastLineNumber) => {
        if (this.editor === null || this.editor === undefined)
            return;

        this.editor.session.removeGutterDecoration(0, selectedLineGutterClass);
        this.editor.session.removeGutterDecoration(lastLineNumber, selectedLineGutterClass);

        // Highlight line of executed instruction
        const maxLines = this.props.numberOfInstructions;
        this.editor.session.addGutterDecoration(
            (lineNumber < maxLines) ? lineNumber : maxLines-1,
            (this.props.hasCompleted) ? haltLineGutterClass : selectedLineGutterClass
        );
    };

    render() {
        this.highlightLine(this.props.programCounter || 0, this.props.lastProgramCounter);

        return (
            <div className={"IDE-wrapper"}>
                <Toolbar
                    items={[
                        {
                            name: "Assemble",
                            onClick: this.assemble
                        },
                        {
                            name: "Step",
                            onClick: this.step
                        },
                        {
                            name: "Run",
                            onClick: this.run
                        }
                    ]}
                />
                <AceEditor
                    className={"IDE"}
                    mode="mips_assembler" theme="ambiance"
                    fontSize={24} style={{width: "100%", height: "100%"}}
                    name="mipsIDE" editorProps={{$blockScrolling: true}}
                    setOptions={{tabSize: 4, wrap: false}}
                    ref={(instance) => { if (instance !== null && instance !== undefined) { this.editor = instance.editor; }}}
                />
            </div>
        );
    }

}

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(IDE);