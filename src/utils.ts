const techBusy: Record<string, [number, number][]> = {};
const equipBusy: Record<string, [number, number][]> = {};

const timeToMinutes = (time: string): number => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
};

const minutesToTime = (minutes: number): string => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};
  

export {timeToMinutes, minutesToTime, techBusy, equipBusy}