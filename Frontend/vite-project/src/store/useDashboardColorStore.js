import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useDashboardColorStore = create(
  persist(
    (set) => ({
      dashboardColor: 'blue', // Default color
      
      setDashboardColor: (color) => set({ dashboardColor: color }),
      
      colors: {
        blue: {
          primary: '#0066ff',
          secondary: '#0052cc',
          accent: '#0080ff',
          gradient: 'linear-gradient(135deg, #0066ff 0%, #0080ff 100%)',
        },
        purple: {
          primary: '#7c3aed',
          secondary: '#6d28d9',
          accent: '#a78bfa',
          gradient: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
        },
        pink: {
          primary: '#ff006e',
          secondary: '#d9005b',
          accent: '#ff4d94',
          gradient: 'linear-gradient(135deg, #ff006e 0%, #ff4d94 100%)',
        },
        green: {
          primary: '#00d084',
          secondary: '#00a35d',
          accent: '#5fdfae',
          gradient: 'linear-gradient(135deg, #00d084 0%, #5fdfae 100%)',
        },
        orange: {
          primary: '#ff7d00',
          secondary: '#e67e00',
          accent: '#ffb84d',
          gradient: 'linear-gradient(135deg, #ff7d00 0%, #ffb84d 100%)',
        },
        red: {
          primary: '#ff0033',
          secondary: '#cc0029',
          accent: '#ff4d6d',
          gradient: 'linear-gradient(135deg, #ff0033 0%, #ff4d6d 100%)',
        },
        cyan: {
          primary: '#00d9ff',
          secondary: '#00a8cc',
          accent: '#50e3c2',
          gradient: 'linear-gradient(135deg, #00d9ff 0%, #50e3c2 100%)',
        },
      },
    }),
    {
      name: 'dashboard-color-storage',
    }
  )
);
