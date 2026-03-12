import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChefHat, Lock, Mail, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      
      // Store mock user in localStorage
      localStorage.setItem("rtms_user", JSON.stringify({
        email: email,
        role: "ADMIN", // Default to ADMIN for testing
        name: "Admin User"
      }));

      toast.success("Welcome back!", {
        description: "Successfully signed in to RTMS.",
      });
      navigate("/");
    }, 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 sm:p-6 overflow-hidden relative">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[1000px] z-10"
      >
        <div className="grid md:grid-cols-2 overflow-hidden bg-card border border-border/50 rounded-xl shadow-elevated">
          {/* Left Side: Visual Sidebar */}
          <div className="hidden md:flex flex-col justify-between p-12 gradient-primary text-background relative overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative z-10"
            >
              <div className="h-10 w-10 rounded-lg bg-background/10 backdrop-blur-md flex items-center justify-center mb-8 border border-background/20">
                <ChefHat className="h-6 w-6 text-background" />
              </div>
              <h1 className="text-4xl font-heading font-bold tracking-tight mb-4 leading-tight">
                Master the Art of Management
              </h1>
              <p className="text-background/70 text-sm max-w-[280px]">
                Streamline your restaurant operations with our intelligent, real-time dashboard.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="relative z-10 bg-background/5 backdrop-blur-md p-5 rounded-lg border border-background/10"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="flex -space-x-1.5">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-6 w-6 rounded-full border-2 border-foreground bg-muted flex items-center justify-center text-[8px] text-foreground font-bold">
                      U{i}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-[10px] font-heading font-bold bg-background/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  <Sparkles className="h-3 w-3" />
                  Live Activity
                </div>
              </div>
              <p className="text-xs text-background/80 italic leading-relaxed">
                "This platform has completely redefined our service efficiency during rush hours."
              </p>
            </motion.div>
          </div>

          {/* Right Side: Login Form */}
          <div className="flex flex-col justify-center p-8 md:p-14 bg-card">
            <motion.div variants={itemVariants} className="mb-10">
              <div className="md:hidden flex justify-center mb-6">
                <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
                  <ChefHat className="h-6 w-6 text-background" />
                </div>
              </div>
              <h2 className="text-3xl font-heading font-bold text-foreground">Sign In</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Access your restaurant management portal.</p>
            </motion.div>

            <form onSubmit={handleLogin} className="space-y-5">
              <motion.div variants={itemVariants} className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wider ml-1">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@rtms.com"
                    className="pl-11 h-12 bg-muted/30 border-border/50 focus-visible:ring-primary/20 rounded-lg transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-1.5">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wider">Password</Label>
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-[10px] font-heading font-bold text-primary uppercase tracking-wider hover:text-primary/80 transition-colors"
                  >
                    Forgot?
                  </button>
                </div>

                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-11 h-12 bg-muted/30 border-border/50 focus-visible:ring-primary/20 rounded-lg transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="pt-2">
                <Button
                  type="submit"
                  className="w-full h-12 font-heading font-semibold text-xs uppercase tracking-wider rounded-lg shadow-sm"
                  disabled={isLoading}
                >
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <div className="h-4 w-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                        Authenticating...
                      </motion.div>
                    ) : (
                      <motion.div
                        key="default"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        Continue <ArrowRight className="h-4 w-4" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </form>

            <motion.div variants={itemVariants} className="mt-10 text-center">
              <p className="text-xs font-medium text-muted-foreground">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/signup")}
                  className="font-heading font-bold text-primary hover:underline underline-offset-4 uppercase tracking-wider"
                >
                  Create Account
                </button>
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
