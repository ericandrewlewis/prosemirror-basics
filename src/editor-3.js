const {EditorState} = require("prosemirror-state")
const {MenuBarEditorView} = require("prosemirror-menu")
const {DOMParser, Schema} = require("prosemirror-model")
const {schema: baseSchema} = require("prosemirror-schema-basic")
const {addListNodes} = require("prosemirror-schema-list")
const {exampleSetup} = require("prosemirror-example-setup")

const schema = new Schema({
  nodes: addListNodes(baseSchema.nodeSpec, "paragraph block*", "block"),
  marks: baseSchema.markSpec
})

let content = document.querySelector(".editor-3-content")
content.style.display = "none"

const prettyJSONContainer = document.querySelector('.editor-3-doc')

const renderDocAsText = (doc) => {
  prettyJSONContainer.innerHTML = JSON.stringify(doc.toJSON(), null, 2)
}

const state = EditorState.create({
  doc: DOMParser.fromSchema(schema).parse(content),
  plugins: exampleSetup({schema})
})

renderDocAsText(state.doc)

let view = new MenuBarEditorView(document.querySelector(".editor-3"), {
  state: state,
  onAction(action) {
    view.updateState(view.editor.state.applyAction(action))
    renderDocAsText(view.editor.state.doc)
  },
})
