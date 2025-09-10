import React from 'react';
import { Outlet } from 'react-router-dom';
import NgoNavbar from '@/components/NgoNavbar';

const NgoLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <NgoNavbar />
      <main>
        <Outlet /> 
      </main>
    </div>
  );
};

export default NgoLayout;

