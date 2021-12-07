import { useState } from 'react';
import DownloadLink from "react-download-link";

function Form({ geojson, upload }) {
  const [uploadFile, setUploadFile] = useState(null);

  const submitForm = (event) => {
    event.preventDefault();
    const reader = new FileReader();
    if (uploadFile) {
      reader.readAsText(uploadFile);

      reader.onload = () => {
        const result = JSON.parse(reader.result)
        upload(result)
      };
    } else return
  };

  return (
    <form className="form" onSubmit={submitForm}>
      <input type="file" accept=".json" multiple={false} onChange={(e) => setUploadFile(e.target.files[0])} />
      <input type="submit" />
      <DownloadLink
        style={{ margin: "0 10px" }}
        label="Export"
        filename="geojson.json"
        tagName="button"
        exportFile={() => JSON.stringify(geojson)}
      />
    </form>
  );
}

export default Form;