import React from 'react';
import 'highlight.js/styles/dracula.css';
import 'react-tree-graph/dist/style.css'
import HighlightBasics from  './HighlightBasics';
import Tree from  'react-tree-graph';
import './App.css';
import { attachTree } from "./d3-shit"
import path from "path"

class App extends React.Component {
  treeId = "tree-container"

  getFolder = (event) => {
    // var files = e.target.files;
    // var path = files[0].webkitRelativePath;
    // var Folder = path.split("/");
    // alert(Folder[0]);

    const finalFiles = []
    let files = event.target.files
    for (let i=0; i<files.length; i++) {
      finalFiles.push(files[i].webkitRelativePath)
    };

    console.log(finalFiles)

    // attachTree()
  }

  onClick = () => {
    attachTree()
  }

  render() {
    return (
      <div>
        {/* <input type="file" id="flup" onChange={this.getFolder} webkitdirectory="" mozdirectory="" msdirectory="" odirectory="" directory="" multiple /> */}
        <button onClick={this.onClick}>click</button>

        <div id={this.treeId} />
      </div>
    );
  }
}

export default App;


/*
<script type="text/javascript">
  function getfolder(e) {
    var files = e.target.files;
    var path = files[0].webkitRelativePath;
    var Folder = path.split("/");
    alert(Folder[0]);
  }
</script>

<input type="file" id="flup" onchange="getfolder(event)" webkitdirectory mozdirectory msdirectory odirectory directory multiple />
*/