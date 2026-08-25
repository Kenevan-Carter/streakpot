import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import Sidebar from "../Sidebar";
import "./Profile.css";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState("");

  const [contestCount, setContestCount] = useState(0);
  const [percentageCorrect, setPercentageCorrect] = useState(0);

  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [savingUsername, setSavingUsername] = useState(false);

  const [loading, setLoading] = useState(true);

  // -----------------------------------------
  // LOAD PROFILE
  // -----------------------------------------

  useEffect(() => {
    const loadProfile = async () => {
      try {
        // -----------------------------------------
        // GET LOGGED IN USER
        // -----------------------------------------

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (!user) {
          return;
        }

        // -----------------------------------------
        // EMAIL FROM SUPABASE AUTH
        // -----------------------------------------

        setEmail(user.email || "");

        // -----------------------------------------
        // GET PROFILE
        // -----------------------------------------

        const {
          data: profileData,
          error: profileError,
        } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) {
          throw profileError;
        }

        setProfile(profileData);
        setNewUsername(profileData?.username || "");

        // -----------------------------------------
        // GET CONTEST COUNT FROM PICKS
        // -----------------------------------------

        const {
          data: contestPicks,
          error: contestPicksError,
        } = await supabase
          .from("picks")
          .select("contest_id")
          .eq("user_id", user.id);

        if (contestPicksError) {
          console.error(
            "Contest count error:",
            contestPicksError
          );
        } else {
          console.log(
            "Contest picks:",
            contestPicks
          );

          const uniqueContestIds = new Set(
            (contestPicks || [])
              .map((pick) => pick.contest_id)
              .filter(Boolean)
          );

          console.log(
            "Unique contests:",
            [...uniqueContestIds]
          );

          console.log(
            "Contest count:",
            uniqueContestIds.size
          );

          setContestCount(
            uniqueContestIds.size
          );
        }

        // -----------------------------------------
        // GET CORRECT PICK PERCENTAGE
        // -----------------------------------------

        const {
          data: resultPicks,
          error: resultPicksError,
        } = await supabase
          .from("picks")
          .select("result")
          .eq("user_id", user.id);

        if (resultPicksError) {
          console.error(
            "Pick results error:",
            resultPicksError
          );
        } else {
          const gradedPicks = (resultPicks || []).filter(
            (pick) =>
              pick.result === "correct" ||
              pick.result === "incorrect"
          );

          const correctPicks = gradedPicks.filter(
            (pick) =>
              pick.result === "correct"
          );

          if (gradedPicks.length > 0) {
            const percent =
              (correctPicks.length /
                gradedPicks.length) *
              100;

            setPercentageCorrect(
              Math.round(percent)
            );
          } else {
            setPercentageCorrect(0);
          }
        }
      } catch (error) {
        console.error(
          "Profile loading error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // -----------------------------------------
  // UPDATE USERNAME
  // -----------------------------------------

  const handleUsernameSave = async () => {
    const cleanedUsername =
      newUsername.trim();

    if (!cleanedUsername) {
      console.error(
        "Username cannot be empty."
      );
      return;
    }

    try {
      setSavingUsername(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        throw new Error(
          "No logged in user found."
        );
      }

      const {
        data,
        error,
      } = await supabase
        .from("profiles")
        .update({
          username: cleanedUsername,
        })
        .eq("id", user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setProfile(data);
      setNewUsername(data.username);
      setEditingUsername(false);

      console.log(
        "Username updated:",
        data.username
      );
    } catch (error) {
      console.error(
        "Username update error:",
        error
      );
    } finally {
      setSavingUsername(false);
    }
  };

  // -----------------------------------------
  // LOADING
  // -----------------------------------------

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

  // -----------------------------------------
  // PAGE
  // -----------------------------------------

  return (
    <div className="profile-page">
      <Sidebar />

      <main className="profile-main">

        {/* HEADER */}

        <div className="profile-header">
          <p className="profile-small-title">
            PROFILE
          </p>

          <p className="profile-subtitle">
            Manage Your StreakPick Account
          </p>
        </div>

        {/* PROFILE CARD */}

        <section className="profile-card">

          <div className="profile-user">

            <div className="profile-avatar">
              {profile?.username
                ? profile.username
                    .charAt(0)
                    .toUpperCase()
                : "U"}
            </div>

            <div>
              <h2>
                {profile?.username || "User"}
              </h2>

              <p>
                {email || "No email"}
              </p>
            </div>

          </div>

          {/* PROFILE STATS */}

          <div className="profile-stats">

            {/* COINS */}

            <div className="profile-stat">
              <span className="profile-stat-label">
                COINS
              </span>

              <span className="profile-stat-value">
                {profile?.coins ?? 0}
              </span>
            </div>

            {/* CONTESTS ENTERED */}

            <div className="profile-stat">
              <span className="profile-stat-label">
                CONTESTS ENTERED
              </span>

              <span className="profile-stat-value">
                {contestCount}
              </span>
            </div>

            {/* CORRECT PICK PERCENTAGE */}

            <div className="profile-stat">
              <span className="profile-stat-label">
                CORRECT PICK PERCENTAGE
              </span>

              <span className="profile-stat-value">
                {percentageCorrect}%
              </span>
            </div>

          </div>

        </section>

        {/* ACCOUNT SETTINGS */}

        <section className="profile-settings">

          <p className="profile-section-label">
            ACCOUNT SETTINGS
          </p>

          <div className="profile-settings-card">

            {/* USERNAME */}

            <div className="profile-setting-row username-setting-row">

              <span>
                Username
              </span>

              {editingUsername ? (
                <div className="username-edit">

                  <input
                    type="text"
                    value={newUsername}
                    onChange={(event) =>
                      setNewUsername(
                        event.target.value
                      )
                    }
                    maxLength={30}
                    autoFocus
                  />

                  <button
                    className="username-save-button"
                    onClick={handleUsernameSave}
                    disabled={savingUsername}
                  >
                    {savingUsername
                      ? "Saving..."
                      : "Save"}
                  </button>

                  <button
                    className="username-cancel-button"
                    onClick={() => {
                      setNewUsername(
                        profile?.username || ""
                      );

                      setEditingUsername(false);
                    }}
                    disabled={savingUsername}
                  >
                    Cancel
                  </button>

                </div>
              ) : (
                <button
                  className="username-display-button"
                  onClick={() =>
                    setEditingUsername(true)
                  }
                >
                  <span>
                    {profile?.username}
                  </span>

                  <span>›</span>
                </button>
              )}

            </div>

            {/* EMAIL */}

            <div className="profile-setting-row">
              <span>
                Email
              </span>

              <div>
                <span>
                  {email}
                </span>
              </div>
            </div>

            {/* PASSWORD */}

            <button className="profile-setting-row">
              <span>
                Password
              </span>

              <div>
                <span>
                  Change
                </span>

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