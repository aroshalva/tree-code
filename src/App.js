// http://bl.ocks.org/robschmuecker/7880033
import aa, { getClassWithColor } from 'file-icons-js'

import React from 'react';
import 'highlight.js/styles/dracula.css';
import 'react-tree-graph/dist/style.css'
import './App.css';
import { attachTree } from "./d3-shit"
import { dummyData } from "./dummy-data"
import path from "path"
import 'file-icons-js/css/style.css'

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

const transformEventToData  = event => {
  let files = event.target.files

  const finalFiles = []

  for (let i=0; i<files.length; i++) {
    finalFiles.push(files[i].webkitRelativePath)
  };

  return buildTree(finalFiles, path.sep)
}


class App extends React.Component {
  treeId = "tree-container"

  dummyTreeShow = true

  componentDidMount () {
    if (this.dummyTreeShow) {
      setTimeout(() => { attachTree(dummyData) }, 10)
    }
  }

  getFolder = (event) => {
    attachTree(transformEventToData(event))
  }

  render() {
    return (
      <div>
        {!this.dummyTreeShow &&
          <input type="file" id="flup" onChange={this.getFolder} webkitdirectory="" mozdirectory="" msdirectory="" odirectory="" directory="" multiple />
        }
        <div class={getClassWithColor.bind(aa)("nana.js")}></div>

        <div id={this.treeId} />
      </div>
    );
  }
}

export default App;
