import React, { PropTypes, Component } from 'react';
import AppBar from 'react-toolbox/lib/app_bar';
import style from './Header.scss';

export default class Header extends Component {
  render() {
    return (
      <AppBar className={style.appbar} flat>
        <h1 className={style.title}>Guild of Dungeoneering Calculator</h1>
      </AppBar>
    );
  }
}
