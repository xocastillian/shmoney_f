import { z } from 'zod';
import {
  AuthResponseSchema,
  RefreshRequestSchema,
  TelegramAuthRequestSchema,
  UserResponseSchema,
  WalletResponseSchema,
  WalletCreateRequestSchema,
  WalletUpdateRequestSchema,
  WalletTransactionRequestSchema,
  WalletTransactionResponseSchema,
  CurrencyResponseSchema,
  ExchangeRateResponseSchema,
  CurrencyConversionResponseSchema,
} from './schemas';

export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type RefreshRequest = z.infer<typeof RefreshRequestSchema>;
export type TelegramAuthRequest = z.infer<typeof TelegramAuthRequestSchema>;

export type UserResponse = z.infer<typeof UserResponseSchema>;
export type WalletResponse = z.infer<typeof WalletResponseSchema>;
export type WalletCreateRequest = z.infer<typeof WalletCreateRequestSchema>;
export type WalletUpdateRequest = z.infer<typeof WalletUpdateRequestSchema>;

export type WalletTransactionRequest = z.infer<typeof WalletTransactionRequestSchema>;
export type WalletTransactionResponse = z.infer<typeof WalletTransactionResponseSchema>;

export type CurrencyResponse = z.infer<typeof CurrencyResponseSchema>;
export type ExchangeRateResponse = z.infer<typeof ExchangeRateResponseSchema>;
export type CurrencyConversionResponse = z.infer<typeof CurrencyConversionResponseSchema>;
