
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center max-w-md px-4">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">404</h1>
        <p className="text-xl mb-6">Oops! This page doesn't exist yet.</p>
        <p className="text-muted-foreground mb-8">
          We couldn't find the page "{location.pathname}". It may be under construction or the URL might be incorrect.
        </p>
        <Link to="/">
          <Button className="bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-90">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
