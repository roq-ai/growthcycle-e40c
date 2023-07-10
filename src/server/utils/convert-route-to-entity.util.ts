const mapping: Record<string, string> = {
  groups: 'group',
  metrics: 'metrics',
  platforms: 'platform',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
