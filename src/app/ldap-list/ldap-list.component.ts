import {Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {UserLdap} from "../model/user-ldap";
import {MatSlideToggleChange} from "@angular/material/slide-toggle";
import {UsersService} from "../service/users.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-ldap-list',
  templateUrl: './ldap-list.component.html',
  styleUrls: ['./ldap-list.component.scss']
})
export class LdapListComponent implements OnInit {

  displayedColumns: string[] = ['nomComplet', 'mail', 'employeNumero'];
  dataSource = new MatTableDataSource<UserLdap>([]);

  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;

  constructor(private usersService: UsersService, private router: Router) { }


  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.getUsers();
  }

  filterPredicate({data, filter}: { data: any, filter: any }): boolean {
    return !filter || data.nomComplet.toLowerCase().startsWith(filter);
  }

  applyFilter($event: KeyboardEvent): void {
    const filterValue = ($event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  unactiveSelected = false;

  private getUsers(): void {
    this.usersService.getUsers().subscribe(
      users => {
          if (this.unactiveSelected) {
            this.dataSource.data = users.filter( user =>
                user.active === false
            );
          }
      });
  }
  unactiveChanged($event: MatSlideToggleChange): void {
    this.unactiveSelected = $event.checked;
    this.getUsers();
  }
}
