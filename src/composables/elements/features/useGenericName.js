import { computed, ref, toRefs } from 'composition-api'

const base = function(props, context, dependencies)
{
  const { name } = toRefs(props)

  // ============ DEPENDENCIES ============

  const label = dependencies.label || ref(null)
  const placeholder = dependencies.placeholder || ref(null)


  // ============== COMPUTED ==============

  /**
   * Helper property used to determine a generic name for the element.
   * 
   * @type {object}
   * @ignore
   */
  const genericName = computed(() => {
    if (label && label.value) {
      return label.value
    } else if (placeholder && placeholder.value) {
      return placeholder.value
    } else {
      return _.upperFirst(name.value)
    }
  })

  return {
    // Computed
    genericName,
  }
}

const file = function(props, context, dependencies)
{
  const { name, embed } = toRefs(props)

  // ============ DEPENDENCIES ============

  const form$ = dependencies.form$
  const label = dependencies.label || ref(null)
  const filename = dependencies.filename || ref(null)

  // ============== COMPUTED ==============

  /**
   * Helper property used to determine a generic name for the element.
   * 
   * @type {object}
   * @ignore
   */
  const genericName = computed(() => {
    if (embed.value && filename.value) {
      return filename.value
    } else if (label.value) {
      return label.value
    } else {
      return /^\d+$/.test(name.value)
        ? form$.value.__('laraform.elements.file.defaultName')
        : _.upperFirst(name.value)
    }
  })

  return {
    // Computed
    genericName,
  }
}

export {
  file,
} 

export default base