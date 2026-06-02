import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import FooterSection from "./FooterSection";
import { ThemeProvider } from "./theme-provider";

const Layout = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="affectlayer-theme">
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
        <Navbar />
        <main className="flex-grow pt-16">
          <Outlet />
        </main>
        <FooterSection />
      </div>
    </ThemeProvider>
  );
};

export default Layout;
