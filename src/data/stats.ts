export interface Stat {
  value: string;
  label: string;
}

export const stats: Stat[] = [
  { value: '< 50ms', label: 'p95 response time' },
  { value: '0 %', label: 'CPU at idle' },
  { value: '< 20 MB', label: 'RAM' },
];
