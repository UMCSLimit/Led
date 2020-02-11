import React, { Component } from 'react';

class Segment extends Component {
    render() {
        const { color } = this.props;
        return (<div style={{ borderStyle: "solid", borderRadius:'3px', borderWidth: "1px", width: "30px", height: "70px", minWidth: "15px", backgroundColor: `rgb(${color})`, margin: "3px"}}></div>);
    }
}

export default Segment;