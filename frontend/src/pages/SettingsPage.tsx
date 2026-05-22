import React, { useState } from "react";
import {
  Bell,
  Moon,
  Shield,
  User,
  Lock,
  Save,
} from "lucide-react";

const SettingsPage: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="min-h-screen bg-dark-900 text-white p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Settings
        </h1>

        <p className="text-slate-400 mt-2">
          Manage your account preferences
        </p>
      </div>

      <div className="space-y-8">
        {/* Account */}
        <div className="glass-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-brand-400" />
            <h2 className="text-2xl font-bold">
              Account Settings
            </h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm mb-2 text-slate-400">
                Full Name
              </label>

              <input
                type="text"
                defaultValue="Mohit Gora"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-slate-400">
                Email
              </label>

              <input
                type="email"
                defaultValue="mohit@example.com"
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="glass-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <Moon className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold">
              Preferences
            </h2>
          </div>

          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">
                  Dark Mode
                </h3>

                <p className="text-slate-400 text-sm">
                  Enable dark theme UI
                </p>
              </div>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-14 h-7 rounded-full transition-all ${
                  darkMode
                    ? "bg-brand-500"
                    : "bg-slate-700"
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full transition-all ${
                    darkMode
                      ? "translate-x-7"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">
                  Notifications
                </h3>

                <p className="text-slate-400 text-sm">
                  Receive email updates
                </p>
              </div>

              <button
                onClick={() =>
                  setNotifications(!notifications)
                }
                className={`w-14 h-7 rounded-full transition-all ${
                  notifications
                    ? "bg-brand-500"
                    : "bg-slate-700"
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full transition-all ${
                    notifications
                      ? "translate-x-7"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="glass-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-green-400" />
            <h2 className="text-2xl font-bold">
              Security
            </h2>
          </div>

          <div className="space-y-5">
            <button className="btn-secondary w-full justify-start">
              <Lock className="w-4 h-4" />
              Change Password
            </button>

            <button className="btn-secondary w-full justify-start">
              <Bell className="w-4 h-4" />
              Manage Notifications
            </button>
          </div>
        </div>

        <button className="btn-primary">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;