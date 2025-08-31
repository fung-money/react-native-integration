
import { encode } from 'base-64';

const DEV_USERNAME = 'apiKeyId'
const DEV_PASSWORD = 'apiKeySecret'

export const generateBasicAuthDevHeader = (): string => {
  const credentials = `${DEV_USERNAME}:${DEV_PASSWORD}`;
  return `Basic ${encode(credentials)}`;
};