import { toRefs, onMounted } from 'composition-api'
import useForm$ from './../useForm$'
import useTheme from './../useTheme'
import useInput from './features/useInput'
import usePath from './features/usePath'
import useConditions from './../useConditions'
import useValueToggle from './features/useValueToggle'
import useData from './features/useData'
import useDefault from './features/useDefault'
import useNullValueBoolean from './features/useNullValueBoolean'
import useValidation from './features/useValidation'
import useLabel from './features/useLabel'
import useClasses from './features/useClasses'
import useId from './features/useId'
import useColumns from './features/useColumns'
import useDescription from './features/useDescription'
import useInfo from './features/useInfo'
import useBaseElement from './features/useBaseElement'
import useView from './features/useView'
import useComponents from './features/useComponents'
import useLayout from './features/useLayout'
import useSlots from './features/useSlots'
import useDebounce from './features/useDebounce'
import useDisabledInput from './features/useDisabledInput'
import useEvents from './../useEvents'
import useHandleChangeCheckbox from './features/useHandleChangeCheckbox'
import useText from './features/useText'
import useBooleanValue from './features/useBooleanValue'
import useToggle from './features/useToggle'

export default function useCheckbox(props, context) {
  const { schema } = toRefs(props)

  const form$ = useForm$(props, context)
  const theme = useTheme(props, context)
  const input = useInput(props, context)
  const path = usePath(props, context)
  const id = useId(props, context)
  const description = useDescription(props, context)
  const info = useInfo(props, context)
  const debounce = useDebounce(props, context)
  const disabled = useDisabledInput(props, context)
  const booleanValue = useBooleanValue(props, context)

  const nullValue = useNullValueBoolean(props, context, {
    falseValue: booleanValue.falseValue,
  })

  const default_ = useDefault(props, context, {
    nullValue: nullValue.nullValue
  })

  const value = useValueToggle(props, context, {
    nullValue: nullValue.nullValue,
    default: default_.default,
    trueValue: booleanValue.trueValue,
    falseValue: booleanValue.falseValue,
  })

  const conditions = useConditions(props, context, {
    form$: form$.form$,
    path: path.path,
    descriptor: schema,
  })

  const validation = useValidation(props, context, {
    form$: form$.form$,
    path: path.path,
  })

  const events = useEvents(props, context, {
    form$: form$.form$,
    descriptor: schema,
  }, {
    events: ['change'],
  })

  const data = useData(props, context, {
    form$: form$.form$,
    available: conditions.available,
    value: value.value,
    currentValue: value.currentValue,
    previousValue: value.previousValue,
    clean: validation.clean,
    validate: validation.validate,
    resetValidators: validation.resetValidators,
    fire: events.fire,
    default: default_.default,
    nullValue: nullValue.nullValue,
    dirt: validation.dirt,
  })

  const label = useLabel(props, context, {
    form$: form$.form$,
  })

  const baseElement = useBaseElement(props, context, {
    label: label.label,
  })
  
  const components = useComponents(props, context, {
    theme: theme.theme,
    form$: form$.form$
  })

  const layout = useLayout(props, context, {
    components: components.components,
  })

  const classes = useClasses(props, context, {
    form$: form$.form$,
    theme: theme.theme,
  })

  const columns = useColumns(props, context, {
    form$: form$.form$,
  })

  const view = useView(props, context, {
    available: conditions.available,
  })

  const slots = useSlots(props, context, {
    form$: form$.form$,
    components: components.components,
  })

  const handleChange = useHandleChangeCheckbox(props, context, {
    form$: form$.form$,
    model: value.model,
    currentValue: value.currentValue,
    previousValue: value.previousValue,
    changed: data.changed,
    dirt: validation.dirt,
    validate: validation.validate,
    fire: events.fire,
  })

  const text = useText(props, context)

  const toggle = useToggle(props, context, {
    update: data.update,
    trueValue: booleanValue.trueValue,
    falseValue: booleanValue.falseValue,
  })

  onMounted(() => {
    validation.initMessageBag()
    validation.initValidation()
  })

  return {
    ...form$,
    ...theme,
    ...input,
    ...path,
    ...conditions,
    ...value,
    ...validation,
    ...label,
    ...classes,
    ...id,
    ...columns,
    ...description,
    ...info,
    ...baseElement,
    ...view,
    ...components,
    ...layout,
    ...slots,
    ...debounce,
    ...disabled,
    ...events,
    ...data,
    ...default_,
    ...nullValue,
    ...handleChange,
    ...booleanValue,
    ...text,
    ...toggle,
  }
} 