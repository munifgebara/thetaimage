import { IAuthority, NewAuthority } from './authority.model';

export const sampleWithRequiredData: IAuthority = {
  name: '4860117a-57ce-4e0b-a177-54194a3a03dd',
};

export const sampleWithPartialData: IAuthority = {
  name: '4ba4a74a-e42b-4f4c-9422-98e4aad3f8a3',
};

export const sampleWithFullData: IAuthority = {
  name: 'e1526a85-416f-47cc-8e68-184f01752dc2',
};

export const sampleWithNewData: NewAuthority = {
  name: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
