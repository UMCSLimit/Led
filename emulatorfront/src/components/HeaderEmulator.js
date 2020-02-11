import React, { Component } from 'react';
import { Heading } from 'react-bulma-components';

class HeaderEmulator extends Component {
    render() {
        return <div>
            {/* <h3>Header Emulator</h3> */}
            <Heading size={1}>Emulator</Heading>
        </div>
    }
}

export default HeaderEmulator;