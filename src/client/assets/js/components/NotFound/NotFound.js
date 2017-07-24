import React, { Component } from 'react';
import { Link } from 'react-router';

export default class NotFound extends React.Component {
  render() {
    return (
      <div className="container text-center">
        <h1>Hmm - sorry can't find the link!</h1>
        <hr />
        <Link to="/">Back To Home View</Link>
      </div>
    );
  }
}
