import React, { use } from 'react';
import { AuthContext } from '../Context/AuthContext';

const UseAuth = () => {
  const authInfo=use(AuthContext);
  return authInfo
};

export default UseAuth;