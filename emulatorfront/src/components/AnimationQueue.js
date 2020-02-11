import React, { Component } from 'react';

import { Card, Content, Heading, Media } from 'react-bulma-components';

class AnimationQueue extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cards: ['1', '2', '3', '4', '1', '2', '3', '4']
        }

        // kolejka
        // - imie
        // - description
        // - czas planowany 
        // - długość odpalania
        // - typ ( kinect czy apka czy ... )

        // - like
        
        // Dropdown:
        // - kod
        // - report 
    }

    cards() {
        let cardList = [];
        this.state.cards.forEach((card) => {
            cardList.push(
                    <Card style={{'flex': '0 0 auto', 'width': '400px', 'margin': '10px'}}>
                        <Card.Header>
                            <Card.Header.Title>Title</Card.Header.Title>
                        </Card.Header>
                        <Card.Content>
                            <Content>
                            <Media>
                                <Media.Item>
                                    <Heading size={6}>John Smith</Heading>
                                    {/* <Heading subtitle size={8}>@johnsmith</Heading> */}
                                </Media.Item>
                                </Media>
                                {card}
                            </Content>
                        </Card.Content>
                        <Card.Footer>
                            <Card.Footer.Item renderAs="a" href="#Yes">Like</Card.Footer.Item>
                            <Card.Footer.Item renderAs="a" href="#No">Code</Card.Footer.Item>
                            <Card.Footer.Item renderAs="a" href="#Maybe">Report</Card.Footer.Item>
                        </Card.Footer>
                    </Card>
        )});
        return <div style={{'display': 'flex', 'flexWrap': 'nowrap', 'overflowX': 'auto'}} >{cardList}</div>;
    }

    render() {
        return <div >{this.cards()}</div>
    }
}

export default AnimationQueue;