import lodash from 'lodash'
import { describe, expect, it } from 'vitest'
import rowFormatter from './row-formatter.js'

// Version of formatter with type-checking turned off to test runtime functionality
const rtRowFormatter: any = rowFormatter

describe('row formatter execution exceptions', () => {
  it('If mapper not is an array throw exception', () => {
    expect(() => rtRowFormatter('', '')).toThrow(/array/)
  })

  it('If mapper array is empty throw exception', () => {
    expect(() => rtRowFormatter([], '')).toThrow(/empty/)
  })

  it('If data is null throw exception', () => {
    expect(() => rtRowFormatter([{}], '')).toThrow('data is null')
  })

  it('If data is not an object throw exception', () => {
    expect(() => rtRowFormatter([{}], 'some string')).toThrow(
      'data is not an object'
    )
  })
})

describe('row formatter execution', () => {
  it('Two string field of size 10, result had lengh 20', () => {
    const map = [
      {
        type: 'string',
        size: '10',
        name: 'name',
      },
      {
        type: 'string',
        size: '10',
        name: 'surname',
      },
    ]
    const data = {
      name: 'John',
      surname: 'Doe',
    }
    expect(lodash.size(rtRowFormatter(map, data))).toBe(20)
  })

  it("Two string field of size 10, result is 'John      Doe       '", () => {
    const map = [
      {
        type: 'string',
        size: '10',
        name: 'name',
      },
      {
        type: 'string',
        size: '10',
        name: 'surname',
      },
    ]
    const data = {
      name: 'John',
      surname: 'Doe',
    }
    expect(rtRowFormatter(map, data)).toBe('John      Doe       ')
  })

  it("Concat field age of size 5, result is 'John      Doe       '", () => {
    const map = [
      {
        type: 'string',
        size: '10',
        name: 'name',
      },
      {
        type: 'string',
        size: '10',
        name: 'surname',
      },
      {
        type: 'integer',
        size: '5',
        name: 'age',
      },
    ]
    const data = {
      name: 'John',
      surname: 'Doe',
      age: 20,
    }
    expect(rtRowFormatter(map, data)).toBe('John      Doe          20')
  })

  it('Concat field height of size 5 precision 3', () => {
    const map = [
      {
        type: 'string',
        size: '10',
        name: 'name',
      },
      {
        type: 'string',
        size: '10',
        name: 'surname',
      },
      {
        type: 'integer',
        size: '5',
        name: 'age',
      },
      {
        type: 'float',
        size: '5',
        name: 'height',
        precision: 3,
      },
    ]
    const data = {
      name: 'John',
      surname: 'Doe',
      age: 20,
      height: 1.75,
    }
    expect(rtRowFormatter(map, data)).toBe('John      Doe          20 1750')
  })

  it("Concat field birth of size 10 format 'DD/MM/YYYY'", () => {
    const map = [
      {
        type: 'string',
        size: 10,
        name: 'name',
      },
      {
        type: 'string',
        size: '10',
        name: 'surname',
      },
      {
        type: 'integer',
        size: 5,
        name: 'age',
      },
      {
        type: 'float',
        size: 5,
        name: 'height',
        precision: 3,
      },
      {
        type: 'date',
        size: 11,
        paddingPosition: 'start',
        name: 'birth',
        format: {
          dateFormat: 'DD/MM/YYYY',
        },
      },
    ]
    const data = {
      name: 'John',
      surname: 'Doe',
      age: 20,
      height: 1.75,
      birth: '1989-12-11',
    }
    expect(rtRowFormatter(map, data)).toBe(
      'John      Doe          20 1750 11/12/1989'
    )
  })
})
