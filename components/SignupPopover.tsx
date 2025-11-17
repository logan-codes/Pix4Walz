"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

export default function SignupPopover() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        throw error;
      }
      toast.success("Account created successfully!");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setOpen(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to sign up right now.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <UserPlus size={18} /> Sign Up
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-sm p-6 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">Sign Up</DialogTitle>
          <DialogDescription className="text-center text-gray-500">
            Create an account to start shopping
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <DialogFooter>
          <Button
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : "Sign Up"}
          </Button>
        </DialogFooter>

        <p className="text-center text-sm text-gray-500 mt-2">
          Already have an account?{" "}
          <span className="text-orange-500 cursor-pointer hover:underline">
            Login
          </span>
        </p>
      </DialogContent>
    </Dialog>
  );
}
