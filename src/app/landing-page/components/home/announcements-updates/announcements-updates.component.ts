import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-announcements-updates',
  templateUrl: './announcements-updates.component.html',
  styleUrl: './announcements-updates.component.css'
})
export class AnnouncementsUpdatesComponent {
  @Input() title:string='';
  @Input() updatedetails!:any;
  selectedIndex: number | null = null;

  selectItem(index: number): void {
    this.selectedIndex = index;
  }
}
