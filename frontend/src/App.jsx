import React, { useState } from 'react';

const App = () => {
  const [img, setImage] = useState([]);
  const [pre, setPre] = useState([]);
  const [num, setNum] = useState(0);

  const selectImage = (e) => {
    setImage([...img, e.target.files[0]]);
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      setPre([...pre, { file: fileReader.result, id: num }]);
      setNum(num + 1);
    };
    if (e.target.files[0]) {
      fileReader.readAsDataURL(e.target.files[0]);
    }
    console.log(pre);
  };

  const removeImage = (id) => {
    setPre(pre.filter((single) => single.id !== id));
  };

  return (
    <div>
      <div className="dropdown">
        <input type="file" onChange={(e) => selectImage(e)} />
        {pre.map((image) => (
          <img
            src={image.file}
            alt=""
            key={image.id}
            onClick={() => removeImage(image.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
