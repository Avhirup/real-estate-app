import { Typography } from '@material-tailwind/react';
import { FaLinkedin } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa';
import { FaGithub } from 'react-icons/fa';

// const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="relative w-full">
      <div className="mx-auto w-full max-w-7xl px-8">
        <div className="mt-6 flex w-full flex-col gap-1 items-center justify-center border-t border-blue-gray-50 py-4 md:flex-row md:justify-between">
          <Typography
            variant="small"
            className="mb-4 text-center font-normal text-blue-gray-900 md:mb-0"
          >
            {/* &copy; {currentYear}{' '} */}Developed by
            <a
              href="https://avhirup.netlify.app/"
              target="_blank"
              style={{ textDecoration: 'underline' }}
            >
              {' '}
              Avhirup Mondal
            </a>
          </Typography>
          <div className="flex gap-4 text-blue-gray-900 sm:justify-center">
            <Typography
              as="a"
              href="https://www.linkedin.com/in/avhirup-mondal/"
              target="_blank"
              className="opacity-80 transition-opacity hover:opacity-100"
            >
              <FaLinkedin />
            </Typography>
            <Typography
              as="a"
              href="https://www.instagram.com/avhirup_/"
              target="_blank"
              className="opacity-80 transition-opacity hover:opacity-100"
            >
              <FaInstagram />
            </Typography>
            <Typography
              as="a"
              href="https://github.com/Avhirup"
              target="_blank"
              className="opacity-80 transition-opacity hover:opacity-100"
            >
              <FaGithub />
            </Typography>
          </div>
        </div>
      </div>
    </footer>
  );
}
