import React, { PropTypes, Component } from 'react';
import AppBar from 'react-toolbox/lib/app_bar';
import style from './Header.scss';

export default class Header extends Component {
  render() {
    return (
      <AppBar className={style.appbar} flat>
        <span className={style.title}>
          <div>Guild of Dungeoneering</div>
          <h1>Battle Calculator</h1>
        </span>
      </AppBar>
    );
  }
}
