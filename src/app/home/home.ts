import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText'; // <-- Add this import

gsap.registerPlugin(ScrollTrigger, SplitText);
@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements AfterViewInit {
  @ViewChild('heroContainer') heroContainer!: ElementRef;

  private gsapCtx!: gsap.Context;
  private splitInstances: SplitText[] = [];
  private contactModalTl!: gsap.core.Timeline;
  ngAfterViewInit(): void {
    this.gsapCtx = gsap.context(() => {
      this.initAmbientBackground();
      this.initNavScrollSpy();
      this.initHeroEntrance();
      this.initFloatingPanels();
      this.initBackgroundMarquee();
      this.initProfileIntro();
      this.initBentoEntrance();
      this.initTextAnimations();
      this.initExperienceTimeline();
      this.initTechMatrix();
      this.initContactSection();
      this.initModalAnimation();
    });

    this.initMouseParallax();
  }

  ngOnDestroy(): void {
    if (this.gsapCtx) {
      this.gsapCtx.revert();
    }

    this.splitInstances.forEach((instance) => instance.revert());
  }
  private initAmbientBackground(): void {
    const orbs = gsap.utils.toArray('.gsap-orb');
    orbs.forEach((orb: any) => {
      gsap.to(orb, {
        x: 'random(-150, 150)',
        y: 'random(-150, 150)',
        scale: 'random(0.8, 1.4)',
        duration: 'random(10, 20)',
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    });
  }
  private initTechMatrix(): void {
    gsap.from('.gsap-tech-card', {
      scrollTrigger: {
        trigger: '.gsap-tech-card',
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
      y: 60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'back.out(1.2)',
    });
  }
  private initHeroEntrance(): void {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.gsap-bg-text', { y: 100, opacity: 0, duration: 1.5, stagger: 0.2 })
      .from(
        '.gsap-hero-img',
        { scale: 0.8, opacity: 0, filter: 'blur(10px)', duration: 1.5 },
        '-=1.2',
      )
      .from('.gsap-panel-left', { x: -50, opacity: 0, duration: 1 }, '-=1')
      .from('.gsap-panel-right', { x: 50, opacity: 0, duration: 1 }, '-=1')
      .from('.gsap-dock div', { y: 20, opacity: 0, duration: 0.8, stagger: 0.1 }, '-=0.8');
  }

  private initFloatingPanels(): void {
    gsap.to(['.gsap-panel-left', '.gsap-panel-right'], {
      y: -10,
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });
  }

  private initBackgroundMarquee(): void {
    gsap.to('.gsap-x-loop', {
      xPercent: -50,
      ease: 'none',
      duration: 25,
      repeat: -1,
    });
  }

  private initExperienceTimeline(): void {
    gsap.to('.gsap-timeline-line', {
      scrollTrigger: {
        trigger: '.gsap-timeline-line',
        start: 'top center',
        end: 'bottom bottom',
        scrub: 1,
      },
      height: '100%',
      ease: 'none',
    });

    const timelineItems = gsap.utils.toArray('.gsap-timeline-item');
    timelineItems.forEach((item: any, i: number) => {
      const isOdd = i % 2 !== 0;
      const xOffset = window.innerWidth > 768 ? (isOdd ? -50 : 50) : 0;

      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        x: xOffset,
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });
    });
  }
private initTextAnimations(): void {
  // 1. Handle the solid white text (Split characters works fine here)
  const whiteHeadings = gsap.utils.toArray('.split-heading') as HTMLElement[];
  whiteHeadings.forEach((heading) => {
    const split = new SplitText(heading, { type: 'chars' });
    gsap.from(split.chars, {
      scrollTrigger: {
        trigger: heading,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
      y: 40,
      autoAlpha: 0,
      duration: 0.8,
      stagger: 0.04,
      ease: 'back.out(1.4)',
    });
  });

  // 2. Handle the Gradient Text (NO SPLITTING - Use Clip-Path)
  const gradientTexts = gsap.utils.toArray('.reveal-text') as HTMLElement[];
  gradientTexts.forEach((text) => {
    gsap.fromTo(text, 
      { 
        clipPath: 'inset(100% 0% 0% 0%)', // Hidden from bottom
        y: 50,
        opacity: 0 
      },
      {
        scrollTrigger: {
          trigger: text,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        clipPath: 'inset(0% 0% 0% 0%)', // Revealed
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power4.out',
      }
    );
  });

  // 3. Your existing body text logic (Lines work fine for gradients usually)
  const bodyTexts = gsap.utils.toArray('.split-body') as HTMLElement[];
  bodyTexts.forEach((body) => {
    const split = new SplitText(body, { type: 'lines' });
    gsap.from(split.lines, {
      scrollTrigger: {
        trigger: body,
        start: 'top 90%',
        toggleActions: 'play none none reverse',
      },
      y: 20,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
    });
  });
}
  private initMouseParallax(): void {
    if (!this.heroContainer) return;

    const container = this.heroContainer.nativeElement;
    container.addEventListener('mousemove', (e: MouseEvent) => {
      const xPos = (e.clientX / window.innerWidth - 0.5) * 60;
      const yPos = (e.clientY / window.innerHeight - 0.5) * 60;

      gsap.to('.bg-text-parallax', {
        x: xPos,
        y: yPos,
        duration: 1.5,
        ease: 'power2.out',
      });
    });
  }
  private initProfileIntro(): void {
    gsap.from('.gsap-profile-img', {
      scrollTrigger: {
        trigger: '.gsap-profile-img',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
      x: -100,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
    });
    const massiveTextSplit = new SplitText('.gsap-massive-text', { type: 'lines' });

    gsap.from(massiveTextSplit.lines, {
      scrollTrigger: {
        trigger: '.gsap-massive-text',
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2, // Delay between "BEYOND" and "SYNTAX."
      ease: 'back.out(1.2)',
    });
  }
  private initBentoEntrance(): void {
    gsap.from('.gsap-bento-box', {
      scrollTrigger: {
        trigger: '.gsap-bento-box',
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out',
    });
  }
  private initContactSection(): void {
    // 1. Animate the massive text lines sliding up from within their hidden overflow boxes
    const contactLines = gsap.utils.toArray('.gsap-reveal-word');
    gsap.from(contactLines, {
      scrollTrigger: {
        trigger: '.gsap-contact-text',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
      y: '100%',
      opacity: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: 'power4.out',
    });
    // 2. Fade in the buttons and footer links slightly after
    gsap.from('.gsap-contact-actions', {
      scrollTrigger: {
        trigger: '.gsap-contact-actions',
        start: 'top 90%',
        toggleActions: 'play none none reverse',
      },
      y: 30,
      opacity: 0,
      duration: 1,
      delay: 0.4, // Wait for the massive text to mostly finish
      ease: 'power3.out',
    });
  }

  private initModalAnimation(): void {
    gsap.set('.gsap-modal-box', { scale: 0.85, y: 80 });
    this.contactModalTl = gsap.timeline({ paused: true });
    this.contactModalTl
      .to('.gsap-contact-modal', { autoAlpha: 1, duration: 0.3, ease: 'power2.out' })
      .to(
        '.gsap-modal-box',
        {
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: 'back.out(1.2)',
        },
        '-=0.1',
      );
  }

  openContactModal(event: Event): void {
    event.preventDefault();
    this.contactModalTl.play();
  }

  closeContactModal(): void {
    this.contactModalTl.reverse();
  }
  public transmitViaMailto(e: Event): void {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('user_name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('user_email') as HTMLInputElement).value;
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;
    const subject = encodeURIComponent(`New Portfolio Contact from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    window.location.href = `mailto:your.email@example.com?subject=${subject}&body=${body}`;
    form.reset();
    this.closeContactModal();
  }
  private initNavScrollSpy(): void {
    const sectionIds = ['home', 'profile', 'experience', 'tech', 'contact'];
    const navLinks = gsap.utils.toArray('.nav-link') as HTMLElement[];
    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (!section) return;

      ScrollTrigger.create({
        trigger: section,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: (self) => {
          if (self.isActive) {
            navLinks.forEach((link) => link.classList.remove('active-nav'));
            const activeLink = document.querySelector(`a[href="#${id}"]`);
            if (activeLink) {
              activeLink.classList.add('active-nav');
            }
          }
        },
      });
    });
  }
}
