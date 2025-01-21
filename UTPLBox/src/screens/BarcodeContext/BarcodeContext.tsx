// BarcodeContext.tsx
import React, { createContext, useContext, useState } from 'react';

type BarcodeContextType = {
    barcode: string;
    setBarcode: (value: string) => void;
};

const BarcodeContext = createContext<BarcodeContextType | undefined>(undefined);

export const BarcodeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [barcode, setBarcode] = useState('');
    return (
        <BarcodeContext.Provider value={{ barcode, setBarcode }}>
            {children} 
        </BarcodeContext.Provider>
    );
};

export const useBarcode = () => {
    const context = useContext(BarcodeContext);
    if (!context) {
        throw new Error('useBarcode must be used within a BarcodeProvider');
    }
    return context;
};

