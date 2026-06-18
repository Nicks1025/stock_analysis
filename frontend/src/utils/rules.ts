/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ValidationRule = (value: any) => true | string;

export const rules = {
  required: (label: string = 'Field'): ValidationRule => 
    (v) => (v !== undefined && v !== null && v !== '') || `${label} is required`,
    
  email: (): ValidationRule => 
    (v) => {
      if (!v) return true;
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email';
    },
    
  minLength: (n: number): ValidationRule => 
    (v) => {
      if (!v) return true;
      return v.length >= n || `Minimum ${n} characters required`;
    },
    
  maxLength: (n: number): ValidationRule => 
    (v) => {
      if (!v) return true;
      return v.length <= n || `Maximum ${n} characters allowed`;
    },
    
  numeric: (): ValidationRule => 
    (v) => {
      if (!v) return true;
      return /^\d+$/.test(v) || 'Only numbers allowed';
    },
    
  positiveNumber: (): ValidationRule => 
    (v) => {
      if (v === undefined || v === null || v === '') return true;
      const num = parseFloat(v);
      return (!isNaN(num) && num > 0) || 'Must be a positive number';
    },
    
  phone: (): ValidationRule => 
    (v) => {
      if (!v) return true;
      return /^\+?[\d\s\-()]{7,15}$/.test(v) || 'Enter a valid phone number';
    },
    
  password: (): ValidationRule => 
    (v) => {
      if (!v) return true;
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(v) || 
        'Password must be 8+ chars with upper, lower, number & special char';
    },
    
  confirmPassword: (pwd: string): ValidationRule => 
    (v) => v === pwd || 'Passwords do not match',
    
  url: (): ValidationRule => 
    (v) => {
      if (!v) return true;
      return /^https?:\/\/.+/.test(v) || 'Enter a valid URL';
    },
    
  panCard: (): ValidationRule => 
    (v) => {
      if (!v) return true;
      return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v) || 'Enter a valid PAN';
    },
    
  pinCode: (): ValidationRule => 
    (v) => {
      if (!v) return true;
      return /^\d{6}$/.test(v) || 'Enter a valid 6-digit PIN code';
    }
};
