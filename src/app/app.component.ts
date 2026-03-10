import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import html2canvas from 'html2canvas';

interface Player {
  id: number;
  name: string;
  number: number;
  x: number;
  y: number;
  isGK?: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, DragDropModule, FormsModule],
  template: `
    <div class="field-container">
      <header class="glass">
        <div class="brand">
          <div class="logo">⚽</div>
          <h1>FORMAT <span>LINEUP</span></h1>
        </div>
        <div class="controls">
          <select [(ngModel)]="playerCount" (change)="resetPlayers()">
            <option [value]="5">5 vs 5 (Halı saha)</option>
            <option [value]="6">6 vs 6</option>
            <option [value]="7">7 vs 7</option>
            <option [value]="11">11 vs 11</option>
          </select>
          <button class="btn reset-btn" (click)="resetPlayers()">Sıfırla</button>
        </div>
      </header>

      <div class="pitch-wrapper glass">
        <div class="pitch" id="pitch-capture">
          <div class="pitch-line center-line"></div>
          <div class="pitch-line center-circle"></div>
          <div class="pitch-line penalty-area top"></div>
          <div class="pitch-line penalty-area bottom"></div>
          <div class="pitch-line goal-area top"></div>
          <div class="pitch-line goal-area bottom"></div>

          <!-- Players -->
          <div *ngFor="let p of players" 
               class="player" 
               [class.gk]="p.isGK"
               cdkDrag 
               [cdkDragBoundary]="'.pitch'"
               [style.left.%]="p.x" 
               [style.top.%]="p.y">
               {{p.number}}
               <span class="player-name">{{p.name}}</span>
               <div class="edit-trigger" (click)="editPlayer($event, p)">✎</div>
          </div>
        </div>
      </div>

      <footer class="glass">
        <button class="btn save-btn" (click)="saveImage()">
          <span class="icon">📸</span> KADROYU PAYLAŞ
        </button>
      </footer>
    </div>
  `,
  styles: [`
    .field-container {
      width: 100%;
      height: 100dvh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding: 10px;
      gap: 10px;
    }

    header, footer {
      width: min(95vw, 450px);
      padding: 12px 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    }

    .brand {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    header h1 {
      font-size: 1.2rem;
      font-family: 'Outfit', sans-serif;
      letter-spacing: 1px;
    }

    header h1 span {
      color: #22c55e;
      font-weight: 400;
    }

    .logo {
      font-size: 1.5rem;
      filter: drop-shadow(0 0 10px #22c55e);
    }

    .controls {
      display: flex;
      gap: 8px;
      width: 100%;
    }

    select {
      flex: 1;
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid var(--glass-border);
      color: white;
      padding: 10px;
      border-radius: 8px;
      font-family: inherit;
      outline: none;
      cursor: pointer;
    }

    .reset-btn {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid var(--glass-border);
    }

    .pitch-wrapper {
      padding: 10px;
      border-radius: 8px;
    }

    footer {
      flex-direction: row;
      justify-content: center;
    }

    .save-btn {
      width: 100%;
      background: linear-gradient(135deg, #22c55e, #16a34a);
      font-size: 1rem;
      padding: 14px;
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: bold;
      cursor: pointer;
    }

    .icon {
      font-size: 1.2rem;
    }
  `]
})
export class AppComponent implements OnInit {
  playerCount = 7;
  players: Player[] = [];

  ngOnInit() {
    this.resetPlayers();
  }

  resetPlayers() {
    const count = Number(this.playerCount);
    this.players = [];

    // Goalkeeper
    this.players.push({
      id: 1,
      name: 'KALECI',
      number: 1,
      x: 44,
      y: 88,
      isGK: true
    });

    if (count === 5) {
      this.addPlayers([
        { n: 2, x: 25, y: 70, name: ' DEFANS' },
        { n: 3, x: 64, y: 70, name: ' DEFANS' },
        { n: 4, x: 44, y: 45, name: ' ORTA' },
        { n: 5, x: 44, y: 15, name: ' FORVET' }
      ]);
    } else if (count === 7) {
      this.addPlayers([
        { n: 2, x: 15, y: 75, name: ' SOL BEK' },
        { n: 3, x: 73, y: 75, name: ' SAG BEK' },
        { n: 5, x: 44, y: 40, name: ' ORTA' },
        { n: 6, x: 44, y: 12, name: ' FORVET' },
        { n: 7, x: 15, y: 35, name: ' SOL KANAT' },
        { n: 8, x: 74, y: 35, name: ' SAG KANAT' }
      ]);
    } else {
      for (let i = 1; i < count; i++) {
        this.players.push({
          id: i + 1,
          name: 'OYUNCU ' + (i + 1),
          number: i + 1,
          x: 44,
          y: 50 - (i * 0.5 * (100 / count))
        });
      }
    }
  }

  addPlayers(configs: any[]) {
    configs.forEach(c => {
      this.players.push({
        id: c.n,
        name: c.name,
        number: c.n,
        x: c.x,
        y: c.y
      });
    });
  }

  editPlayer(event: MouseEvent, p: Player) {
    event.stopPropagation();
    const newName = prompt('Oyuncu ismi girin:', p.name);
    if (newName !== null) p.name = newName.toUpperCase();

    const newNumber = prompt('Numara girin:', p.number.toString());
    if (newNumber !== null) p.number = parseInt(newNumber, 10) || p.number;
  }

  async saveImage() {
    const element = document.getElementById('pitch-capture');
    if (!element) return;

    try {
      // Hide edit triggers during capture
      const triggers = element.querySelectorAll('.edit-trigger');
      triggers.forEach((t: any) => t.style.display = 'none');

      const canvas = await html2canvas(element, {
        backgroundColor: '#2d5a18',
        scale: 2, // higher quality
        logging: false,
        useCORS: true
      });

      // Show edit triggers again
      triggers.forEach((t: any) => t.style.display = 'flex');

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `kadro-${new Date().getTime()}.png`;
      link.href = image;
      link.click();
    } catch (err) {
      console.error('Kadro kaydedilemedi:', err);
      alert('Kadro kaydedilirken bir hata oluştu.');
    }
  }
}
