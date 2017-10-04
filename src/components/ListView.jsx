import React, { Component } from 'react'
import pure from 'recompose/pure'

import AutoSizer from 'react-virtualized/dist/es/AutoSizer'
import InfiniteLoader from 'react-virtualized/dist/es/InfiniteLoader'
import CellMeasurer, { CellMeasurerCache } from 'react-virtualized/dist/es/CellMeasurer'
import List from 'react-virtualized/dist/es/List'

import LoadingIndicator from './LoadingIndicator'
import ListItem from './ListItem'

import './ListView.css'

class ListView extends Component {
  constructor (props) {
    super(props)

    this.registerListReference = this.registerListReference.bind(this)
    this.isRowLoaded = this.isRowLoaded.bind(this)
    this.loadMoreRows = this.loadMoreRows.bind(this)
    this.rowRenderer = this.rowRenderer.bind(this)
    this.resizeAll = this.resizeAll.bind(this)
    this.onExpand = this.onExpand.bind(this)

    this.registerList = undefined
    this.resizeAllFlag = false

    this.cmCache = new CellMeasurerCache(
      {
        fixedWidth: true,
        minHeight: 48
      }
    )

    this.state = {
      items: []
    }
  }

  componentDidMount () {
    this.loadMoreRows()
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.resizeAllFlag) {
      this.resizeAllFlag = false
      this.cmCache.clearAll()

      if (this.list) {
        this.list.recomputeRowHeights()
      }
    } else if (this.state.items !== prevState.items) {
      const index = prevState.items.length

      this.cmCache.clear(index, 0)

      if (this.list) {
        this.list.recomputeRowHeights(index)
      }
    }
  }

  registerListReference (list) {
    this.list = list
    this.registerList(list)
  }

  isRowLoaded ({ index }) {
    return index < this.state.items.length
  }

  loadMoreRows () {
    const items = this.state.items.slice()

    for (let i = 0; i < 100; i += 1) {
      const item = {
        id: `item_${i + 1}`,
        name: 'john smith',
        expanded: false,
        stats: [
          {
            name: 'strength',
            value: 30
          },
          {
            name: 'intelligence',
            value: 20
          },
          {
            name: 'vitality',
            value: 50
          }
        ]
      }

      items.push(item)
    }

    this.setState({ items })
  }

  resizeAll () {
    this.resizeAllFlag = false
    this.cmCache.clearAll()

    if (this.list) {
      this.list.recomputeRowHeights()
    }
  }

  onExpand ({ index }) {
    const items = this.state.items.slice()

    const item = items[index]

    item.expanded = !item.expanded

    this.setState({ items }, () => {
      this.resizeAllFlag = true

      setTimeout(this.resizeAll, 0)
    })
  }

  rowRenderer ({ index, key, parent, style }) {
    const content = index >= this.state.items.length
      ? (
        <LoadingIndicator />
      )
      : (
        <ListItem
          index={index}
          onExpand={this.onExpand}
          {...this.state.items[index]}
        />
      )

    return (
      <CellMeasurer
        cache={this.cmCache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
        width={this.recentWidth}>
        <div
          className='list-view__row-container'
          style={style}>
          {content}
        </div>
      </CellMeasurer>
    )
  }

  render () {
    return (
      <div className='list-view__main-container'>
        <InfiniteLoader
          isRowLoaded={this.isRowLoaded}
          loadMoreRows={this.loadMoreRows}
          rowCount={this.state.items.length}>
          {
            ({ onRowsRendered, registerChild }) => {
              this.registerList = registerChild

              return (
                <AutoSizer>
                  {
                    ({ width, height }) => {
                      if (this.recentWidth && this.recentWidth !== width) {
                        this.resizeAllFlag = true

                        setTimeout(this.resizeAll, 0)
                      }

                      this.recentWidth = width

                      return (
                        <List
                          ref={this.registerListReference}
                          className='list-view__list'
                          width={width}
                          height={height}
                          onRowsRendered={onRowsRendered}
                          deferredMeasurementCache={this.cmCache}
                          rowCount={this.state.items.length}
                          rowHeight={this.cmCache.rowHeight}
                          rowRenderer={this.rowRenderer}
                        />
                      )
                    }
                  }
                </AutoSizer>
              )
            }
          }
        </InfiniteLoader>
      </div>
    )
  }
}

export default pure(ListView)
