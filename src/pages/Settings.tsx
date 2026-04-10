import AppLayout from "@/components/layout/AppLayout";
import { Settings as SettingsIcon, User, Bell, Shield, Palette } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <SettingsIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-sans text-2xl font-medium text-foreground tracking-tight">
                SETTINGS
              </h1>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">
                Configuration & Preferences
              </p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-4">
          {[
            { icon: User, title: "Profile", desc: "Manage your account information" },
            { icon: Bell, title: "Notifications", desc: "Configure alert preferences" },
            { icon: Shield, title: "Security", desc: "Password and authentication" },
            { icon: Palette, title: "Appearance", desc: "Theme and display settings" },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4 hover:border-primary/20 transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-foreground">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
