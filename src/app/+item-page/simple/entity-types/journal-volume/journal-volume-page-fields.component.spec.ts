import { ChangeDetectionStrategy, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TruncatableService } from '../../../../shared/truncatable/truncatable.service';
import { ITEM } from '../../../../shared/entities/switcher/entity-type-switcher.component';
import { TruncatePipe } from '../../../../shared/utils/truncate.pipe';
import { ItemDataService } from '../../../../core/data/item-data.service';
import { Observable } from 'rxjs/Observable';
import { Item } from '../../../../core/shared/item.model';
import { By } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MockTranslateLoader } from '../../../../shared/mocks/mock-translate-loader';
import { GenericItemPageFieldComponent } from '../../field-components/specific-field/generic/generic-item-page-field.component';
import { RemoteData } from '../../../../core/data/remote-data';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { isNotEmpty } from '../../../../shared/empty.util';
import { JournalVolumePageFieldsComponent } from './journal-volume-page-fields.component';

let comp: JournalVolumePageFieldsComponent;
let fixture: ComponentFixture<JournalVolumePageFieldsComponent>;

const mockItem: Item = Object.assign(new Item(), {
  bitstreams: Observable.of(new RemoteData(false, false, true, null, new PaginatedList(new PageInfo(), []))),
  metadata: [
    {
      key: 'journalvolume.identifier.volume',
      language: 'en_US',
      value: '1234'
    },
    {
      key: 'journalvolume.issuedate',
      language: 'en_US',
      value: '2018'
    },
    {
      key: 'journalvolume.identifier.description',
      language: 'en_US',
      value: 'desc'
    }]
});

describe('JournalVolumePageFieldsComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: MockTranslateLoader
        }
      })],
      declarations: [JournalVolumePageFieldsComponent, GenericItemPageFieldComponent, TruncatePipe],
      providers: [
        {provide: ITEM, useValue: mockItem},
        {provide: ItemDataService, useValue: {}},
        {provide: TruncatableService, useValue: {}}
      ],

      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(JournalVolumePageFieldsComponent, {
      set: {changeDetection: ChangeDetectionStrategy.Default}
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(JournalVolumePageFieldsComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  }));

  for (const metadata of mockItem.metadata) {
    it(`should be calling a component with metadata field ${metadata.key}`, () => {
      const fields = fixture.debugElement.queryAll(By.css('.item-page-fields'));
      expect(containsFieldInput(fields, metadata.key)).toBeTruthy();
    });
  }
});

function containsFieldInput(fields: DebugElement[], metadataKey: string): boolean {
  for (const field of fields) {
    const fieldComp = field.componentInstance;
    if (isNotEmpty(fieldComp.fields)) {
      if (fieldComp.fields.indexOf(metadataKey) > -1) {
        return true;
      }
    }
  }
  return false;
}
