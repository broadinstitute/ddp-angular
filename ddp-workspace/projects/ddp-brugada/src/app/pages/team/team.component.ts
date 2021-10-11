import { Component } from '@angular/core';

interface Member {
  Name: string;
  Degree: string;
  Institution: string;
  Bio: string;
  Image: string;
}

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
})
export class TeamComponent {
  getMemberName(member: Member): string {
    if (member.Degree) {
      return `${member.Name}, ${member.Degree}`;
    }

    return member.Name;
  }
}
