"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Camera,
  Save,
  Bell,
  Shield,
  Palette,
  Moon,
  Sun,
  Globe,
  Trash2,
  Plus,
  X,
  Check,
  ChevronRight,
} from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardTopbar } from "@/components/dashboard-topbar"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const skills = [
  "React", "TypeScript", "Node.js", "Python", "AWS", "Docker", 
  "PostgreSQL", "GraphQL", "Next.js", "Tailwind CSS"
]

const experiences = [
  {
    title: "Senior Software Engineer",
    company: "Tech Corp",
    period: "Jan 2022 - Present",
    description: "Leading development of microservices architecture and mentoring junior developers.",
  },
  {
    title: "Software Engineer",
    company: "StartupXYZ",
    period: "Jun 2019 - Dec 2021",
    description: "Built scalable web applications using React and Node.js.",
  },
]

const settingsSections = [
  {
    title: "Notifications",
    icon: Bell,
    settings: [
      { label: "Email notifications", description: "Receive email updates about your interviews", enabled: true },
      { label: "Push notifications", description: "Get browser notifications for reminders", enabled: true },
      { label: "Weekly reports", description: "Receive weekly progress reports", enabled: false },
      { label: "Marketing emails", description: "Updates about new features and tips", enabled: false },
    ],
  },
  {
    title: "Security",
    icon: Shield,
    settings: [
      { label: "Two-factor authentication", description: "Add an extra layer of security", enabled: true },
      { label: "Session timeout", description: "Auto logout after 30 minutes of inactivity", enabled: true },
      { label: "Login alerts", description: "Get notified of new device logins", enabled: true },
    ],
  },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [theme, setTheme] = useState("dark")

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
  ]

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      
      <div className="pl-64">
        <DashboardTopbar />
        
        <main className="p-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">Profile & Settings</h1>
            <p className="text-muted-foreground">Manage your account and preferences</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <GlassCard hover={false}>
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        activeTab === tab.id
                          ? "bg-primary/20 text-primary"
                          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                      }`}
                    >
                      <tab.icon className="h-5 w-5" />
                      <span className="font-medium">{tab.label}</span>
                      {activeTab === tab.id && (
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      )}
                    </button>
                  ))}
                </nav>
              </GlassCard>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {activeTab === "profile" && (
                <>
                  {/* Profile Card */}
                  <GlassCard hover={false}>
                    <div className="flex flex-col md:flex-row items-start gap-6">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl font-bold">
                          JD
                        </div>
                        <button className="absolute -bottom-2 -right-2 p-2 rounded-full bg-secondary border border-border hover:bg-secondary/80 transition-colors">
                          <Camera className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-1">John Doe</h2>
                        <p className="text-muted-foreground mb-4">Senior Software Engineer</p>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            john@example.com
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            +1 (555) 123-4567
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            San Francisco, CA
                          </span>
                        </div>
                      </div>
                      <Button className="bg-gradient-to-r from-primary to-accent">
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  </GlassCard>

                  {/* Edit Profile Form */}
                  <GlassCard hover={false}>
                    <h3 className="text-lg font-semibold mb-6">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          defaultValue="John"
                          className="bg-secondary/50 border-border/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          defaultValue="Doe"
                          className="bg-secondary/50 border-border/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          defaultValue="john@example.com"
                          className="bg-secondary/50 border-border/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          defaultValue="+1 (555) 123-4567"
                          className="bg-secondary/50 border-border/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="title">Job Title</Label>
                        <Input
                          id="title"
                          defaultValue="Senior Software Engineer"
                          className="bg-secondary/50 border-border/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          defaultValue="San Francisco, CA"
                          className="bg-secondary/50 border-border/50"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="bio">Bio</Label>
                        <textarea
                          id="bio"
                          rows={3}
                          defaultValue="Passionate software engineer with 5+ years of experience building scalable web applications."
                          className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 focus:border-primary/50 focus:outline-none resize-none"
                        />
                      </div>
                    </div>
                  </GlassCard>

                  {/* Skills Section */}
                  <GlassCard hover={false}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Code className="h-5 w-5" />
                        Skills
                      </h3>
                      <Button variant="outline" size="sm">
                        <Plus className="mr-1 h-4 w-4" />
                        Add Skill
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, index) => (
                        <motion.div
                          key={skill}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30"
                        >
                          <span className="text-sm">{skill}</span>
                          <button className="hover:text-destructive transition-colors">
                            <X className="h-3 w-3" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </GlassCard>

                  {/* Experience Section */}
                  <GlassCard hover={false}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Briefcase className="h-5 w-5" />
                        Experience
                      </h3>
                      <Button variant="outline" size="sm">
                        <Plus className="mr-1 h-4 w-4" />
                        Add Experience
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {experiences.map((exp, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 rounded-xl bg-secondary/30 relative group"
                        >
                          <button className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <h4 className="font-semibold">{exp.title}</h4>
                          <p className="text-sm text-primary">{exp.company}</p>
                          <p className="text-xs text-muted-foreground mt-1">{exp.period}</p>
                          <p className="text-sm text-muted-foreground mt-2">{exp.description}</p>
                        </motion.div>
                      ))}
                    </div>
                  </GlassCard>
                </>
              )}

              {activeTab === "appearance" && (
                <GlassCard hover={false}>
                  <h3 className="text-lg font-semibold mb-6">Appearance Settings</h3>
                  
                  {/* Theme Selection */}
                  <div className="mb-8">
                    <Label className="mb-4 block">Theme</Label>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { id: "light", icon: Sun, label: "Light" },
                        { id: "dark", icon: Moon, label: "Dark" },
                        { id: "system", icon: Globe, label: "System" },
                      ].map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setTheme(option.id)}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            theme === option.id
                              ? "border-primary bg-primary/10"
                              : "border-border/50 hover:border-primary/50"
                          }`}
                        >
                          <option.icon className="h-6 w-6 mx-auto mb-2" />
                          <p className="text-sm font-medium">{option.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Accent */}
                  <div className="mb-8">
                    <Label className="mb-4 block">Accent Color</Label>
                    <div className="flex gap-3">
                      {["#6366f1", "#8b5cf6", "#06b6d4", "#22c55e", "#f59e0b", "#ef4444"].map((color) => (
                        <button
                          key={color}
                          className="w-10 h-10 rounded-full border-2 border-transparent hover:border-white/50 transition-all"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Font Size */}
                  <div>
                    <Label className="mb-4 block">Font Size</Label>
                    <div className="flex items-center gap-4">
                      <span className="text-sm">A</span>
                      <input
                        type="range"
                        min="12"
                        max="18"
                        defaultValue="14"
                        className="flex-1 h-2 bg-secondary rounded-full appearance-none cursor-pointer"
                      />
                      <span className="text-lg">A</span>
                    </div>
                  </div>
                </GlassCard>
              )}

              {(activeTab === "notifications" || activeTab === "security") && (
                <>
                  {settingsSections
                    .filter((section) =>
                      activeTab === "notifications"
                        ? section.title === "Notifications"
                        : section.title === "Security"
                    )
                    .map((section) => (
                      <GlassCard key={section.title} hover={false}>
                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                          <section.icon className="h-5 w-5" />
                          {section.title}
                        </h3>
                        <div className="space-y-4">
                          {section.settings.map((setting, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-4 rounded-xl bg-secondary/30"
                            >
                              <div>
                                <p className="font-medium">{setting.label}</p>
                                <p className="text-sm text-muted-foreground">{setting.description}</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  defaultChecked={setting.enabled}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-secondary rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                              </label>
                            </div>
                          ))}
                        </div>
                      </GlassCard>
                    ))}

                  {activeTab === "security" && (
                    <GlassCard hover={false}>
                      <h3 className="text-lg font-semibold mb-6">Change Password</h3>
                      <div className="space-y-4 max-w-md">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            className="bg-secondary/50 border-border/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            className="bg-secondary/50 border-border/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            className="bg-secondary/50 border-border/50"
                          />
                        </div>
                        <Button className="bg-gradient-to-r from-primary to-accent">
                          Update Password
                        </Button>
                      </div>
                    </GlassCard>
                  )}
                </>
              )}

              {/* Danger Zone */}
              {activeTab === "security" && (
                <GlassCard className="border-destructive/30" hover={false}>
                  <h3 className="text-lg font-semibold text-destructive mb-4">Danger Zone</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button>
                </GlassCard>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
