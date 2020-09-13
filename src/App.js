// http://bl.ocks.org/robschmuecker/7880033
// https://tree-code-4e0b9.web.app/
import hljs from 'highlight.js';

import React from 'react';
import 'highlight.js/styles/dracula.css';
import 'react-tree-graph/dist/style.css'
import './App.css';
import { attachTree } from "./d3-shit"
import { dummyData } from "./dummy-data"
import { attachId } from "./constants"
import path from "path"

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

const fileDisplayWidth = 450

// eslint-disable-next-line
var viewerWidth = $(document).width() - fileDisplayWidth
// eslint-disable-next-line
var viewerHeight = $(document).height() - 21

class App extends React.Component {
  // dummyTreeShow = true

  constructor(props) {
    super(props);

    this.fileInput = React.createRef();
    this.preCodeRef = React.createRef();

    this.state = { fileText: '', files: null }
  }

  buildTree = (fields, splitBy) => {
    var root;
    let tree = {
      "name": "Shako-root",
      "children": []
    }

    const addNodes = (tag, fieldIndex) => {
      for (let i = 0; i < root.children.length; i++) {
        if (tag === root.children[i].name) {
          root = root.children[i];
          return;
        }
      }
      root.children.push({
        'name': tag,
        indexInFiles: fieldIndex,
        children: []
      })
      root = root.children[root.children.length-1]
    }

    fields.forEach((field, fieldIndex) => {
      console.log(1, fieldIndex)
      var tags = field.split(splitBy);
      root = tree;
      tags.forEach(currentTag => addNodes(currentTag, fieldIndex))
    })
    return tree;
  }

  clearAllShit = () => {
    this.setState({
      fileText: '',
      files: null,
    })
    document.getElementById(attachId).innerHTML = ""
  }

  componentDidMount () {
    if (this.dummyTreeShow) {
      setTimeout(() => {
        attachTree({
          treeData: sortAsFoldersOnTop(dummyData),
          onNodeClick: this.onNodeClick,
          viewerWidth,
          viewerHeight,
        })
      }, 10)
    }
  }

  getFilesFromEvent = (event) => event.target.files

  handleDirectoryChange = (event) => {
    this.clearAllShit()

    const files = this.getFilesFromEvent(event)

    this.setState({ files: files })

    attachTree(
      {
        treeData: sortAsFoldersOnTop(this.transformEventToData(files)),
        onNodeClick: this.onNodeClick,
        viewerWidth,
        viewerHeight,
      }
    )
  }

  transformEventToData = files => {
    const finalFiles = []

    for (let i=0; i<files.length; i++) {
      finalFiles.push(files[i].webkitRelativePath)
    };

    return this.buildTree(finalFiles, path.sep)
  }

  onNodeClick = (d) => {
    if (!d.children && !d._children) {
      // to refresh element, remove from rendering, so that stupid highlightjs work properly on redraw
      this.setState({ fileText: "" })

      const reader = new FileReader()

      reader.onload = () => {
        this.setState({ fileText: reader.result })

        var blocks = document.querySelectorAll('pre code');
        Array.prototype.forEach.call(blocks, hljs.highlightBlock);
      }

      reader.readAsText(this.state.files[d.indexInFiles])
    }
  }

  render() {
    return (
      <div class="app">
        {!this.dummyTreeShow &&
          <input type="file" id="flup" onChange={this.handleDirectoryChange} webkitdirectory="" mozdirectory="" msdirectory="" odirectory="" directory="" multiple />
        }

        <div className="content-container">
          <div id={attachId} />

          <div className="highlightjs-shit">
            {this.state.fileText &&
              <pre><code>{this.state.fileText}</code></pre>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default App;
