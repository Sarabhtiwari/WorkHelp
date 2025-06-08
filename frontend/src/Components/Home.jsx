import { Link } from "react-router-dom";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Home = () => {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-[#fefefc] min-h-screen text-gray-800 font-sans">
      {/* NAVBAR */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-emerald-600 tracking-wide">WorkHelp</h1>
          <ul className="flex gap-6 items-center text-sm md:text-base font-medium">
            <li>
              <button
                onClick={() => scrollToSection("about")}
                className="hover:text-emerald-600 transition"
              >
                About
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection("contact")}
                className="hover:text-emerald-600 transition"
              >
                Contact
              </button>
            </li>
            <li>
              <Link to="/register">
                <button className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition">
                  Register
                </button>
              </Link>
            </li>
            <li>
              <Link to="/login">
                <button className="border border-emerald-600 text-emerald-600 px-4 py-2 rounded-md hover:bg-emerald-50 transition">
                  Login
                </button>
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="text-center py-20 bg-emerald-50">
        <h2 className="text-4xl font-semibold text-emerald-700 mb-4">Welcome to WorkHelp</h2>
        <p className="text-lg max-w-2xl mx-auto text-gray-700">
          Connecting skilled professionals with real-world opportunities. Whether you're a user seeking help or a worker looking for jobs — we make the match effortless.
        </p>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="max-w-5xl mx-auto px-6 py-16">
        <h3 className="text-3xl font-bold text-emerald-700 mb-4">About Us</h3>
        <p className="text-gray-700 leading-relaxed text-lg">
          At WorkHelp, we believe in simplifying the process of finding help for everyday tasks and projects. Whether it's home repairs, tuition, freelance work, or any skilled service — our platform ensures a reliable and quick match between users and trusted workers. Built with a passion for local impact and community development, WorkHelp stands for trust, speed, and simplicity.
        </p>
      </section>

      {/* CONTACT SECTION */}
      <section
        id="contact"
        className="bg-gray-100 py-14 border-t border-gray-200"
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold text-emerald-700 mb-6">
            Contact Us
          </h3>
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-gray-700 text-md">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faEnvelope} className="text-emerald-600" />
              <span>support@workHelp.com</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faPhone} className="text-emerald-600" />
              <span>+91 9876543210</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faGithub} className="text-emerald-600" />
              <a
                href="https://github.com/workHelp"
                target="_blank"
                rel="noreferrer"
                className="hover:text-emerald-700"
              >
                GitHub
              </a>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faInstagram} className="text-emerald-600" />
              <a
                href="https://instagram.com/workHelp"
                target="_blank"
                rel="noreferrer"
                className="hover:text-emerald-700"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
