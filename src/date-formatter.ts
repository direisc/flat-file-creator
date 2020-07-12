import * as moment from 'moment'
import * as _ from 'lodash'
import {
  getPaddingPositionOrDef,
  getPaddingSymbol,
  getPadder,
  getFillStringOfSymbol,
} from './utils'
import {
  DateFieldSpec,
  FieldValue,
  DateFieldValue,
  assertFieldSpec,
} from './Types'

const paddingDefault = 'end'
const defaultFormat = {
  utc: false,
}

const getFormattedDateString = (
  date: Date | moment.Moment | string,
  opts: Partial<NonNullable<DateFieldSpec['format']>>
) => {
  const base = moment(date)
  if (!base.isValid()) {
    throw new Error(`Invalid date ${date}`)
  }
  const convention = opts.utc ? base.utc() : base
  if (!opts.dateFormat) {
    return convention.toISOString()
  }
  return convention.format(opts.dateFormat)
}

function assertDateFieldValue(
  d: any,
  fieldName: string
): asserts d is DateFieldValue {
  if (
    d !== null &&
    typeof d !== 'undefined' &&
    typeof d !== 'string' &&
    typeof d.toISOString === 'undefined' &&
    typeof d.year === 'undefined'
  ) {
    throw new Error(
      `Value for date field ${fieldName} must be a date or a string representation of a date`
    )
  }
}

const dateFormatter = (map: DateFieldSpec, data: FieldValue) => {
  assertFieldSpec(map)
  assertDateFieldValue(data, map.name)

  const format = { ...defaultFormat, ...map.format }
  const resDate = data ? getFormattedDateString(data, format) : ''

  if (_.size(resDate) > map.size) {
    throw new Error(`Date ${resDate} exceed size ${map.size}`)
  }

  return getPadder(
    getPaddingPositionOrDef(map.paddingPosition, paddingDefault)
  )(
    resDate,
    getFillStringOfSymbol(getPaddingSymbol(map.paddingSymbol))(
      map.size - _.size(resDate)
    )
  )
}

export default dateFormatter
