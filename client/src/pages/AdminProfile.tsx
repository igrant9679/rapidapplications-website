import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, User, Upload, Twitter, Linkedin, Github, Globe } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

export default function AdminProfile() {
  const { user, loading: authLoading } = useAuth();
  const [avatar, setAvatar] = useState("");
  const [bio, setBio] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const { data: profile, isLoading: profileLoading } = trpc.userManagement.getProfile.useQuery(
    undefined,
    { enabled: !!user }
  );

  const updateProfileMutation = trpc.userManagement.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile updated successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to update profile: ${error.message}`);
    },
  });

  const uploadImageMutation = trpc.media.uploadImage.useMutation();

  useEffect(() => {
    if (profile) {
      setAvatar(profile.avatar || "");
      setBio(profile.bio || "");
      setTwitterUrl(profile.twitterUrl || "");
      setLinkedinUrl(profile.linkedinUrl || "");
      setGithubUrl(profile.githubUrl || "");
      setWebsiteUrl(profile.websiteUrl || "");
    }
  }, [profile]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const result = await uploadImageMutation.mutateAsync({
          filename: file.name,
          contentType: file.type,
          base64Data: base64,
        });
        setAvatar(result.url);
        toast.success("Avatar uploaded successfully");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await updateProfileMutation.mutateAsync({
      avatar,
      bio,
      twitterUrl,
      linkedinUrl,
      githubUrl,
      websiteUrl,
    });
  };

  if (authLoading || profileLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container max-w-4xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground mt-2">
            Manage your public profile information that appears on your author page
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Section */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>
                Upload a profile picture that will appear on your author page and next to your posts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-6">
                <div className="relative">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-2 border-border"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-2 border-border">
                      <User className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <Label htmlFor="avatar-upload" className="cursor-pointer">
                    <div className="flex items-center gap-2 text-sm text-primary hover:underline">
                      <Upload className="h-4 w-4" />
                      {uploading ? "Uploading..." : "Upload new picture"}
                    </div>
                  </Label>
                  <Input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    disabled={uploading}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG or GIF. Max 5MB.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bio Section */}
          <Card>
            <CardHeader>
              <CardTitle>Bio</CardTitle>
              <CardDescription>
                Write a short bio about yourself. This will appear on your author page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell readers about yourself..."
                rows={6}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground mt-2">
                {bio.length}/500 characters
              </p>
            </CardContent>
          </Card>

          {/* Social Links Section */}
          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
              <CardDescription>
                Add links to your social media profiles and website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="twitter" className="flex items-center gap-2">
                  <Twitter className="h-4 w-4" />
                  Twitter
                </Label>
                <Input
                  id="twitter"
                  type="url"
                  value={twitterUrl}
                  onChange={(e) => setTwitterUrl(e.target.value)}
                  placeholder="https://twitter.com/username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin" className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </Label>
                <Input
                  id="linkedin"
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="github" className="flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  GitHub
                </Label>
                <Input
                  id="github"
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Website
                </Label>
                <Input
                  id="website"
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="submit"
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
