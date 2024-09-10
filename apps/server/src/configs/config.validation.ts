import { ConfigModuleOptions } from '@nestjs/config';
import { configSchema } from './config.schema';

class ConfigException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigException';
  }
}

export const configValidator: ConfigModuleOptions['validate'] = (config) => {
  const result = configSchema.safeParse(config);

  if (!result.success) {
    let errors = 'ENV_CONFIG_ERROR\n';
    for (const [key, value] of Object.entries(
      result.error.flatten().fieldErrors,
    )) {
      errors += `${key}: ${value[0]}\n`;
    }

    throw new ConfigException(errors);
  }

  return config;
};
