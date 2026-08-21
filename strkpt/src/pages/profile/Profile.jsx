import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Sidebar from "../../components/sidebar/Sidebar";
import "./Profile.css";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (!user) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          throw error;
        }

        setProfile(data);
      } catch (error) {
        console.error("Profile error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="profile-page">
        <Sidebar />

        <main className="profile-main">
          <p>Loading profile...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Sidebar />

      <main className="profile-main">

        <div className="profile-header">
          <p className="profile-small-title">
            PROFILE
          </p>

          <h1>My Profile</h1>

          <p className="profile-subtitle">
            View and manage your StreakBet account
          </p>
        </div>

        <section className="profile-card">

          <div className="profile-user">
            <div className="profile-avatar">
              {profile?.username
                ? profile.username.charAt(0).toUpperCase()
                : "U"}
            </div>

            <div>
              <h2>
                {profile?.username || "User"}
              </h2>

              <p>
                {profile?.email || "No email"}
              </p>
            </div>
          </div>

          <div className="profile-stats">

            <div className="profile-stat">
              <span className="profile-stat-label">
                COINS
              </span>

              <span className="profile-stat-value">
                {profile?.coins ?? 0}
              </span>
            </div>

            <div className="profile-stat">
              <span className="profile-stat-label">
                CURRENT STREAK
              </span>

              <span className="profile-stat-value">
                {profile?.streak ?? 0} Days
              </span>
            </div>

            <div className="profile-stat">
              <span className="profile-stat-label">
                CONTESTS
              </span>

              <span className="profile-stat-value">
                0
              </span>
            </div>

          </div>

        </section>

        <section className="profile-settings">

          <p className="profile-section-label">
            ACCOUNT SETTINGS
          </p>

          <div className="profile-settings-card">

            <button className="profile-setting-row">
              <span>Username</span>

              <div>
                <span>{profile?.username}</span>
                <span>›</span>
              </div>
            </button>

            <button className="profile-setting-row">
              <span>Email</span>

              <div>
                <span>{profile?.email}</span>
                <span>›</span>
              </div>
            </button>

            <button className="profile-setting-row">
              <span>Password</span>

              <div>
                <span>Change</span>
                <span>›</span>
              </div>
            </button>

          </div>

        </section>

      </main>
    </div>
  );
}

export default Profile;