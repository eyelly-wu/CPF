import React, { useCallback, useRef } from 'react'
import { Popup, Button, Dialog } from 'antd-mobile'
import { PopupProps } from 'antd-mobile/es/components/popup/popup'
import { Detail } from '../types'
import dayjs from 'dayjs'
import domtoimage from 'dom-to-image'
import xlsx from 'xlsx'
import WaterMark from '../watermark'
import { tip } from '../../constants'
import { toMillion } from '../../utils'
import styles from './index.scss'

export interface DetailPopupProps extends Pick<PopupProps, 'visible'> {
  onClose: () => void
  details: Detail[]
  count: number
}

export default function DetailPopup(props: DetailPopupProps) {
  const { visible, onClose, details, count } = props
  const tableRef = useRef(null)
  const [saveImageLoading, setSaveImageLoading] = React.useState(false)
  const [saveExcelLoading, setSaveExcelLoading] = React.useState(false)

  function showFileAler() {
    Dialog.alert({
      content:
        '该操作已完成，如果没有触发文件下载，说明当前浏览器环境不支持，请尝试切换其他浏览器环境',
    })
  }

  const saveAsImage = useCallback(() => {
    setSaveImageLoading(true)
    setTimeout(async () => {
      try {
        const iamgeUrl = await domtoimage.toPng(tableRef.current, {
          bgcolor: 'white',
        })
        const a = document.createElement('a')
        a.href = iamgeUrl
        a.download = '公积金贷款额度明细表.png'
        a.click()
        showFileAler()
      } catch (error) {
        Dialog.show({ content: error.message })
      }

      setSaveImageLoading(false)
    })
  }, [])

  const saveasExcel = useCallback(async () => {
    setSaveExcelLoading(true)
    try {
      const book = xlsx.utils.table_to_book(tableRef.current)
      await xlsx.writeFile(book, '公积金贷款额度明细表.xlsx')
      showFileAler()
    } catch (error) {
      Dialog.show({ content: error.message })
    }
    setSaveExcelLoading(false)
  }, [])

  return (
    <>
      <Popup
        visible={visible}
        onMaskClick={onClose}
        bodyStyle={{ height: '100vh', overflow: 'hidden' }}
        className={styles.detail}
      >
        <div
          className={styles.wrapper}
          style={{ height: '100vh', overflow: 'scroll' }}
        >
          <WaterMark />
          <table border={1} align="center" ref={tableRef}>
            <caption>公积金贷款额度明细表</caption>
            <thead>
              <tr>
                <th>月份</th>
                <th>对应的储存月份数</th>
                <th>当月缴存入账的金额</th>
                <th>提取金额</th>
                <th>当月应被抵扣的提取额</th>
                <th>当月可纳入计算的金额</th>
                <th>
                  该月贷款额度 = 每月缴存的公积金 x 对应存储月份数 x 存款系数
                </th>
              </tr>
            </thead>
            <tbody>
              {details.map((detail, index) => {
                const { date, month, base, extract, actualExtract, count } =
                  detail
                return (
                  <tr>
                    <td className={styles.dateColumn}>
                      {dayjs(date).format('YYYY年M月')}
                    </td>
                    <td>{month}</td>
                    <td>{base}</td>
                    <td>{extract ? -extract : ''}</td>
                    <td>{actualExtract ? -actualExtract : ''}</td>
                    <td>{base - actualExtract}</td>
                    <td>{`${
                      base - actualExtract
                    } x ${month} x 0.9 = ${count}`}</td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={6}>总计</td>
                <td align="center">{count} 元</td>
              </tr>
              <tr>
                <td colSpan={7} style={{ textAlign: 'left' }}>
                  每月货款额度加总后，结果为{count}
                  元，因贷款额度最小取值为千元，因此该缴存人货款额度为
                  {toMillion(count)}
                  万元。
                </td>
              </tr>
              <tr>
                <td colSpan={7} style={{ textAlign: 'left' }}>
                  {tip}
                </td>
              </tr>
            </tfoot>
          </table>
          <div className={styles.operate}>
            <Button
              size="mini"
              color="primary"
              onClick={saveAsImage}
              loading={saveImageLoading}
            >
              保存为图片
            </Button>
            <Button size="mini" color="primary" onClick={onClose}>
              关闭
            </Button>
            <Button
              size="mini"
              color="primary"
              onClick={saveasExcel}
              loading={saveExcelLoading}
            >
              导出EXCEL
            </Button>
          </div>
        </div>
      </Popup>
    </>
  )
}
