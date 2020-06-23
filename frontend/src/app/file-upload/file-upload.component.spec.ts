import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FileUploadComponent } from './file-upload.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatListModule } from '@angular/material/list';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../app.module';
import {HttpClient, HttpEventType, HttpResponse} from '@angular/common/http';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatDialogModule} from "@angular/material/dialog";
import {UploadService} from "../services/upload.service";
import {of} from "rxjs";
import {IFile} from "../models/IFile.model";

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;
  let translate: TranslateService;
  let uploadService: UploadService;

  const file1 = new File(['test1'], 'spec_test_file1.test', { type: 'text/plain' });
  const file2 = new File(['test2'], 'spec_test_file2.test', { type: 'text/plain' });


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatListModule,
        MatGridListModule,
        MatDialogModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ],
      declarations: [ FileUploadComponent ]
    })
    .compileComponents();
    translate = TestBed.get(TranslateService);
    uploadService = TestBed.get(UploadService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should attempt to resend items', () => {
    const file: IFile = {
      file: file1,
      fid: '',
      status: '',
      progress: 0,
      icon: ''
    };

    const requestType = {
      response: 'overwrite'
    };

    const response = new HttpResponse();
    spyOn(uploadService, 'patchFile').and.returnValue(of(response));
    component.resendFile(requestType, file);
    expect(uploadService.patchFile).toHaveBeenCalled();

    spyOn(uploadService, 'putFile').and.returnValue(of(response));
    requestType.response = 'add';

    component.resendFile(requestType, file);
    expect(uploadService.putFile).toHaveBeenCalled();
  });

  it('should add files to list', () => {
    const list = new DataTransfer();
    list.items.add(file1);
    list.items.add(file2);
    component.onSelectFile(list.files);

    expect(component.files.length).toEqual(2);
    expect(component.files[0].file).toEqual(file1);
    expect(component.files[0].status).toEqual('REQUEST_SEND');
    expect(component.files[0].progress).toEqual(0);
    expect(component.files[0].icon).toEqual('schedule');
  });
});
