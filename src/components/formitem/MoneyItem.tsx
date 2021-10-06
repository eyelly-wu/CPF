import React from 'react'
import { Form, Input } from 'antd-mobile'
import { FormItemProps } from 'antd-mobile/es/components/form/form-item'
import styles from './styles.scss'

export interface DateItemProps extends Pick<FormItemProps, 'name' | 'label'> {}

export default function DateItem(props: DateItemProps) {
  const { name, label } = props

  return (
    <Form.Item
      name={name}
      label={label}
      rules={[
        {
          validator: (values, value) => {
            return new Promise((resolve, reject) => {
              if ([undefined, ''].includes(value)) {
                reject(label + '不能为空')
              }
              resolve(undefined)
            })
          },
        },
      ]}
      className={styles.moneyItem}
    >
      <Input
        style={{ textAlignLast: 'right', textAlign: 'right' }}
        type="number"
        className={styles.moneyInput}
      />
    </Form.Item>
  )
}
