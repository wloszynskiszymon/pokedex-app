import { Component, input } from '@angular/core';

@Component({
  selector: 'app-thermometer',
  standalone: true,
  imports: [],
  templateUrl: './thermometer.component.html',
  styleUrl: './thermometer.component.scss',
})
export class ThermometerComponent {
  label = input<string>();
  value = input.required<unknown>();
  maxValue = input.required<number>();
  asAbsoluteValue = input<boolean>(false); //  in case of passing negative values

  // Converts to <0, 1> in order to calculate % width in component template
  normalizeToUnit(value: unknown, max: number = 100): number {
    if (value === null || value === undefined) return 0;
    let num;
    if (this.asAbsoluteValue()) num = Math.abs(+value); // take absolute value
    else num = +value; // use value as it is
    if (isNaN(num)) {
      console.warn('Invalid value for thermometer. Using default.');
      return 0;
    }
    return Math.max(0, Math.min(1, num / max));
  }
}
