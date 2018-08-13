import React, { Component } from "react";
import gql from "graphql-tag";
import { graphql, withApollo, compose } from "react-apollo";

const newMessages = gql(`
subscription newMessages{
  onCreateMessage{
    id
  }
}
`);

class MyData extends Component {
  componentWillMount() {
    this.props.data.subscribeToMore({
      document: newMessages,
      updateQuery: (prev, { subscriptionData: { data: { onCreateMessage } } }) => {
        console.log("<Incoming data>");
        console.log(onCreateMessage);
        console.log(prev);
        console.log("</Incoming data>");
        const res = {
        ...prev,
          listMessages: {
              ...prev.listMessages,
                items: [
                    ...prev.listMessages.items.filter(c => c.id !== onCreateMessage.id),
                    onCreateMessage,
                ]
              }
            }
            return res
          }
    })
  }

  renderMessages() {
    console.log(this.props.data.listMessages)
    return this.props.data.listMessages.items.map(message => {
      return (
        <tr key = {message.id} >
          <td> {message.id} </td>
          <td> {message.from} </td>
          <td> {message.message} </td>
          <td> {Date.now() - message.time} </td>
        </tr>
      );
    })
  }
  render() {
    console.log(this.props);
    if(this.props.data.loading){
      return(<div> loading... </div>)
    } else {
      return (
        <table className='pure-table pure-table-horizontal'>
          <thead>
            <tr>
              <th>ID</th>
              <th>From</th>
              <th>Message</th>
              <th>Latency (MS)</th>
            </tr>
          </thead>
          <tbody>
          {this.renderMessages()}
          </tbody>
        </table>
       )
    }
  }
}

const getAll = gql(`
  query GetMessageOfUser{
    listMessages {
      items {
        message
        from
        time
        id
      }
    }
  }`)


export default withApollo(compose(
    graphql(
        getAll,{options: {fetchPolicy: 'network-only'}}))
        (MyData)
      )


//export default graphql (getAll) (MyData);
