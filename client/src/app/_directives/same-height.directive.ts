import { Directive, ElementRef, HostBinding, HostListener, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[sameHeightAs]'
})
export class SameHeightDirective implements OnInit {
  @Input() sameHeightAs: HTMLDivElement;
  @Input() min: boolean;
  private property = 'height';
  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    if (this.min) {
      this.property = 'min-height'
    }
    this.defineHeight();
  }

  @HostListener('window:resize') update() {
    this.defineHeight();
  }

  private defineHeight() {
    this.renderer.setStyle(this.el.nativeElement, this.property, `${this.sameHeightAs.offsetHeight}px`);
  }

}
