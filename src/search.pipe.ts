import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter',
})
export class SearchFilterPipe implements PipeTransform {
  transform(users: any[], searchText: string): any[] {
    if (!users) {
      return [];
    }
    if (!searchText) {
      return users;
    }
    searchText = searchText.toLowerCase();
    return users.filter((user) => {
      return (
        user.name.toLowerCase().includes(searchText) ||
        user.age.toString().includes(searchText) ||
        user.gender.toLowerCase().includes(searchText)
      );
    });
  }
}
