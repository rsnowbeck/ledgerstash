import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, UserPlus, Mail, Loader2, Trash2, Crown, Shield, Eye } from "lucide-react";
import { toast } from "sonner";

interface TeamMember {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
  isCurrentUser: boolean;
}

interface PendingInvite {
  id: string;
  email: string;
  role: string;
  created_at: string;
  expires_at: string;
}

interface TeamManagementProps {
  organizationId: string;
  organizationName: string;
}

const ROLE_OPTIONS = [
  { value: "admin", label: "Admin", description: "Full access to all features", icon: Crown },
  { value: "member", label: "Member", description: "Can manage recipients and requirements", icon: Shield },
  { value: "viewer", label: "Viewer", description: "Read-only access", icon: Eye },
];

export function TeamManagement({ organizationId, organizationName }: TeamManagementProps) {
  const { user } = useAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);

  // Invite form
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");

  useEffect(() => {
    fetchTeamData();
  }, [organizationId]);

  const fetchTeamData = async () => {
    setLoading(true);
    try {
      // Fetch team members (profiles in this org)
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .eq("organization_id", organizationId);

      if (profilesError) throw profilesError;

      // Fetch roles for each member
      const memberPromises = (profiles || []).map(async (profile) => {
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", profile.id)
          .single();

        return {
          id: profile.id,
          full_name: profile.full_name,
          email: profile.email,
          role: roles?.role || "member",
          isCurrentUser: profile.id === user?.id,
        };
      });

      const membersData = await Promise.all(memberPromises);
      setMembers(membersData);

      // Fetch pending invitations
      const { data: invites, error: invitesError } = await supabase
        .from("team_invitations")
        .select("id, email, role, created_at, expires_at")
        .eq("organization_id", organizationId)
        .is("accepted_at", null)
        .gt("expires_at", new Date().toISOString());

      if (invitesError) throw invitesError;
      setPendingInvites(invites || []);
    } catch (error) {
      console.error("Error fetching team data:", error);
      toast.error("Failed to load team data");
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail) {
      toast.error("Please enter an email address");
      return;
    }

    // Check if already a member
    if (members.some((m) => m.email?.toLowerCase() === inviteEmail.toLowerCase())) {
      toast.error("This user is already a team member");
      return;
    }

    // Check if already invited
    if (pendingInvites.some((i) => i.email.toLowerCase() === inviteEmail.toLowerCase())) {
      toast.error("An invitation has already been sent to this email");
      return;
    }

    setInviting(true);
    try {
      const token = crypto.randomUUID();
      const tokenHash = await hashToken(token);

      const { error } = await supabase.from("team_invitations").insert({
        organization_id: organizationId,
        email: inviteEmail,
        role: inviteRole,
        invited_by: user?.id,
        token_hash: tokenHash,
      });

      if (error) throw error;

      // Send invitation email via edge function
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user?.id)
        .single();

      const { error: emailError } = await supabase.functions.invoke("send-team-invite", {
        body: {
          email: inviteEmail,
          token: token,
          role: inviteRole,
          organizationName: organizationName,
          inviterName: profile?.full_name || "A team member",
        },
      });

      if (emailError) {
        console.error("Failed to send invitation email:", emailError);
        toast.warning(`Invitation created, but email failed to send`);
      } else {
        toast.success(`Invitation sent to ${inviteEmail}`);
      }
      
      setInviteEmail("");
      setInviteRole("member");
      fetchTeamData();
    } catch (error: any) {
      console.error("Error sending invitation:", error);
      toast.error(error.message || "Failed to send invitation");
    } finally {
      setInviting(false);
    }
  };

  const handleCancelInvite = async (inviteId: string) => {
    try {
      const { error } = await supabase
        .from("team_invitations")
        .delete()
        .eq("id", inviteId);

      if (error) throw error;

      toast.success("Invitation cancelled");
      fetchTeamData();
    } catch (error) {
      console.error("Error cancelling invitation:", error);
      toast.error("Failed to cancel invitation");
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      // Remove user role
      const { error: roleError } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", memberId);

      if (roleError) throw roleError;

      // Update profile to remove from org
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ organization_id: null })
        .eq("id", memberId);

      if (profileError) throw profileError;

      toast.success("Team member removed");
      fetchTeamData();
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error("Failed to remove team member");
    }
  };

  const handleRoleChange = async (memberId: string, newRole: string) => {
    // Note: Currently the app_role enum only supports 'admin' and 'owner'
    // For now, we only allow changing to admin role
    if (newRole !== 'admin' && newRole !== 'owner') {
      toast.info("Role changes are limited in the current version");
      return;
    }
    
    try {
      const { error } = await supabase
        .from("user_roles")
        .update({ role: newRole as "admin" | "owner" })
        .eq("user_id", memberId);

      if (error) throw error;

      toast.success("Role updated");
      fetchTeamData();
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role");
    }
  };

  const getRoleBadgeVariant = (role: string): "default" | "secondary" | "outline" => {
    if (role === "admin") return "default";
    if (role === "member") return "secondary";
    return "outline";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Members
          </CardTitle>
          <CardDescription>
            Manage who has access to {organizationName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">
                    {member.full_name || "—"}
                    {member.isCurrentUser && (
                      <span className="ml-2 text-xs text-muted-foreground">(You)</span>
                    )}
                  </TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    {member.isCurrentUser ? (
                      <Badge variant={getRoleBadgeVariant(member.role)}>
                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                      </Badge>
                    ) : (
                      <Select
                        value={member.role}
                        onValueChange={(value) => handleRoleChange(member.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {!member.isCurrentUser && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove team member?</AlertDialogTitle>
                            <AlertDialogDescription>
                              {member.full_name || member.email} will lose access to this organization.
                              This action can be undone by sending a new invitation.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleRemoveMember(member.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Invite New Member */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Invite Team Member
          </CardTitle>
          <CardDescription>
            Send an invitation to add someone to your team
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="inviteEmail">Email Address</Label>
              <Input
                id="inviteEmail"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="colleague@company.com"
              />
            </div>
            <div className="w-40 space-y-2">
              <Label htmlFor="inviteRole">Role</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <option.icon className="h-3 w-3" />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            {ROLE_OPTIONS.find((r) => r.value === inviteRole)?.description}
          </div>

          <Button
            variant="hero"
            onClick={handleInvite}
            disabled={inviting || !inviteEmail}
          >
            {inviting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4" />
                Send Invitation
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      {pendingInvites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Pending Invitations
            </CardTitle>
            <CardDescription>
              Invitations that haven't been accepted yet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingInvites.map((invite) => (
                  <TableRow key={invite.id}>
                    <TableCell>{invite.email}</TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(invite.role)}>
                        {invite.role.charAt(0).toUpperCase() + invite.role.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(invite.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(invite.expires_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleCancelInvite(invite.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
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
