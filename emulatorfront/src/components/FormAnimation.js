import React, { Component } from 'react';
import { connect } from 'react-redux';
import { modalChangeName, modalChangeDesciption, modalSend, modalSent, modalShow, modalHide } from '../actions';
import { Button, Modal, Form } from 'react-bulma-components';

const axios = require('axios');

const mapStateToProps = (state) => ({
    modal: state.modal,
    code: state.editor.code,
})

const mapDispatchToProps = (dispatch) => ({
    changeName: (name) => dispatch(modalChangeName(name)),
    changeDesciption: (description) => dispatch(modalChangeDesciption(description)),
    send: () => dispatch(modalSend()),
    sent: () => dispatch(modalSent()),
    show: () => dispatch(modalShow()),
    hide: () => dispatch(modalHide())
})

class FormAnimation extends Component {

    send() {
        axios.get('http://212.182.24.47:3005/Led/animations/post', { name: 'electron', author: 'electron app', lang_name: 'js', type_name: 'kinect' ,code: this.props.code })
        .then((resp) => {
            console.log(resp);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    render() {
        let { show, sending, name, description } = this.props.modal;

        return (
        <Modal show={show} modal={{closeOnEsc: true}} closeOnBlur={true} onClose={this.props.hide}> 
        <Modal.Card>
            <Modal.Card.Head>
                <Modal.Card.Title>
                    Share your code with us!
                </Modal.Card.Title>
                {/* <Button remove /> */}
            </Modal.Card.Head>
            <Modal.Card.Body>
                { !sending &&                         
                    <Form.Field>
                        <Form.Label>Your name</Form.Label>
                        <Form.Control>
                            <Form.Input placeholder="Name input" onChange={(e) => {this.props.changeName(e.target.value)}} name="modalName" type="text" value={name}/>
                        </Form.Control>
                    </Form.Field>
                }
                { !sending && 
                    <Form.Field>
                        <Form.Label>Description</Form.Label>
                        <Form.Control>
                        <Form.Textarea placeholder="Description" onChange={(e) => {this.props.changeDesciption(e.target.value)}} name="modalDescription" value={description} />
                        </Form.Control>
                    </Form.Field>
                }
                {sending && 
                    <h1>Sending...</h1>    
                }
            </Modal.Card.Body>
            <Modal.Card.Foot style={{ alignItems: 'center', justifyContent: 'center' }}>
                {!sending && 
                    <Form.Field kind="group">
                        <Form.Control>
                        <Button onClick={() => { this.send(); this.props.send();}} type="primary">Submit</Button>
                        </Form.Control>
                        <Form.Control>
                        <Button onClick={this.props.hide} color="link">Cancel</Button>
                        </Form.Control>
                    </Form.Field>
                }
            </Modal.Card.Foot>
        </Modal.Card>
        </Modal>
    );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FormAnimation);