import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Card, Form, SwipeAction } from 'antd-mobile'
import dayjs from 'dayjs'
import { DownOutline } from 'antd-mobile-icons'
import DateItem from './DateItem'
import NumberItem from './MoneyItem'
import { FormData } from '../types'
import styles from './styles.scss'

export type ItemProps = {
  resitryForm: (form: any) => void // 注册form
  index: number // 标识当前是第一个
  initialValue: FormData // 初始化参数
  hasNext: boolean // 是否有下一个
  onRemove: () => void // 被移除
  [key: string]: any
}

export default function FormItem(props: ItemProps) {
  const {
    resitryForm,
    index = 1,
    initialValue,
    hasNext = false,
    onRemove,
  } = props

  const [form] = Form.useForm()
  const [showForm, setShowForm] = useState(true)
  const [values, setValues] = useState(initialValue)
  const isFirst = index === 1
  const [hasError, setHasError] = useState(false)

  const title = useMemo(() => {
    const { startDate, endDate } = values
    const format = 'YYYY年MM月'
    const toStr = (date: Date) => dayjs(date).format(format)
    return !showForm && startDate && endDate
      ? toStr(startDate) + ' → ' + toStr(endDate)
      : index === 1
      ? '最近一段记录'
      : `倒数第${index}段记录`
  }, [showForm, values])

  const onFinish = useCallback((values: any[]) => {
    let hasEffor = false
    values = values.reduce((res, item) => {
      const {
        errors,
        name: [name],
        value,
      } = item

      if (errors.length) {
        res[name] = undefined
        hasEffor = true
      } else {
        res[name] = value
      }

      return res
    }, {} as FormData)
    setValues(values)
    setHasError(hasEffor)
  }, [])

  useEffect(() => {
    resitryForm(form)
  }, [])

  return (
    <SwipeAction
      rightActions={
        hasNext || isFirst
          ? []
          : [
              {
                key: 'delete',
                text: '删除',
                color: 'danger',
                onClick: onRemove,
              },
            ]
      }
      style={{ marginBottom: '10px' }}
    >
      <Card
        title={title}
        extra={
          <div
            style={{
              transform: `rotate(${showForm ? 0 : '-90deg'})`,
              transition: 'transform 0.5s ease-in-out',
            }}
          >
            <DownOutline />
          </div>
        }
        className={styles.formItem}
        onHeaderClick={() => {
          setShowForm((pre) => !pre)
        }}
        style={{
          border: hasError ? '1px solid red' : 'none',
        }}
      >
        <div
          style={{
            height: showForm ? 220 : 0,
            transition: 'height 0.5s ease-in-out',
            overflow: 'hidden',
          }}
        >
          <Form
            initialValues={initialValue}
            form={form}
            layout="horizontal"
            onFieldsChange={(field, values) => onFinish(values)}
          >
            <DateItem
              name="endDate"
              label="截止月份"
              max={isFirst ? new Date() : undefined}
              min={isFirst ? values.startDate : undefined}
              disabled={hasNext || !isFirst}
            />
            <DateItem
              name="startDate"
              label="起始月份"
              max={values.endDate}
              disabled={hasNext}
            />
            <NumberItem name="base" label="月缴存额" />
            <NumberItem name="extract" label="月提取额" />
          </Form>
        </div>
      </Card>
    </SwipeAction>
  )
}
