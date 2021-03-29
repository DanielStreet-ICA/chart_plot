import React, { useState } from 'react';
import TextInput from './styles';

const Input: React.FC = () => {
  // const [userInput, setUserInput] = useState('');
  const [textValue, setTextValue] = useState('');
  return (
    <>
      <TextInput
        id="user_input_text"
        value={textValue}
        // style={{
        //   width: '100%',
        //   minHeight: '200px',
        //   maxHeight: '330px',
        //   resize: 'vertical',
        // }}
        // onChange={(e) => setUserInput(e.target.value)}
        onChange={(e) => setTextValue(e.target.value)}
      />
    </>
  );
};

export default Input;
