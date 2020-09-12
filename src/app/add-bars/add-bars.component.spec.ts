import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBarsComponent } from './add-bars.component';

describe('AddBarsComponent', () => {
  let component: AddBarsComponent;
  let fixture: ComponentFixture<AddBarsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBarsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
