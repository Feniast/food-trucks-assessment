import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import { afterEach, describe, expect, test } from "vitest";
import { client } from "~/api";
import { renderWithProviders } from "~/test-helpers";
import FoodTrucks from "./FoodTrucks";

const mock = new MockAdapter(client.axios);

afterEach(() => {
  mock.resetHandlers();
});

const data = [
  {
    locationId: 1565571,
    applicant: "MOMO INNOVATION LLC",
    facilityType: "Truck",
    cnn: "3525000",
    locationDescription: "CALIFORNIA ST: DAVIS ST to FRONT ST (100 - 199)",
    address: "101 CALIFORNIA ST",
    blocklot: "0263011",
    block: "0263",
    lot: "011",
    permit: "21MFF-00089",
    status: "APPROVED",
    foodItems:
      "MOMO Spicy Noodle: POPO's Noodle: Spicy Chicken Noodle: Rice Noodles",
    x: 6013245.668,
    y: 2116754.292,
    latitude: 37.7929489528347,
    longitude: -122.398098613167,
    schedule:
      "http://bsm.sfdpw.org/PermitsTracker/reports/report.aspx?title=schedule&report=rptSchedule&params=permit=21MFF-00089&ExportPDF=1&Filename=21MFF-00089_schedule.pdf",
    dayshours: "",
    zip: "28860",
  },
  {
    locationId: 1565954,
    applicant: "Treats by the Bay LLC",
    facilityType: "Truck",
    cnn: "10624001",
    locationDescription: "POST ST: MONTGOMERY ST to LICK PL (1 - 40)",
    address: "1 MONTGOMERY ST",
    blocklot: "0292002",
    block: "0292",
    lot: "002",
    permit: "21MFF-00094",
    status: "APPROVED",
    foodItems: "Sandwich: Donuts: Coffee: Soft Serve Ice Cream: Drinks",
    x: 6011970.278,
    y: 2115432.874,
    latitude: 37.7892495340751,
    longitude: -122.402418597294,
    schedule:
      "http://bsm.sfdpw.org/PermitsTracker/reports/report.aspx?title=schedule&report=rptSchedule&params=permit=21MFF-00094&ExportPDF=1&Filename=21MFF-00094_schedule.pdf",
    dayshours: "",
    zip: "28854",
  },
  {
    locationId: 1565594,
    applicant: "MOMO INNOVATION LLC",
    facilityType: "Truck",
    cnn: "9094000",
    locationDescription: "MISSION ST: ANNIE ST to 03RD ST (663 - 699)",
    address: "667 MISSION ST",
    blocklot: "3722067",
    block: "3722",
    lot: "067",
    permit: "21MFF-00090",
    status: "APPROVED",
    foodItems: "Noodles: Meat & Drinks",
    x: 6012350.571,
    y: 2114444.914,
    latitude: 37.7865580501799,
    longitude: -122.40103337535,
    schedule:
      "http://bsm.sfdpw.org/PermitsTracker/reports/report.aspx?title=schedule&report=rptSchedule&params=permit=21MFF-00090&ExportPDF=1&Filename=21MFF-00090_schedule.pdf",
    dayshours: "",
    zip: "28855",
  },
];

describe("Food Trucks Route", () => {
  test("renders", async () => {
    mock.onGet("/foodtrucks").reply(200, data);

    renderWithProviders(<FoodTrucks />);

    expect(screen.getByTestId("loading")).toBeInTheDocument();

    await waitFor(() => expect(screen.getByRole("table")).toBeInTheDocument());

    const table = screen.getByRole("table");
    const tableBody = table.querySelector("tbody");

    // Get all the rows within the tbody
    const rows = tableBody!.querySelectorAll("tr");
    expect(rows).toHaveLength(data.length);
  });

  test("renders error", async () => {
    mock.onGet("/foodtrucks").reply(404);

    renderWithProviders(<FoodTrucks />);

    expect(screen.getByTestId("loading")).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText(/Error/)).toBeInTheDocument());

    const table = screen.queryByRole("table");

    expect(table).toBeNull();
  });

  test("filters", async () => {
    mock.onGet("/foodtrucks").reply(200, data);
    const user = userEvent.setup();
    renderWithProviders(<FoodTrucks />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole("table")).toBeInTheDocument());

    const foodsInput = screen.getByPlaceholderText(/Filter Foods/);
    user.type(foodsInput, "MOMO");

    await waitFor(() => {
      const table = screen.getByRole("table");
      const tableBody = table.querySelector("tbody")!;

      const rows = tableBody!.querySelectorAll("tr");
      expect(rows).toHaveLength(1);
    });

    user.click(screen.getByText(/Reset/));

    await waitFor(() => {
      const table = screen.getByRole("table");
      const tableBody = table.querySelector("tbody")!;

      const rows = tableBody!.querySelectorAll("tr");
      expect(rows).toHaveLength(data.length);
    });
  });
});
