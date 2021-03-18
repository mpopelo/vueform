import flushPromises from 'flush-promises'
import { createForm, findAllComponents, change, setInstances } from 'test-helpers'

describe('Greater Than Equal Rule', () => {
  it('should validate if the element\'s value is greater than or equal an other field\'s if value is string', async () => {
    let form = createForm({
      schema: {
        a: {
          type: 'text',
          rules: 'gte:b'
        },
        b: {
          type: 'text',
        },
      }
    })

    let a = form.vm.el$('a')
    let b = form.vm.el$('b')

    a.update('aa')
    b.update('aa')
    await flushPromises()

    expect(a.invalid).toBe(false)

    a.update('a')
    await flushPromises()

    expect(a.invalid).toBe(true)
  })

  it('should validate if the element\'s value is greater than or equal an other field\'s if value is numeric', async () => {
    let form = createForm({
      schema: {
        a: {
          type: 'text',
          rules: 'numeric|gte:b'
        },
        b: {
          type: 'text',
          rules: 'numeric'
        },
      }
    })

    let a = form.vm.el$('a')
    let b = form.vm.el$('b')

    a.update('3')
    b.update('3')
    await flushPromises()

    expect(a.invalid).toBe(false)

    a.update('2')
    await flushPromises()

    expect(a.invalid).toBe(true)
  })

  it('should validate if the element\'s value is greater than or equal an other field\'s if value is array', async () => {
    let form = createForm({
      schema: {
        a: {
          type: 'list',
          rules: 'array|gte:b',
          initial: 3,
          element: {
            type: 'text'
          }
        },
        b: {
          type: 'list',
          rules: 'array',
          initial: 3,
          element: {
            type: 'text'
          }
        },
      }
    })

    let a = form.vm.el$('a')
    let b = form.vm.el$('b')

    a.validate()
    await flushPromises()

    expect(a.invalid).toBe(false)

    a.remove(0)

    a.validate()
    await flushPromises()

    expect(a.invalid).toBe(true)
  })

  it('should check for file', async () => {
    let form = createForm({
      schema: {
        el: {
          type: 'file',
          rules: 'gte:el2',
          auto: false,
        },
        el2: {
          type: 'file',
          auto: false,
        },
      }
    })

    let el = form.vm.el$('el')
    let el2 = form.vm.el$('el2')

    await el.validate()
    expect(el.invalid).toBe(false)

    let file1 = new File([''], 'file1.jpg')
    Object.defineProperty(file1, 'size', { value: 500 })
    el.update(file1)
    await el.validate()
    expect(el.invalid).toBe(false)

    let file2 = new File([''], 'file2.jpg')
    Object.defineProperty(file2, 'size', { value: 1000 })
    el2.update(file2)
    await el.validate()
    expect(el.invalid).toBe(true)

    file1 = new File([''], 'file1.jpg')
    Object.defineProperty(file1, 'size', { value: 1000 })
    el.update(file1)
    await el.validate()
    expect(el.invalid).toBe(false)

    file1 = new File([''], 'file1.jpg')
    Object.defineProperty(file1, 'size', { value: 2000 })
    el.update(file1)
    await el.validate()
    expect(el.invalid).toBe(false)
  })
})