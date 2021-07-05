import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MazeUiComponent } from './maze-ui.component';

describe('MazeUiComponent', () => {
  let component: MazeUiComponent;
  let fixture: ComponentFixture<MazeUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MazeUiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MazeUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
