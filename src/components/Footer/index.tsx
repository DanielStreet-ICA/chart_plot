import React from 'react';

import { Container } from './styles';

// eslint-disable-next-line react/prop-types
const Footer: React.FC = ({ children }) => {
  return <Container>{children}</Container>;
};

export default Footer;
