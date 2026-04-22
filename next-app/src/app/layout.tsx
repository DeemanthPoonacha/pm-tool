import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { can, getUser, roleLabels, PERMISSIONS } from "@/lib/permissions";
import { AppNav } from "@/components/layout/AppNav";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { getProjectTeam } from "@/lib/projects";
import { getProject } from "@/lib/projects";
import { getNotifications } from "@/lib/changes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PM Tool",
  description: "Product Management Tool",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;
  
  let user = undefined;
  if (sessionId) {
    // For now, check if we have the session data in localStorage on client
    user = undefined; // Will be handled by client-side auth
  }

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-950">
        <ScriptInjection />
      </body>
    </html>
  );
}

function ScriptInjection() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function initTheme() {
            const theme = localStorage.getItem('theme');
            if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          })();
        `
      }}
    />
  );
}
