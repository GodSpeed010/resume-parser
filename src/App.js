import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function App() {
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [pdfText, setPdfText] = useState('placeholder')

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
  };
  const handleSubmission = () => {
    const formData = new FormData();
    formData.append('pdf', selectedFile);

    fetch(
      'http://localhost:4000/parse',
      {
        method: 'POST',
        body: formData,
      }
    ).then(res => res.text())
    .then((text) => {
      console.log('Received pdf text' + text);
      setPdfText(text);
    })
      // .then((response) => response.json())
      // .then((result) => {
      //   console.log('Success:', result);

      // })
      // .catch((error) => {
      //   console.error('Error:', error);
      // });
  };

  return (
    <div className="App">
      <div>
        <input type="file" name="file" onChange={changeHandler} />
        <div>
          <button onClick={handleSubmission}>Submit</button>
        </div>
      </div>
      {pdfText}
    </div>
  );
}

export default App;
