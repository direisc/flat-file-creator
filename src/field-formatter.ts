import {
  DateFieldValue,
  FieldSpec,
  FloatFieldValue,
  IntegerFieldValue,
  RowData,
  StringFieldSpec,
  StringFieldValue,
  assertFieldSpec,
} from './Types.js'
import dateFormatter from './date-formatter.js'
import floatFormatter from './float-formatter.js'
import integerFormatter from './integer-formatter.js'
import stringFormatter from './string-formatter.js'

const fieldFormatter = <T>(map: FieldSpec, data: RowData<T>) => {
  try {
    assertFieldSpec(map)
    const fieldName = <keyof T>map.name
    switch (map.type) {
      case 'string':
        return stringFormatter(map, <StringFieldValue>data[fieldName])
      case 'integer':
        return integerFormatter(map, <IntegerFieldValue>data[fieldName])
      case 'float':
        return floatFormatter(map, <FloatFieldValue>data[fieldName])
      case 'date':
        return dateFormatter(map, <DateFieldValue>data[fieldName])
      case undefined:
        return stringFormatter(
          { ...(map as StringFieldSpec), type: 'string' },
          <StringFieldValue>data[fieldName]
        )
      default:
        throw new Error('required field type is not present')
    }
  } catch (e) {
    if (map) {
      e.message =
        `Field ${map.name}: ${e.message} ` +
        `(data: ${data ? `'${data[<keyof T>map.name]}'` : 'unknown'})`
    }
    throw e
  }
}

export default fieldFormatter
