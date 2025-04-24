
import { useState, useMemo } from 'react';
import { futuresContracts } from '@/constants/currencyPairs';

export const useContractFilter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const groupedContracts = useMemo(() => {
    const filterContracts = (contracts: Record<string, any>) => {
      return Object.entries(contracts).reduce((acc, [key, value]) => {
        if (key.toLowerCase().includes(searchTerm.toLowerCase())) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);
    };

    return {
      indices: filterContracts({
        'ES': futuresContracts['ES'],
        'NQ': futuresContracts['NQ'],
        'YM': futuresContracts['YM'],
        'RTY': futuresContracts['RTY']
      }),
      commodities: filterContracts({
        'CL': futuresContracts['CL'],
        'GC': futuresContracts['GC'],
        'SI': futuresContracts['SI'],
        'HG': futuresContracts['HG'],
        'NG': futuresContracts['NG']
      }),
      bonds: filterContracts({
        'ZB': futuresContracts['ZB']
      })
    };
  }, [searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    groupedContracts
  };
};
