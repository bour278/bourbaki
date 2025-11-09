import { Link } from "wouter";

export default function Header() {
  return (
    <nav className="nav">
      <ul>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/blog">Blog</Link></li>
        <li><a href="/feed.xml">RSS</a></li>
      </ul>
    </nav>
  );
}
