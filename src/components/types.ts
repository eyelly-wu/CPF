import { FormInstance } from 'rc-field-form'

export interface FormData {
  startDate: Date
  endDate: Date
  base: string
  extract: string
}

export interface Form {
  data: FormData
  form: FormInstance
}

export interface Detail {
  date: Date // 日期
  month: string // 月份
  base: number // 基数
  extract: number // 提取
  actualExtract: number // 实际提取
  restExtract: number // 剩余提取
  count: number // 总计
}
