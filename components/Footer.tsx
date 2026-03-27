import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ borderTop:"1px solid var(--border)", padding:"48px clamp(24px,5vw,72px)" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:"40px", marginBottom:"40px" }}>
        <div>
          <div className="font-display" style={{ fontSize:"26px", letterSpacing:"0.1em", color:"var(--bone)", marginBottom:"6px" }}>SHOTS BY VISHAL</div>
          <p className="font-serif-custom" style={{ fontStyle:"italic", fontSize:"13px", color:"var(--gold)", letterSpacing:"0.1em" }}>Editorial · Portrait · Street</p>
        </div>
        <div style={{ display:"flex", gap:"48px", flexWrap:"wrap" }}>
          <div>
            <p className="font-body" style={{ fontSize:"9px", letterSpacing:"0.3em", color:"rgba(240,235,226,0.25)", textTransform:"uppercase", marginBottom:"16px" }}>Navigation</p>
            <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
              {[["/","Home"],["/gallery","Gallery"],["/about","About"],["/contact","Contact"]].map(([href,label]) => (
                <Link key={href} href={href} className="footer-link">{label}</Link>
              ))}
            </div>
          </div>
          <div>
            <p className="font-body" style={{ fontSize:"9px", letterSpacing:"0.3em", color:"rgba(240,235,226,0.25)", textTransform:"uppercase", marginBottom:"16px" }}>Connect</p>
            <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
              <a href="https://www.instagram.com/shotsbyvishal/" target="_blank" rel="noopener noreferrer" className="footer-link">Instagram</a>
              <a href="https://www.behance.net/shotsbyvishal" target="_blank" rel="noopener noreferrer" className="footer-link">Behance</a>
              <Link href="/contact" className="footer-link">Email</Link>
            </div>
          </div>
        </div>
      </div>
      <div style={{ borderTop:"1px solid rgba(240,235,226,0.06)", paddingTop:"24px", display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:"12px" }}>
        <p className="font-body" style={{ fontSize:"11px", color:"rgba(240,235,226,0.2)", letterSpacing:"0.1em" }}>© {new Date().getFullYear()} Vishal Dey. All rights reserved.</p>
        <p className="font-serif-custom" style={{ fontSize:"12px", color:"rgba(184,150,90,0.3)", fontStyle:"italic" }}>Made with passion</p>
      </div>
    </footer>
  );
}
