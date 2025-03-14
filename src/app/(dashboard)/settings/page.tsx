"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { motion } from "framer-motion";
import { 
  User, 
  Shield, 
  Bell, 
  Moon, 
  Sun, 
  Palette, 
  LucideIcon,
  Loader2,
  Check,
  CreditCard,
  DollarSign,
  PlusCircle,
  XCircle
} from "lucide-react";

type SettingSectionProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  children: React.ReactNode;
};

function SettingSection({ title, description, icon: Icon, children }: SettingSectionProps) {
  return (
    <div className="border border-black rounded-lg p-6 bg-white">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center flex-shrink-0">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-black">{title}</h2>
          <p className="text-black font-medium">{description}</p>
        </div>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { user } = useUser();
  const convexUser = useQuery(api.users.getUser);
  
  const [colorTheme, setColorTheme] = useState("light");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSavePreferences = () => {
    // This would save the preferences to Convex
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 1000);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Open Clerk profile
  const openClerkProfile = () => {
    const userButtonElement = document.querySelector('.cl-userButtonTrigger') as HTMLElement;
    if (userButtonElement) {
      userButtonElement.click();
    }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-4xl mx-auto space-y-6 pb-12"
    >
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold text-black mb-2">Settings</h1>
        <p className="text-black font-medium">Manage your account and preferences.</p>
      </motion.div>

      <motion.div variants={item}>
        <SettingSection 
          title="Current Plan" 
          description="Manage your subscription plan and credits"
          icon={CreditCard}
        >
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <h3 className="font-bold text-black">Current Plan</h3>
              <p className="text-sm text-black font-bold">{convexUser?.plan || "Free Plan"}</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                className="py-2 px-4 border border-black text-black rounded-md hover:bg-gray-50 transition-colors flex items-center gap-1"
              >
                <XCircle size={16} />
                Deactivate Plan
              </button>
              <button 
                className="py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800 transition-colors flex items-center gap-1"
              >
                <PlusCircle size={16} />
                Upgrade
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <h3 className="font-bold text-black">Credits</h3>
              <p className="text-sm text-black">Current credit balance: <span className="font-bold">{convexUser?.credits || 0}</span></p>
            </div>
            <button 
              className="py-2 px-4 border border-black text-black rounded-md hover:bg-gray-50 transition-colors flex items-center gap-1"
            >
              <DollarSign size={16} />
              Add Credits
            </button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <h3 className="font-bold text-black">Usage</h3>
              <p className="text-sm text-black">Tokens used: <span className="font-bold">{convexUser?.usageTokens || 0} / 5000</span></p>
            </div>
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-black rounded-full" 
                style={{ width: `${Math.min(((convexUser?.usageTokens || 0) / 5000) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </SettingSection>
      </motion.div>

      <motion.div variants={item}>
        <SettingSection 
          title="Account Settings" 
          description="Manage your account details and preferences"
          icon={User}
        >
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <h3 className="font-bold text-black">Profile Information</h3>
              <p className="text-sm text-black">Update your personal information</p>
            </div>
            <button 
              onClick={openClerkProfile}
              className="py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Manage Profile
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <h3 className="font-bold text-black">Email Address</h3>
              <p className="text-sm text-black">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
            <button 
              onClick={openClerkProfile}
              className="py-2 px-4 border border-black text-black rounded-md hover:bg-gray-50 transition-colors"
            >
              Change Email
            </button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <h3 className="font-bold text-black">Password</h3>
              <p className="text-sm text-black">Update your password</p>
            </div>
            <button 
              onClick={openClerkProfile}
              className="py-2 px-4 border border-black text-black rounded-md hover:bg-gray-50 transition-colors"
            >
              Change Password
            </button>
          </div>
        </SettingSection>
      </motion.div>

      <motion.div variants={item}>
        <SettingSection 
          title="Appearance" 
          description="Customize how Studi AI looks"
          icon={Palette}
        >
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <h3 className="font-bold text-black">Theme</h3>
              <p className="text-sm text-black">Choose between light and dark mode</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setColorTheme("light")}
                className={`p-2 rounded-md flex items-center gap-2 ${
                  colorTheme === "light" 
                    ? "bg-black text-white" 
                    : "border border-black text-black"
                }`}
              >
                <Sun size={16} />
                Light
              </button>
              <button 
                onClick={() => setColorTheme("dark")}
                className={`p-2 rounded-md flex items-center gap-2 ${
                  colorTheme === "dark" 
                    ? "bg-black text-white" 
                    : "border border-black text-black"
                }`}
              >
                <Moon size={16} />
                Dark
              </button>
            </div>
          </div>
        </SettingSection>
      </motion.div>

      <motion.div variants={item}>
        <SettingSection 
          title="Notifications" 
          description="Manage your notification preferences"
          icon={Bell}
        >
          <div className="flex items-center justify-between py-3">
            <div>
              <h3 className="font-bold text-black">Email Notifications</h3>
              <p className="text-sm text-black">Receive updates via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={notificationsEnabled} 
                onChange={() => setNotificationsEnabled(!notificationsEnabled)} 
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
            </label>
          </div>
        </SettingSection>
      </motion.div>

      <motion.div variants={item}>
        <SettingSection 
          title="Privacy & Security" 
          description="Manage your security settings and data"
          icon={Shield}
        >
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <h3 className="font-bold text-black">Data Storage</h3>
              <p className="text-sm text-black">Your chats are securely stored</p>
            </div>
            <button 
              className="py-2 px-4 border border-black text-black rounded-md hover:bg-gray-50 transition-colors"
            >
              Manage Data
            </button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <h3 className="font-bold text-black">Delete Account</h3>
              <p className="text-sm text-black">Permanently delete your account and all data</p>
            </div>
            <button 
              onClick={openClerkProfile}
              className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Delete Account
            </button>
          </div>
        </SettingSection>
      </motion.div>

      <motion.div variants={item} className="flex justify-end">
        <button
          onClick={handleSavePreferences}
          disabled={saving || saved}
          className="py-2 px-6 bg-black text-white rounded-md hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <Check size={18} />
              Saved!
            </>
          ) : (
            'Save Preferences'
          )}
        </button>
      </motion.div>
    </motion.div>
  );
} 