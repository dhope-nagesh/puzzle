import React, { Component } from 'react'
import './Puzzle.css';
import Box from '../Box/Box';

export default class Puzzle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boxIds: [],
      emptyBoxIndex: 0
    }
  }

  range = (start, stop, step) => Array.from({ length: (stop - start) / step }, (_, i) => [start + (i * step), (start + (i * step)) + step])

  componentDidMount = () => {
    this.reset()
  }

  reset = () => {
    const max = 16;
    const offset = 4;
    let boxIds = Array(max).fill().map((e, i) => i + 1);
    boxIds = this.shuffle(boxIds)
    boxIds = this.range(0, max, offset).map((v, i) => boxIds.slice(v[0], v[1]))
    const emptyBoxPosition = boxIds.reduce((emId, embx, i) => (embx.includes(max)) ? [i, embx.indexOf(max)] : emId, [0, 0])
    boxIds[emptyBoxPosition[0]][emptyBoxPosition[1]] = '';

    const readyToGetEmpty = this.getReadyToGetEmpty(emptyBoxPosition)
    this.setState({
      boxIds,
      emptyBoxPosition,
      readyToGetEmpty,
      isPuzzleSolved: false
    })
  }

  getReadyToGetEmpty = (emptyBoxPosition) => {
    return [1, -1].map((e) =>
      [[emptyBoxPosition[0] + e, emptyBoxPosition[1]], [emptyBoxPosition[0], emptyBoxPosition[1] + e]]
    ).reduce((f, v) => [...f, ...v], [])
  }

  randomize = (max) => {
    return Math.floor(Math.random() * max)
  }

  shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
      const j = this.randomize(i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  handleClick = (newPosition) => {
    let { boxIds, emptyBoxPosition, readyToGetEmpty } = this.state;

    const isMovePossible = readyToGetEmpty.reduce((f, v) => (v[0] === newPosition[0] && v[1] === newPosition[1]) ? true : f, false)

    if (isMovePossible) {
      const boxIdToMove = boxIds[newPosition[0]][newPosition[1]]
      boxIds[newPosition[0]][newPosition[1]] = ""
      boxIds[emptyBoxPosition[0]][emptyBoxPosition[1]] = boxIdToMove
      emptyBoxPosition = [...newPosition]
      const readyToGetEmpty = this.getReadyToGetEmpty(emptyBoxPosition)
      this.setState({
        boxIds,
        emptyBoxPosition,
        readyToGetEmpty
      }, () => {
        const isPuzzleSolved = this.isPuzzleSolved(this.state.boxIds)
        this.setState({
          isPuzzleSolved
        })
      })
    }
  }

  isPuzzleSolved = (boxIds) => {
    let _boxIds = boxIds.reduce((f, l) => [...f, ...l], []).slice(0, 15)
    let requiredBoxIds = Array(15).fill().map((e, i) => i + 1);
    return _boxIds.reduce((final, boxId, index) => final ? (requiredBoxIds[index] === boxId ? true : false) : false, true)
  }

  render() {
    const boxes = this.state.boxIds.map((v, i) => v.map((a, j) => <Box key={j + i * 4} onClick={this.handleClick} boxId={a} position={[i, j]} />)).reduce((f, a) => [...f, ...a], [])
    return (
      <div className="container">
        <div className="puzzle">
          {
            (this.state.isPuzzleSolved) ? <div>Awesome.. You did it</div> : boxes
          }
        </div>
        <div className={'btn-container'}>
          <button onClick={this.reset}>Reset</button>
        </div>

        <div className={'footer'}>
          Developed by DNA | Powered NS Tech Academy
        </div>
      </div>
    )
  }
}
