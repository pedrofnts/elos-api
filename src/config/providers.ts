import { ProvidersConfig, ProviderType, ProviderConfig } from '../types/provider';

// Load environment variable for current provider (default: 'elos')
const CURRENT_PROVIDER = (process.env.ELOS_PROVIDER || 'elos') as ProviderType;

// Validate provider type
if (!['elos', 'evup', 'botosense'].includes(CURRENT_PROVIDER)) {
  throw new Error(`Invalid provider: ${CURRENT_PROVIDER}. Must be 'elos', 'evup' or 'botosense'`);
}

const config: ProvidersConfig = {
  current: CURRENT_PROVIDER,
  providers: {
    elos: {
      name: 'Elos Club',
      baseUrl: process.env.ELOS_URL || 'https://botoclinic.elosclub.com.br',
      loginPath: '/Login',
      timezone: 'America/Sao_Paulo',
      defaultStructureId: '58',
    },
    evup: {
      name: 'Evup',
      baseUrl: process.env.EVUP_URL || 'https://espacolaser.evup.com.br',
      loginPath: '/Login',
      timezone: 'America/Sao_Paulo',
      defaultStructureId: '58',
    },
    botosense: {
      name: 'Botosense',
      baseUrl: 'https://botosense.elosclub.com.br',
      loginPath: '/Login',
      timezone: 'America/Sao_Paulo',
      defaultStructureId: '3',
    },
  },
};

// Get current provider configuration
export const getCurrentProvider = (): ProviderConfig => {
  return config.providers[config.current];
};

// Get provider by name
export const getProvider = (provider: ProviderType): ProviderConfig => {
  return config.providers[provider];
};

// Export for direct access
export default config;
