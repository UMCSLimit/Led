import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Box, Table } from 'react-bulma-components';

const mapStateToProps = (state) => ({
    queue: state.queue.queue,
});

const mapDispatchToProps = (dispatch) => ({
    // onClick: (text) => dispatch(updateDmx(text)),
});

class AnimationQueue extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    // cards() {
    //     let cardList = [];
    //     this.state.cards.forEach((card) => {
    //         cardList.push(
    //                 <Card className='card_selected' style={{'flex': '0 0 auto', 'width': '400px', 'margin': '10px'}}>
    //                     <Card.Header>
    //                         <Card.Header.Title>{card.type}</Card.Header.Title>
    //                     </Card.Header>
    //                     <Card.Content>
    //                         <Content>
    //                             <Media>
    //                                 <Media.Item>
    //                                     <Heading size={6}>{card.name}</Heading>
    //                                     <Heading subtitle size={6}>{card.length_time}</Heading>
    //                                     <Heading subtitle size={6}>{card.author}</Heading>
    //                                 </Media.Item>
    //                             </Media>                  
    //                             {card.description}
    //                         </Content>
    //                     </Card.Content>
    //                     <Card.Footer>
    //                         <Card.Footer.Item renderAs="a" href="#Yes">Like</Card.Footer.Item>
    //                         <Card.Footer.Item renderAs="a" href="#No">Code</Card.Footer.Item>
    //                         <Card.Footer.Item renderAs="a" href="#Maybe">Report</Card.Footer.Item>
    //                     </Card.Footer>
    //                 </Card>
    //     )});
    //     return <div style={{'display': 'flex', 'flexWrap': 'nowrap', 'overflowX': 'auto'}} >{cardList}</div>;
    // }

    tableQ() {
        let rows = [];
        let i = 0;
        this.props.queue.forEach((card) => {
            rows.push(
                <tr className={ i === 0 && 'is-selected' }>
                    <th>{card.id}</th>
                    <td>{card.name}</td>
                    <td>{card.author}</td>
                    <td>{card.description}</td>
                    <td>{card.type}</td>
                    <td>{card.length_time}</td>
                    <td>{card.likes}</td>
                </tr>
            );
            i++;
        })

        return (
            <Table>
                <thead>
                    <tr>
                        <th>Number</th>
                        <th>Name</th>
                        <th>Author</th>
                        <th>Description</th>
                        <th>Type</th>
                        <th>Length</th>
                        <th>Likes</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </Table>
        )
    }

    render() {
        return (
                <Box style={{'marginTop': '30px', 'marginRight': '30px','position': 'absolute'}}>
                    {/* {this.cards()} */}
                    {this.tableQ()}
                </Box>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnimationQueue);