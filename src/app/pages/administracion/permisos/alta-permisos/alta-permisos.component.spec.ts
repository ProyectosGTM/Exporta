import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaPermisosComponent } from './alta-permisos.component';

describe('AltaPermisosComponent', () => {
  let component: AltaPermisosComponent;
  let fixture: ComponentFixture<AltaPermisosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AltaPermisosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AltaPermisosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
