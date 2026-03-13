"use client";

import { useState } from "react";
import { useInviteClerk } from "@/lib/mutations";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";

interface InviteClerkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteClerkModal({ open, onOpenChange }: InviteClerkModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  
  const inviteMutation = useInviteClerk();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !email || !location) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await inviteMutation.mutateAsync({
        full_name: fullName,
        email,
        location,
      });
      
      toast.success(`Invitation sent to ${fullName}`);
      setFullName("");
      setEmail("");
      setLocation("");
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to invite clerk");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="w-12 h-12 rounded-full bg-[#d19c3e]/10 flex items-center justify-center mb-4">
            <UserPlus className="h-6 w-6 text-[#d19c3e]" />
          </div>
          <DialogTitle className="text-xl font-serif">Invite New Clerk</DialogTitle>
          <DialogDescription>
            Enter the details below to invite a new clerk. They will receive an invitation to join the system.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="full-name">Full Name</Label>
            <Input
              id="full-name"
              placeholder="e.g. John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={inviteMutation.isPending}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="clerk@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={inviteMutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location / Branch</Label>
            <Input
              id="location"
              placeholder="e.g. London Office"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={inviteMutation.isPending}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={inviteMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-[#d19c3e] hover:bg-[#c38c33] text-white"
              disabled={inviteMutation.isPending}
            >
              {inviteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Invitation"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
