const {EditorState} = require("prosemirror-state")
const {MenuBarEditorView} = require("prosemirror-menu")
const {DOMParser, Schema} = require("prosemirror-model")
const {schema: baseSchema} = require("prosemirror-schema-basic")
const {addListNodes} = require("prosemirror-schema-list")
const {exampleSetup} = require("prosemirror-example-setup")
const {ReplaceStep, AddMarkStep, RemoveMarkStep, ReplaceAroundStep} = require("prosemirror-transform")
const schema = new Schema({
  nodes: addListNodes(baseSchema.nodeSpec, "paragraph block*", "block"),
  marks: baseSchema.markSpec
})

let content = document.querySelector(".editor-5-content")
content.style.display = "none"
const colors = ['#FFEFBD', '#C7EDAF', '#F2B3C2', '#A4A3D1']

const state = EditorState.create({
  doc: DOMParser.fromSchema(schema).parse(content),
  plugins: exampleSetup({schema})
})

const stepList = document.querySelector('.editor-5-step-list')

const renderStep = (step) => {
  console.log(step);
  if (stepList.children.length >= 5) {
    stepList.removeChild(stepList.children[4]);
  }
  let text = ''
  if (step instanceof ReplaceStep) {
    if (step.slice.toJSON() === null) {
      text += `Delete the content between ${step.from} and ${step.to}\n`
    } else {
      text += `Replace the content between ${step.from} and ${step.to} with the slice: \n`
      text += JSON.stringify(step.slice.toJSON(), null, 2)
    }
  }
  if (step instanceof AddMarkStep) {
    text += `For the content between ${step.from} and ${step.to} apply a ${step.mark.type.name} mark`
  }
  if (step instanceof RemoveMarkStep) {
    text += `For the content between ${step.from} and ${step.to} remove the ${step.mark.type.name} mark`
  }
  if (step instanceof ReplaceAroundStep) {
    text += `For the content between ${step.from} and ${step.to}, remove the outer node and insert its content into\n`
    text += JSON.stringify(step.slice.toJSON(), null, 2)
  }
  let pre = document.createElement('pre')
  pre.style.backgroundColor = colors[Math.floor( Math.random() * 4)]
  pre.classList.add('editor-5-step')
  pre.innerHTML = text
  if (stepList.children.length) {
    stepList.insertBefore(pre, stepList.children[0])
  } else {
    stepList.appendChild(pre)
  }
}

let view = new MenuBarEditorView(document.querySelector(".editor-5"), {
  state: state,
  onAction(action) {
    view.updateState(view.editor.state.applyAction(action))
    if (action.type==="transform") {
      action.transform.steps.forEach(renderStep)
    }
  },
})
