export type ProviderType = 'elos' | 'evup';

export interface ProviderConfig {
  name: string;
  baseUrl: string;
  loginPath: string;
  timezone: string;
}

export interface ProvidersConfig {
  current: ProviderType;
  providers: {
    elos: ProviderConfig;
    evup: ProviderConfig;
  };
}
