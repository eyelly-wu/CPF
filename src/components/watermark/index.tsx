import React from 'react'
import { WaterMark as AWaterMark } from 'antd-mobile'

export type WaterMarkProps = {
  [key: string]: any
}

export default function WaterMark(props: WaterMarkProps) {
  return (
    <AWaterMark
      zIndex={2}
      width={170}
      content="Developed by Eyelly Wu"
      rotate={0}
      gapY={0}
      style={{
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center calc(100vh - 43px)',
      }}
    />
  )
}
