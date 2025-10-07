import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const SignupModal = ({ isOpen, onClose, onSwitchToLogin }: SignupModalProps) => {
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== retypePassword) {
      alert("Passwords don't match!");
      return;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0 gap-0 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Left side - Form */}
          <div className="p-10 bg-card">
            <DialogHeader className="mb-8 text-center">
              <DialogTitle className="text-3xl font-bold">Create Account</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Join Klarvia today
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="signup-name" className="text-sm font-medium">Full name</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Enter your name"
                  className="h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-sm font-medium">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="Enter your email"
                  className="h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-sm font-medium">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="retype-password" className="text-sm font-medium">Re-type Password</Label>
                <Input
                  id="retype-password"
                  type="password"
                  placeholder="Re-enter your password"
                  value={retypePassword}
                  onChange={(e) => setRetypePassword(e.target.value)}
                  className="h-11"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-[#D4A574] hover:bg-[#C39563] text-white font-medium"
              >
                CREATE ACCOUNT
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
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign up with Google
              </Button>
            </form>
          </div>

          {/* Right side - Login prompt */}
          <div className="hidden md:flex bg-muted/50 items-center justify-center p-10">
            <div className="text-center space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-3">Already have an account?</h3>
                <p className="text-muted-foreground">Please sign in</p>
              </div>
              <Button
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-12 h-11 font-medium"
                onClick={onSwitchToLogin}
              >
                SIGN IN
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignupModal;
