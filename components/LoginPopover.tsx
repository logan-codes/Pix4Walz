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
import { Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPopover() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        throw error;
      }
      toast.success("Logged in successfully!");
      setEmail("");
      setPassword("");
      setOpen(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to login right now.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <LogIn size={18} /> Login
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-sm p-6 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">Login</DialogTitle>
          <DialogDescription className="text-center text-gray-500">
            Enter your credentials to access your account
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
        </div>

        <DialogFooter>
          <Button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : "Login"}
          </Button>
        </DialogFooter>

        <p className="text-center text-sm text-gray-500 mt-2">
          Don’t have an account?{" "}
          <span className="text-orange-500 cursor-pointer hover:underline">
            Sign up
          </span>
        </p>
      </DialogContent>
    </Dialog>
  );
}
