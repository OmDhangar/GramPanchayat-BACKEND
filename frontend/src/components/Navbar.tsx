import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, GanttChart, Home, Image, Newspaper } from "lucide-react";
import Button from "./button";
import { useAuthContext } from "../Context/authContext";
import { FaUser } from "react-icons/fa";

const Navbar = () => {
  const { isAuthenticated } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 50) {
        setShowNavbar(true);
        setLastScrollY(window.scrollY);
        return;
      }
      if (window.scrollY > lastScrollY) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={`bg-white shadow-md w-full z-50 transition-transform duration-300 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col items-center space-y-2 md:flex-row md:justify-between md:items-center md:space-y-0">
        {/* Top Logo and Title Row */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center space-x-3">
            <img
              src="/images/panchyatlogo.png"
              alt="Panchayat Logo"
              className="h-8 w-auto"
            />
            <h1 className="text-base md:text-lg font-bold text-center">
              ग्रामपंचायत वाठोडे
            </h1>
          </div>
          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-black focus:outline-none"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Side Logos and Login */}
        <div className="flex items-center justify-between w-full md:justify-end space-x-5">
          <img
            src="/images/azadi-ka-amrit-mahotsav-.jpg"
            alt="Azadi"
            className="h-7 md:h-8"
          />
          <img
            src="/images/mhlogo.png"
            alt="MH Logo"
            className="h-7 md:h-8"
          />
          {isAuthenticated ? (
            <Link to="/dashboard" title="Dashboard">
              <FaUser className="text-xl text-blue-600" />
            </Link>
          ) : (
            <Link to="/dashboard" title="Login">
              <Button />
            </Link>
          )}
        </div>
      </div>

      {/* Bottom Navigation Tray (Mobile & Desktop) */}
      <div
        className={`w-full ${
          isOpen ? "block" : "hidden"
        } md:flex md:justify-center md:space-x-4 bg-gray-50 py-1`}
      >
        <Link
          to="/"
          className="flex items-center px-2 py-1 hover:bg-gray-200 rounded-md"
        >
          <Home className="h-5 w-5 mr-2" />
          <span>मुख्यपृष्ठ</span>
        </Link>
        <Link
          to="/forms"
          className="flex items-center px-2 py-1 hover:bg-gray-200 rounded-md"
        >
          <Newspaper className="h-5 w-5 mr-2" />
          <span>प्रमाणपत्र</span>
        </Link>
        <Link
          to="/schemes"
          className="flex items-center px-2 py-1 hover:bg-gray-200 rounded-md"
        >
          <GanttChart className="h-5 w-5 mr-2" />
          <span>योजना</span>
        </Link>
        <Link
          to="/gallery"
          className="flex items-center px-2 py-1 hover:bg-gray-200 rounded-md"
        >
          <Image className="h-5 w-5 mr-2" />
          <span>गॅलरी</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
