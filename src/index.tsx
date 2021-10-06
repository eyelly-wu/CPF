import React, { useCallback, useState } from 'react'
import ReactDOM from 'react-dom'
import dayjs from 'dayjs'
import { Button, Dialog, Toast } from 'antd-mobile'
import { AddCircleOutline } from 'antd-mobile-icons'
import { FormInstance } from 'rc-field-form'
import { FormItem, DetailPopup, WaterMark } from './components'
import { Form } from './components/types'
import styles from './index.scss'
import { tip } from './constants'
import { toMillion } from './utils'

function App() {
  const [forms, setForms] = useState<Form[]>([
    {
      data: {
        endDate: new Date(),
        startDate: dayjs(new Date()).subtract(1, 'year').toDate(),
        base: '0',
        extract: '0',
      },
      form: {} as FormInstance,
    },
  ])
  const [count, setCount] = useState(0)
  const [detailVisible, setShowDetailVisible] = useState(false)
  const [details, setDetails] = useState([])

  const validate = useCallback(async () => {
    const validateRes = forms.map((form) => form.form.validateFields())
    try {
      let tempRes = await Promise.all(validateRes)
      return tempRes
    } catch (error) {
      Toast.show({
        icon: 'fail',
        content: '请检查红色标识的内容是否填写正确',
      })
      throw error
    }
  }, [forms])

  const onAdd = useCallback(async () => {
    let validateRes = await validate()

    setForms((forms) => {
      const lastFormDate = validateRes[validateRes.length - 1]
      const lastDate = dayjs(lastFormDate.startDate)
        .subtract(1, 'month')
        .toDate()

      const newForm = {
        data: {
          endDate: lastDate,
          startDate: lastDate,
          base: '0',
          extract: '0',
        },
        form: {} as FormInstance,
      }

      return [...forms, newForm]
    })
  }, [validate])

  const calculate = useCallback(async () => {
    let validateRes = await validate()
    const listData = validateRes.reduce((res, item) => {
      const { startDate, endDate, base, extract } = item
      const count = dayjs(endDate).diff(dayjs(startDate), 'month') + 1
      Array(count)
        .fill(0)
        .forEach((item, index) => {
          res.push({
            date: dayjs(endDate).subtract(index, 'month').toDate(),
            base: Number(base),
            extract: Number(extract),
          })
        })
      return res
    }, [])

    const { details, count } = listData.reduce(
      (res, item, index) => {
        const { details, count } = res
        const { base, extract } = item
        // 上个剩余的提取额
        const { restExtract = 0 } = details[details.length - 1] || {}
        // 本月总提取额
        const allExtract = extract + restExtract
        // 本月实际可提取额
        const currentExtract = allExtract > base ? base : allExtract
        // 当前月剩余待提取额
        const currentRestExtract = allExtract - currentExtract
        const month = index + 1
        // 本月可贷总额计算
        let currentCount: number | string =
          month * (base - currentExtract) * 0.9
        currentCount = Number.isInteger(currentCount)
          ? currentCount
          : currentCount.toFixed(2)

        return {
          details: [
            ...res.details,
            {
              ...item,
              actualExtract: currentExtract,
              restExtract: currentRestExtract,
              count: currentCount,
              month,
            },
          ],
          count: count + Number(currentCount),
        }
      },
      { details: [], count: 0 },
    )

    Dialog.show({
      content: (
        <div>
          <div>
            <p style={{ textAlign: 'center' }}>
              可贷&nbsp;
              <strong style={{ color: 'red' }}>{toMillion(count)}</strong>
              &nbsp;万元
            </p>
            {tip}
          </div>
        </div>
      ),
      closeOnAction: true,
      actions: [
        {
          key: 'online',
          text: '查看明细',
          onClick: () => {
            setShowDetailVisible(true)
            setDetails([...details].reverse())
          },
        },
        {
          key: 'online',
          text: '关闭',
        },
      ],
    })

    setCount(count)
  }, [validate])

  return (
    <div>
      <WaterMark />
      <div className={styles.content}>
        {forms.map((formItem, index) => {
          return (
            <FormItem
              key={index}
              index={index + 1}
              resitryForm={(formInstance: any) =>
                (formItem.form = formInstance)
              }
              initialValue={formItem.data}
              hasNext={index != forms.length - 1}
              onRemove={() => setForms((forms) => forms.slice(0, -1))}
            />
          )
        })}
        <div className={styles.add}>
          <AddCircleOutline fontSize={48} onClick={onAdd} />
          <div>
            <span>添加上一段记录</span>
          </div>
        </div>
      </div>
      <div className={styles.operate}>
        <Button block color="primary" onClick={calculate}>
          计算
        </Button>
      </div>
      <DetailPopup
        visible={detailVisible}
        details={details}
        count={count}
        onClose={setShowDetailVisible.bind(null, false)}
      />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))
