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

let content = document.querySelector(".editor-4-content")
content.style.display = "none"

/**
 * Convert a node into an array of position and content pairs.
 */
let getNodePositions = (node) => {
  if (node.type.isLeaf) {
    if (node.type.isText) {
      return node.text.split('')
    } else {
      return [
        node.type.name
      ]
    }
  } else {
    let positions = [
      'start ' + node.type.name
    ]
    node.forEach((node) => {
      positions = positions.concat(getNodePositions(node))
    })
    positions = positions.concat(['end ' + node.type.name])
    return positions
  }
}

let renderPositions = (doc, selection) => {
  let positions = []
  doc.forEach((node) => {
    positions = positions.concat(getNodePositions(node))
  })
  let table = document.querySelector('.editor-4-position-info')
  table.innerHTML = ''
  let positionIndexesRow = document.createElement('tr');
  let positionContentRow = document.createElement('tr');
  let dom = document.querySelector('.editor-4-selection-position-info')
  dom.innerHTML = 'Current selection: From ' + selection.$from.pos + ' to ' + selection.$to.pos
  positions.forEach((value, index) => {
    let td = document.createElement('td');
    td.appendChild(document.createTextNode(index));
    if (index >= selection.$from.pos && index <= selection.$to.pos) {
      td.classList.add('selected');
    }
    positionIndexesRow.appendChild(td);
    td = document.createElement('td');
    if (index >= selection.$from.pos && index + 1 <= selection.$to.pos) {
      td.classList.add('selected');
    }
    td.appendChild(document.createTextNode(''));
    positionIndexesRow.appendChild(td);

    td = document.createElement('td');
    td.appendChild(document.createTextNode(''));
    positionContentRow.appendChild(td);
    td = document.createElement('td');
    td.appendChild(document.createTextNode(value));
    positionContentRow.appendChild(td);
  });
  table.appendChild(positionIndexesRow)
  table.appendChild(positionContentRow)
}


const state = EditorState.create({
  doc: DOMParser.fromSchema(schema).parse(content),
  plugins: exampleSetup({schema})
})

let view = new MenuBarEditorView(document.querySelector(".editor-4"), {
  state: state,
  onAction(action) {
    view.updateState(view.editor.state.applyAction(action))
    renderPositions(view.editor.state.doc, view.editor.state.selection);
  },
})

renderPositions(state.doc, state.selection);
