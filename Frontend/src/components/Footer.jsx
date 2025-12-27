import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-mirage border-t border-slate-200 dark:border-fiord mt-auto transition-colors duration-300">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-400 to-teal-600 flex items-center justify-center text-white shadow-lg">
                📅
              </div>
              <h3 className="font-semibold text-xl text-gray-800 dark:text-white">
                EventHub
              </h3>
            </div>
            <p className="text-gray-600 dark:text-lynch leading-relaxed">
              Creating amazing event experiences through innovative design and
              technology.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-800 dark:text-white mb-6 text-lg">Product</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-lynch hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200"
                >
                  Event Manager
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-lynch hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-lynch hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200"
                >
                  Templates
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-lynch hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200"
                >
                  Integrations
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-800 dark:text-white mb-6 text-lg">Company</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-lynch hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-lynch hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-lynch hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-lynch hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-800 dark:text-white mb-6 text-lg">Support</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-lynch hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-lynch hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-lynch hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200"
                >
                  Community
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-lynch hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200"
                >
                  Status
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-fiord mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-600 dark:text-lynch">
            © 2025 EventHub. All rights reserved.
          </div>
          <div className="flex gap-8 mt-4 md:mt-0">
            <a
              href="#"
              className="text-gray-600 dark:text-lynch hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-gray-600 dark:text-lynch hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-gray-600 dark:text-lynch hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
