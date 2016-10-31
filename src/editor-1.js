var EditorState = require("prosemirror-state").EditorState
var EditorView = require("prosemirror-view").EditorView
var schema = require("prosemirror-schema-basic").schema

var view = new EditorView(document.querySelector('.editor-1'), {
  state: EditorState.create({schema: schema}),
  onAction: function(action) {
    view.updateState(view.state.applyAction(action))
  }
})
