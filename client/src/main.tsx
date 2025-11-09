import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import 'katex/dist/katex.min.css'; // Essential for KaTeX rendering

createRoot(document.getElementById("root")!).render(<App />);
