/* ------------------------------------------------------------------
   Frame sequence loading.

   All sequences on the page share one small download queue so that the
   sequence the user is looking at always wins bandwidth. Frames within a
   sequence load coarse-to-fine (1, 60, 30, 15, 45, …) so a fast scroll
   has something close to show immediately and fills in detail after.
   ------------------------------------------------------------------ */

export const FramePriority = { Idle: 0, Near: 1, Active: 2 } as const;
export type FramePriority = (typeof FramePriority)[keyof typeof FramePriority];

const Status = { None: 0, Queued: 1, Loading: 2, Loaded: 3, Failed: 4 } as const;

type Task = { seq: FrameSequence; index: number; order: number };

const MAX_CONCURRENT = 6;
const GIVE_UP_AFTER = 3;
const queue: Task[] = [];
let inFlight = 0;

function pump() {
  while (inFlight < MAX_CONCURRENT && queue.length) {
    // Highest-priority sequence first, then its own coarse-to-fine order.
    let best = 0;
    for (let i = 1; i < queue.length; i++) {
      const a = queue[i];
      const b = queue[best];
      if (a.seq.priority > b.seq.priority || (a.seq.priority === b.seq.priority && a.order < b.order)) best = i;
    }
    const [task] = queue.splice(best, 1);
    if (task.seq.disposed) continue;
    inFlight++;
    task.seq.fetchFrame(task.index).finally(() => {
      inFlight--;
      pump();
    });
  }
}

function frameUrl(base: string, index: number, ext: string) {
  return `${base}${String(index + 1).padStart(3, "0")}.${ext}`;
}

/** 0, n-1, then midpoints of every gap, breadth first. */
export function progressiveOrder(count: number): number[] {
  if (count <= 0) return [];
  if (count === 1) return [0];
  const order = [0, count - 1];
  const seen = new Set(order);
  let gaps: [number, number][] = [[0, count - 1]];
  while (gaps.length) {
    const next: [number, number][] = [];
    for (const [a, b] of gaps) {
      if (b - a < 2) continue;
      const mid = Math.floor((a + b) / 2);
      if (!seen.has(mid)) {
        seen.add(mid);
        order.push(mid);
      }
      next.push([a, mid], [mid, b]);
    }
    gaps = next;
  }
  return order;
}

export type FrameSequenceOptions = {
  basePath: string;
  ext: string;
  count: number;
  fallbackBasePath?: string;
  fallbackExt?: string;
  onFrameLoaded?: (index: number) => void;
};

export class FrameSequence {
  readonly count: number;
  readonly images: (HTMLImageElement | undefined)[];
  priority: FramePriority = FramePriority.Idle;
  disposed = false;
  private failures = 0;
  private status: Uint8Array;
  private opts: FrameSequenceOptions;

  constructor(opts: FrameSequenceOptions) {
    this.opts = opts;
    this.count = opts.count;
    this.images = new Array(opts.count);
    this.status = new Uint8Array(opts.count);
  }

  isLoaded(index: number) {
    return this.status[index] === Status.Loaded;
  }

  get loadedCount() {
    let n = 0;
    for (let i = 0; i < this.count; i++) if (this.status[i] === Status.Loaded) n++;
    return n;
  }

  get failedAll() {
    for (let i = 0; i < this.count; i++) if (this.status[i] !== Status.Failed) return false;
    return true;
  }

  setPriority(priority: FramePriority) {
    if (this.priority === priority) return;
    this.priority = priority;
    pump();
  }

  /** Queue a single frame (no-op if already requested). */
  request(index: number, order = -1) {
    if (this.disposed || index < 0 || index >= this.count || this.status[index] !== Status.None) return;
    this.status[index] = Status.Queued;
    queue.push({ seq: this, index, order });
    pump();
  }

  /** Queue every frame in coarse-to-fine order. */
  preloadAll() {
    progressiveOrder(this.count).forEach((index, order) => this.request(index, order));
  }

  /** Closest loaded frame to `index`, preferring earlier frames on ties. -1 if none. */
  nearestLoaded(index: number): number {
    if (this.isLoaded(index)) return index;
    for (let d = 1; d < this.count; d++) {
      if (index - d >= 0 && this.isLoaded(index - d)) return index - d;
      if (index + d < this.count && this.isLoaded(index + d)) return index + d;
    }
    return -1;
  }

  /** Called by the shared queue. */
  async fetchFrame(index: number) {
    if (this.disposed) return;
    this.status[index] = Status.Loading;
    const { basePath, ext, fallbackBasePath, fallbackExt } = this.opts;

    let img = await loadImage(frameUrl(basePath, index, ext));
    if (!img && fallbackBasePath) {
      img = await loadImage(frameUrl(fallbackBasePath, index, fallbackExt ?? ext));
    }
    if (this.disposed) return;
    if (img) {
      this.images[index] = img;
      this.status[index] = Status.Loaded;
      this.opts.onFrameLoaded?.(index);
    } else {
      this.status[index] = Status.Failed;
      this.failures++;
      // If the first few frames all fail, the sequence is unreachable: stop instead of trying every file.
      if (this.failures >= GIVE_UP_AFTER && this.loadedCount === 0) this.cancelQueued();
      this.opts.onFrameLoaded?.(index);
    }
  }

  private cancelQueued() {
    for (let i = queue.length - 1; i >= 0; i--) {
      if (queue[i].seq !== this) continue;
      this.status[queue[i].index] = Status.Failed;
      queue.splice(i, 1);
    }
  }

  dispose() {
    this.disposed = true;
    for (let i = queue.length - 1; i >= 0; i--) if (queue[i].seq === this) queue.splice(i, 1);
    this.images.fill(undefined);
  }
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      // Decode off the main thread where supported so the first draw doesn't jank.
      if (typeof img.decode === "function") img.decode().then(() => resolve(img), () => resolve(img));
      else resolve(img);
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/** requestIdleCallback with a timeout-based fallback (Safari). */
export function whenIdle(cb: () => void, timeout = 1200): () => void {
  if (typeof window === "undefined") return () => {};
  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(cb, { timeout });
    return () => window.cancelIdleCallback(id);
  }
  const id = setTimeout(cb, 200);
  return () => clearTimeout(id);
}
