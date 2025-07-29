export const KSTtime = () => {
  const now = new Date();
  const kstTime = new Date(now.getTime() + 9 * 60 * 60 * 1000); // UTC + 9시간
  return kstTime;
};
