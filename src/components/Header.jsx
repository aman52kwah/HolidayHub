import React from "react";
import { Calender } from "lucide-react";

const Header = () => {
  return (
    <header
      className="bg-gradient-to-r from-blue-600 to-blue-800 text-white 
        py-8 px-4 shadow-md"
    >
      <div className="container mx-auto flex items-center">
        <div className="bg-white/20p-2 5 rounded-lg mr-4">
          <Calender size={24} className="text-white" />
        </div>
      </div>
      <h1 className="text-2xl font-bold">National Holidays</h1>
      <p className="text-blue">Discover public holidays around the world</p>
    </header>
  );
};

export default Header;
