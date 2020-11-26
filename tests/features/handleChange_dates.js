import flushPromises from 'flush-promises'
import { createForm, findAllComponents } from 'test-helpers'
import { nextTick } from 'composition-api'

export const handleChange = function (elementType, elementName, options) {
  it('should set model on change', async () => {
    let form = createForm({
      schema: {
        el: {
          type: elementType,
        }
      }
    })

    let el = form.vm.el$('el')

    let dates = [
      moment('2020-12-25').toDate(),
      moment('2020-12-30').toDate()
    ]
    
    el.input.update(dates)

    expect(el.model).toStrictEqual(dates)
  })

  it('should dirt the element if input value is different than the current', () => {
    let form = createForm({
      schema: {
        el: {
          type: elementType,
        }
      }
    })

    let el = form.vm.el$('el')

    expect(el.dirty).toBe(false)

    let dates = [
      moment('2020-12-25').toDate(),
      moment('2020-12-30').toDate()
    ]
    
    el.input.update(dates)

    expect(el.dirty).toBe(true)
  })

  it('should not dirt the element if input value is not different than the current', () => {
    let dates = [
      moment('2020-12-25').toDate(),
      moment('2020-12-30').toDate()
    ]

    let form = createForm({
      schema: {
        el: {
          type: elementType,
          default: dates,
        }
      }
    })

    let el = form.vm.el$('el')

    expect(el.dirty).toBe(false)
    
    el.input.update(dates)

    expect(el.dirty).toBe(false)
  })

  it('should trigger "change" event if value changed', () => {
    let onChangeMock = jest.fn()

    let form = createForm({
      schema: {
        el: {
          type: elementType,
          onChange: onChangeMock
        }
      }
    })

    let el = form.vm.el$('el')

    let dates = [
      moment('2020-12-25').toDate(),
      moment('2020-12-30').toDate()
    ]
    
    el.input.update(dates)

    expect(onChangeMock).toHaveBeenCalled()
  })

  it('should not trigger "change" event if value has not changed', () => {
    let onChangeMock = jest.fn()
    let dates = [
      moment('2020-12-25').toDate(),
      moment('2020-12-30').toDate()
    ]

    let form = createForm({
      schema: {
        el: {
          type: elementType,
          onChange: onChangeMock,
          default: dates,
        }
      }
    })

    let el = form.vm.el$('el')
    
    el.input.update(dates)

    expect(onChangeMock).not.toHaveBeenCalled()
  })

  it('should trigger validation on if validateOn contains "change"', async () => {
    let form = createForm({
      validateOn: 'submit',
      schema: {
        el: {
          type: elementType,
          rules: 'required',
        }
      }
    })

    let el = form.vm.el$('el')
    
    el.input.update([
      moment('2020-12-25').toDate(),
      moment('2020-12-30').toDate()
    ])

    await flushPromises()

    expect(el.validated).toBe(false)

    form.vm.validateOn = 'submit|change'
    
    el.input.update([
      moment('2020-12-26').toDate(),
      moment('2020-12-30').toDate()
    ])

    await flushPromises()

    expect(el.validated).toBe(true)
  })
}