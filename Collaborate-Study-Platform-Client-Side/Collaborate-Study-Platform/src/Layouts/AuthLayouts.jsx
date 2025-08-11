import React from 'react';
import { Outlet } from 'react-router';
import CollaborateLogo from '../Components/CollaborateLogo';

const AuthLayouts = () => {
  return (
    <div className="">
      <div className="my-3 max-w-7xl mx-auto">
        <CollaborateLogo></CollaborateLogo>
      </div>
      <Outlet></Outlet>
    </div>
  );
};

export default AuthLayouts;