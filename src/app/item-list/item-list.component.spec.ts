import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemListComponent } from './item-list.component';
import { Papa } from 'ngx-papaparse';
import { By } from '@angular/platform-browser';
import { Item } from './Item';  // Adjust the import path accordingly

describe('ItemListComponent', () => {
  let component: ItemListComponent;
  let fixture: ComponentFixture<ItemListComponent>;
  let papaParseSpy: jasmine.SpyObj<Papa>;

  beforeEach(async () => {
    const papaSpy = jasmine.createSpyObj('Papa', ['unparse']);

    await TestBed.configureTestingModule({
      imports: [ItemListComponent],
      providers: [
        { provide: Papa, useValue: papaSpy }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ItemListComponent);
    component = fixture.componentInstance;
    papaParseSpy = TestBed.inject(Papa) as jasmine.SpyObj<Papa>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should export CSV', () => {
    const mockItems: Item[] = [
      { id: 1, name: 'Item 1', price: 10.0 },
      { id: 2, name: 'Item 2', price: 15.5 },
      { id: 3, name: 'Item 3', price: 8.9 },
    ];
    component.items = mockItems;

    const itemsCSV = 'id,name,price\n1,Item 1,10.0\n2,Item 2,15.5\n3,Item 3,8.9';
    papaParseSpy.unparse.and.returnValue(itemsCSV);

    const createObjectURLSpy = spyOn(URL, 'createObjectURL').and.returnValue('blob:url');
    const revokeObjectURLSpy = spyOn(URL, 'revokeObjectURL');

    // Create a real anchor element and spy its methods
    const anchorElement = document.createElement('a');
    spyOn(anchorElement, 'click');
    spyOn(anchorElement, 'setAttribute');
    spyOn(anchorElement, 'remove');

    // Manually handle the mocked create anchoring
    const originalCreateElement = document.createElement.bind(document);
    spyOn(document, 'createElement').and.callFake((tagName: string) => {
      if (tagName === 'a') {
        return anchorElement;
      }
      return originalCreateElement(tagName);
    });

    // Trigger CSV export
    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click', null);
    fixture.detectChanges();

    const expectedUnparseArgument = {
      fields: ["id", "name", "price"],  // Define the fields for the CSV.
      data: mockItems.map(item => [    // Convert items to array representation.
        item.id, item.name, item.price
      ])
    };

    expect(papaParseSpy.unparse).toHaveBeenCalledWith(expectedUnparseArgument);
    expect(createObjectURLSpy).toHaveBeenCalled();
    expect(anchorElement.click).toHaveBeenCalled();
    expect((anchorElement.setAttribute as jasmine.Spy).calls.allArgs()).toEqual([
      ['href', 'blob:url'],
      ['download', 'items.csv']
    ]);
    expect(revokeObjectURLSpy).toHaveBeenCalled();
  });
});
