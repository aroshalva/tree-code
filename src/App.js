import React from 'react';
import 'highlight.js/styles/dracula.css';
import 'react-tree-graph/dist/style.css'
import HighlightBasics from  './HighlightBasics';
import Tree from  'react-tree-graph';
import './App.css';
import { attachTree } from "./d3-shit"
import path from "path"

const buildTree = (fields, splitBy) => {
  var root;
  let tree = {
    "name": "Shako-root",
    "children": []
  }

  const addNodes = (tag) => {
    for (let i = 0; i < root.children.length; i++) {
      if (tag === root.children[i].name) {
        root = root.children[i];
        return;
      }
    }
    root.children.push({
      'name': tag,
      children: []
    })
    root = root.children[root.children.length-1]
  }

  fields.forEach((field) => {
    var tags = field.split(splitBy);
    root = tree;
    tags.forEach(addNodes)
  })
  return tree;
}

class App extends React.Component {
  treeId = "tree-container"

  getFolder = (event) => {
    const finalFiles = []
    let files = event.target.files
    for (let i=0; i<files.length; i++) {
      finalFiles.push(files[i].webkitRelativePath)
    };

    console.log(finalFiles)

    attachTree(buildTree(finalFiles, path.sep))
  }

  onClick = () => {
    attachTree()
  }

  render() {
    return (
      <div>
        <input type="file" id="flup" onChange={this.getFolder} webkitdirectory="" mozdirectory="" msdirectory="" odirectory="" directory="" multiple />

        <div id={this.treeId} />
      </div>
    );
  }
}

export default App;
