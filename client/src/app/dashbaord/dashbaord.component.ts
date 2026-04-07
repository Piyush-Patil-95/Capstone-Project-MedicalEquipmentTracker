import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '../../services/http.service';


@Component({
  selector: 'app-dashbaord',
  templateUrl: './dashbaord.component.html',
  styleUrls: ['./dashbaord.component.scss']
})
export class DashbaordComponent implements OnInit, OnDestroy {
  // Cursor
  cursorX = 0;
  cursorY = 0;
  followerX = 0;
  followerY = 0;
  mouseX = 0;
  mouseY = 0;

  // Scroll
  scrollProgress = 0;
  isScrolled = false;
  activeSection = 'hero';

  // Menu
  menuOpen = false;

  // About cards
  activeCard = 0;

  // Image tilt
  imageTransform = '';

  // Form
  form = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  // Data
  features = [
    {
      title: 'Real-time Tracking',
      desc: 'Monitor equipment location and status in real-time with GPS and IoT integration.',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
      gradient: 'linear-gradient(135deg, #2A6F97, #61A5C2)',
      revealed: false
    },
    {
      title: 'Predictive Maintenance',
      desc: 'AI-powered predictions to prevent equipment failures before they happen.',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
      gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
      revealed: false
    },
    {
      title: 'Smart Analytics',
      desc: 'Comprehensive dashboards and reports for data-driven decision making.',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
      gradient: 'linear-gradient(135deg, #f093fb, #f5576c)',
      revealed: false
    },
    {
      title: 'Inventory Control',
      desc: 'Automated inventory tracking with smart reorder notifications.',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>',
      gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)',
      revealed: false
    },
    {
      title: 'Compliance Ready',
      desc: 'Stay compliant with automated regulatory requirement tracking.',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
      gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)',
      revealed: false
    },
    {
      title: 'Mobile Access',
      desc: 'Access your dashboard anywhere with our mobile-responsive platform.',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
      gradient: 'linear-gradient(135deg, #fa709a, #fee140)',
      revealed: false
    }
  ];

  aboutCards = [
    {
      emoji: '🏥',
      title: 'Hospital',
      desc: 'Track and manage equipment efficiently across all departments.',
      gradient: 'linear-gradient(135deg, #2A6F97, #61A5C2)',
      features: ['Equipment Inventory', 'Usage Analytics', 'Maintenance Scheduling', 'Cost Tracking']
    },
    {
      emoji: '🧑‍🔧',
      title: 'Technician',
      desc: 'Handle maintenance workflows with smart task management.',
      gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
      features: ['Work Orders', 'Parts Inventory', 'Service History', 'Mobile Access']
    },
    {
      emoji: '🚚',
      title: 'Supplier',
      desc: 'Manage inventory, orders, and deliveries in one place.',
      gradient: 'linear-gradient(135deg, #f5576c, #f093fb)',
      features: ['Order Management', 'Delivery Tracking', 'Invoice Processing', 'Catalog Management']
    }
  ];

  stats = [
    { value: 500, suffix: '+', label: 'Hospitals', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/></svg>' },
    { value: 50000, suffix: '+', label: 'Equipment', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>' },
    { value: 1200, suffix: '+', label: 'Technicians', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>' },
    { value: 99, suffix: '%', label: 'Uptime', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>' }
  ];

  testimonials = [
    { quote: 'MedTrack has revolutionized how we manage our equipment. The real-time tracking is incredible!', name: 'Dr. Sarah Johnson', role: 'Hospital Admin', initials: 'SJ', color: '#2A6F97', rating: 5 },
    { quote: 'The predictive maintenance feature saved us thousands in potential repairs. Highly recommended!', name: 'Michael Chen', role: 'CTO, City Hospital', initials: 'MC', color: '#667eea', rating: 5 },
    { quote: 'As a technician, the mobile app makes my work so much easier. Everything I need is at my fingertips.', name: 'James Wilson', role: 'Senior Technician', initials: 'JW', color: '#f5576c', rating: 4 },
    { quote: 'The analytics dashboard gives us insights we never had before. Game changer!', name: 'Emily Davis', role: 'Operations Manager', initials: 'ED', color: '#43e97b', rating: 5 },
    { quote: 'MedTrack has revolutionized how we manage our equipment. The real-time tracking is incredible!', name: 'Dr. Sarah Johnson', role: 'Hospital Admin', initials: 'SJ', color: '#2A6F97', rating: 5 },
    { quote: 'The predictive maintenance feature saved us thousands in potential repairs. Highly recommended!', name: 'Michael Chen', role: 'CTO, City Hospital', initials: 'MC', color: '#667eea', rating: 5 }
  ];

  private animationId: number = 0;
  private countersAnimated = false;

  constructor(private router: Router, private httpService:HttpService) {}

  ngOnInit(): void {
    this.animateCursor();
    this.initScrollObserver();
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  // ============ CURSOR ============
  onMouseMove(e: MouseEvent): void {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
    this.cursorX = e.clientX;
    this.cursorY = e.clientY;
  }

  animateCursor(): void {
    const animate = () => {
      this.followerX += (this.mouseX - this.followerX) * 0.1;
      this.followerY += (this.mouseY - this.followerY) * 0.1;
      this.animationId = requestAnimationFrame(animate);
    };
    animate();
  }

  // ============ SCROLL ============
  @HostListener('window:scroll')
  onScroll(): void {
    // Progress bar
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    this.scrollProgress = (winScroll / height) * 100;

    // Navbar
    this.isScrolled = window.scrollY > 50;

    // Active section
    this.updateActiveSection();

    // Counters
    this.checkCounters();

    // Feature cards
    this.revealFeatures();
  }

  updateActiveSection(): void {
    const sections = ['hero', 'features', 'about', 'contact'];
    const scrollPos = window.scrollY + 200;

    for (const id of sections) {
      const el = document.getElementById(id);
      if (el && scrollPos >= el.offsetTop && scrollPos < el.offsetTop + el.offsetHeight) {
        this.activeSection = id;
        break;
      }
    }
  }

  initScrollObserver(): void {
    setTimeout(() => {
      this.revealFeatures();
    }, 100);
  }

  revealFeatures(): void {
    this.features.forEach((feature, index) => {
      const cards = document.querySelectorAll('.feature-card');
      if (cards[index]) {
        const rect = cards[index].getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
          setTimeout(() => {
            feature.revealed = true;
          }, index * 100);
        }
      }
    });
  }

  checkCounters(): void {
    if (this.countersAnimated) return;
    
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
      const rect = statsSection.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        this.countersAnimated = true;
        this.animateCounters();
      }
    }
  }

  animateCounters(): void {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target') || '0');
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const updateCounter = () => {
        current += step;
        if (current < target) {
          counter.textContent = Math.floor(current).toLocaleString();
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toLocaleString();
        }
      };
      updateCounter();
    });

    // Hero stats
    const heroNumbers = document.querySelectorAll('.hero-stats .number');
    const heroTargets = [500, 50000, 99];
    heroNumbers.forEach((el, i) => {
      const target = heroTargets[i];
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const update = () => {
        current += step;
        if (current < target) {
          el.textContent = Math.floor(current).toLocaleString() + (i === 2 ? '' : '+');
          requestAnimationFrame(update);
        } else {
          el.textContent = target.toLocaleString() + (i === 2 ? '' : '+');
        }
      };
      setTimeout(update, i * 200);
    });
  }

  // ============ CARD EFFECTS ============
  onCardHover(e: MouseEvent): void {
    // Add hover effect
  }

  onCardMove(e: MouseEvent): void {
    const card = e.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    card.style.setProperty('--x', x + '%');
    card.style.setProperty('--y', y + '%');
  }

  onCardLeave(e: MouseEvent): void {
    // Remove hover effect
  }

  // ============ IMAGE TILT ============
  tiltImage(e: MouseEvent): void {
    const container = e.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    this.imageTransform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  }

  resetTilt(): void {
    this.imageTransform = '';
  }

  // ============ NAVIGATION ============
  scrollTo(section: string): void {
    this.menuOpen = false;
    document.body.style.overflow = '';
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    document.body.style.overflow = this.menuOpen ? 'hidden' : '';
  }

  goRegister(): void {
    this.router.navigate(['/registration']);
  }

  goLogin(): void {
    this.router.navigate(['/login']);
  }

  goDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  // ============ MISC ============
  playDemo(): void {
    alert('Demo video would play here!');
  }

  
    submitForm(): void {
  console.log('Sending form data:', this.form);

  this.httpService.sendContactMessage(this.form).subscribe({
    next: (res) => {
      alert('Message sent successfully!');
      this.form = { name: '', email: '', subject: '', message: '' };
    },
    error: (err) => {
      console.error('Backend Error:', err);
      // If you see a 404 here, the endpoint /api/contact/send doesn't exist on your server
      // If you see a 403/401, your backend is still demanding a Token
      alert(`Error: ${err.status} - ${err.message}`);
    }
  });
}

   
}
