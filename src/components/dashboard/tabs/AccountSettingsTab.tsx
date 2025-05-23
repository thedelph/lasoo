import { Trash2, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { useSupabaseAuth } from "../../../hooks/useSupabaseAuth";

export default function AccountSettingsTab() {
  const { user } = useSupabaseAuth();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-2">Account Settings</h2>
        <p className="text-gray-600 mb-6">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Account Information Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-medium mb-4">Account Information</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Email Address</p>
            <p className="mt-1">{user?.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Account Created</p>
            <p className="mt-1">
              {user?.created_at 
                ? new Date(user.created_at).toLocaleDateString() 
                : "Not available"}
            </p>
          </div>
        </div>
      </div>

      {/* Data & Privacy Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Data & Privacy</h3>
        <p className="text-gray-600 mb-6">
          Manage your data and privacy preferences
        </p>

        {/* Data Export (placeholder for future feature) */}
        <div className="border-b pb-4 mb-4">
          <h4 className="text-md font-medium mb-2">Export Your Data</h4>
          <p className="text-sm text-gray-600 mb-3">
            Download a copy of your data, including your profile information and location history.
          </p>
          <button 
            className="btn btn-outline btn-sm"
            disabled={true}
            title="Coming soon"
          >
            Export Data (Coming Soon)
          </button>
        </div>

        {/* Delete Account - Danger Zone */}
        <div className="mt-8 border border-red-200 rounded-lg p-4 bg-red-50">
          <div>
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              <h4 className="text-md font-medium text-red-800">Danger Zone</h4>
            </div>
            <p className="text-sm text-gray-700 my-2">
              Permanently delete your account and all of your data. This action cannot be undone.
            </p>
            <Link 
              to="/forgetme" 
              className="btn btn-error btn-sm inline-flex items-center bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
