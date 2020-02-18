import React, { Component } from 'react';
import { connect } from 'react-redux';
import { modalChangeName, modalChangeDesciption, modalSend, modalSent, modalShow, modalHide } from '../actions';
import { Button, Modal, Form } from 'react-bulma-components';

const mapStateToProps = (state) => ({
    modal: state.modal,
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
                {!sending &&                         
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
                        <Button onClick={this.props.send} type="primary">Submit</Button>
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