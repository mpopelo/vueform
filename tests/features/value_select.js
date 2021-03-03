import { createForm, findAllComponents, findAll, destroy } from 'test-helpers'
import { nextTick } from 'composition-api'
import flushPromises from 'flush-promises'

import { value as baseValue } from './value'

export const value = function (elementType, elementName, options) {
  baseValue(elementType, elementName, options)

  it('should value be equal to selected option\'s value when items are an array & native=true', async () => {
    let form = createForm({
      schema: {
        el: {
          type: elementType,
          native: true,
          items: [1,2,3],
          default: 0,
        }
      }
    })

    let el = form.vm.el$('el')
    let elWrapper = findAllComponents(form, { name: elementName }).at(0)
    let select = findAll(elWrapper, `select`).at(0)
    let options = findAll(select, `option`)

    // Default value
    expect(el.value).toBe(0)
    expect(findAll(select, `option:checked`).at(0).element.value).toBe('0')

    // Loaded value
    el.load(1)
    expect(el.value).toBe(1)
    await nextTick()
    expect(findAll(select, `option:checked`).at(0).element.value).toBe('1')

    // Selected value
    options.at(2).setSelected()
    expect(el.value).toBe(2)
    expect(findAll(select, `option:checked`).at(0).element.value).toBe('2')
  })

  it('should value be equal to selected option\'s value when items are an object & native=true', async () => {
    let form = createForm({
      schema: {
        el: {
          type: elementType,
          native: true,
          items: {0:1,1:2,2:3},
          default: 0,
        }
      }
    })

    let el = form.vm.el$('el')
    let elWrapper = findAllComponents(form, { name: elementName }).at(0)
    let select = findAll(elWrapper, `select`).at(0)
    let options = findAll(select, `option`)

    // Default value
    expect(el.value).toBe(0)
    expect(findAll(select, `option:checked`).at(0).element.value).toBe('0')

    // Loaded value
    el.load(1)
    expect(el.value).toBe(1)
    await nextTick()
    expect(findAll(select, `option:checked`).at(0).element.value).toBe('1')

    // Selected value
    options.at(2).setSelected()
    expect(el.value).toBe('2')
    expect(findAll(select, `option:checked`).at(0).element.value).toBe('2')
  })

  it('should value be equal to selected option\'s value when items are an array of objects & native=true', async () => {
    let form = createForm({
      schema: {
        el: {
          type: elementType,
          native: true,
          items: [
            { value: 0, label: 1 },
            { value: 1, label: 2 },
            { value: 2, label: 3 },
          ],
          default: 0,
        }
      }
    })

    let el = form.vm.el$('el')
    let elWrapper = findAllComponents(form, { name: elementName }).at(0)
    let select = findAll(elWrapper, `select`).at(0)
    let options = findAll(select, `option`)

    // Default value
    expect(el.value).toBe(0)
    expect(findAll(select, `option:checked`).at(0).element.value).toBe('0')

    // Loaded value
    el.load(1)
    expect(el.value).toBe(1)
    await nextTick()
    expect(findAll(select, `option:checked`).at(0).element.value).toBe('1')

    // Selected value
    options.at(2).setSelected()
    expect(el.value).toBe(2)
    expect(findAll(select, `option:checked`).at(0).element.value).toBe('2')
  })

  it('should value be equal to selected option\'s value when items are async & native=true', async () => {
    let form = createForm({
      schema: {
        el: {
          type: elementType,
          native: true,
          items: async () => {
            return await new Promise((resolve, reject) => {
              resolve([1,2,3])
            })
          },
          default: 0,
        }
      }
    })

    await flushPromises()

    let el = form.vm.el$('el')
    let elWrapper = findAllComponents(form, { name: elementName }).at(0)
    let select = findAll(elWrapper, `select`).at(0)
    let options = findAll(select, `option`)

    // Default value
    expect(el.value).toBe(0)
    expect(findAll(select, `option:checked`).at(0).element.value).toBe('0')

    // Loaded value
    el.load(1)
    expect(el.value).toBe(1)
    await nextTick()
    expect(findAll(select, `option:checked`).at(0).element.value).toBe('1')

    // Selected value
    options.at(2).setSelected()
    expect(el.value).toBe(2)
    expect(findAll(select, `option:checked`).at(0).element.value).toBe('2')
  })

  it('should value be equal to selected option\'s value when items are an array & native=false', async () => {
    let form = createForm({
      schema: {
        el: {
          type: elementType,
          native: false,
          items: [1,2,3],
          default: 0,
        }
      }
    }, { 
      attach: true,
    })

    let el = form.vm.el$('el')
    let select = el.input

    // Default value
    expect(el.value).toBe(0)
    expect(select.externalValue).toBe(0)
    expect(select.internalValue).toStrictEqual({ value: 0, label: 1 })

    // Loaded value
    el.load(1)
    expect(el.value).toBe(1)
    await nextTick()
    expect(select.externalValue).toBe(1)
    expect(select.internalValue).toStrictEqual({ value: 1, label: 2 })

    // Selected value
    select.handleOptionClick({ value: 2, label: 3 })
    await nextTick()
    expect(select.externalValue).toBe(2)
    expect(select.internalValue).toStrictEqual({ value: 2, label: 3 })

    destroy(form)
  })

  it('should value be equal to selected option\'s value when items are an object & native=false', async () => {
    let form = createForm({
      schema: {
        el: {
          type: elementType,
          native: false,
          items: {0:1,1:2,2:3},
          default: 0,
        }
      }
    }, { 
      attach: true,
    })

    let el = form.vm.el$('el')
    let select = el.input

    // Default value
    expect(el.value).toBe(0)
    expect(select.externalValue).toBe(0)
    expect(select.internalValue).toStrictEqual({ value: '0', label: 1 })

    // Loaded value
    el.load(1)
    expect(el.value).toBe(1)
    await nextTick()
    expect(select.externalValue).toBe(1)
    expect(select.internalValue).toStrictEqual({ value: '1', label: 2 })

    // Selected value
    select.handleOptionClick({ value: '2', label: 3 })
    await nextTick()
    expect(select.externalValue).toBe('2')
    expect(select.internalValue).toStrictEqual({ value: '2', label: 3 })

    destroy(form)
  })

  it('should value be equal to selected option\'s value when items are an array of objects & native=false', async () => {
    let form = createForm({
      schema: {
        el: {
          type: elementType,
          native: false,
          items: [
            { value: 0, label: 1 },
            { value: 1, label: 2 },
            { value: 2, label: 3 },
          ],
          default: 0,
        }
      }
    }, { 
      attach: true,
    })

    let el = form.vm.el$('el')
    let select = el.input

    // Default value
    expect(el.value).toBe(0)
    expect(select.externalValue).toBe(0)
    expect(select.internalValue).toStrictEqual({ value: 0, label: 1 })

    // Loaded value
    el.load(1)
    expect(el.value).toBe(1)
    await nextTick()
    expect(select.externalValue).toBe(1)
    expect(select.internalValue).toStrictEqual({ value: 1, label: 2 })

    // Selected value
    select.handleOptionClick({ value: 2, label: 3 })
    await nextTick()
    expect(select.externalValue).toBe(2)
    expect(select.internalValue).toStrictEqual({ value: 2, label: 3 })

    destroy(form)
  })

  it('should value be equal to selected option\'s value when items are async & native=false', async () => {
    let form = createForm({
      schema: {
        el: {
          type: elementType,
          native: false,
          items: async () => {
            return await new Promise((resolve, reject) => {
              resolve([1,2,3])
            })
          },
          default: 0,
        }
      }
    }, { 
      attach: true,
    })

    await flushPromises()

    let el = form.vm.el$('el')
    let select = el.input

    // Default value
    expect(el.value).toBe(0)
    expect(select.externalValue).toBe(0)
    expect(select.internalValue).toStrictEqual({ value: 0, label: 1 })

    // Loaded value
    el.load(1)
    expect(el.value).toBe(1)
    await nextTick()
    expect(select.externalValue).toBe(1)
    expect(select.internalValue).toStrictEqual({ value: 1, label: 2 })

    // Selected value
    select.handleOptionClick({ value: 2, label: 3 })
    await nextTick()
    expect(select.externalValue).toBe(2)
    expect(select.internalValue).toStrictEqual({ value: 2, label: 3 })

    destroy(form)
  })

  it('should value be equal to selected option\'s value when items are an array & native=false object=true', async () => {
    let form = createForm({
      schema: {
        el: {
          type: elementType,
          native: false,
          items: [1,2,3],
          default: { value: 0, label: 1 },
          options: {
            object: true
          }
        }
      }
    }, { 
      attach: true,
    })

    let el = form.vm.el$('el')
    let select = el.input

    // Default value
    expect(el.value).toStrictEqual({ value: 0, label: 1 })
    expect(select.externalValue).toStrictEqual({ value: 0, label: 1 })
    expect(select.internalValue).toStrictEqual({ value: 0, label: 1 })

    // Loaded value
    el.load({ value: 1, label: 2 })
    expect(el.value).toStrictEqual({ value: 1, label: 2 })
    await nextTick()
    expect(select.externalValue).toStrictEqual({ value: 1, label: 2 })
    expect(select.internalValue).toStrictEqual({ value: 1, label: 2 })

    // Selected value
    select.handleOptionClick({ value: 2, label: 3 })
    await nextTick()
    expect(select.externalValue).toStrictEqual({ value: 2, label: 3 })
    expect(select.internalValue).toStrictEqual({ value: 2, label: 3 })

    destroy(form)
  })

  it('should value be equal to selected option\'s value when items are an object & native=false object=true', async () => {
    let form = createForm({
      schema: {
        el: {
          type: elementType,
          native: false,
          items: {0:1,1:2,2:3},
          default: { value: '0', label: 1 },
          options: {
            object: true
          }
        }
      }
    }, { 
      attach: true,
    })

    let el = form.vm.el$('el')
    let select = el.input

    // Default value
    expect(el.value).toStrictEqual({ value: '0', label: 1 })
    expect(select.externalValue).toStrictEqual({ value: '0', label: 1 })
    expect(select.internalValue).toStrictEqual({ value: '0', label: 1 })

    // Loaded value
    el.load({ value: '1', label: 2 })
    expect(el.value).toStrictEqual({ value: '1', label: 2 })
    await nextTick()
    expect(select.externalValue).toStrictEqual({ value: '1', label: 2 })
    expect(select.internalValue).toStrictEqual({ value: '1', label: 2 })

    // Selected value
    select.handleOptionClick({ value: '2', label: 3 })
    await nextTick()
    expect(select.externalValue).toStrictEqual({ value: '2', label: 3 })
    expect(select.internalValue).toStrictEqual({ value: '2', label: 3 })

    destroy(form)
  })

  it('should value be equal to selected option\'s value when items are an array of objects & native=false object=true', async () => {
    let form = createForm({
      schema: {
        el: {
          type: elementType,
          native: false,
          items: [
            { v: 0, label: 1 },
            { v: 1, label: 2 },
            { v: 2, label: 3 },
          ],
          default: { v: 0, label: 1 },
          options: {
            object: true,
            valueProp: 'v'
          }
        }
      }
    }, { 
      attach: true,
    })

    let el = form.vm.el$('el')
    let select = el.input

    // Default value
    expect(el.value).toStrictEqual({ v: 0, label: 1 })
    expect(select.externalValue).toStrictEqual({ v: 0, label: 1 })
    expect(select.internalValue).toStrictEqual({ v: 0, label: 1 })

    // Loaded value
    el.load({ v: 1, label: 2 })
    expect(el.value).toStrictEqual({ v: 1, label: 2 })
    await nextTick()
    expect(select.externalValue).toStrictEqual({ v: 1, label: 2 })
    expect(select.internalValue).toStrictEqual({ v: 1, label: 2 })

    // Selected value
    select.handleOptionClick({ v: 2, label: 3 })
    await nextTick()
    expect(select.externalValue).toStrictEqual({ v: 2, label: 3 })
    expect(select.internalValue).toStrictEqual({ v: 2, label: 3 })

    destroy(form)
  })

  it('should value be equal to selected option\'s value when items are async & native=false object=true', async () => {
    let form = createForm({
      schema: {
        el: {
          type: elementType,
          native: false,
          items: async () => {
            return await new Promise((resolve, reject) => {
              resolve([1,2,3])
            })
          },
          default: { value: 0, label: 1 },
          options: {
            object: true,
          }
        }
      }
    }, { 
      attach: true,
    })

    await flushPromises()

    let el = form.vm.el$('el')
    let select = el.input

    // Default value
    expect(el.value).toStrictEqual({ value: 0, label: 1 })
    expect(select.externalValue).toStrictEqual({ value: 0, label: 1 })
    expect(select.internalValue).toStrictEqual({ value: 0, label: 1 })

    // Loaded value
    el.load({ value: 1, label: 2 })
    expect(el.value).toStrictEqual({ value: 1, label: 2 })
    await nextTick()
    expect(select.externalValue).toStrictEqual({ value: 1, label: 2 })
    expect(select.internalValue).toStrictEqual({ value: 1, label: 2 })

    // Selected value
    select.handleOptionClick({ value: 2, label: 3 })
    await nextTick()
    expect(select.externalValue).toStrictEqual({ value: 2, label: 3 })
    expect(select.internalValue).toStrictEqual({ value: 2, label: 3 })

    destroy(form)
  })
}