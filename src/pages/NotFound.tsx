import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="text-center space-y-6 max-w-md">
        <div className="relative">
          <h1 className="text-9xl font-heading font-black text-muted/20 select-none">404</h1>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="h-16 w-16 bg-destructive/10 rounded-2xl flex items-center justify-center mb-2">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-heading font-bold text-foreground">Oops! Page not found</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We couldn't find the page you're looking for. It might have been moved or deleted.
          </p>
        </div>

        <div className="pt-4">
          <Button 
            onClick={() => navigate("/")}
            className="rounded-lg h-11 px-8 font-heading font-semibold text-xs uppercase tracking-wider gap-2 shadow-sm"
          >
            <Home className="h-4 w-4" />
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
