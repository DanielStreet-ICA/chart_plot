import React, { useState } from 'react';
import TextInput from './styles';

const Input: React.FC = () => {
  const [textValue, setTextValue] = useState('');
  return (
    <>
      <TextInput
        id="user_input_text"
        value={textValue}
        onChange={(e) => setTextValue(e.target.value)}
      />
    </>
  );
};

export default Input;
