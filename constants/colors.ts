// Color palette for the Oil and Gas RIGs Station app
const lightTheme = {
  primary: {
    main: '#0A4D68', // Deep teal
    light: '#088395',
    dark: '#05BFDB',
  },
  secondary: {
    main: '#00A9A5', // Teal
    light: '#4FD1C5',
    dark: '#008B87',
  },
  accent: {
    orange: '#FF7E33',
    red: '#E53E3E',
    green: '#38A169',
    yellow: '#ECC94B',
  },
  neutral: {
    white: '#FFFFFF',
    lightGray: '#E2E8F0',
    gray: '#718096',
    darkGray: '#2D3748',
    black: '#1A202C',
  },
  background: {
    primary: '#F7FAFC', // Light background
    secondary: '#EDF2F7',
    card: '#FFFFFF',
  },
  text: {
    primary: '#1A202C',
    secondary: '#4A5568',
    disabled: '#A0AEC0',
  },
  status: {
    success: '#38A169',
    warning: '#ECC94B',
    danger: '#E53E3E',
    info: '#3182CE',
    normal: '#718096',
  },
  shadow: {
    light: 'rgba(0, 0, 0, 0.05)',
    medium: 'rgba(0, 0, 0, 0.1)',
    dark: 'rgba(0, 0, 0, 0.15)',
  },
  gradient: {
    primary: ['#0A4D68', '#088395'],
    secondary: ['#00A9A5', '#4FD1C5'],
  }
};

const darkTheme = {
  primary: {
    main: '#0A2647', // Dark blue
    light: '#144272',
    dark: '#051C3B',
  },
  secondary: {
    main: '#00A9A5', // Teal
    light: '#4FD1C5',
    dark: '#008B87',
  },
  accent: {
    orange: '#FF7E33',
    red: '#E53E3E',
    green: '#38A169',
    yellow: '#ECC94B',
  },
  neutral: {
    white: '#FFFFFF',
    lightGray: '#E2E8F0',
    gray: '#718096',
    darkGray: '#2D3748',
    black: '#1A202C',
  },
  background: {
    primary: '#0F172A', // Dark blue background
    secondary: '#1E293B',
    card: '#1A2234',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#A0AEC0',
    disabled: '#718096',
  },
  status: {
    success: '#38A169',
    warning: '#ECC94B',
    danger: '#E53E3E',
    info: '#3182CE',
    normal: '#718096',
  },
  shadow: {
    light: 'rgba(0, 0, 0, 0.2)',
    medium: 'rgba(0, 0, 0, 0.4)',
    dark: 'rgba(0, 0, 0, 0.6)',
  },
  gradient: {
    primary: ['#0A2647', '#144272'],
    secondary: ['#00A9A5', '#4FD1C5'],
  }
};

export { lightTheme, darkTheme };

// Default export will be replaced by the theme provider
export default darkTheme;