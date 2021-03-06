import EventEmitter from "./EventEmitter"
import SpielInterface from "./../types/index"
import InvisibleClass from "./InvisibleClass"
import uniformFunction from "./uniformFunction"
import Contro from 'contro'

const isClass = (fn) =>{
  try {
    return /^\s*class/.test(fn.toString())
  } catch (error) {
    return false
  }
}
const self = {
  startOut: {},
  iout: {},
  cancelOut: {}
}
function timeoutfn(fn: (i: number) =>void, time: number, n: number = 1){
  if(uniformFunction(fn) in self.cancelOut === false){
    if(uniformFunction(fn) in self.startOut === false){
      self.startOut[uniformFunction(fn)] = null
      self.iout[uniformFunction(fn)] = 0
    }
    if(self.startOut[uniformFunction(fn)] === null) self.startOut[uniformFunction(fn)] = Math.trunc((Date.now() + time))
    const intervalFunction = () =>{
      if(self.startOut[uniformFunction(fn)] <= Math.trunc((Date.now()))){
        self.startOut[uniformFunction(fn)] = null
        fn(self.iout[uniformFunction(fn)])
        if(++self.iout[uniformFunction(fn)] < n){
          if(self.startOut[uniformFunction(fn)] === null) self.startOut[uniformFunction(fn)] = Math.trunc((Date.now() + time))
        }
        else clearInterval((interval as unknown as number) + (self.iout[uniformFunction(fn)] = 0))
      }
    }
    const interval = setInterval(intervalFunction, 1)
  }
}
function canceltimeoutfn(fn: (i: number) =>void){
  self.cancelOut[uniformFunction(fn)] = true
}
const nTick = {}
const cancelTick = {}
function tickfn(fn: () =>void, tick: number){
  if(uniformFunction(fn) in cancelTick === false){
    if(uniformFunction(fn) in nTick === false) nTick[uniformFunction(fn)] = 0
    if(++nTick[uniformFunction(fn)] >= tick){
      fn()
      nTick[uniformFunction(fn)] = 0
    }
  }
}
function canceltickfn(fn: () =>void){
  cancelTick[uniformFunction(fn)] = true
}
export function ex(Class: new (args: any) =>any, ...args: any): any{
  return new Class(args)
}
export namespace Loader{
  export function Image(link: string){
    return new Promise<HTMLImageElement>((wait, fail) =>{
      const img = document.createElement("img")
      img.title = "Image"
      img.src = link
      img.onload = () =>{
        EventEmitter.emit("loaded")
        wait(img)
      }
      img.onerror = fail
    })
  }
  export function Audio(link: string){
    return new Promise<HTMLAudioElement>((wait, fail) =>{
      const audio = document.createElement("audio")
      audio.title = "Audio"
      audio.src = link
      audio.onloadeddata = () =>{
        EventEmitter.emit("loaded")
        wait(audio)
      }
      audio.onerror = fail
    })
  }
  export function Text(text: string, style?: {fontSize?: number, fontFamily?: string, color?: string, alpha?: number, padding?: number}){
    return new Promise<SpielInterface.TextInterface>((wait, fail) =>{
      const fontSize = "fontSize" in (style || {}) ? style.fontSize : 10
      const fontFamily = "fontFamily" in (style || {}) ? style.fontFamily : "sans-serif"
      const color = "color" in (style || {}) ? style.color : "#000"
      const alpha = "alpha" in (style || {}) ? style.alpha : 1
      const padding = "padding" in (style || {}) ? style.padding : 5
      setTimeout(() =>{
        EventEmitter.emit("loaded")
        wait({
          fontSize, 
          fontFamily,
          color,
          text, 
          alpha,
          padding,
          title: "Text"
        })
      })
    })
  }
}
// Class
export namespace Entity{
  export class Image implements SpielInterface.EntityInterface{
    public alpha: number = 1
    public use: string
    public index = 1
    public body = null
    public scale = 1
    public game: Game
    public scene: SpielInterface.SceneInterface
    public hidden = false
    public fixed = false
    public canvas: HTMLCanvasElement
    public x: number = 0
    public y: number = 0
    public entityWidth: number
    public entityHeight: number
    public control: SpielInterface.ControlInterface
    public clones: Array<{x: number, y: number, scale?: number, sprit?: {x: number; y: number}, rotation?: number, fixed?: boolean}> = []
    public rotation = 0
    init(){}
    afterRedraw(){}
    redraw(){}
    beforeRedraw(){}
    on(event: string, fn: () =>any): void{}
    off(event: string): void {}
    tick(fn: () =>void, tick: number = 1): void{ return tickfn(fn, tick) }
    cancelTick(fn: () =>void): void{ return canceltickfn(fn) }
    timeout(fn: (i: number) =>void, time: number, n?: number){ return timeoutfn(fn, time, n) }
    cancelTimeout(fn: (i: number) =>void){ return canceltimeoutfn(fn) }
    changeScene(name: string | number){}
    audio(name: string): HTMLAudioElement{ return document.createElement("audio") }
    collide(entity: string, border: number | null): { side: "top" | "left" | "bottom" | "right" | "inside" | "none", collide: boolean }{ return { side: "none", collide: false } }
    getEntity(entity: string): SpielInterface.EntityInterface{ return Object.assign({}, this) }
  }
  export class Text extends Image implements SpielInterface.TextEntityInterface{
    public replaced: Array<[string | RegExp, any]> = []
    setFontSize(v: number){}
    setFontFamily(v: string){}
    setColor(v: string){}
    setPadding(v: number){}
    getFontSize(): number{return 0}
    getFontFamily(): string{return ""}
    getColor(): string{return ""}
    getPadding(): number{return 0}
  }
  export class Sprit extends Image implements SpielInterface.SpritEntityInterface{
    public sprit = {x: 0, y: 0}
    public animationSpeed = 300
    animation(o: {x?: number | Array<number>, y?: number | Array<number>}, step?: (n: number) =>void){}
  }
  export class Camera implements SpielInterface.CameraInterface{
    public canvas: HTMLCanvasElement
    public x: number = 0
    public y: number = 0
    public width: number
    public height: number
    public scene: SpielInterface.SceneInterface
    public game: Game
    public background: Promise<HTMLImageElement>
    init(){}
    update(){}
    tick(fn: () =>void, tick: number = 1): void{ return tickfn(fn, tick) }
    cancelTick(fn: () =>void): void{ return canceltickfn(fn) }
    timeout(fn: (i: number) =>void, time: number, n?: number){ return timeoutfn(fn, time, n) }
    cancelTimeout(fn: (i: number) =>void){ return canceltimeoutfn(fn) }
    audio(name: string): HTMLAudioElement{ return document.createElement("audio") }
    getEntity(entity: string): SpielInterface.EntityInterface{ return Object.assign({}, (this as unknown as SpielInterface.EntityInterface)) }
    getTarget(): SpielInterface.EntityInterface{ return Object.assign({}, (this as unknown as SpielInterface.EntityInterface)) }
    setTarget(entity: string){}
  }
}
export class Plugin implements SpielInterface.Plugin{
  onCamera(camera: SpielInterface.CameraInterface): void{}
  onEntity(entity: SpielInterface.EntityInterface | SpielInterface.SpritEntityInterface | SpielInterface.TextEntityInterface): void {}
  onFirstSetCamera(camera: SpielInterface.CameraInterface): void {}
  changeScene(entities: SpielInterface.SceneEntity, sceneName: string | number){}
  sceneUpdate(entities: SpielInterface.SceneEntity, sceneName: string | number, timestamp: number){}
  entityUpdate(entity: SpielInterface.EntityInterface | SpielInterface.SpritEntityInterface | SpielInterface.TextEntityInterface){}
  onCanvas(canvas: HTMLCanvasElement, entities: SpielInterface.SceneEntity, onEntities: {[x: string]: {[x: string]: () =>void}}){}
  cameraUpdate(camera: SpielInterface.CameraInterface){}
  onFirstSetEntity(entity: SpielInterface.EntityInterface | SpielInterface.SpritEntityInterface | SpielInterface.TextEntityInterface){}
}
export class FPSPlugin extends Plugin{
  private secondsPassed = 0
  private oldTimeStamp = 0
  private fps = 0
  private i = 0
  constructor(){
    super()
    setInterval(() =>{
      this.fps = this.i
      this.i = 0
    }, 1000)
  }
  public sceneUpdate(_, __, timestamp){
    this.secondsPassed = (timestamp - this.oldTimeStamp) / 1000;
    this.oldTimeStamp = timestamp;
    this.fps = Math.round(1 / this.secondsPassed);
  }
  public onEntity(entity: {[x: string]: any}){
    if(this.fps !== entity.fps) entity.fps = this.fps
  }
}
export class Game{
  public state = {}
  private control: SpielInterface.ControlInterface
  private plugins: Array<Plugin>
  private scenes: SpielInterface.SceneInterface[]
  private canvas: HTMLCanvasElement
  private context: CanvasRenderingContext2D
  private use: string | number
  private audio: {[x: string]: HTMLAudioElement} = {}
  private sceneId: number
  private saveObject: {[x: string]: SpielInterface.SceneEntity} = {}
  private load: {[x: string]: HTMLImageElement | SpielInterface.TextInterface} = {}
  private camera: {[x: number]: SpielInterface.CameraInterface} = {}
  private cameraBackground: {[x: number]: HTMLImageElement} = {}
  private target: {[x: number]: SpielInterface.EntityInterface} = {}
  private onTarget: {[x: string]:{[x: string]: {[x: string]: () =>void}}} = {}
  constructor(o: SpielInterface.OptionInterface, private w = 800, private h = 600){
    this.plugins = o.plugins || []
    this.state = o.state || {}
    this.canvas = o.canvas || document.body.appendChild(document.createElement("canvas"))
    this.canvas.height = this.h
    this.canvas.width = this.w
    this.context = this.canvas.getContext("2d")
    if(o.pixel) this.canvas.style.imageRendering = "pixelated"
    this.scenes = o.scene.map((scene) =>{
      for(const entityName in scene.entity) if(isClass(scene.entity[entityName])) scene.entity[entityName] = ex(scene.entity[entityName] as unknown as new () =>SpielInterface.EntityInterface)
      return scene
    })
    this.sceneId = 0
    this.use = this.scenes[this.sceneId].name
    this.control = {
      gamepad: new Contro.Gamepad(),
      keyboard: new Contro.Keyboard(),
      mouse: new Contro.Mouse({canvas: this.canvas}),
      detectAnd: Contro.and,
      detectOr: Contro.or
    }
    for(const entityName in o.load) o.load[entityName].then((l) =>{
      if(l instanceof HTMLAudioElement) this.audio[entityName] = l
      else this.load[entityName] = l
    })
    let i = 0
    EventEmitter.on("loaded", () =>{
      this.context.clearRect(0, 0, this.w, this.h)
      const per = Math.round((++i / Object.keys(o.load).length) * 100)
      if(per > 100) this.start(o)
      else if("loadScene" in o) o.loadScene(this.context, per)
      if(per === 100) EventEmitter.emit("loaded")
    })
  }
  public createSaveJson(): string{
    const o = {
      currentSceneId: this.sceneId,
      currentSceneName: this.use,
      allScene: Object.assign({}, this.saveObject)
    }
    for(const sceneId in o.allScene) for(const entityName in o.allScene[sceneId]) delete o.allScene[sceneId][entityName].canvas
    return JSON.stringify(o)
  }
  private setEntity(o: SpielInterface.OptionInterface, scene: SpielInterface.SceneInterface, entityName: string, l?: HTMLImageElement | HTMLAudioElement | SpielInterface.TextInterface){
    const invisible = new InvisibleClass();
    const entity = scene.entity[entityName]
    if(entity.x === undefined) entity.x = 0
    if(entity.y === undefined) entity.y = 0
    entity.scene = scene
    entity.game = this
    entity.canvas = this.canvas
    entity.getEntity = function(entity){
      if(scene.entity[entity] instanceof Entity.Camera) throw new TypeError("You can't get the camera")
      return Object.assign({}, scene.entity[entity])
    }
    entity.audio = (name) =>{
      if(!(name in o.load)) throw new ReferenceError(`${name} is not loaded or defined with this name`)
      if(name in this.audio) return this.audio[name]
      throw new TypeError(`${name} is not Audio Element`)
    }
    if(!(entity instanceof Entity.Camera) && entityName !== "@camera"){
      entity.control = this.control
      entity.on = (event, fn) =>{
        this.onTarget[this.sceneId][entityName] = {[event]: fn}
      }
      entity.off = (event) =>{
        if(entityName in this.onTarget[this.sceneId]) delete this.onTarget[this.sceneId][entityName][event]
      }
      entity.changeScene = (name) =>{
        this.sceneId = this.scenes.findIndex((scene) =>scene.name === name)
        if(this.sceneId !== -1 && "toScene" in this.scenes[this.sceneId] === false || this.scenes[this.sceneId].toScene(this.use)){
          if(!(this.sceneId in this.saveObject)) this.saveObject[this.sceneId] = this.scenes[this.sceneId].entity
          this.use = this.scenes[this.sceneId].name
          for(const plugin of this.plugins) plugin.changeScene(this.saveObject[this.sceneId], this.use)
        }
      }
      if(l instanceof HTMLImageElement){
        if(entity.entityWidth === undefined) entity.entityWidth = l.width
        if(entity.entityHeight === undefined) entity.entityHeight = l.height
        entity.collide = function(this: SpielInterface.EntityInterface, entityName, border = null){
          const entitySelected = scene.entity[entityName]
          let isCollided = false
          let side: "top" | "left" | "bottom" | "right" | "inside" | "none" = "none"

          let collitionEntitySelected = invisible.collide(this, entitySelected, entitySelected, border)
          if(collitionEntitySelected.side !== "none") side = collitionEntitySelected.side
          if(collitionEntitySelected.collide !== false) isCollided = collitionEntitySelected.collide
          
          entitySelected.clones.forEach((positionClone) =>{
            let collitionCloneEntitySelected = invisible.collide(this, entitySelected, positionClone, border)
            if(collitionCloneEntitySelected.side !== "none") side = collitionCloneEntitySelected.side
            if(collitionCloneEntitySelected.collide !== false) isCollided = collitionCloneEntitySelected.collide
          })
          return {
            side: side,
            collide: isCollided
          }
        }
        if(entity instanceof Entity.Sprit){
          (entity as SpielInterface.SpritEntityInterface).animation = invisible.anim()
        }
      }else{
        (entity as SpielInterface.TextEntityInterface).setFontSize = (v: number) =>{(l as SpielInterface.TextInterface).fontSize = v}
        (entity as SpielInterface.TextEntityInterface).setFontFamily = (v: string) =>{(l as SpielInterface.TextInterface).fontFamily = v}
        (entity as SpielInterface.TextEntityInterface).setColor = (v: string) =>{(l as SpielInterface.TextInterface).color = v}
        (entity as SpielInterface.TextEntityInterface).setPadding = (v: number) =>{(l as SpielInterface.TextInterface).padding = v}
        (entity as SpielInterface.TextEntityInterface).getFontSize = () =>{return (l as SpielInterface.TextInterface).fontSize}
        (entity as SpielInterface.TextEntityInterface).getFontFamily = () =>{return (l as SpielInterface.TextInterface).fontFamily}
        (entity as SpielInterface.TextEntityInterface).getColor = () =>{return (l as SpielInterface.TextInterface).color}
        (entity as SpielInterface.TextEntityInterface).getPadding = () =>{return (l as SpielInterface.TextInterface).padding}
      }
    }else if(entity instanceof Entity.Camera && entityName === "@camera"){
      entity.getTarget = () =>{
        return this.target[this.sceneId]
      }
      entity.setTarget = (entity) =>{
        if(scene.entity[entity] instanceof Entity.Camera) throw new TypeError("You can't target the camera")
        this.target[this.sceneId] = scene.entity[entity]
      }
    }
    for(const plugin of this.plugins){
      if(entity instanceof Entity.Camera && entityName === "@camera") plugin.onFirstSetCamera(entity)
      else plugin.onFirstSetEntity(entity)
    }
  }
  private start(o: SpielInterface.OptionInterface){
    if(this.sceneId !== -1){
      this.scene(o, this.sceneId)
      if(this.onTarget[this.sceneId]　=== undefined) this.onTarget[this.sceneId] = {}
      for(const plugin of this.plugins) plugin.onCanvas(this.canvas, this.saveObject[this.sceneId], this.onTarget[this.sceneId])
      const on = (event: string, ev: MouseEvent) =>{
        for(const entityName in this.onTarget[this.sceneId]){
          if(event in this.onTarget[this.sceneId][entityName]){
            if(
              ev.offsetX < this.saveObject[this.sceneId][entityName].x + (this.saveObject[this.sceneId][entityName].entityWidth * this.saveObject[this.sceneId][entityName].scale) &&
              ev.offsetX > this.saveObject[this.sceneId][entityName].x &&
              ev.offsetY < this.saveObject[this.sceneId][entityName].y + (this.saveObject[this.sceneId][entityName].entityHeight * this.saveObject[this.sceneId][entityName].scale) &&
              ev.offsetY > this.saveObject[this.sceneId][entityName].y
            ) this.onTarget[this.sceneId][entityName][event]()
          }
        }
      }
      this.canvas.onmouseover = (ev: MouseEvent) =>on("hover", ev)
      this.canvas.onclick = (ev: MouseEvent) =>on("click", ev)
    }
  }
  private scene(o: SpielInterface.OptionInterface, sceneId: number){
    if(!(sceneId in this.saveObject)) this.saveObject[sceneId] = this.scenes[sceneId].entity
    setTimeout(async () =>{
      if("@camera" in this.saveObject[sceneId]){
        if(this.saveObject[sceneId]["@camera"].canvas === undefined){
          this.setEntity(o, this.scenes[sceneId], "@camera")
          this.camera[sceneId] = (this.saveObject[sceneId]["@camera"] as unknown as SpielInterface.CameraInterface)
        }
        if("init" in this.camera[sceneId]){
          this.camera[sceneId].init()
          if(o.save || ("save" in o)) this.camera[sceneId].init = () =>{}
        }
        this.cameraBackground[sceneId] = await this.camera[sceneId].background
        this.camera[sceneId].width = this.cameraBackground[sceneId].width
        this.camera[sceneId].height = this.cameraBackground[sceneId].height
        this.drawCamera(sceneId)
      }
      for(const entityName in this.saveObject[sceneId]){
        if(entityName !== "@camera"){
          if(this.saveObject[sceneId][entityName].canvas === undefined) this.setEntity(o, this.scenes[sceneId], entityName, this.load[this.saveObject[sceneId][entityName].use] || this.load[entityName])
          if("init" in this.saveObject[sceneId][entityName]){
            this.saveObject[sceneId][entityName].init()
            if(o.save || ("save" in o)) this.saveObject[sceneId][entityName].init = () =>{}
          }
          this.draw(entityName, sceneId)
        }
      }
      const update = async (timestamp: number) =>{
        if(this.use === this.scenes[sceneId].name) requestAnimationFrame(update)
        else if(sceneId !== -1) this.scene(o, this.sceneId)
        EventEmitter.emit("key:tick-increment")
        this.context.clearRect(0, 0, this.w, this.h)
        await this.update(o, sceneId)
        for(const plugin of this.plugins) plugin.sceneUpdate(this.saveObject[sceneId], this.use, timestamp)
      }
      update(0)
    })
  }
  private drawCamera(sceneId: number){
    for(const plugin of this.plugins) plugin.cameraUpdate(this.camera[sceneId])
    this.context.drawImage(
      this.cameraBackground[sceneId],
      this.camera[sceneId].x, 
      this.camera[sceneId].y
    )
  }
  private draw(entityName: string, sceneId: number){
    const entity = this.saveObject[sceneId][entityName]
    for(const plugin of this.plugins) plugin.entityUpdate(entity)
    if(entityName in this.saveObject[sceneId]){
      const o = this.load[entity.use] || this.load[entityName]
      this.context.globalAlpha = entity.alpha
      if(o instanceof HTMLImageElement){
        if("sprit" in entity){
          this.context.save()
          this.context.translate(
            entity.x + (this.camera[sceneId] === undefined || entity.fixed ? 0 : this.camera[sceneId].x), 
            entity.y + (this.camera[sceneId] === undefined || entity.fixed ? 0 : this.camera[sceneId].y)
          )
          this.context.rotate(entity.rotation * (Math.PI / 180))
          this.context.drawImage(
            o,
            (entity.entityWidth * (entity as SpielInterface.SpritEntityInterface).sprit.x),
            (entity.entityHeight * (entity as SpielInterface.SpritEntityInterface).sprit.y),
            entity.entityWidth,
            entity.entityHeight,
            0,
            0,
            entity.entityWidth * entity.scale,
            entity.entityHeight * entity.scale
            ) 
          this.context.restore()
          entity.clones.forEach(({x, y, scale, sprit, rotation = 0, fixed = false}) =>{
            this.context.save()
            this.context.translate(
              x + (this.camera[sceneId] === undefined || fixed ? 0 : this.camera[sceneId].x), 
              y + (this.camera[sceneId] === undefined || fixed ? 0 : this.camera[sceneId].y)
            )
            this.context.rotate(rotation * (Math.PI / 180))
            this.context.drawImage(
              o,
              (entity.entityWidth * (sprit || entity.sprit).x),
              (entity.entityHeight * (sprit || entity.sprit).y),
              entity.entityWidth,
              entity.entityHeight,
              0,
              0,
              entity.entityWidth * scale,
              entity.entityHeight * scale
            )
            this.context.restore()
          })
        }
        else{
          this.context.save()
          this.context.translate(
            entity.x + (this.camera[sceneId] === undefined || entity.fixed ? 0 : this.camera[sceneId].x), 
            entity.y + (this.camera[sceneId] === undefined || entity.fixed ? 0 : this.camera[sceneId].y)
          )
          this.context.rotate(entity.rotation * (Math.PI / 180))
          this.context.drawImage(
            o, 
            0,
            0,
            entity.entityWidth * entity.scale,
            entity.entityHeight * entity.scale
          )
          this.context.restore()
          entity.clones.forEach(({x, y, rotation = 0, scale, fixed = false}) =>{
            this.context.save()
            this.context.translate(
              x + (this.camera[sceneId] === undefined || fixed ? 0 : this.camera[sceneId].x), 
              y + (this.camera[sceneId] === undefined || fixed ? 0 : this.camera[sceneId].y)
            )
            this.context.rotate(rotation * (Math.PI / 180))
            this.context.drawImage(
              o, 
              0, 
              0,
              entity.entityWidth * (scale || entity.scale),
              entity.entityHeight * (scale || entity.scale)
            )
            this.context.restore()
          })
        }
      }
      else if(!(o instanceof HTMLAudioElement)){
        let text = o.text
        if("replaced" in entity) [(["", ""] as [string, string]), ...(entity as SpielInterface.TextEntityInterface).replaced].forEach((arr) =>{
          text = text.replace(...arr).replace(/\*[a-z0-9_]+/i, (result) =>result.slice(1) in entity ? entity[result.slice(1)] : result)
        })
        entity.entityWidth = 0
        entity.entityHeight = 0
        this.context.save()
        this.context.translate(
          entity.x + (this.camera[sceneId] === undefined || entity.fixed ? 0 : this.camera[sceneId].x), 
          entity.y + (this.camera[sceneId] === undefined || entity.fixed ? 0 : this.camera[sceneId].y) + (o.fontSize * entity.scale / 1.4)
        )
        this.context.rotate(entity.rotation * (Math.PI / 180))
        this.context.font = `${o.fontSize * entity.scale}px ${o.fontFamily}`
        this.context.fillStyle = o.color
        text.split("\n").forEach((text, i) =>{
          if(entity.entityWidth < this.context.measureText(text).width) entity.entityWidth = this.context.measureText(text).width
          entity.entityHeight = (o.fontSize * (i + 1) + o.padding * i)
          this.context.fillText(text.trim(), 0, ((o.fontSize + o.padding) * i))
        })
        this.context.restore()
        entity.clones.forEach(({x, y, rotation = 0, scale, fixed = false}) =>{
          this.context.save()
          this.context.translate(
            x + (this.camera[sceneId] === undefined || fixed ? 0 : this.camera[sceneId].x), 
            y + (o.fontSize * scale / 1.4) + (this.camera[sceneId] === undefined || fixed ? 0 : this.camera[sceneId].y)
          )
          this.context.rotate(rotation * (Math.PI / 180))
          this.context.font = `${o.fontSize * scale}px ${o.fontFamily}`
          this.context.fillStyle = o.color
          text.split("\n").forEach((text, i) =>{
            if(entity.entityWidth < this.context.measureText(text).width) entity.entityWidth = this.context.measureText(text).width
            entity.entityHeight = (o.fontSize * (i + 1) + o.padding * i)
            this.context.fillText(text.trim(), 0, ((o.fontSize + o.padding) * i))
          })
          this.context.restore()
        })
      }
    }
  }
  private async update(o: SpielInterface.OptionInterface, sceneId: number){
    if(this.scenes[sceneId].backgroundColor || o.darkmode || !("darkmode" in o)){
      this.context.save()
      this.context.fillStyle = this.scenes[sceneId].backgroundColor ? this.scenes[sceneId].backgroundColor : "#000"
      this.context.rect(0, 0, this.w, this.h)
      this.context.fill()
      this.context.restore()
    }
    if(this.camera[sceneId] !== undefined){
      if(this.target[sceneId]){
        const target = this.target[sceneId]
        if(this.canvas.width / 2 <= target.x + target.entityWidth / 2){
          let speed = null
          if(this.camera[sceneId].width - (this.canvas.width / 2) <= target.x + target.entityWidth / 2 && this.camera[sceneId].x <= this.canvas.width - this.camera[sceneId].width) speed = this.canvas.width - this.camera[sceneId].width
          else speed = (this.canvas.width / 2) - (target.x + target.entityWidth / 2)
          this.camera[sceneId].x = Math.round(speed)
        }
        if(this.canvas.height / 2 <= target.y + target.entityHeight / 2){
          let speed = null
          if(this.camera[sceneId].height - (this.canvas.height / 2) <= target.y + target.entityHeight / 2 && this.camera[sceneId].y <= this.canvas.height - this.camera[sceneId].height) speed = this.canvas.height - this.camera[sceneId].height
          else speed = (this.canvas.height / 2) - (target.y + target.entityHeight / 2)
          this.camera[sceneId].y = Math.round(speed)
        }
      }
      this.drawCamera(sceneId)
      for(const plugin of this.plugins) plugin.onCamera(this.camera[sceneId])
      this.camera[sceneId].update()
    }
    for(const entityName of Object.keys(this.saveObject[sceneId]).filter((n) =>n !== "@camera").sort((a, b) =>this.saveObject[sceneId][a].index - this.saveObject[sceneId][b].index)){
      for(const plugin of this.plugins) plugin.onEntity(this.saveObject[sceneId][entityName])
      if("beforeRedraw" in this.saveObject[sceneId][entityName]) this.saveObject[sceneId][entityName].beforeRedraw()
      if("redraw" in this.saveObject[sceneId][entityName]) this.saveObject[sceneId][entityName].redraw()
      if(!this.saveObject[sceneId][entityName].hidden) this.draw(entityName, sceneId)
      if("afterRedraw" in this.saveObject[sceneId][entityName]) this.saveObject[sceneId][entityName].afterRedraw()
    }
  }
}