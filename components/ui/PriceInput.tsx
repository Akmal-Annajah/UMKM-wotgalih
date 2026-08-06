'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';

interface PriceInputProps {
  id: string;
  name: string;
  defaultValue?: number;
  required?: boolean;
  placeholder?: string;
}

export function PriceInput({ id, name, defaultValue, required, placeholder }: PriceInputProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const [display, setDisplay] = useState(defaultValue ? formatNumber(defaultValue) : '');
  const [rawValue, setRawValue] = useState(defaultValue?.toString() || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Strip semua non-digit
    const digits = e.target.value.replace(/\D/g, '');
    
    if (digits === '') {
      setDisplay('');
      setRawValue('');
      return;
    }

    const num = parseInt(digits, 10);
    setDisplay(formatNumber(num));
    setRawValue(num.toString());
  };

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500 font-medium pointer-events-none">Rp</span>
      <Input
        id={id}
        type="text"
        inputMode="numeric"
        value={display}
        onChange={handleChange}
        required={required}
        placeholder={placeholder || '10.000'}
        className="pl-10"
      />
      {/* Hidden input untuk mengirim nilai angka asli ke form */}
      <input type="hidden" name={name} value={rawValue} />
    </div>
  );
}
