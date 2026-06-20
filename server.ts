import "dotenv/config";
import express from "express";
import path from "path";
import type { AppConfig, LogEntry } from "./src/types";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.disable("x-powered-by");
app.use(express.json({ limit: "32kb" }));
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
});

// Memory-based databases for config and backend simulation logs
let backendConfig: AppConfig = {
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  calendarAutoBlock: true,
  emailReminders: Boolean(process.env.DEFAULT_REMINDER_EMAIL),
  calendarTargetName: "DSA Study Schedule",
  testEmail: process.env.DEFAULT_REMINDER_EMAIL || "",
};

let transactionLogs: LogEntry[] = [
  {
    id: "sys-0",
    timestamp: new Date().toISOString(),
    type: "system",
    message: "DSA Pattern Tracker background worker initialized successfully.",
  },
  {
    id: "sys-1",
    timestamp: new Date().toISOString(),
    type: "system",
    message: "Spaced Repetition intervals configured securely: 1-Day, 7-Day, and 14-Day.",
  }
];

// POST logs
const addLog = (type: 'calendar' | 'email' | 'system' | 'oauth', message: string) => {
  const newLog: LogEntry = {
    id: `${type}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    type,
    message,
  };
  transactionLogs.unshift(newLog);
  // Keep last 100 logs
  if (transactionLogs.length > 100) {
    transactionLogs.pop();
  }
};

// API: Get app settings configuration
app.get("/api/config", (req, res) => {
  res.json(backendConfig);
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", uptime: Math.round(process.uptime()) });
});

// API: Save settings configuration
app.post("/api/config", (req, res) => {
  const googleClientId = typeof req.body.googleClientId === "string" ? req.body.googleClientId.trim() : backendConfig.googleClientId;
  const testEmail = typeof req.body.testEmail === "string" ? req.body.testEmail.trim() : backendConfig.testEmail;

  if (googleClientId && !/^[\w-]+\.apps\.googleusercontent\.com$/.test(googleClientId)) {
    res.status(400).json({ success: false, error: "Enter a valid Google OAuth web client ID." });
    return;
  }
  if (testEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail)) {
    res.status(400).json({ success: false, error: "Enter a valid reminder email address." });
    return;
  }
  if (req.body.emailReminders === true && !testEmail) {
    res.status(400).json({ success: false, error: "Add a recipient email before enabling email notifications." });
    return;
  }

  backendConfig = {
    ...backendConfig,
    googleClientId,
    testEmail,
    calendarAutoBlock: typeof req.body.calendarAutoBlock === "boolean" ? req.body.calendarAutoBlock : backendConfig.calendarAutoBlock,
    emailReminders: typeof req.body.emailReminders === "boolean" ? req.body.emailReminders : backendConfig.emailReminders,
    calendarTargetName: typeof req.body.calendarTargetName === "string" ? req.body.calendarTargetName.slice(0, 100) : backendConfig.calendarTargetName,
  };
  addLog("system", `System configuration updated: Calendar Auto-Block: ${backendConfig.calendarAutoBlock}, Email Reminders: ${backendConfig.emailReminders}.`);
  res.json({ success: true, config: backendConfig });
});

// API: Retrieve transaction execution logs
app.get("/api/logs", (req, res) => {
  res.json(transactionLogs);
});

// API: Clear simulation logs
app.post("/api/logs/clear", (req, res) => {
  transactionLogs = [
    {
      id: "sys-reset",
      timestamp: new Date().toISOString(),
      type: "system",
      message: "Developer log console cleared by user.",
    }
  ];
  res.json({ success: true });
});

// API: Block Calendar with spaced repetition slots
app.post("/api/calendar/block", async (req, res) => {
  const { accessToken, questionName, difficulty, url, intervals } = req.body;
  addLog("system", `Scheduling spaced review timeline for: "${questionName}" (${difficulty})`);

  // Parse provided intervals or default
  const days = intervals || [1, 7, 14];

  const results: any[] = [];
  const now = new Date();

  for (const day of days) {
    const targetDate = new Date();
    targetDate.setDate(now.getDate() + day);
    const dateStr = targetDate.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    const formattedDate = targetDate.toISOString().split('T')[0];

    let eventCreated = false;
    let externalEventId = null;

    if (accessToken && accessToken !== "MOCK_TOKEN") {
      try {
        // Build Google Calendar Event Payload
        const eventPayload = {
          summary: `[DSA Repeat] ${questionName} (${difficulty})`,
          description: `Time to review: ${questionName}\nDifficulty: ${difficulty}\nLeetCode Link: ${url}\n\nScheduled automatically via your DSA Pattern Tracker.`,
          start: {
            date: formattedDate,
          },
          end: {
            date: formattedDate,
          },
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'email', minutes: 24 * 60 },
              { method: 'popup', minutes: 30 }
            ]
          }
        };

        const googleRes = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventPayload),
        });

        if (googleRes.ok) {
          const eventData: any = await googleRes.json();
          eventCreated = true;
          externalEventId = eventData.id;
          addLog("calendar", `✓ [Real Calendar Blocked] Event scheduled successfully in primary calendar for ${dateStr} (Day ${day} review). Event ID: ${externalEventId}`);
        } else {
          const errText = await googleRes.text();
          console.error("Google Calendar Error Response:", errText);
          addLog("calendar", `⚠️ [Calendar API Error] Couldnot schedule real OAuth event for Day ${day}. Error details logged on backend. Falling back to simulator.`);
        }
      } catch (err: any) {
        console.error("Calendar scheduling error:", err);
        addLog("calendar", `⚠️ [Calendar Connect Error] Network fault for Day ${day}. Falling back to simulation.`);
      }
    }

    // fallback simulation
    if (!eventCreated) {
      addLog("calendar", `[Calendar Emulated] Automatically blocked Calendar slot on ${dateStr} for reviewing "${questionName}" (${difficulty}).`);
    }

    results.push({
      day,
      date: formattedDate,
      emulated: !eventCreated,
      eventId: externalEventId,
    });
  }

  res.json({ success: true, blocks: results });
});

// API: Send a Gmail confirmation after scheduling a review
app.post("/api/gmail/send", async (req, res) => {
  const { accessToken, questionName, difficulty, url, targetDay } = req.body;
  const recipientEmail = backendConfig.testEmail;

  if (!recipientEmail) {
    res.status(400).json({ success: false, error: "A recipient email is required." });
    return;
  }

  addLog("system", `Drafting active Gmail study notification for "${questionName}"`);

  let gmailSent = false;

  const emailSubject = `🚀 DSA review scheduled: ${questionName} (${difficulty})`;
  const emailBody = `Hi there,\n\nYour Day ${targetDay} spaced-repetition review has been scheduled.\n\n📚 Question: ${questionName}\n⚡ Difficulty: ${difficulty}\n🔗 Practice here: ${url}\n\nYour Google Calendar event carries the actual due-date reminder.\n\nBest,\nYour DSA Pattern Tracker Bot 🤖`;

  if (accessToken && accessToken !== "MOCK_TOKEN") {
    try {
      // Build MIME RFC 2822 Email Body for raw Gmail sending
      const utf8Subject = `=?utf-8?B?${Buffer.from(emailSubject).toString('base64')}?=`;
      const emailParts = [
        `To: ${recipientEmail}`,
        `Subject: ${utf8Subject}`,
        'Content-Type: text/plain; charset="utf-8"',
        'MIME-Version: 1.0',
        'Content-Transfer-Encoding: 7bit',
        '',
        emailBody
      ];
      const encodedMessage = Buffer.from(emailParts.join('\r\n'))
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const googleRes = await fetch("https://www.googleapis.com/gmail/v1/users/me/messages/send", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ raw: encodedMessage }),
      });

      if (googleRes.ok) {
        addLog("email", `✓ [Real RFC-2822 Gmail Sent] Spaced repetition alert dispatched to ${recipientEmail} for question: "${questionName}"`);
        gmailSent = true;
      } else {
        const errText = await googleRes.text();
        console.error("Gmail send error:", errText);
        addLog("email", `⚠️ [Gmail API Fail] Failed to transmit real alert to recipient. Falling back to backend mock queue.`);
      }
    } catch (err) {
      console.error("Gmail networking fault:", err);
      addLog("email", `⚠️ [Gmail Network Error] Unable to dispatch mail via Google OAuth API. Falling back to background emulator.`);
    }
  }

  if (!gmailSent) {
    addLog("email", `[Email Emulated] Successfully dispatched simulated study alert to [${recipientEmail}] for Day ${targetDay} review: "${questionName}"`);
  }

  res.json({ success: true, emulated: !gmailSent });
});

async function startServer() {
  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, {
      setHeaders: (res, filePath) => {
        if (filePath.includes(`${path.sep}assets${path.sep}`)) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        } else {
          res.setHeader("Cache-Control", "no-cache");
        }
      }
    }));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[FULL-STACK BACKEND] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
