import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserProfileStats, getUserRecentActivity } from "@/lib/db/queries/profile";
import { CheckCircle2, Clock, MapPin, Mail, Briefcase, Award, AlertCircle } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

export default async function ProfilePage() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect("/login");

  // Fetch user profile from DB
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("id, name, email, role, created_at, department:departments(name)")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="w-12 h-12 text-error mb-4" />
        <h2 className="text-xl font-bold">Profile not found</h2>
        <p className="text-muted-foreground mt-2 text-center max-w-md">We couldn't find your profile information. This may happen if your account setup was interrupted.</p>
      </div>
    );
  }

  // Fetch stats and activity
  let stats;
  let activity: any[] = [];
  try {
    stats = await getUserProfileStats(user.id);
    activity = await getUserRecentActivity(user.id);
  } catch (err) {
    console.error("Failed to load profile stats:", err);
    // Keep stats null so we can render an empty state or partial UI
  }

  const joinDate = profile.created_at ? format(new Date(profile.created_at), 'MMM yyyy') : 'Unknown';
  const departmentName = profile.department?.[0]?.name || 'Organization';
  const roleDisplay = profile.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : 'Member';

  // Extract initials for avatar
  const initials = profile.name
    ? profile.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U';

  return (
    <div className="container mx-auto py-6 px-4 lg:px-6 space-y-6 max-w-5xl">
      
      {/* Profile Header (Hero style) */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden relative">
        <div className="h-32 bg-primary/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        </div>
        
        <div className="px-6 sm:px-10 pb-8 relative">
          {/* Avatar pushing up into banner */}
          <div className="flex justify-between items-end -mt-12 mb-4">
            <div className="w-24 h-24 rounded-full border-4 border-card bg-background flex items-center justify-center shadow-md relative overflow-hidden">
              <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold text-3xl">
                {initials}
              </div>
            </div>
            <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition shadow-sm">
              Edit Profile
            </button>
          </div>
          
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground">{profile.name || 'Anonymous User'}</h1>
            <p className="text-sm font-medium text-primary">{roleDisplay} • {departmentName}</p>
          </div>
          
          <div className="flex flex-wrap gap-4 mt-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" /> Remote
            </div>
            <div className="flex items-center gap-1.5">
              <Mail className="w-4 h-4" /> {profile.email}
            </div>
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-4 h-4" /> Joined {joinDate}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Stats */}
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Work Statistics</h2>
            
            {stats ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> Tasks Completed</span>
                  <span className="font-bold text-foreground">{stats.tasksCompleted}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2"><Clock className="w-4 h-4 text-warning" /> Hours Logged</span>
                  <span className="font-bold text-foreground">{stats.hoursLogged}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2"><Award className="w-4 h-4 text-primary" /> Tokens Earned</span>
                  <span className="font-bold text-foreground">{stats.tokensEarned}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Stats unavailable at this time.</p>
            )}
          </div>
          
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Achievements</h2>
            {stats?.achievements && stats.achievements.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {stats.achievements.map((ach: string, i: number) => (
                  <span key={i} className="px-2.5 py-1 text-xs font-medium bg-primary/10 text-primary rounded-lg border border-primary/20">{ach}</span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No achievements yet.</p>
            )}
          </div>
        </div>

        {/* Right Column - Activity */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-6">Recent Activity</h2>
            
            <div className="space-y-6">
              {activity.length > 0 ? (
                activity.map((item, i) => (
                  <div key={item.id || i} className="flex gap-4">
                    <div className="mt-1">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-foreground">
                        <span className="font-semibold">{profile.name}</span> {item.action}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.timestamp ? formatDistanceToNow(new Date(item.timestamp), { addSuffix: true }) : 'Unknown date'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Clock className="w-10 h-10 text-muted-foreground/30 mb-3" />
                  <p className="text-sm font-medium text-foreground">No recent activity</p>
                  <p className="text-xs text-muted-foreground mt-1">Your actions will appear here once you start using the platform.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
