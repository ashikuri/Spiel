export interface OptionInterface{
  darkmode?: boolean
  pixel?: boolean
  canvas?: HTMLCanvasElement
  load: {[x: string]: Promise<HTMLImageElement | HTMLAudioElement | {font: string, text: string, title: string}>}
  scene?: Array<SceneInterface>
  camera?: {
    use: boolean
    width?: number
    height?: number
  }
}
export interface SceneInterface{
  name: string | number
  entity: {[x: string]: EntityInterface | SpritEntityInterface | TextEntityInterface}
}
export interface BodyEntityInterface{
  x: number
  y: number
  width: number
  height: number
}
export interface EntityInterface{
  body?: BodyEntityInterface
  init?(): void
  beforeRedraw?(): void
  redraw?(): void
  afterRedraw?(): void
  audio?(name: string): HTMLAudioElement | null
  collide?(entity: string, border: number | null): boolean
  getEntity?(entity: string): EntityInterface
  on?(name: "click", listener: (e: MouseEvent) =>void): void
  changeScene(name: string | number): void
  key?: Array<string>
  canvas: HTMLCanvasElement
  x?: number
  y?: number
  entityWidth?: number
  entityHeight?: number
  scale?: number
}
export interface SpritEntityInterface extends EntityInterface{
  sprit: {x: number; y: number}
  animationSpeed: number
  animation(o: {x: number | Array<number>; y: number | Array<number>}, step?: () =>void): void
}
export interface TextEntityInterface extends EntityInterface{
  replaced?: Array<[string | RegExp, any]>

}
export function ex(Class: new (...args) =>any, ...any: any): any
export namespace Loader{
  export function Image(link: string): Promise<HTMLImageElement>
  export function Audio(link: string): Promise<HTMLAudioElement>
  export function Text(text: string, style?: {fontSize?: string, fontFamily?: string}): Promise<{ font: string; text: string; title: string }>
}
export namespace Entity{
  export class Text implements TextEntityInterface{
    public canvas: HTMLCanvasElement
    public x: number
    public y: number
    public replaced: Array<[string | RegExp, any]>
    init(): void
    afterRedraw(): void
    redraw(): void
    beforeRedraw(): void
    on(name: "click", listener: (e: MouseEvent) =>void): void
    changeScene(name: string | number): void
  }
  export class Image implements EntityInterface{
    public scale: number
    public canvas: HTMLCanvasElement
    public x: number
    public y: number
    public entityWidth: number
    public entityHeight: number
    public key: Array<string>
    init(): void
    afterRedraw(): void
    redraw(): void
    beforeRedraw(): void
    on(name: "click", listener: (e: MouseEvent) =>void): void
    audio(name: string): HTMLAudioElement
    colide(entity: string): boolean
    getEntity(entity: string): EntityInterface
    changeScene(name: string | number): void
  }
  export class Sprit extends Image implements SpritEntityInterface{
    public sprit: { x: number; y: number }
    public animationSpeed: number
    animation(o: { x?: number | Array<number>; y?: number | Array<number> }, step?: (n: number) =>void)
  }
}
export class Game{
  private key
  private canvas: HTMLCanvasElement
  private context: CanvasRenderingContext2D
  private use: string | number
  private load: {[x: string]: HTMLImageElement | HTMLAudioElement | {font: string, text: string}}
  private entityList: {[x: string]: EntityInterface | TextEntityInterface}
  private w: number
  private h: number
  constructor(o: OptionInterface, w: number, h: number)
  private start(o: OptionInterface): void
  private scene(o: OptionInterface, sceneId: number): void
  private draw(entityName): void
  private update(): void
}
