import React, { Component } from "react";

class Toolbar extends Component {

    render() {
        let elements = [];
        let items = this.props.items;

        for(let i=0; i < items.length; i++){
            let item = items[i];
            elements.push(<button key={`button-`+i} onClick={item.onClick}>{item.name}</button>);
        }

        return (
            <div className={"toolbar"} name={this.props.name || "toolbar"}>
                {elements}
            </div>
        );
    }

}

export default Toolbar;