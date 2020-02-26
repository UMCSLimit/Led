import React, { Component } from 'react';
import { connect } from 'react-redux';
import { modalChangeName, modalChangeDesciption, modalSend, modalSent, modalShow, modalHide, modalChangeAuthor, modalReset } from '../actions';
import { Button, Modal, Form, Container } from 'react-bulma-components';

const axios = require('axios');

const mapStateToProps = (state) => ({
    modal: state.modal,
    code: state.editor.code,
})

const mapDispatchToProps = (dispatch) => ({
    changeName: (name) => dispatch(modalChangeName(name)),
    changeDesciption: (description) => dispatch(modalChangeDesciption(description)),
    changeAuthor: (author) => dispatch(modalChangeAuthor(author)),
    send: () => dispatch(modalSend()),
    sent: () => dispatch(modalSent()),
    show: () => dispatch(modalShow()),
    hide: () => dispatch(modalHide()),
    reset: () => dispatch(modalReset()),
})

class FormAnimation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            error: [],
            isError: false,
            finished: false
        }
    }

    send = () => {

        let config = {
            headers: { 'Content-Type': 'application/json' },
        };

        let data = {
            name: this.props.modal.name,
            description: this.props.modal.description,
            author: this.props.modal.author,
            id_lang: 1,
            id_type: 1,
            code: this.props.code
        }

        this.props.send();

        axios.post('http://localhost:3005/Led/animations/post', data, config)
        .then(resp => {
            this.setState({finished: true});  
            this.props.reset();
            this.props.sent();
        })
        .catch((error) => {
            if (error.response) {
              // Request made and server responded
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);

              this.setState({error: error.response.data.name});
            } else if (error.request) {
              // The request was made but no response was received
              this.setState({error: ['No response']});
              console.log(error.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log('Error', error.message);
              this.setState({error: ['Unknown error']});
            }

            this.setState({isError: true, finished: true});
            this.props.reset();
            this.props.sent();
        });
    }

    hide = () => {
        this.setState({finished: false, isError: false, error: []});
        this.props.hide();
        this.props.reset();
    }

    showErrors = () => {
        let errors = [];
        this.state.error.forEach((err) => {
            errors.push(<div>
                {err}
            </div>);
        });
        return <div>{errors}</div>
    }

    body = () => {
        const { sending, name, description, author } = this.props.modal;
        if (sending) {
            return (<Container>
                Sending...
            </Container>);
        } else {
            if (this.state.finished) {
                if (this.state.isError) {
                    return (<Container>
                        {this.showErrors()}
                    </Container>);
                } else {
                    return (<Container>
                        Finished :)
                    </Container>);
                }
            } else {
                return <Container>
                    <Form.Field>
                        <Form.Label>Animation name</Form.Label>
                        <Form.Control>
                            <Form.Input placeholder="Name" onChange={(e) => {this.props.changeName(e.target.value)}} name="modalName" type="text" value={name}/>
                        </Form.Control>
                    </Form.Field>
                    <Form.Field>
                        <Form.Label>Description</Form.Label>
                        <Form.Control>
                        <Form.Textarea placeholder="Description" onChange={(e) => {this.props.changeDesciption(e.target.value)}} name="modalDescription" value={description} />
                        </Form.Control>
                    </Form.Field>
                    <Form.Field>
                        <Form.Label>Author</Form.Label>
                        <Form.Control>
                        <Form.Input placeholder="Author" onChange={(e) => {this.props.changeAuthor(e.target.value)}} name="modalAuthor" value={author} />
                        </Form.Control>
                    </Form.Field>
                </Container>
            }
        }
    }

    render() {
        const { show, sending } = this.props.modal;
        const { finished } = this.state;

        return (
            <Modal show={show} modal={{closeOnEsc: true}} closeOnBlur={true} onClose={this.hide}> 
                <Modal.Content>
                    <Modal.Card>
                        <Modal.Card.Head onClose={this.hide}>
                                Share your code with us!
                            <Modal.Card.Title>
                            </Modal.Card.Title>
                        </Modal.Card.Head>
                        <Modal.Card.Body>
                            { this.body() }
                        </Modal.Card.Body>
                        <Modal.Card.Foot style={{ alignItems: 'center', justifyContent: 'center' }}>
                            {!sending && !finished && 
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
                </Modal.Content>
            </Modal>
    );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FormAnimation);