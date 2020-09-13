// http://bl.ocks.org/robschmuecker/7880033
// https://tree-code-4e0b9.web.app/

import React from 'react';
import 'highlight.js/styles/dracula.css';
import 'react-tree-graph/dist/style.css'
import './App.css';
import { attachTree } from "./d3-shit"
import { dummyData } from "./dummy-data"
import { attachId } from "./constants"
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

const transformEventToData  = event => {
  let files = event.target.files

  const finalFiles = []

  for (let i=0; i<files.length; i++) {
    finalFiles.push(files[i].webkitRelativePath)
  };

  return buildTree(finalFiles, path.sep)
}

const sortAsFoldersOnTop = (data) => {
  const sortArr = (arr) => {
    arr.sort((a, b) => b.name.toLowerCase() < a.name.toLowerCase() ? 1 : -1)

    arr.sort((a, b) => {
      if (a.children.length === 0 && b.children.length === 0) return 0
      if (a.children.length > 0 && b.children.length > 0) return 0

      return a.children.length > 0 ? -1 : 1
    })
  }

  const sortRecursive = (recData) => {
    if (recData.children) {
      sortArr(recData.children)

      recData.children.forEach((currChild) => { sortRecursive(currChild) })
    }
  }

  sortRecursive(data)

  return data
}

class App extends React.Component {
  // dummyTreeShow = true

  componentDidMount () {
    if (this.dummyTreeShow) {
      setTimeout(() => {
        attachTree(
          sortAsFoldersOnTop(dummyData)
        )
      }, 10)
    }
  }

  getFolder = (event) => {
    // eslint-disable-next-line
    document.getElementById(attachId).innerHTML = ""

    attachTree(
      sortAsFoldersOnTop(
        transformEventToData(event)
      )
    )
  }

  render() {
    return (
      <div>
        {!this.dummyTreeShow &&
          <input type="file" id="flup" onChange={this.getFolder} webkitdirectory="" mozdirectory="" msdirectory="" odirectory="" directory="" multiple />
        }

        <div id={attachId} />
      </div>
    );
  }
}

export default App;
