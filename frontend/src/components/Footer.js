import React from 'react';
import { Link } from 'react-router-dom';
import { Droplets, Mail, Phone, MapPin, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-900/90 backdrop-blur-xl border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Droplets className="h-8 w-8 text-primary-400" />
              <span className="text-2xl font-bold gradient-text">SafeSip</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Advanced waterborne disease management and monitoring system for healthcare professionals, 
              ensuring safer water and healthier communities.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Analytics
                </Link>
              </li>
              <li>
                <Link to="/reports" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Reports
                </Link>
              </li>
              <li>
                <Link to="/workflow" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Workflow
                </Link>
              </li>
            </ul>
          </div>

          {/* Dashboards */}
          <div>
            <h3 className="text-white font-semibold mb-4">Dashboards</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/asha-dashboard" className="text-gray-400 hover:text-white transition-colors text-sm">
                  ASHA Worker
                </Link>
              </li>
              <li>
                <Link to="/phc-dashboard" className="text-gray-400 hover:text-white transition-colors text-sm">
                  PHC Dashboard
                </Link>
              </li>
              <li>
                <Link to="/health-dashboard" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Health Official
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-primary-400" />
                <span className="text-gray-400">contact@safesip.in</span>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-primary-400" />
                <span className="text-gray-400">+91 98765-43210</span>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-primary-400" />
                <span className="text-gray-400">New Delhi, India</span>
              </li>
            </ul>
            
            {/* Emergency Contact */}
            <div className="mt-6 p-4 bg-error-500/10 border border-error-500/20 rounded-xl">
              <h4 className="text-error-400 font-semibold text-sm mb-2">Emergency Helpline</h4>
              <p className="text-error-300 font-bold text-lg">1800-SAFESIP</p>
              <p className="text-error-400 text-xs">24/7 Available</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} SafeSip. All rights reserved. Built for Smart India Hackathon 2025.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;