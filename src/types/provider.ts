export type ProviderType = 'elos' | 'evup' | 'botosense';

export interface ProviderConfig {
  name: string;
  baseUrl: string;
  loginPath: string;
  timezone: string;
  defaultStructureId: string;
}

export interface ProvidersConfig {
  current: ProviderType;
  providers: {
    elos: ProviderConfig;
    evup: ProviderConfig;
    botosense: ProviderConfig;
  };
}
