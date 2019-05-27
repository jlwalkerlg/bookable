import React from 'react';
import NavBar from '../components/NavBar';

const AppLayout = ({ component, ...props }) => {
  const Component = component;

  return component.name === 'NotFound' ? (
    <Component {...props} />
  ) : (
    <>
      <NavBar {...props} />
      <main>
        <Component {...props} />
      </main>
    </>
  );
};

export default AppLayout;
