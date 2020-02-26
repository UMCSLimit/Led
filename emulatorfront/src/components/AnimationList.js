import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Modal, Button, Tabs } from 'react-bulma-components';
import { editorChange } from '../actions';

const axios = require('axios');

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = (dispatch) => ({
    editorChange: (code) => dispatch(editorChange(code))
})

class AnimationList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            animations: [],
            show: false,
            tabs: [
                {
                    name: 'Latest',
                    url: 'http://localhost:3005/Led/animations/all',
                    is_active: true
                },
                {
                    name: 'Approved',
                    url: 'http://localhost:3005/Led/animations/approved',
                    is_active: false
                },
                {
                    name: 'Examples',
                    url: 'http://localhost:3005/Led/animations/examples',
                    is_active: false
                },
            ]
        }
    }

    componentDidMount() {
        this.apiCall();
    }
    
    apiCall = () => {
        axios.get('http://localhost:3005/Led/animations/all')
        .then(resp => {
            this.setState({animations: resp.data});
        })
        .catch(err => {
            console.log(err);
        })
    }

    tableQ() {
        let rows = [];
        this.state.animations.forEach((card) => {
            rows.push(
                <tr>
                    <td><a onClick={() => {this.props.editorChange(card.code); this.setState({show: false})}}>{card.name}</a></td>
                    <td>{card.author}</td>
                    <td>{card.description}</td>
                    <td>{card.id_lang.lang}</td>
                    <td>{card.id_type.app}</td>
                    <td>5</td>
                </tr>
            );
        })

        return (
            <Table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Author</th>
                        <th>Description</th>
                        <th>Language</th>
                        <th>Type</th>
                        <th>Likes</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </Table>
        )
    }

    selectTab = (name) => {
        let new_tab = [];
        for(let i = 0; i < this.state.tabs.length; i++) {
            let tab = this.state.tabs[i];
            tab.is_active = false;
            if (this.state.tabs[i].name === name) {
                tab.is_active = true;
                let url = tab.url;
                axios.get(url)
                .then(resp => {
                    if (i === 0 || i === 1) {
                        this.setState({animations: resp.data});
                    }
                    else {
                        
                        let tmp = [];
                        resp.data.forEach((t) => {tmp.push(t.id_animation)});
                        this.setState({animations: tmp });
                        
                    }
                })
                .catch(err => {
                    console.log(err);
                    this.setState({animations: []});
                })
            }
            new_tab.push(tab);
        }
        this.setState({ tabs: new_tab });
    }

    showTabs = () => {
        let tabs = [];
        this.state.tabs.forEach((tab) => {
            if (tab.is_active) tabs.push(<Tabs.Tab active>{tab.name}</Tabs.Tab>);
            else tabs.push(<Tabs.Tab onClick={() => {this.selectTab(tab.name); }}>{tab.name}</Tabs.Tab>)
        })
        return (
            <Tabs>
                {tabs}
            </Tabs>);
    }

    hide = () => {
        this.setState({show: false});
    }

    modal = () => {
        return (
        <Modal style={{'width': '40%'}} show={this.state.show} modal={{closeOnEsc: true}} closeOnBlur={true} onClose={this.hide}> 
            <Modal.Card style={{'width': '40%'}}>
                <Modal.Card.Head onClose={this.hide}>
                    <Modal.Card.Title>
                        {this.state.show && this.showTabs()}
                    </Modal.Card.Title>
                </Modal.Card.Head>
                <Modal.Card.Body>
                    { this.tableQ()}
                </Modal.Card.Body>
            <Modal.Card.Foot style={{ alignItems: 'center', justifyContent: 'center' }}>

            </Modal.Card.Foot>
        </Modal.Card>
        </Modal>
        )
    }

    render() {
        return (<div>
            <Button onClick={() => {this.setState({show: true}); this.apiCall();}}>Show codes</Button>
            {this.modal()}
        </div>);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnimationList);