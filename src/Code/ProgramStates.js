const ProgramStates = Object.freeze({
    None: Symbol("None"),
    Assembled: Symbol("Assembled"),
    Running: Symbol("Running"),
    Completed: Symbol("Completed"),
    Errored: Symbol("Errored")
});

export default ProgramStates;