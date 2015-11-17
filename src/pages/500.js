/**
 * React Static Boilerplate
 * https://github.com/koistya/react-static-boilerplate
 * Copyright (c) Konstantin Tarkus (@koistya) | MIT license
 */

import React, { Component, PropTypes } from 'react';

class SystemError extends Component {

  static propTypes = {
    error: PropTypes.instanceOf(Error),
  };

  render() {
    return (
      <div>
        <h1>Error</h1>
        <pre>{
          this.props.error ?
            this.props.error.message + '\n\n' + this.props.error.stack :
            'A critical error occurred.'
        }</pre>
      </div>
    );
  }

  render() {
    return (
      <div>
        <h1>500</h1>
        <p>The page you're looking for was not found.</p>
      </div>
    );
  }
}

export default SystemError;
