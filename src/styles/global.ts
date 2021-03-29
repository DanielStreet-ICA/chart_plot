import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    outline: 0;
  }

  html{
    height: 100%;
    overflow-x:hidden;

  }

  body{

    min-height: 100%;
    color: #FFF;
    -webkit-font-smoothing: antialiased;
    background-attachment: fixed;
  }

  body, input, button {
    font-family: 'Roboto', serif;
    font-size: 16px;
  }

  h1, h2, h3, h4, h5, h6, strong {
    font-weight: 500;
  }

  button {
    cursor: pointer;
  }

  .ReactCollapse--collapse {
    transition: height 300ms;
  }
`;
