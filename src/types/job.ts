export type Job = {
  name: string;
  run: () => Promise<void>;
};