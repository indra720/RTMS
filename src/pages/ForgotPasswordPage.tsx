import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChefHat, Mail, ArrowRight, ArrowLeft, KeyRound, Sparkles, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const navigate = useNavigate();

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulated email sending
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
      toast.info("Reset Link Sent!", {
        description: "Please check your inbox for instructions to reset your password.",
        duration: 4000,
      });
    }, 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 sm:p-6 overflow-hidden relative">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[900px] z-10"
      >
        <div className="grid md:grid-cols-2 overflow-hidden bg-card border border-border/50 rounded-xl shadow-elevated">
          {/* Left Side: Brand Visual */}
          <div className="hidden md:flex flex-col justify-between p-10 bg-foreground text-background relative overflow-hidden">
            <div className="relative z-10">
              <div className="h-10 w-10 rounded-lg bg-background/10 backdrop-blur-md flex items-center justify-center mb-6 border border-background/20">
                <ChefHat className="h-6 w-6 text-background" />
              </div>
              <h1 className="text-3xl font-heading font-bold tracking-tight mb-3 leading-tight">
                Secure Your <br />Account Access
              </h1>
              <p className="text-background/70 text-sm max-w-[240px]">
                Don't worry, it happens to the best of us. We'll help you get back into your kitchen.
              </p>
            </div>

            <div className="relative z-10 bg-background/5 backdrop-blur-md p-4 rounded-lg border border-background/10">
              <div className="flex items-center gap-2 mb-1">
                <KeyRound className="h-3 w-3 text-background/60" />
                <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-background/40">Security Tip</span>
              </div>
              <p className="text-xs text-background/80 italic leading-relaxed">
                "Use a unique password and enable 2FA to keep your restaurant data safe."
              </p>
            </div>
          </div>

          {/* Right Side: Reset Form */}
          <div className="flex flex-col justify-center p-8 md:p-12 bg-card">
            <AnimatePresence mode="wait">
              {!isSent ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-heading font-bold text-foreground">Forgot Password?</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Enter your email address to receive a reset link.
                    </p>
                  </div>

                  <form onSubmit={handleResetRequest} className="space-y-5">
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wider ml-1">Email Address</Label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="admin@rtms.com"
                          className="pl-10 h-11 bg-muted/30 border-border/50 focus-visible:ring-primary/20 rounded-lg"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-11 font-heading font-semibold text-xs uppercase tracking-wider rounded-lg shadow-sm group"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="h-4 w-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                      ) : (
                        <div className="flex items-center gap-2">
                          Send Reset Link <Send className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      )}
                    </Button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-4"
                >
                  <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                    <Send className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Check Your Email</h2>
                  <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                    We've sent a recovery link to <span className="text-foreground font-semibold">{email}</span>.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full h-11 rounded-lg font-heading font-semibold text-xs uppercase tracking-wider transition-all"
                    onClick={() => setIsSent(false)}
                  >
                    Resend Email
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div variants={itemVariants} className="mt-8 text-center">
              <button
                onClick={() => navigate("/login")}
                className="flex items-center justify-center gap-2 mx-auto text-xs font-heading font-semibold text-muted-foreground hover:text-primary transition-colors group uppercase tracking-wider"
              >
                <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
                Back to Sign In
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
