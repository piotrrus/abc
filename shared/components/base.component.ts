import { OnDestroy, Component } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
     template: '',
})
export abstract class BaseComponent implements OnDestroy {
     protected destruct$: Subject<boolean> = new Subject<boolean>();

     public ngOnDestroy(): void {
          this.destruct$.next(true);
          this.destruct$.unsubscribe();
     }
}
