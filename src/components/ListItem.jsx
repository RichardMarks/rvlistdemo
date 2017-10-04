import React from 'react'

import './ListItem.css'

const debug = false

const ListItem = props => {
  const onTouchTap = () => {
    props.onExpand && props.onExpand({ index: props.index })
  }
  return (
    <div
      key={props.index}
      className='list-item__main-container'
      onTouchTap={onTouchTap}>
      <div className='list-item__name-container'>
        <div className='list-item__name-text'>({props.index}) {props.name}</div>
      </div>
      {
        props.expanded && (
          <div className='list-item__stats-container'>
            {
              props.stats.map((stat, statIndex) => (
                <div
                  key={statIndex}
                  className='list-item__stat-container'>
                  <div className='list-item__stat-name-text'>{stat.name}</div>
                  <div className='list-item__stat-value-text'>{stat.value}</div>
                </div>
              ))
            }
          </div>
        )
      }
      {
        debug && (
          <pre>{JSON.stringify(props, null, 2)}</pre>
        )
      }
    </div>
  )
}

export default ListItem
