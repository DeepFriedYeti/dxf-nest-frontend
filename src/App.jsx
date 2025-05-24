import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [files, setFiles] = useState([]);
  const [quantities, setQuantities] = useState([]);
  const [sheetWidth, setSheetWidth] = useState(1000);
  const [sheetHeight, setSheetHeight] = useState(1000);
  const [gap, setGap] = useState(5);
  const [rotationStep, setRotationStep] = useState(15);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [svgContent, setSvgContent] = useState(null);

  const handleFilesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setQuantities(selectedFiles.map(() => 1));
  };

  const handleQuantityChange = (index, value) => {
    const newQuantities = [...quantities];
    newQuantities[index] = value;
    setQuantities(newQuantities);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    files.forEach((file, i) => {
      formData.append('files', file);
      formData.append('quantities', quantities[i]);
    });
    formData.append('sheet_width', sheetWidth);
    formData.append('sheet_height', sheetHeight);
    formData.append('gap', gap);
    formData.append('rotation_step', rotationStep);

    const res = await axios.post('https://dxf-nest-backend.onrender.com/nest', formData, {
      responseType: 'blob',
    });

    const blob = new Blob([res.data], { type: 'application/dxf' });
    setPreviewUrl(URL.createObjectURL(blob));

    const svgRes = await axios.post('http://localhost:8000/nest_preview', formData, {
      responseType: 'text',
    });
    setSvgContent(svgRes.data);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">DXF Nesting App</h1>
      <input type="file" multiple onChange={handleFilesChange} />
      {files.map((file, i) => (
        <div key={i} className="flex items-center space-x-2 mt-1">
          <span>{file.name}</span>
          <input
            type="number"
            className="w-16 border p-1"
            value={quantities[i]}
            onChange={(e) => handleQuantityChange(i, parseInt(e.target.value))}
          />
        </div>
      ))}
      <input type="number" placeholder="Sheet Width" className="input" value={sheetWidth} onChange={e => setSheetWidth(e.target.value)} />
      <input type="number" placeholder="Sheet Height" className="input" value={sheetHeight} onChange={e => setSheetHeight(e.target.value)} />
      <input type="number" placeholder="Gap" className="input" value={gap} onChange={e => setGap(e.target.value)} />
      <input type="number" placeholder="Rotation Step (deg)" className="input" value={rotationStep} onChange={e => setRotationStep(e.target.value)} />
      <button onClick={handleUpload} className="btn btn-blue mt-2">Nest DXFs</button>
      {previewUrl && <a href={previewUrl} download="nested_output.dxf" className="block mt-4 text-blue-600 underline">Download Nested DXF</a>}
      {svgContent && <div className="mt-4 border"><div dangerouslySetInnerHTML={{ __html: svgContent }} /></div>}
    </div>
  );
}

export default App;