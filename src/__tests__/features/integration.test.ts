/**
 * @fileoverview Feature package integration tests
 * @description Tests to ensure feature packages work correctly with Expo components
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

// Mock feature packages
jest.mock('@donotdev/auth', () => ({
  useAuth: jest.fn((key: string) => {
    if (key === 'user') return null;
    if (key === 'isAvailable') return true;
    if (key === 'signInWithPartner') return jest.fn();
    if (key === 'linkWithPartner') return jest.fn();
    return null;
  }),
  useDeleteAccount: jest.fn(() => ({
    deleteAccount: jest.fn(),
    status: 'idle',
  })),
  getAuthState: jest.fn(() => ({ user: null })),
  subscribeToAuth: jest.fn(() => jest.fn()),
}));

jest.mock('@donotdev/billing', () => ({
  useStripeBilling: jest.fn((key: string) => {
    if (key === 'checkout')
      return jest.fn(() => Promise.resolve('https://checkout.stripe.com'));
    if (key === 'status') return 'ready';
    if (key === 'subscription') return null;
    if (key === 'manageSubscription')
      return jest.fn(() => Promise.resolve('https://billing.stripe.com'));
    return null;
  }),
}));

jest.mock('@donotdev/oauth', () => ({
  useOAuth: jest.fn(() => ({
    connect: jest.fn(),
    status: 'idle',
  })),
}));

describe('Feature Package Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Auth components', () => {
    it('exports auth components', async () => {
      const auth = await import('../../features/auth');
      expect(auth.AuthPartnerButton).toBeDefined();
      expect(auth.LoginModal).toBeDefined();
      expect(auth.MultipleAuthProviders).toBeDefined();
      expect(auth.FeatureGuard).toBeDefined();
    });

    it('exports auth hooks', async () => {
      const auth = await import('../../features/auth');
      expect(auth.useAuth).toBeDefined();
      expect(auth.useDeleteAccount).toBeDefined();
    });
  });

  describe('Billing components', () => {
    it('exports billing components', async () => {
      const billing = await import('../../features/billing');
      expect(billing.ProductCard).toBeDefined();
      expect(billing.StripeCheckoutButton).toBeDefined();
      expect(billing.SecurityNotice).toBeDefined();
      expect(billing.SubscriptionManager).toBeDefined();
    });

    it('exports billing hooks', async () => {
      const billing = await import('../../features/billing');
      expect(billing.useStripeBilling).toBeDefined();
    });
  });

  describe('OAuth components', () => {
    it('exports OAuth components', async () => {
      const oauth = await import('../../features/oauth');
      expect(oauth.MultipleOAuthProviders).toBeDefined();
      expect(oauth.OAuthConnectionModal).toBeDefined();
      expect(oauth.OAuthFallback).toBeDefined();
      expect(oauth.OAuthPartnerButton).toBeDefined();
    });

    it('exports OAuth hooks', async () => {
      const oauth = await import('../../features/oauth');
      expect(oauth.useOAuth).toBeDefined();
    });
  });

  describe('CRUD components', () => {
    it('exports CRUD components', async () => {
      const crud = await import('../../crud');
      expect(crud.EntityFormRenderer).toBeDefined();
      expect(crud.EntityDisplayRenderer).toBeDefined();
      expect(crud.EntityFilters).toBeDefined();
      expect(crud.FormFieldRenderer).toBeDefined();
      expect(crud.DisplayFieldRenderer).toBeDefined();
    });
  });
});
