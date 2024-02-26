import React, { useEffect, useState } from 'react'

import { Small } from '../Typography/Typography'

interface Props {
  days: string
  hours: string
  minutes: string
  seconds: string
}

const CountdownContent: React.FC<Props> = ({ days, hours, minutes, seconds }) => {
  const [dys, setDys] = useState<string>('0')
  const [hrs, setHrs] = useState<string>('0')
  const [mins, setMins] = useState<string>('0')
  const [secs, setSecs] = useState<string>('0')

  useEffect(() => {
    setDys(days)
    setHrs(hours)
    setMins(minutes)
    setSecs(seconds)
  }, [seconds, days, minutes, hours])

  return (
    <div>
      <Small>
        {dys}D : {hrs}H : {mins}M : {secs}S
      </Small>
    </div>
  )
}

export default CountdownContent
