const isBeta = import.meta.env.PUBLIC_BETA === 'true';
export const installCmd = isBeta
  ? 'curl -fsSL https://beta.odio.love/install | bash'
  : 'curl -fsSL https://odio.love/install | bash';
