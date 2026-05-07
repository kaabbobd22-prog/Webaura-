import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // প্রতিবার পাথ পরিবর্তন হলে স্ক্রল একেবারে উপরে চলে যাবে
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}