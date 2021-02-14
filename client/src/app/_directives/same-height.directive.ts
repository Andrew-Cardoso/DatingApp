import { Directive, ElementRef, HostBinding, HostListener, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[sameHeightAs]'
})
export class SameHeightDirective implements OnInit {
  @Input() sameHeightAs: HTMLDivElement;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    this.defineHeight();
  }

  @HostListener('window:resize') update() {
    this.defineHeight();
  }

  private defineHeight() {
    this.renderer.setStyle(this.el.nativeElement, 'height', `${this.sameHeightAs.offsetHeight}px`);
  }

}
