import { create } from 'zustand';
import { WellDrillingData } from '@/types/drilling';
import { mockWellDrillingData, updateDrillingData } from '@/mocks/drillingData';

interface DrillingState {
  wells: WellDrillingData[];
  selectedWellId: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchWells: () => Promise<void>;
  updateWellData: () => void;
  selectWell: (wellId: string) => void;
  
  // Chart display options
  chartTimeframe: 'last-hour' | 'last-6-hours' | 'last-day';
  setChartTimeframe: (timeframe: 'last-hour' | 'last-6-hours' | 'last-day') => void;
  
  // Parameter display options
  selectedParameters: string[];
  toggleParameter: (parameter: string) => void;
}

export const useDrillingStore = create<DrillingState>((set, get) => ({
  wells: [],
  selectedWellId: null,
  isLoading: false,
  error: null,
  chartTimeframe: 'last-6-hours',
  selectedParameters: ['rop', 'wob', 'torque', 'rpm'],
  
  fetchWells: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set({
        wells: mockWellDrillingData,
        isLoading: false,
        selectedWellId: mockWellDrillingData[0]?.wellId || null,
      });
    } catch (error) {
      set({ 
        error: 'Failed to fetch well drilling data',
        isLoading: false 
      });
    }
  },
  
  updateWellData: () => {
    const { wells } = get();
    if (wells.length === 0) return;
    
    const updatedWells = updateDrillingData(wells);
    set({ wells: updatedWells });
  },
  
  selectWell: (wellId: string) => {
    set({ selectedWellId: wellId });
  },
  
  setChartTimeframe: (timeframe) => {
    set({ chartTimeframe: timeframe });
  },
  
  toggleParameter: (parameter) => {
    set(state => {
      const isSelected = state.selectedParameters.includes(parameter);
      
      if (isSelected) {
        // Don't remove if it's the last parameter
        if (state.selectedParameters.length <= 1) {
          return state;
        }
        return {
          selectedParameters: state.selectedParameters.filter(p => p !== parameter)
        };
      } else {
        return {
          selectedParameters: [...state.selectedParameters, parameter]
        };
      }
    });
  }
}));