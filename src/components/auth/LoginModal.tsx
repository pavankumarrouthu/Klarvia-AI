import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { RequestPasswordResetModal } from "./RequestPasswordResetModal";
import { useToast } from "@/components/ui/use-toast";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup: () => void;
}

const LoginModal = ({ isOpen, onClose, onSwitchToSignup }: LoginModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      toast({
        title: "Success",
        description: "You have successfully logged in.",
      });
      // Clear form and close modal
      setEmail("");
      setPassword("");
      onClose();
    } catch (err: any) {
      toast({
        title: "Login Failed",
        description: err?.message || 'Invalid email or password.',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[800px] p-0 gap-0 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left side - Form */}
            <div className="p-10 bg-card">
              <DialogHeader className="mb-8 text-center">
                <DialogTitle className="text-3xl font-bold">Welcome</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Sign in to your account
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11"
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11"
                    required
                    autoComplete="current-password"
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" />
                    <label htmlFor="remember" className="text-muted-foreground cursor-pointer">
                      Remember me
                    </label>
                  </div>
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto text-primary"
                    onClick={() => setIsResetModalOpen(true)}
                  >
                    Forgot password?
                  </Button>
                </div>

                <Button type="submit" className="w-full h-11 bg-[#D4A574] hover:bg-[#C39563] text-white font-medium" disabled={loading}>
                  {loading ? 'Signing in...' : 'SIGN IN'}
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-card px-2 text-muted-foreground">OR</span>
                  </div>
                </div>

                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full h-11"
                >
                  Sign in with Google
                </Button>
              </form>
            </div>

            {/* Right side - Sign up prompt */}
            <div className="hidden md:flex bg-muted/50 items-center justify-center p-10">
              <div className="text-center space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-3">Don't have an account?</h3>
                  <p className="text-muted-foreground">Please sign up</p>
                </div>
                <Button
                  variant="outline"
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-12 h-11 font-medium"
                  onClick={onSwitchToSignup}
                >
                  SIGN UP
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <RequestPasswordResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
      />
    </>
  );
};

export default LoginModal;
