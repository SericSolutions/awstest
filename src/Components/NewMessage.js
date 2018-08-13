import React, { Component } from "react";
import gql from "graphql-tag";
import { graphql } from "react-apollo";


class NewMessage extends Component {

  state = {
    message: ''
  }

  onSubmit(event) {
    event.preventDefault()

    console.log(this.state.message);

    this.props.mutate({
      variables: {
        message: this.state.message,
        time: Date.now()
      }
    })
  }

  render() {
    return (
      <div>
        <form onSubmit={this.onSubmit.bind(this)}>
          <input
          onChange = {event => this.setState({message: event.target.value})}
          value = {this.state.message}/>
        </form>
      </div>
    )
    }
  }

const getAll = gql(`
  mutation CreateMessage($message: String!, $time: Float){
    createMessage(input: {
      message: $message
      time: $time
      from: "server"
    }) {
      id
      message
      time
      from
    }
  }`)


export default graphql (getAll) (NewMessage);
