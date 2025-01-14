import { Component } from "@angular/core";

@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.component.html",
  styleUrls: ["./home-page.component.scss"],
})
export class HomePageComponent {
  public nrOfRows: number = 0;

  public onAdd(): void {
    this.nrOfRows > 5 ? (this.nrOfRows = 5) : this.nrOfRows++;
    console.log(this.nrOfRows);
  }
}
