import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'Pyramid',
  description: 'Task management, built for focus.',
};

// Runs before React hydrates so the correct theme/accent classes are
// present on first paint — prevents a flash of the default (light/blue)
// theme before ThemeProvider's useEffect runs.
const noFlashScript = `
(function () {
  try {
    var mode = localStorage.getItem('pyramid-theme-mode') || 'light';
    var color = localStorage.getItem('pyramid-theme-color') || 'blue';
    document.documentElement.classList.add(mode, 'accent-' + color);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
      </head>
      <body>
        <AuthProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
