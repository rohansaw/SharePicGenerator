import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { fabric } from 'fabric';
import FontFaceObserver from 'fontfaceobserver'

@Component({
  selector: 'angular-editor-fabric-js',
  templateUrl: './angular-editor-fabric-js.component.html',
  styleUrls: ['./angular-editor-fabric-js.component.css'],
})
export class FabricjsEditorComponent implements AfterViewInit {
  @ViewChild('htmlCanvas') htmlCanvas: ElementRef;

  private canvas: fabric.Canvas;
  public props = {
    canvasFill: '#ffffff',
    canvasImage: '',
    id: null,
    opacity: null,
    fill: null,
    fontSize: null,
    lineHeight: null,
    charSpacing: null,
    fontWeight: null,
    fontStyle: null,
    textAlign: null,
    fontFamily: null,
    editTextString: null,
    TextDecoration: ''
  };

  public bottomBar: fabric.Rect;
  public topBar: fabric.Rect;
  public topBarHeight : number;
  public bottomBarHeight : number;


  public textString: string;
  public url: string | ArrayBuffer = '';
  public bgImage: fabric.Image;
  public bgImageUrl: string | ArrayBuffer = '';
  public bgImageScale = 50;
  public size: any = {
    width: 1080,
    height: 1080
  };

  public json: any;
  private globalEditor = false;
  public textEditor = false;
  private imageEditor = false;
  public figureEditor = false;
  public selected: any;

  constructor() { }

  ngAfterViewInit(): void {

    this.canvas = new fabric.Canvas(this.htmlCanvas.nativeElement, {
      hoverCursor: 'pointer',
      selection: true,
      selectionBorderColor: 'blue',
    });

    this.canvas.on({
      'object:moved': (e) => { 
        if (e.target == this.bgImage) {
          this.cleanSelect();
        }
      },
      'mouse:up': (e) => {
        if(e.target == this.bgImage) {
          this.selected = null;
          this.canvas.discardActiveObject();
          this.canvas.renderAll();
          return;
        }
      },
      'object:selected': (e: any) => {
        const selectedObject = e.target;
        this.selected = selectedObject;
        selectedObject.hasRotatingPoint = true;
        selectedObject.transparentCorners = false;
        selectedObject.cornerColor = 'rgba(255, 87, 34, 0.7)';

        this.resetPanels();

        if (selectedObject.type !== 'group' && selectedObject) {
          this.getId();
          this.getOpacity();

          switch (selectedObject.type) {
            case 'i-text':
              this.textEditor = true;
              this.getLineHeight();
              this.getCharSpacing();
              this.getBold();
              this.getFill();
              this.getTextDecoration();
              this.getTextAlign();
              this.getFontFamily();
              break;
            case 'image':
              break;
          }
        } 
      },
      'selection:cleared': (e) => {
        this.selected = null;
        this.canvas.discardActiveObject();
        this.canvas.renderAll();
      }
    });

    this.canvas.setWidth(this.size.width);
    this.canvas.setHeight(this.size.height);

    var canvasWrapperWidth = document.getElementById('canvasWrapper').offsetWidth;
    var scaleRatio = (canvasWrapperWidth - 20 )/ this.canvas.getWidth();
    this.canvas.setDimensions({ width: this.canvas.getWidth() * scaleRatio, height: this.canvas.getHeight() * scaleRatio });

    this.bottomBar = new fabric.Rect({
      angle: -7,
      fill: '#3f51b5',
      hasControls: false,
      lockRotation: true,
    });

    this.topBar = new fabric.Rect({
      angle: -7,
      fill: '#3f51b5',
      hasControls: false,
      lockRotation: true,
    });

    this.topBar.lockScalingX = this.topBar.lockScalingY = this.topBar.lockMovementX = this.topBar.lockMovementY = true;
    this.bottomBar.lockScalingX = this.bottomBar.lockScalingY = this.bottomBar.lockMovementX = this.bottomBar.lockMovementY = true;
    this.canvas.add(this.bottomBar);
    this.canvas.add(this.topBar);

    // get references to the html canvas element & its context
    this.canvas.on('mouse:down', (e) => {
      const canvasElement: any = document.getElementById('canvas');
    });

    const Direction = {
      LEFT: 0,
      UP: 1,
      RIGHT: 2,
      DOWN: 3
    };

    fabric.util.addListener(document.body, 'keydown', (event) => {
      if (event.keyCode === 37) { // handle Left key
        this.moveSelected(Direction.LEFT);
      } else if (event.keyCode === 38) { // handle Up key
        this.moveSelected(Direction.UP);
      } else if (event.keyCode === 39) { // handle Right key
        this.moveSelected(Direction.RIGHT);
      } else if (event.keyCode === 40) { // handle Down key
        this.moveSelected(Direction.DOWN);
      } else if(event.keyCode === 46 || event.keyCode === 8) { // delete
        this.removeSelected();
      }
    });

    window.addEventListener("keydown", (e) => {
      // space and arrow keys
      if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        if(this.canvas.getActiveObject()){
          e.preventDefault();
        }   
      }
    }, false);
  }

  public moveSelected(direction) {
    const Direction = {
      LEFT: 0,
      UP: 1,
      RIGHT: 2,
      DOWN: 3
    };
  
    const STEP = 1;
    var activeObject = this.canvas.getActiveObject();
    console.log(activeObject)
    if (activeObject) {
      switch (direction) {
        case Direction.LEFT:
          activeObject.left -= STEP;
          break;
        case Direction.UP:
          activeObject.top -= STEP;
          break;
        case Direction.RIGHT:
          activeObject.left += STEP;
          break;
        case Direction.DOWN:
          activeObject.top += STEP;
          break;
      }

      activeObject.setCoords();
      this.canvas.renderAll();
      console.log('selected objects was moved');
    }
  
  }

  /*------------------------Block elements------------------------*/

  changeSize() {
    var canvasWrapperWidth = document.getElementById('canvasWrapper').offsetWidth;
    var scaleRatio = (canvasWrapperWidth - 20 )/ this.size.width;
    this.canvas.setDimensions({ width: this.size.width * scaleRatio, height: this.size.height * scaleRatio });
    this.setBottomBar();
  }

  addText() {
    if (this.textString) {
      var fontA = new FontFaceObserver('Titillium Web');
      fontA.load().then(() => {
      const text = new fabric.IText(this.textString, {
        left: 10,
        top: 10,
        fontFamily: 'Titillium Web',
        fontSize: 30,
        angle: -7,
        fill: '#000000',
        fontWeight: '',
        hasRotatingPoint: true,
      });

      this.extend(text, this.randomId());
      this.canvas.add(text);
      this.textString = '';
    });
    }
  }

  addTextTitle() {
    var pos = {x: 50, y: 50, angle: -7, padding: 10};
    if (this.textString) {
      var fontA = new FontFaceObserver('Titillium Web');
      fontA.load().then(() => {
        const text = new fabric.IText(this.textString.toUpperCase(), {
          top: 50,
          left: 50,
          fontFamily: 'Titillium Web',
          fill: '#fff',
          fontWeight: '700',
          fontSize: 50,
          angle: pos.angle
        });
        this.canvas.add(text)
        console.log(text)

          var textHeight, rectPadding,  shapes = [];
          textHeight = Math.floor(text.lineHeight * text.fontSize);
          
          var rectWidth = text.width + 3 * pos.padding;
          var offset = rectWidth * Math.tan(7 * Math.PI / 180);
          var left = text.left- pos.padding;
          var top = text.top - pos.padding;
          var height =  textHeight + 2 * pos.padding;
          var rect = new fabric.Polygon([
            { x: left, y: top }, 
            { x: left + rectWidth, y: top - offset}, 
            { x: left + rectWidth, y: top + height - offset},
            { x: left, y: top + height}], {
              fill: 'red',
            });

          rect.setGradient('fill', {
            type: 'linear',
            x1: -rect.width / 20,
            y1: 0,
            x2: rect.width / 1.2,
            y2: 0,
            colorStops: {
                0: '#F21F31',
                1: '#FF007A'
            }
          });

          shapes.push(rect);
          shapes.push(text);

        let group = new fabric.Group(shapes, {lockRotation: true,});
        this.extend(group, this.randomId());
        this.canvas.add(group);
        this.textString = '';
        });
      }
    }

    addTextSubtitle() {
      var pos = {x: 50, y: 50, angle: -7, padding: 10};
      if (this.textString) {
        var fontA = new FontFaceObserver('Titillium Web');
        fontA.load().then(() => {
          const text = new fabric.IText(this.textString.toUpperCase(), {
            top: 50,
            left: 50,
            fontFamily: 'Titillium Web',
            fill: 'red',
            fontWeight: '900',
            fontSize: 40,
            angle: -7,
          });

          var textHeight, rectPadding, top = 50, shapes = [];
            textHeight = Math.floor(text.lineHeight * text.fontSize);

            var rectWidth = text.width + 3 * pos.padding;
            var offset = rectWidth * Math.tan(7 * Math.PI / 180);
            var left = text.left- pos.padding;
            var top = text.top - pos.padding;
            var height =  textHeight + 2 * pos.padding;
            var rect = new fabric.Polygon([
              { x: left, y: top }, 
              { x: left + rectWidth, y: top - offset}, 
              { x: left + rectWidth, y: top + height - offset},
              { x: left, y: top + height}], {
                fill: '#fff',
              });

            text.setGradient('fill', {
              type: 'linear',
              x1: -rect.width / 20,
              y1: 0,
              x2: rect.width / 1.2,
              y2: 0,
              colorStops: {
                  0: '#F21F31',
                  1: '#FF007A'
              }
            });

            shapes.push(rect);
            shapes.push(text);

            var group = new fabric.Group(shapes, {lockRotation: true,});

        this.extend(group, this.randomId());
        this.canvas.add(group);
        //this.selectItemAfterAdded(group);
        this.textString = '';
          });
      }
  }

  loadAndUse(font) {
    var myfont = new FontFaceObserver(font)
    myfont.load()
      .then(function() {
        this.canvas.getActiveObject().set("fontFamily", font);
        this.canvas.requestRenderAll();
      }).catch(function(e) {
        console.log(e)
        alert('font loading failed ' + font);
      });
  }

  setSelectedText() {
    if (this.canvas.getActiveObject().type == 'i-text') {
      this.canvas.renderAll()
    }
  }

  // Block "Add images"

  getImgPolaroid(event: any) {
    const el = event.target;
    fabric.loadSVGFromURL(el.src, (objects, options) => {
      const image = fabric.util.groupSVGElements(objects, options);
      image.set({
        left: 10,
        top: 10,
        angle: 0,
        padding: 10,
        cornerSize: 10,
        hasRotatingPoint: true,
      });
      this.extend(image, this.randomId());
      this.canvas.add(image);
      this.selectItemAfterAdded(image);
    });
  }

  // Block "Upload Image"

  addImageOnCanvas(event: any) {
    var url = event.target.src;
    console.log(url)
    if (url) {
      fabric.Image.fromURL(url, (image) => {
        image.set({
          left: 50,
          top: 50,
          angle: 0,
          padding: 10,
          cornerSize: 10,
          hasRotatingPoint: true,
          centeredScaling: true,
        });
        image.scaleToWidth(this.canvas.getWidth() / 1.3)
        this.extend(image, this.randomId());
        this.canvas.add(image);
        //this.selectItemAfterAdded(image);
      });
    }
  }

  addImageOnCanvasFromUrl(url) {
    if (url) {
      fabric.Image.fromURL(url, (image) => {
        image.set({
          left: 50,
          top: 50,
          angle: 0,
          padding: 10,
          cornerSize: 10,
          hasRotatingPoint: true,
          centeredScaling: true,
        });
        image.scaleToWidth(this.canvas.getWidth() / 1.3)
        this.extend(image, this.randomId());
        this.canvas.add(image);
        //this.selectItemAfterAdded(image);
      });
    }
  }

  addBGImageOnCanvas(url) {
    if (url) {
      if(this.bgImage){
        this.canvas.remove(this.bgImage);
      }
      fabric.Image.fromURL(url, (image) => {
        image.set({
          left: 0,
          top: 0,
          angle: 0,
          padding: 10,
          cornerSize: 10,
          hasControls: false,
          lockRotation: true,
          lockUniScaling: true,
          centeredScaling: true,
        });
        image.scaleToWidth(this.size.width);
        this.extend(image, this.randomId());
        this.canvas.add(image);
        this.canvas.sendToBack(image);
        this.bgImage = image;
      });
    }
  }

  readBGUrl(event){
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        this.bgImageUrl = readerEvent.target.result;
        this.addBGImageOnCanvas(readerEvent.target.result);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  readUrl(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        this.url = readerEvent.target.result;
        this.addImageOnCanvas(readerEvent.target.result);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  removeWhite(url) {
    this.url = '';
  }

  scaleBGImage() {
    if(this.bgImage){
      this.bgImage.scaleToWidth(this.size.width * this.bgImageScale/100 * 2);
      this.canvas.renderAll();
    }
    
  }

  /*Canvas*/

  cleanSelect() {
    this.canvas.discardActiveObject().renderAll();
  }

  selectItemAfterAdded(obj) {
    this.canvas.discardActiveObject().renderAll();
    this.canvas.setActiveObject(obj);
  }

  setCanvasFill() {
    if (!this.props.canvasImage) {
      this.canvas.backgroundColor = this.props.canvasFill;
      this.canvas.renderAll();
    }
  }

  extend(obj, id) {
    obj.toObject = ((toObject) => {
      return function() {
        return fabric.util.object.extend(toObject.call(this), {
          id
        });
      };
    })(obj.toObject);
  }

  setCanvasImage() {
    const self = this;
    if (this.props.canvasImage) {
      this.canvas.setBackgroundColor(new fabric.Pattern({ source: this.props.canvasImage, repeat: 'repeat' }), () => {
        self.props.canvasFill = '';
        self.canvas.renderAll();
      });
    }
  }

  randomId() {
    return Math.floor(Math.random() * 999999) + 1;
  }

  /*------------------------Global actions for element------------------------*/

  getActiveStyle(styleName, object) {
    object = object || this.canvas.getActiveObject();
    if (!object) { return ''; }

    if (object.getSelectionStyles && object.isEditing) {
      return (object.getSelectionStyles()[styleName] || '');
    } else {
      return (object[styleName] || '');
    }
  }

  setActiveStyle(styleName, value: string | number, object: fabric.IText) {
    object = object || this.canvas.getActiveObject() as fabric.IText;
    if (!object) { return; }

    if (object.setSelectionStyles && object.isEditing) {
      const style = {};
      style[styleName] = value;

      if (typeof value === 'string') {
        if (value.includes('underline')) {
          object.setSelectionStyles({underline: true});
        } else {
          object.setSelectionStyles({underline: false});
        }

        if (value.includes('overline')) {
          object.setSelectionStyles({overline: true});
        } else {
          object.setSelectionStyles({overline: false});
        }

        if (value.includes('line-through')) {
          object.setSelectionStyles({linethrough: true});
        } else {
          object.setSelectionStyles({linethrough: false});
        }
      }

      object.setSelectionStyles(style);
      object.setCoords();

    } else {
      if (typeof value === 'string') {
        if (value.includes('underline')) {
        object.set('underline', true);
        } else {
          object.set('underline', false);
        }

        if (value.includes('overline')) {
          object.set('overline', true);
        } else {
          object.set('overline', false);
        }

        if (value.includes('line-through')) {
          object.set('linethrough', true);
        } else {
          object.set('linethrough', false);
        }
      }

      object.set(styleName, value);
    }

    object.setCoords();
    this.canvas.renderAll();
  }


  getActiveProp(name) {
    const object = this.canvas.getActiveObject();
    if (!object) { return ''; }

    return object[name] || '';
  }

  setActiveProp(name, value) {
    const object = this.canvas.getActiveObject();
    if (!object) { return; }
    object.set(name, value).setCoords();
    this.canvas.renderAll();
  }

  getId() {
    this.props.id = this.canvas.getActiveObject().toObject().id;
  }

  setId() {
    const val = this.props.id;
    const complete = this.canvas.getActiveObject().toObject();
    console.log(complete);
    this.canvas.getActiveObject().toObject = () => {
      complete.id = val;
      return complete;
    };
  }

  getOpacity() {
    this.props.opacity = this.getActiveStyle('opacity', null) * 100;
  }

  setOpacity() {
    this.setActiveStyle('opacity', parseInt(this.props.opacity, 10) / 100, null);
  }

  getFill() {
    this.props.fill = this.getActiveStyle('fill', null);
  }

  setFill() {
    this.setActiveStyle('fill', this.props.fill, null);
  }

  getEditTextString() {
    this.props.editTextString = this.getActiveStyle('text', null);
  }

  getLineHeight() {
    this.props.lineHeight = this.getActiveStyle('lineHeight', null);
  }

  setLineHeight() {
    this.setActiveStyle('lineHeight', parseFloat(this.props.lineHeight), null);
  }

  getCharSpacing() {
    this.props.charSpacing = this.getActiveStyle('charSpacing', null);
  }

  setCharSpacing() {
    this.setActiveStyle('charSpacing', this.props.charSpacing, null);
  }

  getFontSize() {
    this.props.fontSize = this.getActiveStyle('fontSize', null);
  }

  setFontSize() {
    this.setActiveStyle('fontSize', parseInt(this.props.fontSize, 10), null);
  }

  getBold() {
    this.props.fontWeight = this.getActiveStyle('fontWeight', null);
  }

  setBold() {
    this.props.fontWeight = !this.props.fontWeight;
    this.setActiveStyle('fontWeight', this.props.fontWeight ? 'bold' : '', null);
  }

  setFontStyle() {
    this.props.fontStyle = !this.props.fontStyle;
    if (this.props.fontStyle) {
      this.setActiveStyle('fontStyle', 'italic', null);
    } else {
      this.setActiveStyle('fontStyle', 'normal', null);
    }
  }

  getTextDecoration() {
    this.props.TextDecoration = this.getActiveStyle('textDecoration', null);
  }

  setTextDecoration(value) {
    let iclass = this.props.TextDecoration;
    if (iclass.includes(value)) {
      iclass = iclass.replace(RegExp(value, 'g'), '');
    } else {
      iclass += ` ${value}`;
    }
    this.props.TextDecoration = iclass;
    this.setActiveStyle('textDecoration', this.props.TextDecoration, null);
  }

  hasTextDecoration(value) {
    return this.props.TextDecoration.includes(value);
  }

  getTextAlign() {
    this.props.textAlign = this.getActiveProp('textAlign');
  }

  setTextAlign(value) {
    this.props.textAlign = value;
    this.setActiveProp('textAlign', this.props.textAlign);
  }

  getFontFamily() {
    this.props.fontFamily = this.getActiveProp('fontFamily');
  }

  setFontFamily() {
    this.setActiveProp('fontFamily', this.props.fontFamily);
  }

  /* Top and Bottom bar*/

  setBottomBar() {
    var height = this.bottomBarHeight / 65 * this.canvas.getHeight();
    this.bottomBar.width = this.canvas.getWidth() + height * Math.sin(7 * Math.PI / 180) + 100;
    this.bottomBar.height = height;
    this.bottomBar.left = -(height* Math.sin(7 * Math.PI / 180));
    this.bottomBar.top = this.canvas.getHeight() - height + Math.tan(7 * Math.PI / 180)  * this.canvas.getWidth() + 100;
    this.bottomBar.setGradient('fill', {
      type: 'linear',
      x1: -this.bottomBar.width / 20,
      y1: 0,
      x2: this.bottomBar.width / 1.2,
      y2: 0,
      colorStops: {
          0: '#045922',
          1: '#95C11F'
      }
    });
    this.canvas.renderAll();
  }

  setTopBar() {
    var height = this.topBarHeight / 65 * this.canvas.getHeight();
    this.topBar.width = this.canvas.getWidth() + height * Math.sin(7 * Math.PI / 180) + 100;
    this.topBar.height = height;
    this.topBar.left = -(height* Math.sin(7 * Math.PI / 180));
    this.topBar.top = - Math.tan(7 * Math.PI / 180)  * this.canvas.getWidth() ;
    this.topBar.setGradient('fill', {
      type: 'linear',
      x1: -this.topBar.width / 20,
      y1: 0,
      x2: this.topBar.width / 1.2,
      y2: 0,
      colorStops: {
          0: '#045922',
          1: '#95C11F'
      }
    });
    this.canvas.renderAll();
  }

  /*System*/

  removeSelected() {
    const activeObject = this.canvas.getActiveObject();
    const activeGroup = this.canvas.getActiveObjects();

    if (activeObject) {
      this.canvas.remove(activeObject);
      // this.textString = '';
    } else if (activeGroup) {
      this.canvas.discardActiveObject();
      const self = this;
      activeGroup.forEach((object) => {
        self.canvas.remove(object);
      });
    }
  }

  bringToFront() {
    const activeObject = this.canvas.getActiveObject();
    const activeGroup = this.canvas.getActiveObjects();

    if (activeObject) {
      activeObject.bringToFront();
      activeObject.opacity = 1;
    } else if (activeGroup) {
      this.canvas.discardActiveObject();
      activeGroup.forEach((object) => {
        object.bringToFront();
      });
    }
  }

  sendToBack() {
    const activeObject = this.canvas.getActiveObject();
    const activeGroup = this.canvas.getActiveObjects();

    if (activeObject) {
      this.canvas.sendToBack(activeObject);
      activeObject.sendToBack();
      activeObject.opacity = 1;
    } else if (activeGroup) {
      this.canvas.discardActiveObject();
      activeGroup.forEach((object) => {
        object.sendToBack();
      });
    }
  }

  confirmClear() {
    if (confirm('Are you sure?')) {
      this.canvas.clear();
    }
  }

  rasterize() {
    console.log("test");
    const image = new Image();
    const factor =  this.size.width / this.canvas.getWidth();
    image.src = this.canvas.toDataURL({format: 'png', multiplier: factor});
    const w = window.open('');
    w.document.write(image.outerHTML);
  }

  rasterizeSVG() {
    const w = window.open('');
    w.document.write(this.canvas.toSVG());
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(this.canvas.toSVG());
  }

  saveCanvasToJSON() {
    const json = JSON.stringify(this.canvas);
    localStorage.setItem('Kanvas', json);
    console.log('json');
    console.log(json);

  }

  loadCanvasFromJSON() {
    const CANVAS = localStorage.getItem('Kanvas');
    console.log('CANVAS');
    console.log(CANVAS);

    // and load everything from the same json
    this.canvas.loadFromJSON(CANVAS, () => {
      console.log('CANVAS untar');
      console.log(CANVAS);

      // making sure to render canvas at the end
      this.canvas.renderAll();

      // and checking if object's "name" is preserved
      console.log('this.canvas.item(0).name');
      console.log(this.canvas);
    });

  }

  rasterizeJSON() {
    this.json = JSON.stringify(this.canvas, null, 2);
  }

  resetPanels() {
    this.textEditor = false;
    this.imageEditor = false;
    this.figureEditor = false;
  }

}
