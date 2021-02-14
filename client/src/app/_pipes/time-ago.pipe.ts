import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  pure: false
})
export class TimeAgoPipe implements PipeTransform {

  private readonly msg = 'active right now, go talk to';

  transform(value: Date, gender: string): string {

    const date = new Date(value);
    const now = new Date();
    const seconds = Math.round(Math.abs((now.getTime() - date.getTime())/1000));
    const minutes = Math.round(Math.abs(seconds / 60));
		const hours = Math.round(Math.abs(minutes / 60));
		const days = Math.round(Math.abs(hours / 24));
		const months = Math.round(Math.abs(days/30.416));
		const years = Math.round(Math.abs(days/365));

    if (isNaN(seconds)) return '';
    if (seconds === 0) return gender === 'f' ? `She's ${this.msg} her!` : `He's ${this.msg} him!`;
    if (seconds < 60) return `${seconds} seconds ago`;
    if (minutes === 1) return `A minute ago`;
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours === 1) return `An hour ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days === 1) return `A day ago`;
    if (days < 7) return `${days} days ago`;
    if (days < 14) return `A week ago`;
    if (months < 1) return `${Math.floor(days / 7)} weeks ago`;
    if (months === 1) return `A month ago`;
    if (months < 12) return `${months} months ago`;
    if (years === 1) return `A year ago`;    
    return 'A really long time';
  }
}
