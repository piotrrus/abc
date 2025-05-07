import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ConfirmDialogComponent } from './confirm.component';

describe('ConfirmComponent', () => {
     let component: ConfirmDialogComponent;
     let fixture: ComponentFixture<ConfirmDialogComponent>;
     const mockDialogRef = {
          close: jasmine.createSpy('close'),
     };
     beforeEach(async () => {
          await TestBed.configureTestingModule({
               declarations: [ConfirmDialogComponent],
               imports: [
                    MatDialogModule,
                    NoopAnimationsModule,
                    MatIconTestingModule,
                    TranslateModule.forRoot({
                         loader: {
                              provide: TranslateLoader,
                              useClass: TranslateFakeLoader,
                         },
                    }),
               ],
               providers: [
                    {
                         provide: MatDialogRef,
                         useValue: mockDialogRef,
                    },
                    {
                         provide: MAT_DIALOG_DATA,
                         useValue: {},
                    },
               ],
               schemas: [CUSTOM_ELEMENTS_SCHEMA],
          }).compileComponents();
     });

     beforeEach(() => {
          fixture = TestBed.createComponent(ConfirmDialogComponent);
          component = fixture.componentInstance;
          fixture.detectChanges();
     });

     it('should create', () => {
          expect(component).toBeTruthy();
     });
});
