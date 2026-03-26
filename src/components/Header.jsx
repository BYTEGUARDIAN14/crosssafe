import './Header.css';

function LogoMark() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6 20V4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M18 20V4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M8.5 7.5H15.5M8.5 11H15.5M8.5 14.5H15.5M8.5 18H15.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M3.75 20.25H20.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

export default function Header() {
  return (
    <header className="header">
      <div className="headerInner">
        <div className="brand" aria-label="CrossSafe">
          <span className="logo" aria-hidden="true">
            <LogoMark />
          </span>
          <span className="brandText">CrossSafe</span>
        </div>
        <div className="tagline">AI-Powered Zebra Crossing Safety Detector</div>
      </div>
    </header>
  );
}

