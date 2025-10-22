declare module "bwip-js" {
  export function toCanvas(
    canvas: HTMLCanvasElement,
    options: {
      bcid: string;
      text: string;
      scale?: number;
      height?: number;
      includetext?: boolean;
      textxalign?: string;
    }
  ): void;
}
