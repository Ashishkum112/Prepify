import { useState, useEffect, useMemo } from 'react';
import TimerCard, { TimerState } from './components/TimerCard';
import { 
  Flame, 
  Calendar, 
  Mail, 
  Settings, 
  BookOpen, 
  ExternalLink, 
  Terminal, 
  CheckCircle2, 
  Circle, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  User, 
  RefreshCw,
  Clock,
  LogOut,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { PATTERNS_DATA } from './data';
import { 
  Pattern, 
  Question, 
  ProgressState, 
  StreakState, 
  AppConfig, 
  LogEntry,
  Difficulty
} from './types';

// --- Input Validation Helpers ---
const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email) && email.length <= 254;
};

const isValidUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const sanitizeString = (str: string): string => {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, 500); // Max 500 chars
};

export default function App() {
  // --- Config State ---
  const [config, setConfig] = useState<AppConfig>({
    googleClientId: "",
    calendarAutoBlock: true,
    emailReminders: false,
    calendarTargetName: "DSA Study Schedule",
    testEmail: "",
  });

  // --- Auth State ---
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    try {
      const token = localStorage.getItem('google_access_token');
      return (token && typeof token === 'string' && token.length > 0) ? token : null;
    } catch {
      return null;
    }
  });
  const [profile, setProfile] = useState<any | null>(() => {
    try {
      const saved = localStorage.getItem('google_profile');
      if (!saved || typeof saved !== 'string') return null;
      const parsed = JSON.parse(saved);
      return (parsed && typeof parsed === 'object' && parsed.name) ? parsed : null;
    } catch {
      return null;
    }
  });
  const [authLoading, setAuthLoading] = useState<boolean>(false);

  // --- Study Progress State ---
  const [progress, setProgress] = useState<ProgressState>(() => {
    try {
      const saved = localStorage.getItem('dsa_progress');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to parse progress:", e);
    }
    return {};
  });

  const [streak, setStreak] = useState<StreakState>(() => {
    try {
      const saved = localStorage.getItem('dsa_streak');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            currentStreak: typeof parsed.currentStreak === 'number' ? parsed.currentStreak : 0,
            streakDates: Array.isArray(parsed.streakDates) ? parsed.streakDates : [],
            lastSolvedDate: parsed.lastSolvedDate || undefined
          };
        } else if (typeof parsed === 'number') {
          return {
            currentStreak: parsed,
            streakDates: []
          };
        }
      }
    } catch (e) {
      console.error("Failed to parse streak:", e);
    }
    return {
      currentStreak: 0,
      streakDates: []
    };
  });

  // --- Dynamic Patterns State ---
  const [patterns, setPatterns] = useState<Pattern[]>(() => {
    try {
      const saved = localStorage.getItem('dsa_custom_patterns');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to parse custom patterns:", e);
    }
    return PATTERNS_DATA;
  });

  useEffect(() => {
    localStorage.setItem('dsa_custom_patterns', JSON.stringify(patterns));
  }, [patterns]);

  // --- Interactive UI States ---
  const [expandedPatterns, setExpandedPatterns] = useState<number[]>([0]);
  const [filterTag, setFilterTag] = useState<string>('All');
  const [filterDiff, setFilterDiff] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);

  // --- Custom Creator States ---
  const [showAddPatternForm, setShowAddPatternForm] = useState<boolean>(false);
  const [patternAddingQuestion, setPatternAddingQuestion] = useState<number | null>(null);
  
  // Custom Pattern Form fields
  const [newPatternName, setNewPatternName] = useState<string>('');
  const [newPatternTag, setNewPatternTag] = useState<string>('');
  const [newPatternDesc, setNewPatternDesc] = useState<string>('');
  const [newPatternIcon, setNewPatternIcon] = useState<string>('📁');

  // Custom Question Form fields
  const [newQName, setNewQName] = useState<string>('');
  const [newQDiff, setNewQDiff] = useState<Difficulty>('Easy');
  const [newQUrl, setNewQUrl] = useState<string>('');

  // --- Backend Logs & Execution Traces ---
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [logsLoading, setLogsLoading] = useState<boolean>(false);
  const [showConfigDrawer, setShowConfigDrawer] = useState<boolean>(false);
  const [toasts, setToasts] = useState<Array<{ id: string; text: string; type: 'success' | 'warn' | 'info' | 'error' }>>([]);

  // --- Timers (Productive Hours) ---
  const TIMER_STORAGE_KEY = 'prepify_timers';
  const defaultCategories = ['DSA', 'LLD', 'HLD', 'Interview Questions'];
  const [timers, setTimers] = useState<Record<string, TimerState>>(() => {
    try {
      const raw = localStorage.getItem(TIMER_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          // ensure all default categories exist
          const result: Record<string, TimerState> = {};
          defaultCategories.forEach(cat => {
            const v = parsed[cat];
            result[cat] = v && typeof v === 'object' ? {
              category: cat,
              elapsedMs: typeof v.elapsedMs === 'number' ? v.elapsedMs : 0,
              running: !!v.running,
              lastStartedAt: typeof v.lastStartedAt === 'number' ? v.lastStartedAt : null,
            } : { category: cat, elapsedMs: 0, running: false, lastStartedAt: null };
          });
          return result;
        }
      }
    } catch (e) {
      console.error('Failed to load timers', e);
    }
    const blank: Record<string, TimerState> = {};
    defaultCategories.forEach(cat => { blank[cat] = { category: cat, elapsedMs: 0, running: false, lastStartedAt: null }; });
    return blank;
  });

  useEffect(() => {
    try {
      localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(timers));
    } catch (e) {
      console.error('Failed to persist timers', e);
    }
  }, [timers]);

  const handleTimerChange = (s: TimerState) => {
    setTimers(prev => ({ ...prev, [s.category]: s }));
  };

  // --- Pattern & Question Handlers ---
  const handleAddPattern = () => {
    if (!newPatternName.trim() || !newPatternTag.trim()) {
      addToast("Pattern name and category tag are required fields!", "error");
      return;
    }
    const newIdx = patterns.length > 0 ? Math.max(...patterns.map(p => p.index)) + 1 : 0;
    const newPattern: Pattern = {
      index: newIdx,
      name: sanitizeString(newPatternName),
      tag: sanitizeString(newPatternTag),
      icon: newPatternIcon || "📁",
      description: sanitizeString(newPatternDesc) || "Custom learning pattern",
      questions: []
    };
    setPatterns(prev => [...prev, newPattern]);
    
    // Reset fields
    setNewPatternName('');
    setNewPatternTag('');
    setNewPatternDesc('');
    setNewPatternIcon('📁');
    setShowAddPatternForm(false);
    
    addToast(`✓ Custom pattern "${newPattern.name}" successfully created!`, "success");
  };

  const handleAddQuestionToPattern = (patternIndex: number) => {
    if (!newQName.trim()) {
      addToast("Question name cannot be blank!", "error");
      return;
    }
    
    const targetUrl = newQUrl.trim() || "https://leetcode.com";
    
    // Validate URL format
    if (!isValidUrl(targetUrl)) {
      addToast("Invalid URL format. Use https://... format.", "error");
      return;
    }
    
    setPatterns(prev => prev.map(p => {
      if (p.index === patternIndex) {
        const uniqueQId = `p${p.index}-qcustom-${Date.now()}`;
        const newQuestion: Question = {
          id: uniqueQId,
          name: sanitizeString(newQName),
          difficulty: newQDiff,
          url: targetUrl
        };
        return {
          ...p,
          questions: [...p.questions, newQuestion]
        };
      }
      return p;
    }));

    // Reset fields
    setNewQName('');
    setNewQDiff('Easy');
    setNewQUrl('');
    setPatternAddingQuestion(null);

    addToast(`✓ Custom question added to pattern successfully!`, "success");
  };

  // --- Load backend configurations on boot ---
  useEffect(() => {
    fetch("/api/config")
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (data && typeof data === 'object' && data.googleClientId) {
          setConfig(data);
        }
      })
      .catch(err => console.error("Config load error - using defaults"));

    refreshLogs();
    const logInterval = setInterval(() => {
      if (document.visibilityState === 'visible') refreshLogs();
    }, 15000);
    return () => clearInterval(logInterval);
  }, []);

  // --- Save states to cache on change ---
  useEffect(() => {
    localStorage.setItem('dsa_progress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('dsa_streak', JSON.stringify(streak));
  }, [streak]);

  const refreshLogs = async () => {
    try {
      setLogsLoading(true);
      const res = await fetch("/api/logs");
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (err) {
      console.error("Failed to load logs:", err);
    } finally {
      setLogsLoading(false);
    }
  };

  const addToast = (text: string, type: 'success' | 'warn' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const clearLogs = async () => {
    try {
      const res = await fetch("/api/logs/clear", { method: "POST" });
      if (res.ok) {
        addToast("Developer console logs cleared.", "info");
        refreshLogs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- Google OAuth popup triggers ---
  const initGoogleAuth = () => {
    const hasValidClientId = config.googleClientId.endsWith('.apps.googleusercontent.com') &&
      !config.googleClientId.includes('YOUR_') &&
      !config.googleClientId.includes('REPLACE_WITH');
    if (!hasValidClientId) {
      addToast("OAuth not configured. Please check with admin.", "error");
      return;
    }

    const google = (window as any).google;
    if (typeof google === 'undefined' || !google.accounts) {
      addToast("Loading authentication. Please wait...", "info");
      setTimeout(() => initGoogleAuth(), 2000);
      return;
    }

    try {
      setAuthLoading(true);
      const client = google.accounts.oauth2.initTokenClient({
        client_id: config.googleClientId,
        scope: "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
        callback: async (response: any) => {
          if (response.access_token) {
            setAccessToken(response.access_token);
            localStorage.setItem('google_access_token', response.access_token);

            // Fetch profile
            try {
              const profileRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
                headers: { "Authorization": `Bearer ${response.access_token}` }
              });
              if (profileRes.ok) {
                const profileData = await profileRes.json();
                setProfile(profileData);
                localStorage.setItem('google_profile', JSON.stringify(profileData));
                addToast(`Welcome back, ${profileData.name}!`, "success");
              } else {
                addToast("Authentication successful. Redirecting...", "info");
                setProfile({ name: "User" });
              }
            } catch (err) {
              console.error("Profile retrieval error");
              setProfile({ name: "User" });
            }
            refreshLogs();
          } else {
            addToast("Authentication cancelled.", "warn");
          }
          setAuthLoading(false);
        }
      });
      client.requestAccessToken({ prompt: "consent" });
    } catch (err: any) {
      console.error("GSI initialization error");
      addToast(`Authentication failed. Try refreshing the page.`, "error");
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setAccessToken(null);
    setProfile(null);
    localStorage.removeItem('google_access_token');
    localStorage.removeItem('google_profile');
    addToast("Logged out of Google Space successfully.", "info");
  };

  // --- Config Drawer updates ---
  const saveConfig = async (newConfig: AppConfig) => {
    // Validate config before saving
    if (newConfig.testEmail && !isValidEmail(newConfig.testEmail)) {
      addToast("Invalid email address format.", "error");
      return;
    }
    
    if (newConfig.googleClientId && !newConfig.googleClientId.endsWith('.apps.googleusercontent.com')) {
      addToast("Invalid Google Client ID format. Should end with .apps.googleusercontent.com", "warn");
    }

    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newConfig),
      });
      if (res.ok) {
        const data = await res.json();
        // Don't log the client ID for security
        setConfig(data.config);
        addToast("Settings successfully applied to background worker.", "success");
        refreshLogs();
      } else {
        const data = await res.json().catch(() => null);
        addToast(data?.error || "Could not save settings.", "error");
      }
    } catch (err) {
      console.error("Config save error (details not logged for security)");
      addToast("Could not reach the settings service.", "error");
    }
  };

  // --- Compute question spaced repetition review target dates ---
  const calculateSpacedDates = (solvedDateStr: string) => {
    const base = new Date(solvedDateStr);
    const addDays = (d: number) => {
      const copy = new Date(base.getTime());
      copy.setDate(copy.getDate() + d);
      return copy.toISOString().split('T')[0];
    };
    return {
      d1: addDays(1),
      d7: addDays(7),
      d14: addDays(14)
    };
  };

  // --- Toggling solved checklists with race condition protection ---
  const toggleSolved = async (q: Question, _patternIdx: number) => {
    const questionId = q.id;
    const isSolved = !progress[questionId]?.solved;
    const todayStr = new Date().toISOString().split('T')[0];
    const notesValue = progress[questionId]?.note || "";

    addToast(isSolved ? `🎉 Resolved: "${q.name}"` : `Marked Unchecked: "${q.name}"`, isSolved ? "success" : "info");

    // Use functional setState to prevent race conditions
    setProgress(prevProgress => {
      let updatedProgress: ProgressState = { ...prevProgress };
      const integrationRequests: Promise<Response>[] = [];

      if (isSolved) {
        const calculated = calculateSpacedDates(todayStr);
        updatedProgress[questionId] = {
          solved: true,
          note: notesValue,
          solvedAt: todayStr,
          spacedRepetitionDate1: calculated.d1,
          spacedRepetitionDate7: calculated.d7,
          spacedRepetitionDate14: calculated.d14
        };

        // --- Trigger Spaced Calendar auto blocks on back-end server ---
        if (config.calendarAutoBlock && config.googleClientId && config.googleClientId.endsWith('.apps.googleusercontent.com')) {
          integrationRequests.push(
            fetch("/api/calendar/block", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                accessToken: accessToken || "MOCK_TOKEN",
                questionName: q.name.trim(),
                difficulty: q.difficulty,
                url: q.url,
                intervals: [1, 7, 14]
              })
            }).catch(err => {
              console.error("Calendar block failed:", err);
              addToast("Calendar sync failed (will retry)", "warn");
              return null;
            })
          );
        }

        // --- Trigger Mail Alert dispatch on backend ---
        if (config.emailReminders && config.testEmail && isValidEmail(config.testEmail)) {
          integrationRequests.push(
            fetch("/api/gmail/send", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                accessToken: accessToken || "MOCK_TOKEN",
                questionName: q.name.trim(),
                difficulty: q.difficulty,
                url: q.url,
                targetDay: 1
              })
            }).catch(err => {
              console.error("Email send failed:", err);
              addToast("Email sync failed (will retry)", "warn");
              return null;
            })
          );
        }

        // Update streaks state
        let updatedDates = Array.isArray(streak?.streakDates) ? [...streak.streakDates] : [];
        if (!updatedDates.includes(todayStr)) {
          updatedDates.push(todayStr);
        }
        
        // Calculate consecutive current streak
        const currentStreak = computeStreakCount(updatedDates);

        setStreak({
          currentStreak,
          lastSolvedDate: todayStr,
          streakDates: updatedDates
        });

      } else {
        updatedProgress[questionId] = {
          solved: false,
          note: notesValue,
          solvedAt: undefined,
          spacedRepetitionDate1: undefined,
          spacedRepetitionDate7: undefined,
          spacedRepetitionDate14: undefined
        };
      }

      // Trigger async operations after state update
      if (integrationRequests.length > 0) {
        Promise.allSettled(integrationRequests.filter(r => r !== null)).then(refreshLogs);
      }

      return updatedProgress;
    });
  };

  const saveNote = (questionId: string, text: string) => {
    setProgress(prev => ({
      ...prev,
      [questionId]: {
        ...(prev[questionId] || { solved: false }),
        note: text
      }
    }));
  };

  const triggerManualTestSpaced = async (q: Question, reviewDay: number) => {
    // Validate question data before sending
    if (!q.name || !q.difficulty || !isValidUrl(q.url)) {
      addToast("Invalid question data. Cannot trigger alert.", "error");
      return;
    }

    addToast(`Force triggering study alert for Day ${reviewDay}: "${q.name}"`, "info");
    try {
      // Calendar Event Send simulation
      await fetch("/api/calendar/block", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessToken: accessToken || "MOCK_TOKEN",
          questionName: sanitizeString(q.name),
          difficulty: q.difficulty,
          url: q.url,
          intervals: [reviewDay]
        })
      }).catch(err => {
        console.error("Calendar block error");
        addToast("Calendar sync failed", "warn");
      });

      // Email dispatch simulation
      await fetch("/api/gmail/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessToken: accessToken || "MOCK_TOKEN",
          questionName: sanitizeString(q.name),
          difficulty: q.difficulty,
          url: q.url,
          targetDay: reviewDay
        })
      }).catch(err => {
        console.error("Gmail send error");
        addToast("Email sync failed", "warn");
      });

      refreshLogs();
    } catch (err) {
      console.error("Test trigger error");
      addToast("Testing trigger failed to hit mock server.", "error");
    }
  };

  // Helper calculation of active streak
  const computeStreakCount = (dates: string[]) => {
    if (dates.length === 0) return 0;
    const sorted = [...dates].sort((a,b) => new Date(b).getTime() - new Date(a).getTime());
    let streak = 0;
    let expected = new Date(); // Start from today
    expected.setHours(0,0,0,0);

    // If last entry isn't today or yesterday, streak is broken
    const lastEntryStr = sorted[0];
    const lastDate = new Date(lastEntryStr);
    lastDate.setHours(0,0,0,0);
    const diffDays = Math.floor((expected.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays > 1) {
      return 0;
    }

    let tracker = new Date(lastDate);
    for (let i = 0; i < sorted.length; i++) {
      const cur = new Date(sorted[i]);
      cur.setHours(0,0,0,0);
      
      const diff = Math.floor((tracker.getTime() - cur.getTime()) / (1000 * 60 * 60 * 24));
      if (diff === 0) {
        streak++;
        tracker.setDate(tracker.getDate() - 1); // anticipate yesterday
      } else if (diff === 1) {
        // Gap of exactly 1 day, user continuous
        streak++;
        tracker = cur;
        tracker.setDate(tracker.getDate() - 1);
      } else if (diff > 1) {
        break;
      }
    }
    return streak;
  };

  // Force-increment streak manual debug action
  const forceMarkTodayCompleted = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    let updatedDates = Array.isArray(streak?.streakDates) ? [...streak.streakDates] : [];
    if (!updatedDates.includes(todayStr)) {
      updatedDates.push(todayStr);
    }
    const currentStreak = computeStreakCount(updatedDates);
    setStreak({
      currentStreak,
      lastSolvedDate: todayStr,
      streakDates: updatedDates
    });
    addToast("🔥 Completed! Marked daily learning target completed for today.", "success");
  };

  // --- Filtering Analytics ---
  const activeTags = useMemo(() => Array.from(new Set(patterns.map(p => p.tag))), [patterns]);

  const totalQuestionsChecked = Object.values(progress).filter((p: any) => p.solved).length;
  const totalQuestionsCount = patterns.reduce((acc, p) => acc + (p.questions?.length || 0), 0) || 120;
  const overallCompletedPercentage = Math.min(100, Math.round((totalQuestionsChecked / totalQuestionsCount) * 100));

  const completedPatternsCount = patterns.filter(pattern => {
    const qIds = pattern.questions.map(q => q.id);
    return qIds.length > 0 && qIds.every(id => progress[id]?.solved);
  }).length;

  const filteredPatterns = useMemo(() => patterns.filter(pattern => {
    // 1. Tag filter matching
    if (filterTag !== 'All' && pattern.tag !== filterTag) {
      return false;
    }

    // 2. Pattern contains questions matching criteria
    const questionsMatching = pattern.questions.filter(q => {
      // Search text fit
      const textFit = q.name.toLowerCase().includes(searchTerm.toLowerCase());
      if (!textFit) return false;

      // Difficulty fit
      if (filterDiff !== 'All' && q.difficulty !== filterDiff) {
        return false;
      }

      // Solved status fit
      const solved = progress[q.id]?.solved || false;
      if (filterStatus === 'Completed' && !solved) return false;
      if (filterStatus === 'Unsolved' && solved) return false;

      return true;
    });

    return questionsMatching.length > 0;
  }), [patterns, filterTag, filterDiff, filterStatus, searchTerm, progress]);

  const toggleExpandPattern = (idx: number) => {
    if (expandedPatterns.includes(idx)) {
      setExpandedPatterns(prev => prev.filter(p => p !== idx));
    } else {
      setExpandedPatterns(prev => [...prev, idx]);
    }
  };

  // Retrieve upcoming spaced repetition schedule reviews
  const getUpcomingReviews = () => {
    const items: Array<{ id: string; name: string; date: string; dayNo: 1 | 7 | 14; url: string }> = [];
    Object.entries(progress).forEach(([qId, rawData]) => {
      const data = rawData as any;
      if (data && data.solved) {
        // find question name
        let matchedQ: Question | null = null;
        patterns.forEach(p => {
          const found = p.questions.find(q => q.id === qId);
          if (found) matchedQ = found;
        });

        if (matchedQ) {
          const mq = matchedQ as Question;
          if (data.spacedRepetitionDate1) items.push({ id: qId, name: mq.name, date: data.spacedRepetitionDate1, dayNo: 1, url: mq.url });
          if (data.spacedRepetitionDate7) items.push({ id: qId, name: mq.name, date: data.spacedRepetitionDate7, dayNo: 7, url: mq.url });
          if (data.spacedRepetitionDate14) items.push({ id: qId, name: mq.name, date: data.spacedRepetitionDate14, dayNo: 14, url: mq.url });
        }
      }
    });

    const nowStr = new Date().toISOString().split('T')[0];
    return items
      .filter(item => item.date >= nowStr)
      .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 10);
  };

  const upcomingReviews = useMemo(getUpcomingReviews, [progress, patterns]);

  // --- Render login screen if not authenticated ---
  if (!profile) {
    return (
      <div className="min-h-screen bg-brand-bg text-[#e8e8f0] font-sans antialiased flex items-center justify-center p-4">
        {/* Login Screen */}
        <div className="w-full max-w-md">
          <div className="bg-brand-surface border border-brand-border rounded-3xl p-12 flex flex-col items-center gap-8 shadow-2xl">
            {/* Logo */}
            <div className="w-16 h-16 bg-gradient-to-br from-brand-accent to-brand-accent2 rounded-2xl flex items-center justify-center font-display font-black text-2xl text-white shadow-lg shadow-brand-accent/30">
              P
            </div>

            {/* Title & Description */}
            <div className="text-center flex flex-col gap-3">
              <h1 className="text-4xl font-display font-black tracking-tight bg-gradient-to-r from-brand-accent to-brand-accent2 bg-clip-text text-transparent">
                Prepify
              </h1>
              <p className="text-sm text-slate-400">Master DSA patterns with spaced repetition</p>
            </div>

            {/* Features List */}
            <div className="w-full flex flex-col gap-3">
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <div className="w-5 h-5 rounded-full bg-brand-accent/20 flex items-center justify-center">
                  <span className="text-brand-accent text-[10px] font-bold">✓</span>
                </div>
                <span>Track 150+ curated DSA problems</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <div className="w-5 h-5 rounded-full bg-brand-accent/20 flex items-center justify-center">
                  <span className="text-brand-accent text-[10px] font-bold">✓</span>
                </div>
                <span>Spaced repetition scheduling</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <div className="w-5 h-5 rounded-full bg-brand-accent/20 flex items-center justify-center">
                  <span className="text-brand-accent text-[10px] font-bold">✓</span>
                </div>
                <span>Google Calendar & Email integration</span>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-brand-border to-transparent"></div>

            {/* Login Button */}
            <button
              onClick={initGoogleAuth}
              disabled={authLoading}
              className="w-full py-3 px-6 bg-gradient-to-r from-brand-accent to-brand-accent2 hover:from-brand-accent/90 hover:to-brand-accent2/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-brand-accent/25"
            >
              {authLoading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8m3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5m-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11m3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" fill="currentColor"/>
                  </svg>
                  <span>Sign in with Google</span>
                </>
              )}
            </button>

            {/* Footer */}
            <p className="text-[11px] text-slate-500 text-center">
              By signing in, you agree to our terms of service and privacy policy
            </p>
          </div>
        </div>

        {/* Toast notifications */}
        <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
          {toasts.map(toast => (
            <div 
              key={toast.id} 
              className={`px-4 py-3 rounded-lg shadow-2xl border flex items-center gap-3 backdrop-blur-md animate-fade-in pointer-events-auto transition-all ${
                toast.type === 'success' ? 'bg-[#112519]/90 text-emerald-300 border-emerald-500/40' :
                toast.type === 'error' ? 'bg-[#291414]/90 text-red-300 border-red-500/40' :
                toast.type === 'warn' ? 'bg-[#2a1e12]/90 text-amber-300 border-amber-500/40' :
                'bg-[#121c2c]/90 text-indigo-300 border-indigo-500/40'
              }`}
            >
              <div className={`w-2 h-2 rounded-full animate-ping ${
                toast.type === 'success' ? 'bg-emerald-400' :
                toast.type === 'error' ? 'bg-red-400' :
                toast.type === 'warn' ? 'bg-amber-400' :
                'bg-indigo-400'
              }`} />
              <span className="text-xs font-medium tracking-wide">{toast.text}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- Main App (authenticated users) ---
  return (
    <div className="min-h-screen bg-brand-bg text-[#e8e8f0] font-sans antialiased flex flex-col selection:bg-brand-accent selection:text-white">
      {/* Toast popup panel */}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className={`px-4 py-3 rounded-lg shadow-2xl border flex items-center gap-3 backdrop-blur-md animate-fade-in pointer-events-auto transition-all ${
              toast.type === 'success' ? 'bg-[#112519]/90 text-emerald-300 border-emerald-500/40' :
              toast.type === 'error' ? 'bg-[#291414]/90 text-red-300 border-red-500/40' :
              toast.type === 'warn' ? 'bg-[#2a1e12]/90 text-amber-300 border-amber-500/40' :
              'bg-[#121c2c]/90 text-indigo-300 border-indigo-500/40'
            }`}
          >
            <div className={`w-2 h-2 rounded-full animate-ping ${
              toast.type === 'success' ? 'bg-emerald-400' :
              toast.type === 'error' ? 'bg-red-400' :
              toast.type === 'warn' ? 'bg-amber-400' :
              'bg-indigo-400'
            }`} />
            <span className="text-xs font-medium tracking-wide">{toast.text}</span>
          </div>
        ))}
      </div>

      {/* Main Header */}
      <header className="h-16 border-b border-brand-border px-3 md:px-6 flex items-center justify-between glass-blur sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-brand-accent to-brand-accent2 rounded-xl flex items-center justify-center font-display font-black text-white shadow-lg shadow-brand-accent/20">
            P
          </div>
          <div>
            <h1 className="text-sm md:text-base font-display font-black tracking-tight uppercase flex items-center gap-2 bg-gradient-to-r from-brand-accent to-brand-accent2 bg-clip-text text-transparent">
              Prepify
              <span className="hidden sm:inline text-[9px] uppercase font-mono px-2 py-0.5 rounded-full border border-brand-border bg-brand-bg font-normal text-slate-400">
                DSA Master v2
              </span>
            </h1>
            <p className="hidden md:block text-[10px] text-slate-500 italic">Spaced Repetition Study Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* User profile with Google OAuth indicator */}
          <div className="flex items-center gap-2 md:gap-3 border border-brand-border bg-brand-surface px-2 md:px-3 py-1.5 rounded-xl">
            {profile ? (
              <>
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-[11px] font-semibold text-slate-200">{profile.name}</span>
                  <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                    GOOGLE CONNECTED
                  </span>
                </div>
                {profile.picture ? (
                  <img src={profile.picture} alt={profile.name} className="w-8 h-8 rounded-full border border-emerald-500" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center font-bold text-xs" referrerPolicy="no-referrer">
                    {profile.name[0]}
                  </div>
                )}
                <button 
                  onClick={handleLogout}
                  title="Disconnect Google OAuth"
                  className="text-slate-400 hover:text-rose-400 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button 
                onClick={initGoogleAuth}
                className="text-xs font-semibold px-3 py-1 bg-white hover:bg-slate-100 text-slate-950 rounded-lg flex items-center gap-2 transition"
              >
                <User className="w-3.5 h-3.5 fill-slate-950" />
                <span className="hidden sm:inline">Sign In with Google</span>
              </button>
            )}
          </div>

          <button 
            onClick={() => setShowConfigDrawer(!showConfigDrawer)}
            className="p-2 border border-brand-border rounded-xl bg-brand-surface text-slate-300 hover:text-white hover:border-brand-accent transition"
            title="Configure notifications, test email and client options"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Split Dashboard Content */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-3 md:px-6 py-4 md:py-6 flex flex-col gap-6">
        
        {/* Dynamic Global Settings Drawer (Toggled from settings cog) */}
        {showConfigDrawer && (
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 flex flex-col gap-6 animate-fade-in">
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-brand-accent" />
                <h3 className="font-display font-semibold text-sm uppercase tracking-wide">Study Engine Settings</h3>
              </div>
              <button 
                onClick={() => setShowConfigDrawer(false)}
                className="text-slate-400 hover:text-white text-xs font-semibold"
              >
                ✕ Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono uppercase text-slate-400">Target Notification Mail Address</label>
                <input 
                  type="email"
                  value={config.testEmail}
                  onChange={e => setConfig({...config, testEmail: e.target.value})}
                  className="bg-brand-bg border border-brand-border rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:border-brand-accent focus:outline-none"
                  placeholder="e.g. you@example.com"
                />
                <span className="text-[9px] text-slate-500 italic">Receives study reminders when review alerts are scheduled.</span>
              </div>

              <div className="flex flex-col justify-center gap-4 pt-1">
                <div className="flex items-center justify-between border-b border-brand-border/40 pb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-brand-accent2" />
                    <span className="text-xs font-medium">Auto-schedule Google Calendar Blocks</span>
                  </div>
                  <input 
                    type="checkbox"
                    checked={config.calendarAutoBlock}
                    onChange={e => setConfig({...config, calendarAutoBlock: e.target.checked})}
                    className="accent-brand-accent2 cursor-pointer w-4 h-4"
                  />
                </div>

                <div className="flex items-center justify-between border-b border-brand-border/40 pb-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-yellow-400" />
                    <span className="text-xs font-medium">Email Study Reminders</span>
                  </div>
                  <input 
                    type="checkbox"
                    checked={config.emailReminders}
                    onChange={e => setConfig({...config, emailReminders: e.target.checked})}
                    className="accent-brand-accent cursor-pointer w-4 h-4"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-2 border-t border-brand-border/50 pt-3">
              <button 
                onClick={() => saveConfig(config)}
                className="bg-brand-accent hover:bg-brand-accent/90 text-white font-semibold text-xs px-4 py-2 rounded-xl transition"
              >
                Save Settings Configuration
              </button>
            </div>
          </div>
        )}

        {/* Global Study Metrics Panel */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-4 flex flex-col justify-between">
            <span className="text-[10px] font-display uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-brand-accent" />
              Patterns Completed
            </span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-2xl font-mono font-bold text-brand-accent2">{completedPatternsCount}</span>
              <span className="text-xs text-slate-500">/ {patterns.length} Patterns</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Patterns with 10/10 questions solved</p>
          </div>

          <div className="bg-brand-surface border border-brand-border rounded-2xl p-4 flex flex-col justify-between">
            <span className="text-[10px] font-display uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-brand-accent2" />
              Total Checklist Solved
            </span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-2xl font-mono font-bold text-brand-accent">{totalQuestionsChecked}</span>
              <span className="text-xs text-slate-500">/ {totalQuestionsCount} Core Problems</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Checked on LeetCode</p>
          </div>

          <div className="bg-brand-surface border border-brand-border rounded-2xl p-4 flex flex-col justify-between">
            <span className="text-[10px] font-display uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              Consecutive Study Streak
            </span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-2xl font-mono font-bold text-amber-500">{streak.currentStreak}</span>
              <span className="text-xs text-slate-400">Days 🔥</span>
            </div>
            <button 
              onClick={forceMarkTodayCompleted}
              className="text-[9px] font-mono text-brand-accent font-semibold text-left hover:text-white mt-1 underline"
            >
              Force Check Today
            </button>
          </div>

          <div className="bg-brand-surface border border-brand-border rounded-2xl p-4 flex flex-col justify-between">
            <span className="text-[10px] font-display uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-yellow-400" />
              Spaced Calendar Blocks
            </span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-2xl font-mono font-bold text-slate-200">{overallCompletedPercentage}%</span>
              <span className="text-xs text-slate-500">Overall Track</span>
            </div>
            <div className="w-full h-1.5 bg-brand-bg rounded-full overflow-hidden mt-2">
              <div className="h-full bg-brand-accent transition-all duration-300" style={{ width: `${overallCompletedPercentage}%` }}></div>
            </div>
          </div>
        </section>

        {/* Productive Time Tracker Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {['DSA','LLD','HLD','Interview Questions'].map(cat => (
            <div key={cat} className="flex">
              <TimerCard
                initial={timers[cat] || { category: cat, elapsedMs: 0, running: false, lastStartedAt: null }}
                onChange={handleTimerChange}
              />
            </div>
          ))}
        </section>

        {/* Dynamic Google OAuth Setup Banner - REMOVED */}
        {/* Google OAuth is now configured via environment variables for security */}

        {/* Dashboard Navigation Filter Bar */}
        <section className="bg-brand-surface border border-brand-border rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 max-w-sm w-full bg-brand-bg border border-brand-border rounded-xl px-3 py-1.5">
            <Search className="w-4 h-4 text-slate-500" />
            <input 
              type="text"
              placeholder="Search problem name globally..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-transparent border-none text-xs text-slate-200 outline-none w-full"
            />
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            {/* Filter Tags pills */}
            <div className="flex items-center gap-1 overflow-x-auto py-1 whitespace-nowrap">
              <button 
                onClick={() => setFilterTag('All')}
                className={`text-[10px] px-2.5 py-1.5 rounded-lg border font-mono tracking-tight font-medium transition cursor-pointer ${
                  filterTag === 'All' ? 'bg-brand-accent/25 bd border-brand-accent text-brand-accent' : 'bg-brand-bg text-slate-400 border-brand-border/60 hover:text-slate-200'
                }`}
              >
                All Tags
              </button>
              {activeTags.map((tag, idx) => (
                <button 
                  key={idx}
                  onClick={() => setFilterTag(tag)}
                  className={`text-[10px] px-2.5 py-1.5 rounded-lg border font-mono tracking-tight font-medium transition cursor-pointer ${
                    filterTag === tag ? 'bg-brand-accent/25 border-brand-accent text-brand-accent' : 'bg-brand-bg text-slate-400 border-brand-border/60 hover:text-slate-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Difficulty filtration */}
            <div className="flex rounded-xl bg-brand-bg border border-brand-border p-0.5">
              {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
                <button 
                  key={diff}
                  onClick={() => setFilterDiff(diff)}
                  className={`text-[10px] px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                    filterDiff === diff ? 'bg-brand-surface border border-brand-border text-white' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            {/* Solved filtration status */}
            <div className="flex rounded-xl bg-brand-bg border border-brand-border p-0.5">
              {['All', 'Unsolved', 'Completed'].map((status) => (
                <button 
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`text-[10px] px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                    filterStatus === status ? 'bg-brand-surface border border-brand-border text-white' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Custom Create Button */}
            <button
              onClick={() => setShowAddPatternForm(!showAddPatternForm)}
              className={`text-[10px] px-3.5 py-2 font-semibold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                showAddPatternForm 
                  ? 'bg-rose-950/40 border border-rose-500/30 text-rose-400' 
                  : 'bg-brand-accent text-white shadow-md shadow-brand-accent/20 hover:bg-brand-accent/90'
              }`}
            >
              <span>{showAddPatternForm ? '✕ Cancel Creator' : '＋ Add Custom Pattern'}</span>
            </button>
          </div>
        </section>

        {/* Collapsible Add Custom Pattern Form Panel */}
        {showAddPatternForm && (
          <div className="bg-brand-surface border border-brand-accent/35 rounded-2xl p-5 flex flex-col gap-4 animate-fade-in ring-1 ring-brand-accent/10">
            <div className="flex items-center justify-between border-b border-brand-border/60 pb-2">
              <span className="text-xs font-display font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
                Configure New Algorithm Pattern
              </span>
              <span className="text-[10px] font-mono text-slate-500 font-semibold">Will start at pattern index #{patterns.length}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 animate-fade-in">
              <div className="md:col-span-4 flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-mono text-slate-400 font-medium">Pattern Name</label>
                <input 
                  type="text"
                  placeholder="e.g. Backtracking, Greedy, Prefix Sum"
                  value={newPatternName}
                  onChange={e => setNewPatternName(e.target.value)}
                  className="bg-brand-bg border border-brand-border rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-brand-accent focus:outline-none"
                />
              </div>

              <div className="md:col-span-3 flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-mono text-slate-400 font-medium">Category / Tag</label>
                <input 
                  type="text"
                  placeholder="e.g. Recursion, Arrays, Math"
                  value={newPatternTag}
                  onChange={e => setNewPatternTag(e.target.value)}
                  className="bg-brand-bg border border-brand-border rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-brand-accent focus:outline-none"
                />
              </div>

              <div className="md:col-span-2 flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-mono text-slate-400 font-medium">Icon Emoji</label>
                <select 
                  value={newPatternIcon}
                  onChange={e => setNewPatternIcon(e.target.value)}
                  className="bg-brand-bg border border-brand-border rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-brand-accent focus:outline-none"
                >
                  <option value="📁">📁 Folder</option>
                  <option value="🌳">🌳 Tree</option>
                  <option value="🥞">🥞 Stack/Heap</option>
                  <option value="🔍">🔍 Search</option>
                  <option value="🎯">🎯 Target/DP</option>
                  <option value="⛓">⛓ Link/List</option>
                  <option value="🧬">🧬 Math/Graph</option>
                  <option value="⚡">⚡ Fast/Slow</option>
                  <option value="🧩">🧩 Miscellaneous</option>
                </select>
              </div>

              <div className="md:col-span-3 flex flex-col justify-end">
                <button 
                  onClick={handleAddPattern}
                  className="bg-brand-accent hover:bg-brand-accent/90 text-white font-semibold text-xs py-2 px-4 rounded-xl shadow-lg shadow-brand-accent/25 transition cursor-pointer"
                >
                  Create Pattern Card
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-mono text-slate-400 font-medium">Study Strategy Description</label>
              <textarea 
                rows={1}
                placeholder="Give a short summary of when and why to pick this study pattern..."
                value={newPatternDesc}
                onChange={e => setNewPatternDesc(e.target.value)}
                className="bg-brand-bg border border-brand-border rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-brand-accent focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Workspace Matrix split body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main pattern checklist grid (L: 8cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            
            {filteredPatterns.length === 0 ? (
              <div className="bg-brand-surface border border-brand-border rounded-2xl p-12 flex flex-col items-center justify-center text-center gap-3">
                <span className="text-3xl">🏜</span>
                <h3 className="text-sm font-display font-medium">No results match filters</h3>
                <p className="text-xs text-slate-500">There are no study patterns matching your selected search terms or difficulty configurations.</p>
                <div className="flex gap-2.5">
                  <button 
                    onClick={() => {setSearchTerm(''); setFilterTag('All'); setFilterDiff('All'); setFilterStatus('All');}}
                    className="bg-brand-bg border border-brand-border text-xs px-4 py-2 rounded-xl text-brand-accent hover:text-white transition cursor-pointer"
                  >
                    Reset Active Filters
                  </button>
                </div>
              </div>
            ) : (
              filteredPatterns.map((pattern: Pattern) => {
                const isExpanded = expandedPatterns.includes(pattern.index);
                const qIds = pattern.questions.map(q => q.id);
                const solvedCount = qIds.filter(id => progress[id]?.solved).length;
                const progressPercent = pattern.questions.length > 0 ? Math.round((solvedCount / pattern.questions.length) * 100) : 0;

                return (
                  <div 
                    key={pattern.index}
                    className={`bg-brand-surface border rounded-2xl overflow-hidden transition-all duration-300 ${
                      isExpanded ? 'border-brand-accent/60 ring-1 ring-brand-accent/20' : 'border-brand-border hover:border-brand-accent/35'
                    }`}
                  >
                    {/* Header Banner expanded block bar */}
                    <div 
                      onClick={() => toggleExpandPattern(pattern.index)}
                      className="p-4 flex items-center justify-between cursor-pointer select-none hover:bg-brand-surface2/40 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-bg rounded-xl flex items-center justify-center text-lg border border-brand-border/60">
                          {pattern.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-display font-semibold text-sm text-slate-100">{pattern.name}</h4>
                            <span className="text-[9px] font-mono tracking-wider text-slate-400 bg-brand-bg border border-brand-border px-1.5 py-0.5 rounded-full uppercase">
                              {pattern.tag}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 leading-normal">{pattern.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                          <span className="text-xs font-mono font-bold text-slate-300">
                            {solvedCount} <span className="text-[10px] text-slate-500">/ {pattern.questions.length}</span>
                          </span>
                          <div className="w-20 h-1 bg-brand-bg rounded-full overflow-hidden mt-1">
                            <div className="h-full bg-brand-accent transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
                          </div>
                        </div>

                        <div>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Table of Checklist Questions */}
                    {isExpanded && (
                      <div className="border-t border-brand-border bg-brand-bg/40 divide-y divide-brand-border/40">
                        {pattern.questions
                          .filter(q => {
                            if (filterDiff !== 'All' && q.difficulty !== filterDiff) return false;
                            const solved = progress[q.id]?.solved || false;
                            if (filterStatus === 'Completed' && !solved) return false;
                            if (filterStatus === 'Unsolved' && solved) return false;
                            if (searchTerm && !q.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
                            return true;
                          })
                          .map((q: Question) => {
                            const isSolved = progress[q.id]?.solved || false;
                            const questionNote = progress[q.id]?.note || "";

                            return (
                              <div 
                                key={q.id}
                                className={`p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between transition ${
                                  isSolved ? 'bg-brand-accent/5' : 'hover:bg-brand-surface2/20'
                                }`}
                              >
                                <div className="flex items-start gap-3 flex-1">
                                  {/* Custom solved indicator checkbox */}
                                  <button 
                                    onClick={() => toggleSolved(q, pattern.index)}
                                    className="pt-0.5 cursor-pointer text-slate-500 hover:text-brand-accent2 transition"
                                  >
                                    {isSolved ? (
                                      <CheckCircle2 className="w-5 h-5 text-brand-accent2 stroke-[2.5]" />
                                    ) : (
                                      <Circle className="w-5 h-5 hover:border-brand-accent2 text-slate-600" />
                                    )}
                                  </button>

                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="text-xs font-medium text-slate-100">{q.name}</span>
                                      
                                      <span className={`text-[9px] px-1.5 py-0.5 font-mono font-medium rounded ${
                                        q.difficulty === 'Easy' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20' :
                                        q.difficulty === 'Medium' ? 'bg-amber-950/40 text-amber-500 border border-amber-500/20' :
                                        'bg-rose-950/30 text-rose-400 border border-rose-500/20'
                                      }`}>
                                        {q.difficulty}
                                      </span>

                                      <a 
                                        href={q.url} 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-slate-500 hover:text-slate-300 inline-flex items-center gap-0.5 transition hover:underline"
                                      >
                                        <ExternalLink className="w-3 h-3" />
                                        <span className="text-[9px] font-mono leading-none">Practice</span>
                                      </a>
                                    </div>

                                    {/* Spaced Dates Display Block */}
                                    {isSolved && (
                                      <div className="flex flex-wrap gap-2.5 mt-2 text-[10px] text-slate-400 font-mono">
                                        <span className="text-brand-accent">Spaced repeat dates:</span>
                                        <span className="flex items-center gap-0.5 border border-brand-border/80 bg-brand-bg px-1.5 py-0.5 rounded">
                                          1d: {progress[q.id]?.spacedRepetitionDate1}
                                        </span>
                                        <span className="flex items-center gap-0.5 border border-brand-border/80 bg-brand-bg px-1.5 py-0.5 rounded">
                                          7d: {progress[q.id]?.spacedRepetitionDate7}
                                        </span>
                                        <span className="flex items-center gap-0.5 border border-brand-border/80 bg-brand-bg px-1.5 py-0.5 rounded">
                                          14d: {progress[q.id]?.spacedRepetitionDate14}
                                        </span>
                                      </div>
                                    )}

                                    {/* Inline study helper notes textarea */}
                                    <div className="mt-2.5">
                                      <input 
                                        type="text"
                                        className="w-full bg-brand-bg border border-brand-border/65 rounded-xl px-2.5 py-1 text-[10px] text-slate-400 focus:text-slate-200 focus:border-brand-accent focus:outline-none focus:ring-0"
                                        placeholder="Add quick study notes, complexity (e.g. O(N)), or approach details..."
                                        value={questionNote}
                                        onChange={e => saveNote(q.id, e.target.value)}
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Direct Trigger Testing Panel */}
                                <div className="flex gap-1.5 mt-2 md:mt-0">
                                  <button 
                                    onClick={() => triggerManualTestSpaced(q, 1)}
                                    className="text-[9px] font-mono border border-brand-border bg-brand-surface py-1 px-2 rounded-lg text-slate-400 hover:text-yellow-400 hover:border-yellow-500/40 transition cursor-pointer"
                                    title="Manual testing: send email & block schedule for 1 Day review"
                                  >
                                    Test Alert
                                  </button>
                                </div>
                              </div>
                            );
                          })}

                        {/* Interactive Dynamic Form to Append Custom Question to this pattern */}
                        <div className="p-4 bg-brand-surface/20 border-t border-brand-border/40">
                          {patternAddingQuestion === pattern.index ? (
                            <div className="bg-brand-bg/90 border border-brand-border/80 rounded-xl p-4 flex flex-col gap-3 animate-fade-in text-left">
                              <h5 className="text-[10px] uppercase font-mono tracking-wider text-brand-accent font-bold">Add Custom Question to "{pattern.name}"</h5>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="flex flex-col gap-1 md:col-span-2">
                                  <label className="text-[9px] font-mono text-slate-400 uppercase">Problem Title / Name</label>
                                  <input 
                                    type="text"
                                    placeholder="e.g. Spiral Matrix, LRU Cache..."
                                    value={newQName}
                                    onChange={e => setNewQName(e.target.value)}
                                    className="bg-brand-surface border border-brand-border rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:border-brand-accent focus:outline-none"
                                  />
                                </div>
                                <div className="flex flex-col gap-1">
                                  <label className="text-[9px] font-mono text-slate-400 uppercase">Difficulty</label>
                                  <select
                                    value={newQDiff}
                                    onChange={e => setNewQDiff(e.target.value as Difficulty)}
                                    className="bg-brand-surface border border-brand-border rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:border-brand-accent focus:outline-none"
                                  >
                                    <option value="Easy">🟢 Easy</option>
                                    <option value="Medium">🟡 Medium</option>
                                    <option value="Hard">🔴 Hard</option>
                                  </select>
                                </div>
                              </div>

                              <div className="flex flex-col gap-1">
                                <label className="text-[9px] font-mono text-slate-400 uppercase">LeetCode / Practice URL</label>
                                <input 
                                  type="text"
                                  placeholder="https://leetcode.com/problems/your-problem-name"
                                  value={newQUrl}
                                  onChange={e => setNewQUrl(e.target.value)}
                                  className="bg-brand-surface border border-brand-border rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:border-brand-accent focus:outline-none"
                                />
                              </div>

                              <div className="flex gap-2 justify-end mt-1">
                                <button 
                                  onClick={() => setPatternAddingQuestion(null)}
                                  className="px-3.5 py-1.5 bg-brand-surface text-slate-400 hover:text-white rounded-lg text-xs font-semibold border border-brand-border transition cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button 
                                  onClick={() => handleAddQuestionToPattern(pattern.index)}
                                  className="px-4 py-1.5 bg-brand-accent text-white hover:bg-brand-accent/90 rounded-lg text-xs font-semibold shadow-md shadow-brand-accent/20 transition cursor-pointer"
                                >
                                  Add Question
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button 
                              onClick={() => {
                                setPatternAddingQuestion(pattern.index);
                                setNewQName('');
                                setNewQUrl('');
                                setNewQDiff('Easy');
                              }}
                              className="text-[11px] font-mono font-medium text-slate-400 hover:text-brand-accent inline-flex items-center gap-1.5 transition select-none cursor-pointer py-1"
                            >
                              <span>＋ Add Practice Question to this pattern</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Spaced repeat schedule & Logger Sidebar (R: 4cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Spaced rep study calendar panel */}
            <div className="bg-brand-surface border border-brand-border rounded-2xl p-4 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-brand-border/60 pb-2">
                <span className="text-xs font-display font-semibold tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-brand-accent2" />
                  Upcoming Study Reminders
                </span>
                <span className="text-[10px] bg-brand-bg py-0.5 px-2 rounded-full font-mono text-slate-400">
                  {upcomingReviews.length} Scheduled
                </span>
              </div>

              {upcomingReviews.length === 0 ? (
                <div className="p-4 bg-brand-bg/50 border border-brand-border rounded-xl text-center flex flex-col items-center gap-1.5">
                  <span className="text-xl">🎓</span>
                  <p className="text-[10px] text-slate-400">Review schedule clean!</p>
                  <p className="text-[9px] text-slate-500 italic">Complete questions to calculate study slots.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
                  {upcomingReviews.map((item, idx) => (
                    <div key={idx} className="bg-brand-bg/60 border border-brand-border rounded-xl p-2.5 flex flex-col gap-1 hover:border-brand-accent2/20 transition">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-slate-200 truncate max-w-[150px]">{item.name}</span>
                        <span className="text-[9px] uppercase font-mono px-1.5 bg-brand-accent/20 border border-brand-accent/30 rounded text-brand-accent">
                          Day {item.dayNo}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
                        <span>Due: {item.date}</span>
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-brand-accent2 hover:underline">Link</a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Background worker Console log */}
            <div className="bg-brand-surface border border-brand-border rounded-2xl overflow-hidden flex flex-col">
              <div className="bg-brand-surface2/60 border-b border-brand-border p-3 flex items-center justify-between">
                <span className="text-xs font-display font-semibold tracking-wide flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-brand-accent" />
                  Integration Trace logs
                </span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={refreshLogs}
                    className="p-1 hover:bg-brand-surface rounded text-slate-400 hover:text-white transition cursor-pointer"
                    title="Refresh Log Feed"
                  >
                    <RefreshCw className={`w-3 h-3 ${logsLoading ? 'animate-spin text-brand-accent' : ''}`} />
                  </button>
                  <button 
                    onClick={clearLogs}
                    className="text-[9px] bg-brand-bg text-slate-500 hover:text-rose-400 border border-brand-border px-1.5 py-0.5 rounded cursor-pointer transition"
                  >
                    Clear Logs
                  </button>
                </div>
              </div>

              <div className="bg-[#07070a] p-3 font-mono text-[9px] text-[#4fffb0]/85 h-80 overflow-y-auto flex flex-col gap-2 leading-relaxed">
                {logs.length === 0 ? (
                  <span className="text-slate-600 italic">No execution traces. Click checkboxes or trigger test alerts above to populate database transactions...</span>
                ) : (
                  logs.map(log => (
                    <div key={log.id} className="border-b border-brand-border/20 pb-1.5">
                      <div className="flex items-center justify-between text-slate-500 text-[8px] mb-0.5">
                        <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                        <span className={`uppercase font-medium text-[7px] border px-1 rounded ${
                          log.type === 'calendar' ? 'border-[#4fffb0]/30 text-[#4fffb0]' :
                          log.type === 'email' ? 'border-yellow-400/30 text-yellow-500' :
                          log.type === 'oauth' ? 'border-brand-accent/30 text-brand-accent' :
                          'border-slate-500/30 text-slate-400'
                        }`}>
                          {log.type}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap">{log.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Spaced guidelines instructions card */}
            <div className="bg-brand-surface border border-brand-border rounded-2xl p-4 text-xs flex flex-col gap-2 relative overflow-hidden">
              <div className="absolute right-[-10px] bottom-[-15px] text-5xl opacity-5 select-none font-bold">DSA</div>
              <h4 className="font-display font-semibold text-brand-accent flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Spaced Repetition Rules
              </h4>
              <p className="text-slate-400 text-[10px] leading-relaxed">
                Scientific memory algorithms require studying a completed pattern card 
                after <strong>1 Day</strong>, <strong>7 Days</strong>, and <strong>14 Days</strong> to bypass the Ebbinghaus Forgetting Curve.
              </p>
              <ul className="text-[10px] text-slate-500 list-disc list-inside mt-1 flex flex-col gap-1 leading-normal">
                <li>Automatic Google Calendar blocking</li>
                <li>Optional Gmail schedule confirmations</li>
                <li>Comprehensive {patterns.length} patterns × {totalQuestionsCount} curated questions tracking</li>
              </ul>
            </div>

          </div>

        </div>

      </div>

      {/* Main App Footer */}
      <footer className="min-h-12 border-t border-brand-border mt-auto px-3 md:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[10px] font-mono text-slate-500 glass-blur">
        <span>STREAK: {streak.currentStreak} DAYS • SOLVED: {totalQuestionsChecked}/{totalQuestionsCount}</span>
        <span className="truncate max-w-full">RECIPIENT: {config.testEmail || "Not configured"}</span>
      </footer>
    </div>
  );
}
