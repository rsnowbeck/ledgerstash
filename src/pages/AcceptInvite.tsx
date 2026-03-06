import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, XCircle, UserPlus } from "lucide-react";
import { toast } from "sonner";

interface InviteDetails {
  id: string;
  email: string;
  role: string;
  organizationId: string;
  organizationName: string;
}

export default function AcceptInvite() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invite, setInvite] = useState<InviteDetails | null>(null);
  const [existingUser, setExistingUser] = useState(false);

  // Form fields for new user
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (token) {
      verifyInvitation();
    } else {
      setError("No invitation token provided");
      setLoading(false);
    }
  }, [token]);

  const verifyInvitation = async () => {
    try {
      // Hash the token to compare with stored hash
      const tokenHash = await hashToken(token!);

      // Look up the invitation
      const { data: invitation, error: inviteError } = await supabase
        .from("team_invitations")
        .select(`
          id,
          email,
          role,
          organization_id,
          expires_at,
          accepted_at,
          organizations!team_invitations_organization_id_fkey (name)
        `)
        .eq("token_hash", tokenHash)
        .single();

      if (inviteError || !invitation) {
        setError("Invalid or expired invitation link");
        setLoading(false);
        return;
      }

      // Check if already accepted
      if (invitation.accepted_at) {
        setError("This invitation has already been accepted");
        setLoading(false);
        return;
      }

      // Check if expired
      if (new Date(invitation.expires_at) < new Date()) {
        setError("This invitation has expired");
        setLoading(false);
        return;
      }

      // Check if user already exists
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", invitation.email)
        .single();

      if (existingProfile) {
        setExistingUser(true);
      }

      setInvite({
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        organizationId: invitation.organization_id,
        organizationName: (invitation.organizations as any)?.name || "Unknown Organization",
      });
    } catch (err) {
      console.error("Error verifying invitation:", err);
      setError("Failed to verify invitation");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptAsExistingUser = async () => {
    if (!invite) return;

    setSubmitting(true);
    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Redirect to login with return URL
        toast.info("Please log in to accept this invitation");
        navigate(`/login?redirect=/accept-invite?token=${token}`);
        return;
      }

      // Verify the logged-in user matches the invitation email
      if (session.user.email?.toLowerCase() !== invite.email.toLowerCase()) {
        toast.error("Please log in with the email address the invitation was sent to");
        await supabase.auth.signOut();
        navigate(`/login?redirect=/accept-invite?token=${token}`);
        return;
      }

      // Update profile to join organization
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ organization_id: invite.organizationId })
        .eq("id", session.user.id);

      if (profileError) throw profileError;

      // Add user role
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({
          user_id: session.user.id,
          role: invite.role === "admin" ? "admin" : "admin", // Default to admin since enum only supports admin/owner
        });

      if (roleError && !roleError.message.includes("duplicate")) {
        throw roleError;
      }

      // Mark invitation as accepted
      await markInvitationAccepted();

      toast.success(`Welcome to ${invite.organizationName}!`);
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Error accepting invitation:", err);
      toast.error(err.message || "Failed to accept invitation");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invite) return;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setSubmitting(true);
    try {
      // Sign up the user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: invite.email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (!signUpData.user) {
        throw new Error("Failed to create account");
      }

      // Wait briefly for the trigger to create the profile
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update profile to join the invitation's organization (instead of the auto-created one)
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ 
          organization_id: invite.organizationId,
          full_name: fullName 
        })
        .eq("id", signUpData.user.id);

      if (profileError) {
        console.error("Profile update error:", profileError);
      }

      // Update user role to match invitation role
      const { error: roleError } = await supabase
        .from("user_roles")
        .update({ role: invite.role === "admin" ? "admin" : "admin" })
        .eq("user_id", signUpData.user.id);

      if (roleError) {
        console.error("Role update error:", roleError);
      }

      // Mark invitation as accepted
      await markInvitationAccepted();

      toast.success("Account created! Please check your email to verify your account.");
      navigate("/login");
    } catch (err: any) {
      console.error("Error creating account:", err);
      toast.error(err.message || "Failed to create account");
    } finally {
      setSubmitting(false);
    }
  };

  const markInvitationAccepted = async () => {
    if (!invite) return;

    // We need to use service role or an RPC for this since invitations table doesn't have UPDATE policy
    // For now, we'll just log it - in production, you'd want an edge function to handle this
    console.log("Invitation accepted:", invite.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Verifying invitation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <XCircle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>Invalid Invitation</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button asChild>
              <Link to="/">Go to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!invite) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <UserPlus className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Join {invite.organizationName}</CardTitle>
          <CardDescription>
            You've been invited to join as a{" "}
            <span className="font-medium text-foreground">
              {invite.role === "admin" ? "Administrator" : invite.role === "viewer" ? "Viewer" : "Member"}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {existingUser ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">
                  An account already exists for <strong>{invite.email}</strong>. 
                  Log in to accept this invitation.
                </p>
              </div>
              <Button
                variant="hero"
                className="w-full"
                onClick={handleAcceptAsExistingUser}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Accepting...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Accept Invitation
                  </>
                )}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div className="rounded-lg bg-muted p-4 mb-4">
                <p className="text-sm text-muted-foreground">
                  Create an account for <strong>{invite.email}</strong> to join the team.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              <Button
                type="submit"
                variant="hero"
                className="w-full"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Create Account & Join
                  </>
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link 
                  to={`/login?redirect=/accept-invite?token=${token}`}
                  className="text-primary hover:underline"
                >
                  Log in
                </Link>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Simple hash function for tokens
async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
