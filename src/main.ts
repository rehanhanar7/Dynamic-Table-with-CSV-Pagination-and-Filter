import 'zone.js/dist/zone';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as Papa from 'papaparse';
import jspdf from 'jspdf';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginationInstance } from 'ngx-pagination';
import { ApplicationPipesModule } from './pipe.module';

import { bootstrapApplication } from '@angular/platform-browser';

interface User {
  sno: number;
  name: string;
  age: number;
  gender: string;
  showEdit: boolean;
}

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    ApplicationPipesModule,
  ],
  template: `
  <label class="d-block p-2">
    Search:
    <input type="text" [(ngModel)]="searchText" (ngModelChange)="updateCurrentPage()"/>
  </label>
  <table class="table table-bordered m-2">
    <thead class="thead-light">
      <tr>
        <th>Sno</th>
        <th>Name</th>
        <th>Age</th>
        <th>Gender</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let user of pagedUsers | searchFilter: searchText | paginate: { itemsPerPage: tableconfig.itemsPerPage, currentPage: tableconfig.currentPage }; let i = index">
        <td>{{ user.sno }}</td>
        <td *ngIf="!user.showEdit">{{ user.name }}</td>
        <td *ngIf="user.showEdit">
          <input type="text" [(ngModel)]="user.name" maxlength="100"/>
        </td>
        <td *ngIf="!user.showEdit">{{ user.age }}</td>
        <td *ngIf="user.showEdit">
          <input type="number" [(ngModel)]="user.age" max="999" />
        </td>
        <td *ngIf="!user.showEdit">{{ user.gender }}</td>
        <td *ngIf="user.showEdit">
          <select [(ngModel)]="user.gender">
            <option [value]="'Male'">Male</option>
            <option [value]="'Female'">Female</option>
          </select>
        </td>
        <td *ngIf="!user.showEdit">
          <button class="btn btn-primary" (click)="toggleEdit(user)">Edit</button>
          <button class="btn btn-danger" (click)="deleteUser(user)">Delete</button>
        </td>
        <td *ngIf="user.showEdit">
          <button class="btn btn-success" (click)="saveUser(user)">Save</button>
          <button class="btn btn-danger" (click)="cancelEdit(user)">Cancel</button>
        </td>
      </tr>
    </tbody>
  </table>
  <pagination-controls (pageChange)="tableconfig.currentPage = $event"></pagination-controls>
  <div *ngIf="!users[users.length - 1].showEdit">
    <button class="btn btn-primary" (click)="addUser()">Add Data</button>
    <button class="btn btn-danger" (click)="downloadCSV()">Download CSV</button>
    <button class="btn btn-success" (click)="downloadPDF()">Download PDF</button>
  </div>
  `,
})
export class App implements OnInit {
  name = 'Angular';
  users: User[] = [];
  pagedUsers: User[];
  originalName: string;
  originalAge: number;
  originalGender: string;
  // p: number = 1;
  searchText: string;
  // pagelimit: number = 5;
  tableconfig: PaginationInstance = {
    itemsPerPage: 5,
    currentPage: 1,
  };

  serverUsers = [
    {
      sno: 1,
      name: 'John Doe',
      age: 30,
      gender: 'Male',
      showEdit: false,
    },
    {
      sno: 2,
      name: 'Jane Doe',
      age: 25,
      gender: 'Female',
      showEdit: false,
    },
    {
      sno: 3,
      name: 'Bob Smith',
      age: 35,
      gender: 'Male',
      showEdit: false,
    },
  ];

  ngOnInit() {
    this.users = this.serverUsers;
    this.pagedUsers = this.users;
  }

  updateCurrentPage() {
    this.tableconfig.currentPage = 1;
  }

  addUser() {
    const lastUser = this.users[this.users.length - 1];

    if (lastUser.name.trim().length === 0) {
      alert('Please fill in all fields before adding a new user');
      return;
    }

    let newUser: User = {
      sno: this.users.length + 1,
      name: '',
      age: 0,
      gender: 'Male',
      showEdit: true,
    };

    this.users.push(newUser);
    this.calculateCurrentPage();
  }

  toggleEdit(user: User) {
    const index = this.users.findIndex((x) => x === user);
    this.originalName = this.users[index].name;
    this.originalAge = this.users[index].age;
    this.originalGender = this.users[index].gender;
    this.users[index].showEdit = !this.users[index].showEdit;
  }

  cancelEdit(user: User) {
    const index = this.users.findIndex((x) => x === user);
    this.users[index].showEdit = false;
    this.users[index].name = this.originalName;
    this.users[index].age = this.originalAge;
    this.users[index].gender = this.originalGender;
  }

  saveUser(user: User) {
    this.toggleEdit(user);
  }

  deleteUser(user: User) {
    const index = this.users.findIndex((x) => x === user);
    this.users.splice(index, 1);
    this.calculateCurrentPage();
  }

  downloadCSV() {
    const csv = Papa.unparse(this.users);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'users.csv';
    link.click();
  }

  calculateCurrentPage() {
    this.tableconfig.currentPage = Math.ceil(
      this.users.length / this.tableconfig.itemsPerPage
    );
  }

  downloadPDF() {
    const doc = new jspdf();
    let table =
      '<table><thead><tr><th>Sno</th><th>Name</th><th>Age</th><th>Gender</th></tr></thead><tbody>';

    this.users.forEach((user) => {
      table +=
        '<tr><td>' +
        user.sno +
        '</td><td>' +
        user.name +
        '</td><td>' +
        user.age +
        '</td><td>' +
        user.gender +
        '</td></tr>';
    });

    table += '</tbody></table>';

    console.log(table);

    // still work to be done
    doc.text(table, 3, 3);
    doc.save('table.pdf');
  }
}

bootstrapApplication(App);
