import React, { Component } from 'react'
import './Box.css';

export default class Box extends Component {
  render() {
    return (
      <div className="box" onClick={() => this.props.onClick(this.props.position) }>
        {this.props.boxId}
      </div>
    )
  }
}