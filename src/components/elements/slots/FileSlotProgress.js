import useElementComponent from './../../../composables/useElementComponent'

export default {
  name: 'FileSlotProgress',
  props: {
    progress: {
      required: true,
      type: [Number],
      default: 0,
    }
  },
  init(props, context) {
    return {
      ...useElementComponent(props, context),
    }
  },
}