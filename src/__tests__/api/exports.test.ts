/**
 * @fileoverview Package exports tests
 * @description Tests to ensure all public APIs are exported correctly
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

describe('Package Exports', () => {
  it('exports atomic components', async () => {
    const expo = await import('../../index');
    expect(expo.Button).toBeDefined();
    expect(expo.Text).toBeDefined();
    expect(expo.Card).toBeDefined();
    expect(expo.Input).toBeDefined();
    expect(expo.Stack).toBeDefined();
  });

  it('exports CRUD components', async () => {
    const expo = await import('../../index');
    expect(expo.EntityFormRenderer).toBeDefined();
    expect(expo.EntityDisplayRenderer).toBeDefined();
    expect(expo.EntityFilters).toBeDefined();
  });

  it('exports feature packages from @donotdev/expo/features', async () => {
    // Features are optional — imported from separate entry point (Item 96)
    const features = await import('../../features');
    // Auth
    expect(features.AuthPartnerButton).toBeDefined();
    expect(features.LoginModal).toBeDefined();
    expect(features.useAuth).toBeDefined();
    // Billing
    expect(features.ProductCard).toBeDefined();
    expect(features.useStripeBilling).toBeDefined();
    // OAuth
    expect(features.MultipleOAuthProviders).toBeDefined();
    expect(features.useOAuth).toBeDefined();
  });

  it('exports storage strategies', async () => {
    const expo = await import('../../index');
    expect(expo.AsyncStorageStrategy).toBeDefined();
    expect(expo.zustandAsyncStorage).toBeDefined();
    expect(expo.getZustandAsyncStorage).toBeDefined();
  });

  it('exports providers', async () => {
    const expo = await import('../../index');
    expect(expo.ExpoAppProviders).toBeDefined();
  });

  it('exports routing hooks', async () => {
    const expo = await import('../../index');
    expect(expo.useNavigate).toBeDefined();
    expect(expo.useLocation).toBeDefined();
    expect(expo.useParams).toBeDefined();
    expect(expo.useSearchParams).toBeDefined();
    expect(expo.Link).toBeDefined();
  });

  it('exports Firebase utilities', async () => {
    const expo = await import('../../index');
    expect(expo.initializeExpoAuth).toBeDefined();
  });
});
