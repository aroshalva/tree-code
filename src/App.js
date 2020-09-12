import React from 'react';
import 'highlight.js/styles/dracula.css';
import 'react-tree-graph/dist/style.css'
import HighlightBasics from  './HighlightBasics';
import Tree from  'react-tree-graph';
import './App.css';

class App extends React.Component {
  getFolder(e) {
    console.log(99, e)

    var files = e.target.files;
    var path = files[0].webkitRelativePath;
    var Folder = path.split("/");
    alert(Folder[0]);
  }

  render() {
    return (
      <div>
        <input type="file" id="flup" onChange={this.getFolder} webkitdirectory mozdirectory msdirectory odirectory directory multiple />
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