import React from 'react';
import hljs from 'highlight.js';

class HighlightBasics extends React.Component {
  constructor(props) {
    super(props);

    this.fileInput = React.createRef();
    this.preCodeRef = React.createRef();

    this.state = { fileText: '' }
  }

  onClickProcess = () => {
    // to refresh element, remove from rendering, so that stupid highlightjs work properly on redraw
    this.setState({ fileText: "" })

    const reader = new FileReader()

    reader.onload = () => {
      this.setState({ fileText: reader.result })

      var blocks = document.querySelectorAll('pre code');
      Array.prototype.forEach.call(blocks, hljs.highlightBlock);
    }

    reader.readAsText(this.fileInput.current.files[0])
  }

  render() {
    return (
      <div>
        {this.state.fileText &&
          <pre><code>{this.state.fileText}</code></pre>
        }

        <input type="file" ref={this.fileInput} />

        <button onClick={this.onClickProcess}>process</button>
      </div>
    );
  }
}

export default HighlightBasics;
