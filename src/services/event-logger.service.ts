import { Injectable, signal } from '@angular/core';

export interface RouterLog {
  id: number;
  timestamp: string;
  source: string;
  event: 'activate' | 'deactivate' | 'attach' | 'detach';
  details: string;
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventLoggerService {
  private _logs = signal<RouterLog[]>([]);
  readonly logs = this._logs.asReadonly();
  private counter = 0;

  log(source: string, event: 'activate' | 'deactivate' | 'attach' | 'detach', component: any) {
    const componentName = component?.constructor?.name || 'UnknownComponent';
    
    let color = 'text-gray-600';
    if (event === 'activate') color = 'text-green-600 font-bold';
    if (event === 'deactivate') color = 'text-red-600';
    if (event === 'attach') color = 'text-blue-600 font-bold';
    if (event === 'detach') color = 'text-amber-600';

    const newLog: RouterLog = {
      id: ++this.counter,
      timestamp: new Date().toLocaleTimeString(),
      source,
      event,
      details: componentName,
      color
    };

    this._logs.update(current => [newLog, ...current]);
  }

  clear() {
    this._logs.set([]);
  }
}