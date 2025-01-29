// BarcodeContext.tsx
import React, { createContext, useContext, useState } from 'react';

type BarcodeContextType = {
    barcode: string;
    setBarcode: (barcode: string) => void;
    componentesVerificados: Componente[];
    agregarComponenteVerificado: (componente: Componente) => void;
};

type Componente = {
    id: string;
    nombre: string;
    cantidad: number;
    limite: number;
    estado: 'Perfecto Estado' | 'Buen Estado (Usado)' | 'Defectuoso' | 'Obsoleto';
    codigo?: string;
    fecha: string;
    hora: string;
    descripcion: string;
    image: string;
};

const BarcodeContext = createContext<BarcodeContextType>({
    barcode: '',
    setBarcode: () => {},
    componentesVerificados: [],
    agregarComponenteVerificado: () => {},
});

export const BarcodeProvider = ({ children }: { children: React.ReactNode }) => {
    const [barcode, setBarcode] = useState('');
    const [componentesVerificados, setComponentesVerificados] = useState<Componente[]>([]);

    const agregarComponenteVerificado = (componente: Componente) => {
        setComponentesVerificados([...componentesVerificados, componente]);
    };

    return (
        <BarcodeContext.Provider value={{ barcode, setBarcode, componentesVerificados, agregarComponenteVerificado }}>
            {children}
        </BarcodeContext.Provider>
    );
};

export const useBarcode = () => useContext(BarcodeContext);
