import styled from 'styled-components';

const TextInput = styled.textarea`
  width: '100%';
  min-height: 200px;
  max-height: 330px;
  resize: vertical;
  background: #353a40;
  color: white;
  padding: 15px;
  q {
    color: red;
  }
  blockquote {
    color: red;
  }
`;

export default TextInput;
