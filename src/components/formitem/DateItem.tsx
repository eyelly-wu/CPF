import React, { useState } from 'react'
import { Form, DatePicker } from 'antd-mobile'
import dayjs from 'dayjs'
import { FormItemProps } from 'antd-mobile/es/components/form/form-item'
import { DatePickerProps } from 'antd-mobile/es/components/date-picker/date-picker'

export interface DateItemProps
  extends Pick<FormItemProps, 'name' | 'label' | 'disabled'>,
    Pick<DatePickerProps, 'min' | 'max'> {}

export default function DateItem(props: DateItemProps) {
  const {
    name,
    label,
    min = new Date('1999-01'),
    max = new Date(),
    disabled,
  } = props

  const [showPicker, setShowPicker] = useState(false)

  return (
    <Form.Item
      name={name}
      label={label}
      trigger="onConfirm"
      onClick={() => {
        if (disabled) return
        setShowPicker(true)
      }}
      rules={[{ required: true, message: label + '不能为空' }]}
      disabled={disabled}
    >
      <DatePicker
        visible={showPicker}
        onClose={() => {
          setShowPicker(false)
        }}
        onClick={(e) => {
          e.stopPropagation()
        }}
        min={min}
        max={max}
        precision="month"
        style={{ textAlign: 'right' }}
      >
        {(value) => (
          <div style={{ textAlign: 'right' }}>
            {value ? dayjs(value).format('YYYY-MM') : '请选择年月'}
          </div>
        )}
      </DatePicker>
    </Form.Item>
  )
}
