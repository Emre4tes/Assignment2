import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderOperationsComponent } from './order-operations.component';

describe('OrderOperationsComponent', () => {
  let component: OrderOperationsComponent;
  let fixture: ComponentFixture<OrderOperationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderOperationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
