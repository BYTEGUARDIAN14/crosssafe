import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footerInner">
        <div>Powered by TensorFlow.js + Teachable Machine</div>
        <div className="footerMuted">Drop an image of a zebra crossing to analyze.</div>
      </div>
    </footer>
  );
}

