package com.urgeguard

import android.accessibilityservice.AccessibilityService
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.view.accessibility.AccessibilityEvent

class AppBlockerService : AccessibilityService() {

    override fun onAccessibilityEvent(event: AccessibilityEvent) {
        // Only inspect window state changes (i.e. when a new app is opened/focused)
        if (event.eventType == AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) {
            val openedPackageName = event.packageName?.toString() ?: return

            // 1. Check if the UrgeGuard app shield is globally enabled
            val prefs: SharedPreferences = getSharedPreferences("UrgeGuardPrefs", Context.MODE_PRIVATE)
            val isShieldEnabled = prefs.getBoolean("isShieldEnabled", true)
            val isUrgeActive = prefs.getBoolean("isUrgeActive", false)

            if (isShieldEnabled && isUrgeActive) {
                // 2. Fetch the user's blacklist of apps (stored as a comma-separated string)
                val blacklistStr = prefs.getString("blacklist", "com.instagram.android,com.zhiliaoapp.musically,com.reddit.frontpage") ?: ""
                val blacklistedPackages = blacklistStr.split(",").map { it.trim() }

                // 3. If the user opened a forbidden app, trigger redirect to the UrgeGuard app
                if (blacklistedPackages.contains(openedPackageName)) {
                    performRedirectToUrgeGuard()
                }
            }
        }
    }

    private fun performRedirectToUrgeGuard() {
        // Intent to launch UrgeGuard's main activity
        val launchIntent = packageManager.getLaunchIntentForPackage(packageName)
        if (launchIntent != null) {
            launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            launchIntent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
            // Extra to let the React Native layer know to open the Breathing intervention directly
            launchIntent.putExtra("blocked_app_redirect", true)
            startActivity(launchIntent)
        }
    }

    override fun onInterrupt() {
        // Handle unexpected service interruption safely
    }

    override fun onServiceConnected() {
        super.onServiceConnected()
        // Accessibility service configuration is automatically loaded from xml (accessibility_service_config.xml)
    }
}
