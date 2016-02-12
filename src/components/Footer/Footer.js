import React, { PropTypes, Component } from 'react';
import Link from 'react-toolbox/lib/link';
import style from './Footer.scss';

export default class Footer extends Component {
  render() {
    return (
      <nav className={style.content}>
        <Link href="mailto:noahsug+god@gmail.com"
              target="_blank"
              label="Created by Noah Sugarman"
              icon="email" />
        <Link href="https://github.com/noahsug/guild-of-dungeoneering-solver"
              target="_blank"
              label="Source code lives on github" icon="code" />
      </nav>
    );
  }
}
