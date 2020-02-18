import React, { Component } from 'react';

class Segment extends Component {

    getColorRGBA(color) {
        let rgb_sum = color[0] + color[1] + color[2];
        let transp = rgb_sum / (255 * 3);

        // if(!color[0] && !color[1] && !color[2]) return `${color}, 0.3`;
        return `${color}, ${transp}`;
    }

    render() {
        const { color } = this.props;
        return (<div style={{ 
            // borderStyle: "solid", 
            // borderRadius:'3px', 
            // borderWidth: "1px", 
            width: "30px", 
            height: "70px", 
            minWidth: "15px", 
            backgroundColor: `rgb(${color})`, 
            // background: `linear-gradient(to bottom, rgba(${this.getColorRGBA(color)}), rgba(${color},0))`,
            // background: `linear-gradient(to bottom, rgba(${color},1), rgba(${color},0))`,
            margin: "3px"}}>
            </div>);
    }
}

export default Segment;