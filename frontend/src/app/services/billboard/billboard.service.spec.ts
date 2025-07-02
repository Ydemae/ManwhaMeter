// Copyright (c) 2025 Ydemae
// Licensed under the AGPLv3 License. See LICENSE file for details.

import { TestBed } from '@angular/core/testing';

import { BillboardService } from './billboard.service';

describe('BillboardService', () => {
  let service: BillboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BillboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
