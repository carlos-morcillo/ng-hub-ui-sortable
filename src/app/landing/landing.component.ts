import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ElementRef } from "@angular/core";
import { RouterModule } from "@angular/router";
import hljs from "highlight.js/lib/core";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import bash from "highlight.js/lib/languages/bash";

// Register languages
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("bash", bash);

@Component({
  selector: "app-landing",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.scss"],
})
export class LandingComponent implements AfterViewInit {
  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    // Highlight all code blocks
    this.highlightCode();
  }

  private highlightCode(): void {
    const codeBlocks =
      this.elementRef.nativeElement.querySelectorAll("pre code");
    codeBlocks.forEach((block: HTMLElement) => {
      hljs.highlightElement(block);
    });
  }
}
