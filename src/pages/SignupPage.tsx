import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChefHat, Lock, Mail, ArrowRight, User, Building2, Sparkles, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    restaurantName: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulated signup
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Registration Successful!", {
        description: "Your registration is successful! Please login and start your new journey with RTMS.",
        duration: 3000,
      });
      
      // Delay navigation to allow user to see the toast
      setTimeout(() => {
        navigate("/login");
      }, 500);
    }, 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
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
          <div className="hidden md:flex flex-col justify-between p-12 gradient-primary text-background relative overflow-hidden order-last md:order-first">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative z-10"
            >
              <div className="h-10 w-10 rounded-lg bg-background/10 backdrop-blur-md flex items-center justify-center mb-8 border border-background/20">
                <ChefHat className="h-6 w-6 text-background" />
              </div>
              <h1 className="text-4xl font-heading font-bold tracking-tight mb-4 leading-tight">
                Scale Your <br />Culinary Business
              </h1>
              <p className="text-background/70 text-sm max-w-[300px] mb-8">
                Join thousands of restaurateurs who have optimized their service with RTMS.
              </p>

              <div className="space-y-4">
                {[
                  "Smart Table Management",
                  "Real-time Order Tracking",
                  "Advanced Analytics Dashboard"
                ].map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + (idx * 0.1) }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="h-4 w-4 text-background/40" />
                    <span className="text-xs font-heading font-semibold tracking-wider uppercase">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="relative z-10 bg-background/5 backdrop-blur-md p-5 rounded-lg border border-background/10"
            >
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-3 w-3 text-background/60" />
                <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-background/40">New Feature</span>
              </div>
              <p className="text-xs text-background/80 italic leading-relaxed">
                "AI-driven reservation forecasting now available for all partners."
              </p>
            </motion.div>
          </div>

          {/* Right Side: Signup Form */}
          <div className="flex flex-col justify-center p-8 md:p-12 bg-card">
            <motion.div variants={itemVariants} className="mb-8">
              <div className="md:hidden flex justify-center mb-6">
                <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
                  <ChefHat className="h-6 w-6 text-background" />
                </div>
              </div>
              <h2 className="text-3xl font-heading font-bold text-foreground">Create Account</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Set up your restaurant in minutes.</p>
            </motion.div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <motion.div variants={itemVariants} className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wider ml-1">Full Name</Label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      className="pl-11 h-11 bg-muted/30 border-border/50 focus-visible:ring-primary/20 rounded-lg text-sm"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-1.5">
                  <Label htmlFor="restaurantName" className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wider ml-1">Restaurant</Label>
                  <div className="relative group">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="restaurantName"
                      placeholder="The Grand Bistro"
                      className="pl-11 h-11 bg-muted/30 border-border/50 focus-visible:ring-primary/20 rounded-lg text-sm"
                      value={formData.restaurantName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </motion.div>
              </div>

              <motion.div variants={itemVariants} className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wider ml-1">Work Email</Label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@restaurant.com"
                    className="pl-11 h-11 bg-muted/30 border-border/50 focus-visible:ring-primary/20 rounded-lg text-sm"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wider ml-1">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-11 h-11 bg-muted/30 border-border/50 focus-visible:ring-primary/20 rounded-lg text-sm"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="pt-4">
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
                        Creating...
                      </motion.div>
                    ) : (
                      <motion.div
                        key="default"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        Get Started <ArrowRight className="h-4 w-4" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </form>

            <motion.div variants={itemVariants} className="mt-10 text-center">
              <p className="text-xs font-medium text-muted-foreground">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="font-heading font-bold text-primary hover:underline underline-offset-4 uppercase tracking-wider"
                >
                  Sign In
                </button>
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;






