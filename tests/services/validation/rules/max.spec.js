import flushPromises from 'flush-promises'
import { createForm, findAllComponents, change, setInstances, tryInputValues } from 'test-helpers'

describe('Max Rule', () => {
  it('should check if numeric value is lower or equal than minimum', async () => {
    let form = createForm({
      schema: {
        a: {
          type: 'text',
          rules: 'numeric|max:2',
        }
      }
    })

    let a = findAllComponents(form, { name: 'TextElement' }).at(0)

    let values = {
      '1': false,
      '2': false,
      '3': true,
      '1.2': false,
      '1,2': true,
      '2.5': true,
      '2,5': true,
      'asdf': true,
      '%/?+': true,
      '3 ': true,
      '-3': false,
    }
    
    await tryInputValues(values, a)
  })

  it('should check if integer value is lower or equal than minimum', async () => {
    let form = createForm({
      schema: {
        a: {
          type: 'text',
          rules: 'integer|max:2',
        }
      }
    })

    let a = findAllComponents(form, { name: 'TextElement' }).at(0)

    let values = {
      '1': false,
      '2': false,
      '3': true,
      '1.2': true,
      '1,2': true,
      '2.5': true,
      '2,5': true,
      'asdf': true,
      '%/?+': true,
      '3 ': true,
      '-3': false,
    }
    
    await tryInputValues(values, a)
  })

  it('should check if string length is lower or equal than minimum', async () => {
    let form = createForm({
      schema: {
        a: {
          type: 'text',
          rules: 'max:2',
        }
      }
    })

    let a = findAllComponents(form, { name: 'TextElement' }).at(0)
    
    change(a, 'a')
    await flushPromises()
    expect(a.vm.invalid).toBe(false)
    
    change(a, 'as')
    await flushPromises()
    expect(a.vm.invalid).toBe(false)
    
    change(a, 'asd')
    await flushPromises()
    expect(a.vm.invalid).toBe(true)
    
    change(a, 'a吧')
    await flushPromises()
    expect(a.vm.invalid).toBe(false)
    
    change(a, 'Ру')
    await flushPromises()
    expect(a.vm.invalid).toBe(false)
    
    change(a, ' ')
    await flushPromises()
    expect(a.vm.invalid).toBe(false)
    
    change(a, '  ')
    await flushPromises()
    expect(a.vm.invalid).toBe(false)
    
    change(a, '1')
    await flushPromises()
    expect(a.vm.invalid).toBe(false)
    
    change(a, '2')
    await flushPromises()
    expect(a.vm.invalid).toBe(false)
    
    change(a, '4')
    await flushPromises()
    expect(a.vm.invalid).toBe(false)
    
    change(a, '123')
    await flushPromises()
    expect(a.vm.invalid).toBe(true)
    
    change(a, '%!+')
    await flushPromises()
    expect(a.vm.invalid).toBe(true)
  })

  it('should check if array length is lower or equal than min (v<max)', async () => {
    let form = createForm({
      schema: {
        a: {
          type: 'list',
          rules: 'array|max:2',
          initial: 1,
          element: {
            type: 'text'
          }
        }
      }
    })

    let a = findAllComponents(form, { name: 'ListElement' }).at(0)

    a.vm.validate()
    await flushPromises()
    expect(a.vm.invalid).toBe(false)
  })

  it('should check if array length is lower or equal than min (v=max)', async () => {
    let form = createForm({
      schema: {
        a: {
          type: 'list',
          rules: 'array|max:2',
          initial: 2,
          element: {
            type: 'text'
          }
        }
      }
    })

    let a = findAllComponents(form, { name: 'ListElement' }).at(0)
    
    a.vm.validate()
    await flushPromises()
    expect(a.vm.invalid).toBe(false)
  })

  it('should check if array length is lower or equal than min (v>max)', async () => {
    let form = createForm({
      schema: {
        a: {
          type: 'list',
          rules: 'array|max:2',
          initial: 3,
          element: {
            type: 'text'
          }
        }
      }
    })

    let a = findAllComponents(form, { name: 'ListElement' }).at(0)

    a.vm.validate()
    await flushPromises()
    expect(a.vm.invalid).toBe(true)
  })

  it('should check for file', async () => {
    let form = createForm({
      schema: {
        el: {
          type: 'file',
          rules: 'max:2',
          auto: false,
        }
      }
    })

    let el = form.vm.el$('el')

    await el.validate()
    expect(el.invalid).toBe(false)

    let file = new File([''], 'file.jpg')
    Object.defineProperty(file, 'size', { value: 1000 })
    el.update(file)
    await el.validate()
    expect(el.invalid).toBe(false)

    file = new File([''], 'file.jpg')
    Object.defineProperty(file, 'size', { value: 2000 })
    el.update(file)
    await el.validate()
    expect(el.invalid).toBe(false)

    file = new File([''], 'file.jpg')
    Object.defineProperty(file, 'size', { value: 3000 })
    el.update(file)
    await el.validate()
    expect(el.invalid).toBe(true)
  })
})