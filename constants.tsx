import { TargetApp, Patch } from './types';

export const TARGET_APPS: TargetApp[] = [
  { 
    id: 'youtube', 
    name: 'YouTube', 
    icon: '🔴', 
    packageName: 'com.google.android.youtube', 
    color: 'bg-red-500',
    recommendedVersion: '19.23.40' 
  },
  { 
    id: 'youtube-music', 
    name: 'YouTube Music', 
    icon: '🎵', 
    packageName: 'com.google.android.apps.youtube.music', 
    color: 'bg-red-600',
    recommendedVersion: '7.23.51'
  },
  { 
    id: 'tiktok', 
    name: 'TikTok', 
    icon: '📱', 
    packageName: 'com.zhiliaoapp.musically', 
    color: 'bg-black',
    recommendedVersion: '36.5.4'
  },
  { 
    id: 'reddit', 
    name: 'Reddit', 
    icon: '🤖', 
    packageName: 'com.reddit.frontpage', 
    color: 'bg-orange-500',
    recommendedVersion: '2024.17.0'
  },
  { 
    id: 'twitter', 
    name: 'Twitter (X)', 
    icon: '🐦', 
    packageName: 'com.twitter.android', 
    color: 'bg-slate-800',
    recommendedVersion: '10.48.0-release'
  },
  { 
    id: 'spotify', 
    name: 'Spotify', 
    icon: '🎧', 
    packageName: 'com.spotify.music', 
    color: 'bg-green-500',
    recommendedVersion: '9.0.36.683'
  },
  { 
    id: 'google-photos', 
    name: 'Google Photos', 
    icon: '🖼️', 
    packageName: 'com.google.android.apps.photos', 
    color: 'bg-blue-500',
    recommendedVersion: '6.94.0'
  },
  { 
    id: 'twitch', 
    name: 'Twitch', 
    icon: '🎮', 
    packageName: 'tv.twitch.android.app', 
    color: 'bg-purple-600',
    recommendedVersion: '18.2.1'
  },
  { 
    id: 'jio-hotstar', 
    name: 'Jio Hotstar', 
    icon: '⭐', 
    packageName: 'in.startv.hotstar', 
    color: 'bg-indigo-600',
    recommendedVersion: '12.9.9'
  }
];

const PKG_YT = 'com.google.android.youtube';
const PKG_YTM = 'com.google.android.apps.youtube.music';
const PKG_TT = 'com.zhiliaoapp.musically';
const PKG_RD = 'com.reddit.frontpage';
const PKG_TW = 'com.twitter.android';
const PKG_SP = 'com.spotify.music';
const PKG_GP = 'com.google.android.apps.photos';
const PKG_TCH = 'tv.twitch.android.app';
const PKG_JH = 'in.startv.hotstar';

export const INITIAL_PATCHES: Patch[] = [
  // --- YOUTUBE 59 PATCHES (ACCURATE TO SCREENSHOTS) ---
  { id: 'alternative-thumbnails', name: 'Alternative thumbnails', description: 'Replaces thumbnails with custom versions.', enabled: false, compatibleApps: [PKG_YT] },
  { id: 'announcements', name: 'Announcements', description: 'Displays ReVanced announcements.', enabled: true, compatibleApps: [PKG_YT] },
  { id: 'bypass-url-redirects', name: 'Bypass URL redirects', description: 'Bypasses link shorteners and tracking redirects.', enabled: true, compatibleApps: [PKG_YT] },
  { id: 'bypass-image-region-restrictions', name: 'Bypass image region restrictions', description: 'Bypasses region checks for images.', enabled: true, compatibleApps: [PKG_YT] },
  { id: 'change-form-factor', name: 'Change form factor', description: 'Forces tablet or mobile layout.', enabled: false, compatibleApps: [PKG_YT] },
  { id: 'change-header', name: 'Change header', description: 'Customizes the app header layout.', enabled: false, compatibleApps: [PKG_YT] },
  { id: 'change-start-page', name: 'Change start page', description: 'Sets a custom starting page.', enabled: false, compatibleApps: [PKG_YT] },
  { id: 'check-watch-history-domain', name: 'Check watch history domain name resolution', description: 'Fixes issues with watch history not saving.', enabled: true, compatibleApps: [PKG_YT] },
  { id: 'copy-video-url', name: 'Copy video URL', description: 'Adds button to copy URL from player.', enabled: true, compatibleApps: [PKG_YT] },
  { id: 'custom-branding', name: 'Custom branding', description: 'Changes app icon and name.', enabled: true, compatibleApps: [PKG_YT, PKG_YTM, PKG_TT, PKG_RD, PKG_TW, PKG_SP, PKG_GP, PKG_TCH, PKG_JH] },
  { id: 'custom-player-overlay-opacity', name: 'Custom player overlay opacity', description: 'Adjusts opacity of controls.', enabled: false, compatibleApps: [PKG_YT] },
  { id: 'disable-auto-captions', name: 'Disable auto captions', description: 'Prevents automatic subtitles.', enabled: true, compatibleApps: [PKG_YT] },
  { id: 'disable-double-tap-actions', name: 'Disable double tap actions', description: 'Removes skip forward/backward gestures.', enabled: false, compatibleApps: [PKG_YT] },
  { id: 'disable-fullscreen-ambient-mode', name: 'Disable fullscreen ambient mode', description: 'Removes glow effect in fullscreen.', enabled: true, compatibleApps: [PKG_YT] },
  { id: 'disable-haptic-feedback', name: 'Disable haptic feedback', description: 'Removes vibrations for UI interactions.', enabled: false, compatibleApps: [PKG_YT] },
  { id: 'disable-player-popup-panels', name: 'Disable player popup panels', description: 'Removes popups like suggested videos.', enabled: true, compatibleApps: [PKG_YT] },
  { id: 'disable-resuming-shorts', name: 'Disable resuming Shorts on startup', description: 'Opens Home instead of Shorts.', enabled: true, compatibleApps: [PKG_YT] },
  { id: 'disable-rolling-number-animations', name: 'Disable rolling number animations', description: 'Removes count animations.', enabled: false, compatibleApps: [PKG_YT] },
  { id: 'disable-sign-in-tv-popup', name: 'Disable sign in to TV popup', description: 'Removes TV pairing prompt.', enabled: true, compatibleApps: [PKG_YT] },
  { id: 'disable-video-codecs', name: 'Disable video codecs', description: 'Forces specific video codecs.', enabled: false, compatibleApps: [PKG_YT] },
  { id: 'downloads', name: 'Downloads', description: 'Enables native download buttons.', enabled: true, compatibleApps: [PKG_YT, PKG_YTM] },
  { id: 'enable-debugging', name: 'Enable debugging', description: 'Allows remote debugging.', enabled: false, compatibleApps: [PKG_YT] },
  { id: 'exit-fullscreen-mode', name: 'Exit fullscreen mode', description: 'Customizes how fullscreen is exited.', enabled: false, compatibleApps: [PKG_YT] },
  { id: 'force-original-audio', name: 'Force original audio', description: 'Bypasses audio normalization.', enabled: false, compatibleApps: [PKG_YT] },
  { id: 'gmscore-support', name: 'GmsCore support', description: 'Required for login on non-root.', enabled: true, compatibleApps: [PKG_YT, PKG_YTM, PKG_TCH] },
  { id: 'hide-shorts-components', name: 'Hide Shorts components', description: 'Removes elements from Shorts feed.', enabled: true, compatibleApps: [PKG_YT] },
  { id: 'hide-ads', name: 'Hide ads', description: 'Removes general feed ads.', enabled: true, compatibleApps: [PKG_YT, PKG_YTM, PKG_TT, PKG_RD, PKG_TW, PKG_SP, PKG_GP, PKG_TCH, PKG_JH] },
  { id: 'hide-end-screen-cards', name: 'Hide end screen cards', description: 'Removes end video overlays.', enabled: true, compatibleApps: [PKG_YT] },
  { id: 'hide-end-screen-suggested-video', name: 'Hide end screen suggested video', description: 'Hides recommendations at end.', enabled: true, compatibleApps: [PKG_YT] },
  { id: 'hide-info-cards', name: 'Hide info cards', description: 'Removes mid-video popups.', enabled: true, compatibleApps: [PKG_YT] },
  { id: 'hide-layout-components', name: 'Hide layout components', description: 'Cleans up the Home UI.', enabled: true, compatibleApps: [PKG_YT] },
  { id: 'hide-player-flyout-menu-items', name: 'Hide player flyout menu items', description: 'Simplifies settings menu.', enabled: true, compatibleApps: [PKG_YT] },
  { id: 'hide-player-overlay-buttons', name: 'Hide player overlay buttons', description: 'Removes control icons.', enabled: true, compatibleApps: [PKG_YT] },
  { id: 'hide-related-video-overlay', name: 'Hide related video overlay', description: 'Removes suggestions on pause.', enabled: true, compatibleApps: [PKG_YT] },
  { id: 'hide-timestamp', name: 'Hide timestamp', description: 'Removes duration from thumbnails.', enabled: false, compatibleApps: [PKG_YT] },
  { id: 'hide-video-action-buttons', name: 'Hide video action buttons', description: 'Removes Share/Thanks buttons.', enabled: false, compatibleApps: [PKG_YT] },
  { id: 'loop-video', name: 'Loop video', description: 'Adds auto-restart functionality.', enabled: true, compatibleApps: [PKG_YT] },
  { id: 'miniplayer', name: 'Miniplayer', description: 'Enables background miniplayer.', enabled: true, compatibleApps: [PKG_YT] },
  { id: 'navigation-buttons', name: 'Navigation buttons', description: 'Customizes bottom bar items.', enabled: true, compatibleApps: [PKG_YT] },
  { id: 'open-shorts-in-regular-player', name: 'Open Shorts in regular player', description: 'Forces standard UI for Shorts.', enabled: false, compatibleApps: [PKG_YT] },
  { id: 'open-links-externally', name: 'Open links externally', description: 'Forces browser for all links.', enabled: true, compatibleApps: [PKG_YT] },
  { id: 'open-videos-fullscreen', name: 'Open videos fullscreen', description: 'Auto-expands videos on start.', enabled: false, compatibleApps: [PKG_YT] },
  { id: 'pause-on-audio-interrupt', name: 'Pause on audio interrupt', description: 'Stops playback when busy.', enabled: true, compatibleApps: [PKG_YT] },
  { id: 'playback-speed', name: 'Playback speed', description: 'Adds more speed options.', enabled: true, compatibleApps: [PKG_YT] },
  { id: 'remove-background-playback-restrictions', name: 'Remove background playback restrictions', description: 'Enables screen-off playback.', enabled: true, compatibleApps: [PKG_YT, PKG_YTM] },
  { id: 'remove-viewer-discretion-dialog', name: 'Remove viewer discretion dialog', description: 'Auto-clicks age confirmation.', enabled: true, compatibleApps: [PKG_YT] },
  { id: 'return-youtube-dislike', name: 'Return YouTube Dislike', description: 'Restores the dislike counter.', enabled: true, compatibleApps: [PKG_YT] },
  { id: 'sanitize-sharing-links', name: 'Sanitize sharing links', description: 'Removes URL tracking.', enabled: true, compatibleApps: [PKG_YT] },
  { id: 'seekbar', name: 'SeekBar', description: 'Customizes progress bar visuals.', enabled: true, compatibleApps: [PKG_YT] },
  { id: 'shorts-autoplay', name: 'Shorts autoplay', description: 'Auto-advances in Shorts.', enabled: true, compatibleApps: [PKG_YT] },
  { id: 'sponsorblock', name: 'SponsorBlock', description: 'Skips sponsor segments.', enabled: true, compatibleApps: [PKG_YT] },
  { id: 'spoof-app-version', name: 'Spoof app version', description: 'Fixes playback/buffer issues.', enabled: true, compatibleApps: [PKG_YT, PKG_YTM] },
  { id: 'spoof-device-dimensions', name: 'Spoof device dimensions', description: 'Unlocks 4K on small screens.', enabled: true, compatibleApps: [PKG_YT] },
  { id: 'spoof-video-streams', name: 'Spoof video streams', description: 'Bypasses server-side throttling.', enabled: true, compatibleApps: [PKG_YT] },
  { id: 'swipe-controls', name: 'Swipe controls', description: 'Brightness/Volume gestures.', enabled: true, compatibleApps: [PKG_YT] },
  { id: 'theme', name: 'Theme', description: 'Custom dark modes and colors.', enabled: true, compatibleApps: [PKG_YT, PKG_YTM, PKG_TT, PKG_RD, PKG_TW, PKG_SP, PKG_GP, PKG_TCH, PKG_JH] },
  { id: 'video-ads', name: 'Video ads', description: 'Blocks in-stream video ads.', enabled: true, compatibleApps: [PKG_YT] },
  { id: 'video-quality', name: 'Video quality', description: 'Remembers resolution settings.', enabled: true, compatibleApps: [PKG_YT] },
  { id: 'wide-search-bar', name: 'Wide search bar', description: 'Optimizes search UI space.', enabled: false, compatibleApps: [PKG_YT] },

  // --- YOUTUBE MUSIC SPECIFIC ---
  { id: 'ytm-background-playback', name: 'Background playback', description: 'Listen with the screen off.', enabled: true, compatibleApps: [PKG_YTM] },
  { id: 'ytm-codecs-unlock', name: 'Codecs unlock', description: 'Enables high-fidelity audio.', enabled: true, compatibleApps: [PKG_YTM] },
  { id: 'ytm-exclusive-content', name: 'Unlock exclusive content', description: 'Access premium-only tracks.', enabled: true, compatibleApps: [PKG_YTM] },
  { id: 'ytm-premium-headings', name: 'Premium headings', description: 'Restores premium branding.', enabled: true, compatibleApps: [PKG_YTM] },

  // --- GOOGLE PHOTOS SPECIFIC (USER REQUESTED) ---
  { id: 'pixel-spoof', name: 'Pixel Spoof', description: 'Spoof device as Pixel XL to unlock unlimited original quality storage.', enabled: true, compatibleApps: [PKG_GP] },
  { id: 'unlimited-storage', name: 'Unlimited cloud storage', description: 'Enables unlimited backup for original quality photos.', enabled: true, compatibleApps: [PKG_GP] },

  // --- TIKTOK SPECIFIC ---
  { id: 'tiktok-ads', name: 'Remove Ads', description: 'Removes all feed and profile ads.', enabled: true, compatibleApps: [PKG_TT] },
  { id: 'tiktok-region-bypass', name: 'Region bypass', description: 'Access content from any country.', enabled: true, compatibleApps: [PKG_TT] },
  { id: 'tiktok-feed-filter', name: 'Feed Filter', description: 'Filters out unwanted hashtags.', enabled: true, compatibleApps: [PKG_TT] },

  // --- REDDIT SPECIFIC ---
  { id: 'reddit-ads', name: 'Hide Ads', description: 'Removes promoted posts.', enabled: true, compatibleApps: [PKG_RD] },
  { id: 'reddit-premium-icons', name: 'Premium Icons', description: 'Unlocks restricted app icons.', enabled: true, compatibleApps: [PKG_RD] },

  // --- SPOTIFY SPECIFIC ---
  { id: 'spotify-no-ads', name: 'Ad-free', description: 'Removes audio and visual ads.', enabled: true, compatibleApps: [PKG_SP] },
  { id: 'spotify-unlimited-skips', name: 'Unlimited Skips', description: 'Skip any track at any time.', enabled: true, compatibleApps: [PKG_SP] },

  // --- TWITCH SPECIFIC ---
  { id: 'twitch-adblock', name: 'Adblock', description: 'Removes in-stream Twitch ads.', enabled: true, compatibleApps: [PKG_TCH] }
];
