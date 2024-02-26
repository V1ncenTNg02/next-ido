import React from 'react'
import Countdown from 'react-countdown'

import CountdownContent from './CountdownContent'

const renderer = ({ days, hours, minutes, seconds }: any) => {
  return <CountdownContent days={days} hours={hours} minutes={minutes} seconds={seconds} />
}

interface Props {
  startDate: number
}

const CountdownSection: React.FC<Props> = ({ startDate }) => {
  return <Countdown date={startDate} renderer={renderer} precision={3} />
}

export default CountdownSection
