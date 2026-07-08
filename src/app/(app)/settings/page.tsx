import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Bell, Lock, User, MonitorSmartphone, Download, Trash2, AlertCircle } from 'lucide-react';

export default async function SettingsPage() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect('/login');

  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('name, email')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="w-12 h-12 text-error mb-4" />
        <h2 className="text-xl font-bold">Profile Error</h2>
        <p className="text-muted-foreground mt-2">Could not fetch profile settings.</p>
      </div>
    );
  }

  const initials = profile.name
    ? profile.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U';

  return (
    <div className="container mx-auto py-6 px-4 lg:px-6 max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account preferences and configurations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation/Sidebar */}
        <div className="space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg bg-primary/10 text-primary transition text-left">
            <User className="w-4 h-4" /> Account
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground transition text-left">
            <Bell className="w-4 h-4" /> Notifications
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground transition text-left">
            <Lock className="w-4 h-4" /> Privacy & Security
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground transition text-left">
            <MonitorSmartphone className="w-4 h-4" /> Connected Apps
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 space-y-6">
          
          {/* Section: Profile Info */}
          <section className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-4">Profile Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                  {initials}
                </div>
                <button className="px-3 py-1.5 text-sm font-medium border border-border rounded-lg bg-background hover:bg-muted transition text-foreground">
                  Change Avatar
                </button>
              </div>
              <hr className="border-border my-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Full Name</label>
                  <input type="text" defaultValue={profile.name || ''} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Email Address</label>
                  <input type="email" defaultValue={profile.email || user.email || ''} disabled className="w-full px-3 py-2 rounded-lg border border-border bg-muted/30 text-sm text-muted-foreground cursor-not-allowed" />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition">
                  Save Changes
                </button>
              </div>
            </div>
          </section>

          {/* Section: Password */}
          <section className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-4">Change Password</h2>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Current Password</label>
                <input type="password" placeholder="••••••••" className="w-full max-w-md px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">New Password</label>
                <input type="password" placeholder="••••••••" className="w-full max-w-md px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none" />
              </div>
              <div className="flex justify-end max-w-md pt-2">
                <button className="px-4 py-2 bg-background border border-border text-foreground text-sm font-medium rounded-lg hover:bg-muted transition">
                  Update Password
                </button>
              </div>
            </div>
          </section>

          {/* Section: Danger Zone */}
          <section className="p-6 rounded-xl border border-error/20 bg-error/5 shadow-sm">
            <h2 className="text-lg font-semibold text-error mb-4">Danger Zone</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground text-sm">Export Data</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Download a CSV of all your personal data.</p>
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-background border border-border text-foreground text-sm font-medium rounded-lg hover:bg-muted transition">
                  <Download className="w-4 h-4" /> Export
                </button>
              </div>
              <hr className="border-error/20" />
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-error text-sm">Delete Account</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Permanently delete your account and all data.</p>
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-error text-error-foreground text-sm font-medium rounded-lg hover:bg-error/90 transition shadow-sm">
                  <Trash2 className="w-4 h-4" /> Delete Account
                </button>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
