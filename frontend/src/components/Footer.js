import React from 'react';
import { Link } from 'react-router-dom';
import { Droplets, Mail, Phone, MapPin, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white/80 backdrop-blur-xl border-t border-gray-200 mt-20 text-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Droplets className="h-8 w-8 text-primary-600" />
              <span className="text-2xl font-bold text-primary-700">SafeSip</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Advanced waterborne disease management and monitoring system for healthcare professionals, 
              ensuring safer water and healthier communities.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-primary-600 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary-600 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                  Analytics
                </Link>
              </li>
              <li>
                <Link to="/reports" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                  Reports
                </Link>
              </li>
              <li>
                <Link to="/workflow" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                  Workflow
                </Link>
              </li>
            </ul>
          </div>

          {/* Campus */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Campus</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/analytics" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                  Campus Map
                </Link>
              </li>
              <li>
                <Link to="/reports" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                  Locations
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                  Reports
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                  Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-primary-600" />
                <span className="text-gray-600">hello@safesip.in</span>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-primary-600" />
                <span className="text-gray-600">+91 97460 95420</span>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-primary-600" />
                <span className="text-gray-600">Bengaluru, Karnataka</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-600 text-sm">
              © {currentYear} SafeSip • Made with ❤️ in Bengaluru
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
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