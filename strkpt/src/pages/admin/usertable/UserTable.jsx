import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import "./UserTable.css";

function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      setErrorMessage("");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      setUsers(data || []);
      setLoading(false);
    };

    loadUsers();
  }, []);

  if (loading) {
    return (
      <div className="user-table-page">
        <p className="user-table-message">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="user-table-page">
      <div className="user-table-header">
        <p className="user-table-label">ADMIN</p>
        <h1>User Table</h1>
        <p>
          Registered users currently stored in the profiles table.
        </p>
      </div>

      {errorMessage && (
        <div className="user-table-error">
          {errorMessage}
        </div>
      )}

      {!errorMessage && users.length === 0 && (
        <p className="user-table-message">
          No users found.
        </p>
      )}

      {!errorMessage && users.length > 0 && (
        <div className="user-table-wrapper">
          <table className="user-table">
            <thead>
                <tr>
                <th>Username</th>
                <th>User ID</th>
                <th>Role</th>
                <th>Created</th>
                </tr>
            </thead>

            <tbody>
                {users.map((user) => (
                <tr key={user.id}>
                    <td className="username-cell">
                    {user.username || "No username"}
                    </td>


                    <td className="user-id-cell">
                    {user.id}
                    </td>

                    <td>
                    <span className="role-badge">
                        {user.role || "user"}
                    </span>
                    </td>

                    <td>
                    {user.created_at
                        ? new Date(user.created_at).toLocaleString()
                        : "Unknown"}
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      )}
    </div>
  );
}

export default UserTable;