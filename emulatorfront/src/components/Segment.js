import React, { Component } from 'react';

class Segment extends Component {
    render() {
        const { color } = this.props;
        return (<div style={{width: "30px", height: "70px", backgroundColor: `rgb(${color})`, margin: "3px"}}></div>);
    }
}

export default Segment;